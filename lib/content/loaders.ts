import { chapter1 } from "@/content/chapters/chapter-1";
import { libraryBooks } from "@/content/library";
import { chapter1Molecules } from "@/content/molecules/chapter-1";
import { chapter1Phases } from "@/content/phases/chapter-1";
import { chapterSchema, libraryBookSchema, moleculeSchema, phaseSchema } from "@/lib/content/schema";
import type { Chapter, ChapterId, LibraryBook, LibraryBookId, Molecule, MoleculeId, Phase, PhaseId } from "@/lib/content/types";

const chapters = [chapterSchema.parse(chapter1)];
const parsedLibraryBooks = libraryBooks.map((book) => libraryBookSchema.parse(book));
const molecules = chapter1Molecules.map((molecule) => moleculeSchema.parse(molecule));
const phases = chapter1Phases.map((phase) => phaseSchema.parse(phase));

const chapterMap = new Map<ChapterId, Chapter>(chapters.map((chapter) => [chapter.id, chapter]));
const libraryBookMap = new Map<LibraryBookId, LibraryBook>(parsedLibraryBooks.map((book) => [book.id, book]));
const moleculeMap = new Map<MoleculeId, Molecule>(molecules.map((molecule) => [molecule.id, molecule]));
const phaseMap = new Map<PhaseId, Phase>(phases.map((phase) => [phase.id, phase]));

function assertChapterExists(chapterId: ChapterId): Chapter {
  const chapter = chapterMap.get(chapterId);

  if (!chapter) {
    throw new Error(`Capítulo não encontrado: ${chapterId}`);
  }

  return chapter;
}

function assertPhaseExists(phaseId: PhaseId): Phase {
  const phase = phaseMap.get(phaseId);

  if (!phase) {
    throw new Error(`Fase não encontrada: ${phaseId}`);
  }

  return phase;
}

function assertLibraryBookExists(bookId: LibraryBookId): LibraryBook {
  const book = libraryBookMap.get(bookId);

  if (!book) {
    throw new Error(`Livro da biblioteca não encontrado: ${bookId}`);
  }

  return book;
}

function assertMoleculeExists(moleculeId: MoleculeId): Molecule {
  const molecule = moleculeMap.get(moleculeId);

  if (!molecule) {
    throw new Error(`Molécula não encontrada: ${moleculeId}`);
  }

  return molecule;
}

export function getAllChapters(): Chapter[] {
  return chapters;
}

export function getPrimaryChapter(): Chapter {
  const [chapter] = chapters;

  if (!chapter) {
    throw new Error("Nenhum capítulo foi carregado no conteúdo oficial.");
  }

  return chapter;
}

export function getChapterById(chapterId: ChapterId): Chapter {
  return assertChapterExists(chapterId);
}

export function getAllMolecules(): Molecule[] {
  return molecules;
}

export function getAllLibraryBooks(): LibraryBook[] {
  return parsedLibraryBooks;
}

export function getLibraryBookById(bookId: LibraryBookId): LibraryBook {
  return assertLibraryBookExists(bookId);
}

export function getMoleculeById(moleculeId: MoleculeId): Molecule {
  return assertMoleculeExists(moleculeId);
}

export function getAllPhases(): Phase[] {
  return phases;
}

export function getPhaseById(phaseId: PhaseId): Phase {
  return assertPhaseExists(phaseId);
}

export function getPhasesByChapterId(chapterId: ChapterId): Phase[] {
  assertChapterExists(chapterId);

  return phases
    .filter((phase) => phase.chapterId === chapterId)
    .sort((left, right) => left.number - right.number);
}

export function getMoleculesByIds(ids: MoleculeId[]): Molecule[] {
  return ids.map(assertMoleculeExists);
}

export function validateContentIntegrity(): void {
  const sectionIds = new Set<string>();

  for (const book of parsedLibraryBooks) {
    if (book.sections.length === 0) {
      throw new Error(`Livro ${book.id} não possui seções.`);
    }

    for (const section of book.sections) {
      const scopedId = `${book.id}:${section.id}`;

      if (sectionIds.has(scopedId)) {
        throw new Error(`Seção duplicada na biblioteca: ${scopedId}`);
      }

      sectionIds.add(scopedId);
    }
  }

  for (const chapter of chapters) {
    for (const phaseId of chapter.phaseIds) {
      const phase = assertPhaseExists(phaseId);

      if (phase.chapterId !== chapter.id) {
        throw new Error(`Fase ${phase.id} aponta para capítulo ${phase.chapterId}, esperado ${chapter.id}`);
      }
    }

    for (const moleculeId of chapter.moleculeIds) {
      assertMoleculeExists(moleculeId);
    }
  }

  for (const phase of phases) {
    assertMoleculeExists(phase.excellentAnswer);
    phase.adequateAnswers.forEach(assertMoleculeExists);
    phase.availableMolecules.forEach(assertMoleculeExists);
  }
}

validateContentIntegrity();
