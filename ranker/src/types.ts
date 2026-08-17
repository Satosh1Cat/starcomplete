export interface CompletionContext {
  languageId: string;
  fileText: string;
  cursorOffset: number;
}

export interface Candidate {
  label: string;
  kind?: string;
  insertText?: string;
}

export interface Features {
  languageId: string;
  prefix: string;
  receiver: string | null;
  typedMember: string;
  imports: string[];
  identifierCounts: Record<string, number>;
  currentFunction: string | null;
  linePrefix: string;
}

export interface RankedCandidate extends Candidate {
  score: number;
  starred: boolean;
  reasons: string[];
  originalIndex: number;
}

export interface ScoreBreakdown {
  score: number;
  reasons: string[];
}
