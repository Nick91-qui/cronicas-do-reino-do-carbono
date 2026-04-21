import { describe, expect, it } from "vitest";

import { getPhaseById } from "@/lib/content/loaders";
import { applyPhaseCompletionRewards, ensurePlayerInventorySnapshot } from "@/lib/inventory/service";

function createInventoryDb(initialInventory?: {
  carbonAvailable: number;
  hydrogenMode: string;
  unlockedFragmentsJson: string[];
  unlockedMoleculesJson: string[];
  unlockedTitlesJson: string[];
}) {
  let inventoryRecord = initialInventory
    ? { playerId: "player-1", ...initialInventory }
    : null;
  const rewardEvents: Array<Record<string, unknown>> = [];

  return {
    rewardEvents,
    db: {
      playerInventory: {
        findUnique: async () => inventoryRecord,
        create: async ({ data }: { data: typeof inventoryRecord }) => {
          inventoryRecord = data;
          return data;
        },
        update: async ({ data }: { data: Partial<NonNullable<typeof inventoryRecord>> }) => {
          inventoryRecord = {
            ...(inventoryRecord ?? {
              playerId: "player-1",
              carbonAvailable: 0,
              hydrogenMode: "implicit_infinite",
              unlockedFragmentsJson: [],
              unlockedMoleculesJson: [],
              unlockedTitlesJson: [],
            }),
            ...data,
          };

          return inventoryRecord;
        },
      },
      playerRewardEvent: {
        createMany: async ({ data }: { data: Array<Record<string, unknown>> }) => {
          rewardEvents.push(...data);
          return { count: data.length };
        },
      },
    },
  };
}

describe("integration/inventory/rewards", () => {
  it("cria inventário inicial quando ainda não existe", async () => {
    const { db } = createInventoryDb();

    const inventory = await ensurePlayerInventorySnapshot(db as never, "player-1");

    expect(inventory).toEqual({
      carbonAvailable: 1,
      hydrogenMode: "implicit_infinite",
      unlockedFragments: ["ligacao_simples"],
      unlockedMolecules: [],
      unlockedTitles: [],
    });
  });

  it("aplica recompensas de fase correta ao inventário e registra eventos", async () => {
    const { db, rewardEvents } = createInventoryDb({
      carbonAvailable: 1,
      hydrogenMode: "implicit_infinite",
      unlockedFragmentsJson: ["ligacao_simples"],
      unlockedMoleculesJson: [],
      unlockedTitlesJson: [],
    });

    const phase = getPhaseById("chapter-1-phase-1");
    const result = await applyPhaseCompletionRewards(db as never, "player-1", phase);

    expect(result.inventory.carbonAvailable).toBe(2);
    expect(result.inventory.unlockedMolecules).toContain("metano");
    expect(result.inventory.unlockedTitles).toContain("Centelha de Carbono");
    expect(result.grantedRewards).toEqual([
      { rewardType: "carbon", rewardValue: "1" },
      { rewardType: "molecule", rewardValue: "metano" },
      { rewardType: "title", rewardValue: "Centelha de Carbono" },
    ]);
    expect(rewardEvents).toHaveLength(3);
  });

  it("não duplica desbloqueios já existentes ao aplicar novas recompensas", async () => {
    const { db, rewardEvents } = createInventoryDb({
      carbonAvailable: 4,
      hydrogenMode: "implicit_infinite",
      unlockedFragmentsJson: ["ligacao_simples", "ligacao_dupla"],
      unlockedMoleculesJson: ["metano"],
      unlockedTitlesJson: ["O Volátil"],
    });

    const phase = getPhaseById("chapter-1-phase-4");
    const result = await applyPhaseCompletionRewards(db as never, "player-1", phase);

    expect(result.inventory.unlockedFragments).toEqual(["ligacao_simples", "ligacao_dupla"]);
    expect(result.inventory.unlockedTitles).toEqual(["O Volátil"]);
    expect(result.inventory.carbonAvailable).toBe(4);
    expect(result.grantedRewards).toEqual([
      { rewardType: "fragment", rewardValue: "ligacao_dupla" },
      { rewardType: "title", rewardValue: "O Volátil" },
    ]);
    expect(rewardEvents).toHaveLength(2);
  });
});
