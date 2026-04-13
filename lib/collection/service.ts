import type { PrismaClient } from "@prisma/client";

import { getMoleculesByIds } from "@/lib/content/loaders";
import { getPlayerInventorySnapshot } from "@/lib/inventory/service";

export async function getPlayerCollection(db: PrismaClient, playerId: string) {
  const inventory = await getPlayerInventorySnapshot(db, playerId);
  const molecules = getMoleculesByIds(inventory.unlockedMolecules);

  return {
    unlockedCount: molecules.length,
    molecules,
  };
}
