import { z } from "zod";

const chapterIds = ["chapter-1"] as const;
const moleculeIds = ["metano", "etano", "propano", "eteno", "propeno", "buteno", "benzeno"] as const;
const fragmentIds = ["ligacao_simples", "ligacao_dupla", "estrutura_aromatica"] as const;
const phaseIds = [
  "chapter-1-phase-1",
  "chapter-1-phase-2",
  "chapter-1-phase-3",
  "chapter-1-phase-4",
  "chapter-1-phase-5",
  "chapter-1-phase-6",
  "chapter-1-phase-7",
  "chapter-1-phase-8",
] as const;
const phaseTypes = ["construction", "choice", "construction_choice"] as const;
const qualitativeResults = ["excellent", "adequate", "inadequate"] as const;
const validationResults = ["correct", "incorrect"] as const;
const chemicalClasses = ["alcano", "alceno", "aromatico"] as const;
const bondTypes = ["single", "double", "aromatic"] as const;
const selectableProperties = [
  "saturada",
  "insaturada",
  "aromatica",
  "aberta",
  "fechada",
  "homogenea",
  "normal",
  "baixa_polaridade",
  "alta_volatilidade",
  "alto_potencial_energetico",
  "alta_reatividade",
  "util_como_combustivel",
  "util_como_precursor_de_transformacao",
  "util_para_polimeros",
  "estabilidade_especial",
  "adequada_para_meio_apolar",
  "cadeia_curta",
] as const;

export const chapterIdSchema = z.enum(chapterIds);
export const moleculeIdSchema = z.enum(moleculeIds);
export const fragmentIdSchema = z.enum(fragmentIds);
export const phaseIdSchema = z.enum(phaseIds);
export const phaseTypeSchema = z.enum(phaseTypes);
export const qualitativeResultSchema = z.enum(qualitativeResults);
export const validationResultSchema = z.enum(validationResults);
export const chemicalClassSchema = z.enum(chemicalClasses);
export const bondTypeSchema = z.enum(bondTypes);
export const selectablePropertySchema = z.enum(selectableProperties);

export const moleculeAttributesSchema = z.object({
  polaridade: z.union([z.literal(1), z.literal(2), z.literal(3), z.literal(4), z.literal(5)]),
  potencialEnergetico: z.union([z.literal(1), z.literal(2), z.literal(3), z.literal(4), z.literal(5)]),
  reatividade: z.union([z.literal(1), z.literal(2), z.literal(3), z.literal(4), z.literal(5)]),
  estabilidade: z.union([z.literal(1), z.literal(2), z.literal(3), z.literal(4), z.literal(5)]),
  caraterAcidoBasico: z.union([z.literal(1), z.literal(2), z.literal(3), z.literal(4), z.literal(5)]),
  interacaoBiologica: z.union([z.literal(1), z.literal(2), z.literal(3), z.literal(4), z.literal(5)]),
  volatilidade: z.union([z.literal(1), z.literal(2), z.literal(3), z.literal(4), z.literal(5)]),
});

export const moleculeSchema = z.object({
  id: moleculeIdSchema,
  nomeQuimico: z.string().min(1),
  nomeEpico: z.string().min(1),
  formulaMolecular: z.string().min(1),
  formulaEstrutural: z.string().min(1),
  classe: chemicalClassSchema,
  carbonos: z.number().int().positive(),
  tipoDeLigacao: bondTypeSchema,
  atributos: moleculeAttributesSchema,
  propriedades: z.array(selectablePropertySchema),
  descricaoCurta: z.string().min(1),
  pontosFortes: z.array(z.string().min(1)),
  limitacoes: z.array(z.string().min(1)),
});

export const phaseResourcesSchema = z.object({
  carbonAvailable: z.number().int().nonnegative(),
  hydrogenMode: z.literal("implicit_infinite"),
  availableFragments: z.array(fragmentIdSchema),
  supportCards: z.array(z.string().min(1)),
});

export const rewardSchema = z.object({
  carbon: z.number().int().positive().optional(),
  fragments: z.array(fragmentIdSchema).optional(),
  unlockedMolecule: moleculeIdSchema.optional(),
  unlockedTitle: z.string().min(1).optional(),
});

export const phaseFeedbackSchema = z.object({
  excellent: z.string().min(1),
  adequate: z.string().min(1).optional(),
  inadequate: z.string().min(1),
});

export const phaseSchema = z.object({
  id: phaseIdSchema,
  chapterId: chapterIdSchema,
  number: z.number().int().positive(),
  title: z.string().min(1),
  coreConcept: z.string().min(1),
  technicalType: phaseTypeSchema,
  displayType: z.string().min(1),
  narrative: z.string().min(1),
  objective: z.string().min(1),
  resources: phaseResourcesSchema,
  availableMolecules: z.array(moleculeIdSchema).min(1),
  excellentAnswer: moleculeIdSchema,
  adequateAnswers: z.array(moleculeIdSchema),
  expectedProperties: z.array(selectablePropertySchema),
  pedagogicalNotes: z.array(z.string().min(1)),
  rewards: rewardSchema,
  feedback: phaseFeedbackSchema,
  score: z.object({
    excellent: z.literal(3),
    adequate: z.literal(2),
    inadequate: z.literal(0),
  }),
});

export const chapterSchema = z.object({
  id: chapterIdSchema,
  title: z.string().min(1),
  totalPhases: z.number().int().positive(),
  moleculeIds: z.array(moleculeIdSchema).min(1),
  phaseIds: z.array(phaseIdSchema).min(1),
});

export const phaseSubmissionSchema = z.object({
  phaseId: phaseIdSchema,
  selectedMoleculeId: moleculeIdSchema,
  selectedProperties: z.array(selectablePropertySchema).min(1).max(3),
});
