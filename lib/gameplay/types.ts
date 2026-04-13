import type { BuilderState } from "@/lib/builder/types";
import type {
  MoleculeId,
  PhaseId,
  QualitativeResult,
  SelectableProperty,
  ValidationResult,
} from "@/lib/content/types";

export type PhaseSubmitInput = {
  phaseId: PhaseId;
  builderState?: BuilderState;
  selectedMoleculeId?: MoleculeId;
  selectedProperties: SelectableProperty[];
};

export type EvaluatedPhaseSubmission = {
  phaseId: PhaseId;
  selectedMoleculeId: MoleculeId | null;
  selectedProperties: SelectableProperty[];
  builderState?: BuilderState;
  qualitativeResult: QualitativeResult;
  validationResult: ValidationResult;
  scoreAwarded: 0 | 2 | 3;
  expectedPropertiesMatched: SelectableProperty[];
  feedback: string;
};
