import { validateBuilderStateForPhase } from "@/lib/builder/validate";
import { getPhaseById } from "@/lib/content/loaders";
import type {
  MoleculeId,
  Phase,
  QualitativeResult,
  SelectableProperty,
  ValidationResult,
} from "@/lib/content/types";

import type { EvaluatedPhaseSubmission, PhaseSubmitInput } from "@/lib/gameplay/types";

function uniqueProperties(properties: SelectableProperty[]): SelectableProperty[] {
  return [...new Set(properties)];
}

function getExpectedMatches(
  selectedProperties: SelectableProperty[],
  phase: Phase,
): SelectableProperty[] {
  const expected = new Set(phase.expectedProperties);
  return selectedProperties.filter((property) => expected.has(property));
}

function getResultPayload(
  phase: Phase,
  selectedMoleculeId: MoleculeId | null,
  selectedProperties: SelectableProperty[],
  qualitativeResult: QualitativeResult,
  validationResult: ValidationResult,
  scoreAwarded: 0 | 2 | 3,
): EvaluatedPhaseSubmission {
  const expectedPropertiesMatched = getExpectedMatches(selectedProperties, phase);
  const feedback =
    qualitativeResult === "excellent"
      ? phase.feedback.excellent
      : qualitativeResult === "adequate"
        ? phase.feedback.adequate ?? phase.feedback.excellent
        : phase.feedback.inadequate;

  return {
    phaseId: phase.id,
    selectedMoleculeId,
    selectedProperties,
    qualitativeResult,
    validationResult,
    scoreAwarded,
    expectedPropertiesMatched,
    feedback,
  };
}

function evaluateChoiceLikePhase(
  phase: Phase,
  selectedMoleculeId: MoleculeId,
  selectedProperties: SelectableProperty[],
): EvaluatedPhaseSubmission {
  const expectedPropertiesMatched = getExpectedMatches(selectedProperties, phase);

  if (selectedMoleculeId === phase.excellentAnswer) {
    if (expectedPropertiesMatched.length >= 2) {
      return getResultPayload(phase, selectedMoleculeId, selectedProperties, "excellent", "correct", 3);
    }

    return getResultPayload(phase, selectedMoleculeId, selectedProperties, "adequate", "correct", 2);
  }

  if (phase.adequateAnswers.includes(selectedMoleculeId)) {
    return getResultPayload(phase, selectedMoleculeId, selectedProperties, "adequate", "correct", 2);
  }

  return getResultPayload(phase, selectedMoleculeId, selectedProperties, "inadequate", "incorrect", 0);
}

function evaluateConstructionPhase(input: PhaseSubmitInput): EvaluatedPhaseSubmission {
  const phase = getPhaseById(input.phaseId);

  if (!input.builderState) {
    throw new Error("Fases de construção exigem `builderState`.");
  }

  const builderValidation = validateBuilderStateForPhase(phase.id, input.builderState);

  if (!builderValidation.canCreateMolecule || !builderValidation.resolvedMoleculeId) {
    return {
      ...getResultPayload(phase, null, input.selectedProperties, "inadequate", "incorrect", 0),
      builderState: input.builderState,
    };
  }

  const selectedMoleculeId = builderValidation.resolvedMoleculeId;

  const evaluated = selectedMoleculeId === phase.excellentAnswer
    ? getResultPayload(phase, selectedMoleculeId, input.selectedProperties, "excellent", "correct", 3)
    : getResultPayload(phase, selectedMoleculeId, input.selectedProperties, "inadequate", "incorrect", 0);

  return {
    ...evaluated,
    builderState: input.builderState,
  };
}

export function evaluatePhaseSubmission(input: PhaseSubmitInput): EvaluatedPhaseSubmission {
  const phase = getPhaseById(input.phaseId);
  const selectedProperties = uniqueProperties(input.selectedProperties);

  if (selectedProperties.length !== input.selectedProperties.length) {
    throw new Error("Propriedades duplicadas não são permitidas na submissão.");
  }

  if (phase.technicalType === "construction") {
    return evaluateConstructionPhase({ ...input, selectedProperties });
  }

  if (!input.selectedMoleculeId) {
    throw new Error("Fases de escolha exigem `selectedMoleculeId`.");
  }

  return evaluateChoiceLikePhase(phase, input.selectedMoleculeId, selectedProperties);
}
