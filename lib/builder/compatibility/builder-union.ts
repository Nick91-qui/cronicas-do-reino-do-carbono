import type { BranchedBuilderState } from "@/lib/builder/state/branched-types";
import type { GraphBuilderState } from "@/lib/builder/types";

export type SupportedBuilderState = GraphBuilderState | BranchedBuilderState;

export function isBranchedBuilderState(
  state: SupportedBuilderState,
): state is BranchedBuilderState {
  return "kind" in state && state.kind === "branched_v2";
}

export function isGraphBuilderState(
  state: SupportedBuilderState,
): state is GraphBuilderState {
  return "layout" in state && "carbonCount" in state;
}
