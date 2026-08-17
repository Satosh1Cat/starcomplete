import { priorFor } from "./frequency";
import type { Candidate, Features, RankedCandidate, ScoreBreakdown } from "./types";

export const STAR_COUNT = 3;
export const STAR_MIN_SCORE = 2.5;

export function rank(candidates: Candidate[], features: Features): RankedCandidate[] {
  const scored: RankedCandidate[] = candidates.map((candidate, originalIndex) => {
    const { score, reasons } = scoreCandidate(candidate, features, originalIndex);
    return {
      ...candidate,
      score,
      reasons,
      originalIndex,
      starred: false,
    };
  });

  scored.sort((a, b) => b.score - a.score || a.originalIndex - b.originalIndex);

  let starred = 0;
  for (const item of scored) {
    if (starred < STAR_COUNT && item.score >= STAR_MIN_SCORE) {
      item.starred = true;
      starred += 1;
    }
  }
  return scored;
}

export function scoreCandidate(
  candidate: Candidate,
  features: Features,
  originalIndex: number,
): ScoreBreakdown {
  const label = completionName(candidate.label);
  const reasons: string[] = [];
  let score = 0;

  const typed = features.typedMember || features.prefix;
  if (typed) {
    const lower = label.toLowerCase();
    const needle = typed.toLowerCase();
    if (lower.startsWith(needle)) {
      score += 2.5;
      reasons.push("prefix");
    } else if (lower.includes(needle)) {
      score += 0.5;
    }
  }

  if (features.imports.includes(label) || (features.receiver && features.imports.includes(features.receiver))) {
    if (features.imports.includes(label)) {
      score += 3;
      reasons.push("imported");
    }
  }

  const seen = features.identifierCounts[label] ?? 0;
  if (seen > 0) {
    const bump = Math.min(seen, 6) * 0.6;
    score += bump;
    reasons.push("same-file");
  }

  const prior = priorFor(features.receiver, label);
  if (prior > 0) {
    score += prior * 0.45;
    reasons.push("common API");
  }

  if (features.receiver && isMethodish(candidate.kind)) {
    score += 0.3;
  }

  score -= originalIndex * 0.001;
  return { score, reasons };
}

export function completionName(label: string): string {
  return label.replace(/^\W+/, "").split(/[(\s.]/, 1)[0] ?? label;
}

function isMethodish(kind: string | undefined): boolean {
  if (!kind) {
    return false;
  }
  const normalized = kind.toLowerCase();
  return normalized.includes("method") || normalized.includes("function") || normalized.includes("property");
}
