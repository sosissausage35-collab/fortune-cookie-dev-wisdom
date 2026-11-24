// Fortune Cookie Wisdom for Developers — make.fun entry.
//
// The program holds a small set of original fortune-cookie lines written for
// this bounty, judges them the way the house judge does — criterion by
// criterion, most important first — and writes the winning line, and only
// that line, to /output/entry.txt.
//
// Judging order (from the bounty brief, most important first):
//   1. one original line of fortune-cookie wisdom for a developer
//   2. reads like a real fortune cookie (one short balanced sentence)
//   3. says something true about a developer's day
//   4. turns that truth in a way not heard before
//   5. leaves a quiet twist or double meaning for a second read
//
// The winner is picked by LEXICOGRAPHIC comparison of the five scores, in
// that order: the first criterion where two lines differ decides, unless a
// later one differs by much more. No weighted sum is used anywhere.

import { mkdirSync, writeFileSync } from "node:fs";

// Each line is scored 0-2 on the five criteria above, in order.
const CANDIDATES = [
  {
    text: "The legacy code you curse today was written by someone as tired as you are now.",
    scores: [2, 2, 2, 2, 2],
  },
  {
    text: "Your future self is already debugging the shortcut you are about to take.",
    scores: [2, 2, 2, 2, 1],
  },
  {
    text: "You will spend a day chasing a bug that lives in the line you trust most.",
    scores: [2, 2, 2, 1, 2],
  },
  {
    text: "You will fix the bug by deleting the clever code you were once so proud to write.",
    scores: [2, 2, 2, 1, 1],
  },
  {
    text: "The estimate you whisper will be quoted back to you as a promise; speak it slowly.",
    scores: [2, 2, 2, 1, 1],
  },
  {
    text: "The code review you dread will praise the line you almost deleted.",
    scores: [2, 2, 1, 2, 1],
  },
];

// Compare two score tuples lexicographically: the earliest differing
// criterion decides. Returns <0 when a beats b, >0 when b beats a.
function compareScores(a, b) {
  for (let i = 0; i < a.length; i++) {
    if (a[i] !== b[i]) return b[i] - a[i];
  }
  return 0;
}

function pickWinner(candidates) {
  let best = candidates[0];
  for (const candidate of candidates.slice(1)) {
    const cmp = compareScores(candidate.scores, best.scores);
    // Exact score tie: the bounty breaks ties toward the smaller text,
    // so prefer the shorter line (fewer bytes, same order as the ranking).
    if (cmp < 0 || (cmp === 0 && candidate.text.length < best.text.length)) {
      best = candidate;
    }
  }
  return best;
}

const winner = pickWinner(CANDIDATES);
const line = winner.text;

// Gate: the entry must be 1-120 characters, not only whitespace, no newline.
if (line.length < 1 || line.length > 120) {
  throw new Error(`winning line is ${line.length} characters, must be 1-120`);
}
if (line.includes("\n") || line.trim().length === 0) {
  throw new Error("winning line must be a single non-blank line");
}

mkdirSync("/output", { recursive: true });
// Exactly one line, no trailing newline.
writeFileSync("/output/entry.txt", line, "utf8");
console.log(`Wrote ${line.length} characters to /output/entry.txt`);
