import type { Prisma, PrismaClient, PlayerRewardEvent as PrismaPlayerRewardEvent } from "@prisma/client";

import type {
  FragmentId,
  MoleculeId,
  Phase,
  PlayerInventory,
} from "@/lib/content/types";
import { createInitialPlayerInventory } from "@/lib/inventory/defaults";

type DbClient = PrismaClient | Prisma.TransactionClient;

export type GrantedReward = Pick<PrismaPlayerRewardEvent, "rewardType" | "rewardValue">;

function uniqueValues<T extends string>(values: T[]): T[] {
  return [...new Set(values)];
}

function parseJsonArray<T extends string>(value: Prisma.JsonValue): T[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.filter((item): item is T => typeof item === "string");
}

function mapInventoryRecordToDomain(record: {
  carbonAvailable: number;
  hydrogenMode: string;
  unlockedFragmentsJson: Prisma.JsonValue;
  unlockedMoleculesJson: Prisma.JsonValue;
  unlockedTitlesJson: Prisma.JsonValue;
}): PlayerInventory {
  return {
    carbonAvailable: record.carbonAvailable,
    hydrogenMode: "implicit_infinite",
    unlockedFragments: parseJsonArray<FragmentId>(record.unlockedFragmentsJson),
    unlockedMolecules: parseJsonArray<MoleculeId>(record.unlockedMoleculesJson),
    unlockedTitles: parseJsonArray<string>(record.unlockedTitlesJson),
  };
}

function buildRewardEvents(phase: Phase): Array<{
  rewardType: string;
  rewardValue: string;
  metadataJson: Prisma.InputJsonValue;
}> {
  const rewardEvents: Array<{
    rewardType: string;
    rewardValue: string;
    metadataJson: Prisma.InputJsonValue;
  }> = [];

  if (phase.rewards.carbon && phase.rewards.carbon > 0) {
    rewardEvents.push({
      rewardType: "carbon",
      rewardValue: String(phase.rewards.carbon),
      metadataJson: { chapterId: phase.chapterId, phaseNumber: phase.number },
    });
  }

  for (const fragmentId of phase.rewards.fragments ?? []) {
    rewardEvents.push({
      rewardType: "fragment",
      rewardValue: fragmentId,
      metadataJson: { chapterId: phase.chapterId, phaseNumber: phase.number },
    });
  }

  if (phase.rewards.unlockedMolecule) {
    rewardEvents.push({
      rewardType: "molecule",
      rewardValue: phase.rewards.unlockedMolecule,
      metadataJson: { chapterId: phase.chapterId, phaseNumber: phase.number },
    });
  }

  if (phase.rewards.unlockedTitle) {
    rewardEvents.push({
      rewardType: "title",
      rewardValue: phase.rewards.unlockedTitle,
      metadataJson: { chapterId: phase.chapterId, phaseNumber: phase.number },
    });
  }

  return rewardEvents;
}

export async function getPlayerInventorySnapshot(
  db: DbClient,
  playerId: string,
): Promise<PlayerInventory> {
  const inventory = await db.playerInventory.findUnique({ where: { playerId } });

  if (!inventory) {
    return createInitialPlayerInventory();
  }

  return mapInventoryRecordToDomain(inventory);
}

export async function ensurePlayerInventorySnapshot(
  db: DbClient,
  playerId: string,
): Promise<PlayerInventory> {
  const existingInventory = await db.playerInventory.findUnique({ where: { playerId } });

  if (existingInventory) {
    return mapInventoryRecordToDomain(existingInventory);
  }

  const initialInventory = createInitialPlayerInventory();

  await db.playerInventory.create({
    data: {
      playerId,
      carbonAvailable: initialInventory.carbonAvailable,
      hydrogenMode: initialInventory.hydrogenMode,
      unlockedFragmentsJson: initialInventory.unlockedFragments,
      unlockedMoleculesJson: initialInventory.unlockedMolecules,
      unlockedTitlesJson: initialInventory.unlockedTitles,
    },
  });

  return initialInventory;
}

export async function applyPhaseCompletionRewards(
  db: DbClient,
  playerId: string,
  phase: Phase,
): Promise<{
  inventory: PlayerInventory;
  grantedRewards: GrantedReward[];
}> {
  const currentInventory = await ensurePlayerInventorySnapshot(db, playerId);
  const nextInventory: PlayerInventory = {
    carbonAvailable: currentInventory.carbonAvailable + (phase.rewards.carbon ?? 0),
    hydrogenMode: currentInventory.hydrogenMode,
    unlockedFragments: uniqueValues([
      ...currentInventory.unlockedFragments,
      ...(phase.rewards.fragments ?? []),
    ]),
    unlockedMolecules: uniqueValues([
      ...currentInventory.unlockedMolecules,
      ...(phase.rewards.unlockedMolecule ? [phase.rewards.unlockedMolecule] : []),
    ]),
    unlockedTitles: uniqueValues([
      ...currentInventory.unlockedTitles,
      ...(phase.rewards.unlockedTitle ? [phase.rewards.unlockedTitle] : []),
    ]),
  };

  await db.playerInventory.update({
    where: { playerId },
    data: {
      carbonAvailable: nextInventory.carbonAvailable,
      hydrogenMode: nextInventory.hydrogenMode,
      unlockedFragmentsJson: nextInventory.unlockedFragments,
      unlockedMoleculesJson: nextInventory.unlockedMolecules,
      unlockedTitlesJson: nextInventory.unlockedTitles,
    },
  });

  const rewardEvents = buildRewardEvents(phase);

  if (rewardEvents.length > 0) {
    await db.playerRewardEvent.createMany({
      data: rewardEvents.map((rewardEvent) => ({
        playerId,
        phaseId: phase.id,
        rewardType: rewardEvent.rewardType,
        rewardValue: rewardEvent.rewardValue,
        metadataJson: rewardEvent.metadataJson,
      })),
    });
  }

  return {
    inventory: nextInventory,
    grantedRewards: rewardEvents.map(({ rewardType, rewardValue }) => ({
      rewardType,
      rewardValue,
    })),
  };
}
