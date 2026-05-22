import { describe, expect, it } from "vitest";

import {
  createExplicitHydrogenProjection,
  getHydrogenCountForAtom,
  getTotalHydrogenCount,
} from "@/lib/builder/chemistry/branched-hydrogens";
import {
  getCanonicalSignatureFromEngine,
  layoutBranchedStateWithEngine,
} from "@/lib/builder/chemistry/engine-interop";
import { createBranchedRenderModel } from "@/lib/builder/layout/branched-render-model";
import {
  addCarbonToAtom,
  createBranchedBuilderState,
  cycleBondOrder,
} from "@/lib/builder/state/branched-operations";

describe("branched builder foundation", () => {
  it("calcula hidrogênios explícitos para etano linear", () => {
    const methane = createBranchedBuilderState();
    const ethane = addCarbonToAtom(methane, "a1");

    expect(getHydrogenCountForAtom(ethane, "a1")).toBe(3);
    expect(getHydrogenCountForAtom(ethane, "a2")).toBe(3);
    expect(getTotalHydrogenCount(ethane)).toBe(6);

    const projection = createExplicitHydrogenProjection(ethane);
    expect(projection.atoms).toHaveLength(6);
    expect(projection.bonds).toHaveLength(6);
  });

  it("atualiza hidrogênios e assinatura canônica ao criar isobutano", () => {
    const methane = createBranchedBuilderState();
    const ethane = addCarbonToAtom(methane, "a1");
    const propane = addCarbonToAtom(ethane, "a2");
    const isobutane = addCarbonToAtom(propane, "a2");

    expect(getHydrogenCountForAtom(isobutane, "a2")).toBe(1);
    expect(getTotalHydrogenCount(isobutane)).toBe(10);
    expect(getCanonicalSignatureFromEngine(isobutane)).not.toHaveLength(0);
  });

  it("permite alternar ordem de ligação respeitando valência do carbono", () => {
    const methane = createBranchedBuilderState();
    const ethane = addCarbonToAtom(methane, "a1");
    const ethene = cycleBondOrder(ethane, "b1");
    const ethyne = cycleBondOrder(ethene, "b1");

    expect(getHydrogenCountForAtom(ethene, "a1")).toBe(2);
    expect(getHydrogenCountForAtom(ethyne, "a1")).toBe(1);
    expect(getTotalHydrogenCount(ethyne)).toBe(2);
  });

  it("gera coordenadas 2D e render model com hidrogênios explícitos", () => {
    const methane = createBranchedBuilderState();
    const ethane = addCarbonToAtom(methane, "a1");
    const layout = layoutBranchedStateWithEngine(ethane);
    const renderModel = createBranchedRenderModel(ethane);

    expect(layout.atomCoords).toHaveLength(2);
    expect(new Set(layout.atomCoords.map((coord) => coord.atomId))).toEqual(
      new Set(["a1", "a2"]),
    );

    expect(renderModel.atoms.filter((atom) => atom.label === "C")).toHaveLength(2);
    expect(renderModel.atoms.filter((atom) => atom.label === "H")).toHaveLength(6);
    expect(renderModel.bonds.filter((bond) => bond.kind === "hydrogen")).toHaveLength(6);
  });
});
