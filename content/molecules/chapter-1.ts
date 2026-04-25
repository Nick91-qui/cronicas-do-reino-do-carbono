import type { ChemicalClass, Molecule, MoleculeAttributePalette, MoleculeId } from "@/lib/content/types";

function getPalette(classe: ChemicalClass): MoleculeAttributePalette {
  if (classe === "alceno") return "alkene";
  if (classe === "aromatico") return "aromatic";
  return "hydrocarbon";
}

type ArtworkConfig = {
  fit?: "cover" | "contain";
  position?: string;
  scale?: number;
};

function buildVisual(
  id: MoleculeId,
  classe: ChemicalClass,
  badgeLabel: string,
  artworkConfig?: ArtworkConfig,
) {
  return {
    assets: {
      artworkAsset: `/visual/cards/art/molecule-${id}-main.png`,
      artworkFit: artworkConfig?.fit,
      artworkPosition: artworkConfig?.position,
      artworkScale: artworkConfig?.scale,
      frameAsset: "/visual/cards/frames/card-frame-common.png",
      textureAsset: "/visual/cards/textures/card-texture-paper-v1.png",
      iconAsset: `/visual/icons/molecule-${id}-icon.png`,
    },
    accentFrom: classe === "aromatico" ? "#f7c948" : classe === "alceno" ? "#22c55e" : "#21d4fd",
    accentTo: classe === "aromatico" ? "#f97316" : classe === "alceno" ? "#0ea5e9" : "#b721ff",
    attributePalette: getPalette(classe),
    preferredLayout: "expanded" as const,
    stateVariants: {
      unlocked: {
        badgeLabel,
      },
      newly_created: {
        badgeLabel: "Sintetizada",
      },
      selected: {
        badgeLabel: "Selecionada",
      },
    },
  };
}

export const chapter1Molecules: Molecule[] = [
  {
    id: "metano",
    nomeQuimico: "Metano",
    nomeEpico: "O Primeiro Sopro",
    formulaMolecular: "CH4",
    formulaEstrutural: "CH4",
    classe: "alcano",
    carbonos: 1,
    tipoDeLigacao: "single",
    atributos: { polaridade: 1, potencialEnergetico: 4, reatividade: 1, estabilidade: 4, caraterAcidoBasico: 1, interacaoBiologica: 2, volatilidade: 5 },
    propriedades: ["saturada", "aberta", "homogenea", "normal", "baixa_polaridade", "alta_volatilidade", "cadeia_curta", "util_como_combustivel"],
    descricaoCurta: "A menor e mais simples molécula orgânica da jornada.",
    pontosFortes: ["estrutura simples", "alta volatilidade", "boa introdução à tetravalência do carbono"],
    limitacoes: ["baixa reatividade", "baixa versatilidade estrutural"],
    visual: buildVisual("metano", "alcano", "Desbloqueada", {
      fit: "contain",
      position: "center 56%",
      scale: 1.08,
    }),
  },
  {
    id: "etano",
    nomeQuimico: "Etano",
    nomeEpico: "A Ponte das Cadeias",
    formulaMolecular: "C2H6",
    formulaEstrutural: "CH3-CH3",
    classe: "alcano",
    carbonos: 2,
    tipoDeLigacao: "single",
    atributos: { polaridade: 1, potencialEnergetico: 4, reatividade: 1, estabilidade: 4, caraterAcidoBasico: 1, interacaoBiologica: 2, volatilidade: 4 },
    propriedades: ["saturada", "aberta", "homogenea", "normal", "baixa_polaridade", "alta_volatilidade", "util_como_combustivel"],
    descricaoCurta: "O primeiro crescimento de cadeia do reino.",
    pontosFortes: ["introduz ligação C-C", "estrutura estável", "bom exemplo de alcano simples"],
    limitacoes: ["reatividade baixa", "menos volátil que o metano"],
    visual: buildVisual("etano", "alcano", "Desbloqueada", {
      fit: "contain",
      position: "center 54%",
      scale: 1.06,
    }),
  },
  {
    id: "propano",
    nomeQuimico: "Propano",
    nomeEpico: "A Tocha do Portão Norte",
    formulaMolecular: "C3H8",
    formulaEstrutural: "CH3-CH2-CH3",
    classe: "alcano",
    carbonos: 3,
    tipoDeLigacao: "single",
    atributos: { polaridade: 1, potencialEnergetico: 5, reatividade: 1, estabilidade: 4, caraterAcidoBasico: 1, interacaoBiologica: 2, volatilidade: 3 },
    propriedades: ["saturada", "aberta", "homogenea", "normal", "baixa_polaridade", "alto_potencial_energetico", "util_como_combustivel"],
    descricaoCurta: "O alcano mais representativo para o desafio energético inicial.",
    pontosFortes: ["alto potencial energético", "bom uso em contexto de combustível", "cadeia maior que metano e etano"],
    limitacoes: ["menos volátil que alcanos menores", "reatividade baixa"],
    visual: buildVisual("propano", "alcano", "Desbloqueada", {
      fit: "contain",
      position: "center 50%",
      scale: 1.04,
    }),
  },
  {
    id: "eteno",
    nomeQuimico: "Eteno",
    nomeEpico: "Arauto da Ligação Viva",
    formulaMolecular: "C2H4",
    formulaEstrutural: "CH2=CH2",
    classe: "alceno",
    carbonos: 2,
    tipoDeLigacao: "double",
    atributos: { polaridade: 1, potencialEnergetico: 4, reatividade: 4, estabilidade: 3, caraterAcidoBasico: 1, interacaoBiologica: 2, volatilidade: 4 },
    propriedades: ["insaturada", "aberta", "homogenea", "normal", "baixa_polaridade", "alta_reatividade", "util_como_precursor_de_transformacao", "util_para_polimeros"],
    descricaoCurta: "A primeira estrutura insaturada da jornada.",
    pontosFortes: ["introduz a ligação dupla", "mais reativo que etano", "base para transformação e polimerização"],
    limitacoes: ["menos estável que alcanos equivalentes"],
    visual: buildVisual("eteno", "alceno", "Desbloqueada"),
  },
  {
    id: "propeno",
    nomeQuimico: "Propeno",
    nomeEpico: "Chama da Transformação",
    formulaMolecular: "C3H6",
    formulaEstrutural: "CH2=CH-CH3",
    classe: "alceno",
    carbonos: 3,
    tipoDeLigacao: "double",
    atributos: { polaridade: 1, potencialEnergetico: 4, reatividade: 4, estabilidade: 3, caraterAcidoBasico: 1, interacaoBiologica: 2, volatilidade: 3 },
    propriedades: ["insaturada", "aberta", "homogenea", "normal", "baixa_polaridade", "alta_reatividade", "util_como_precursor_de_transformacao", "util_para_polimeros"],
    descricaoCurta: "Um alceno aceitável para transformação e polimerização.",
    pontosFortes: ["reativo", "útil em contexto de transformação", "aceitável em contextos de polimerização"],
    limitacoes: ["menos direto que eteno para introdução pedagógica"],
    visual: buildVisual("propeno", "alceno", "Desbloqueada"),
  },
  {
    id: "buteno",
    nomeQuimico: "Buteno",
    nomeEpico: "Cadeia Viva Expandida",
    formulaMolecular: "C4H8",
    formulaEstrutural: "CH2=CH-CH2-CH3",
    classe: "alceno",
    carbonos: 4,
    tipoDeLigacao: "double",
    atributos: { polaridade: 1, potencialEnergetico: 4, reatividade: 4, estabilidade: 3, caraterAcidoBasico: 1, interacaoBiologica: 2, volatilidade: 2 },
    propriedades: ["insaturada", "aberta", "homogenea", "normal", "baixa_polaridade", "alta_reatividade", "util_para_polimeros"],
    descricaoCurta: "Uma cadeia maior que mantém a lógica da insaturação.",
    pontosFortes: ["mantém comportamento de alceno", "aceitável como precursor em contexto amplo de polímeros"],
    limitacoes: ["menos direto para introdução do conceito"],
    visual: buildVisual("buteno", "alceno", "Desbloqueada"),
  },
  {
    id: "benzeno",
    nomeQuimico: "Benzeno",
    nomeEpico: "A Coroa dos Seis",
    formulaMolecular: "C6H6",
    formulaEstrutural: "C6H6 (anel aromático)",
    classe: "aromatico",
    carbonos: 6,
    tipoDeLigacao: "aromatic",
    atributos: { polaridade: 1, potencialEnergetico: 3, reatividade: 2, estabilidade: 5, caraterAcidoBasico: 1, interacaoBiologica: 2, volatilidade: 2 },
    propriedades: ["aromatica", "fechada", "homogenea", "baixa_polaridade", "estabilidade_especial", "adequada_para_meio_apolar"],
    descricaoCurta: "Estrutura aromática introdutória com estabilidade especial.",
    pontosFortes: ["aromaticidade", "estabilidade diferenciada", "fecha o arco conceitual do capítulo"],
    limitacoes: ["não deve ser confundido com alceno comum"],
    visual: buildVisual("benzeno", "aromatico", "Desbloqueada"),
  },
];
