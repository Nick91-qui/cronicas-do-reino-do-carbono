import type { PlayerInventory } from "@/lib/content/types";

export const INITIAL_PLAYER_INVENTORY: PlayerInventory = {
  carbonAvailable: 1,
  hydrogenMode: "implicit_infinite",
  unlockedFragments: ["ligacao_simples"],
  unlockedMolecules: [],
  unlockedTitles: [],
};

export function createInitialPlayerInventory(): PlayerInventory {
  return {
    carbonAvailable: INITIAL_PLAYER_INVENTORY.carbonAvailable,
    hydrogenMode: INITIAL_PLAYER_INVENTORY.hydrogenMode,
    unlockedFragments: [...INITIAL_PLAYER_INVENTORY.unlockedFragments],
    unlockedMolecules: [...INITIAL_PLAYER_INVENTORY.unlockedMolecules],
    unlockedTitles: [...INITIAL_PLAYER_INVENTORY.unlockedTitles],
  };
}
