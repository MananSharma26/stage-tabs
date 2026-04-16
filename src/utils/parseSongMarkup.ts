import type { Block } from '../types/song';

// Markup rules:
// [Verse 1], [Chorus], [Bridge], [Intro], [Outro]  → sectionHeader
// {Instrumental}, {Pause}, {Stop}, {Build}, etc.   → cue
// C: G   D   Em   C                                 → chordLine
// anything else                                     → lyricLine
// blank line                                        → emptyLine

export function parseSongMarkup(content: string): Block[] {
  const lines = content.split('\n');
  const blocks: Block[] = [];

  for (const raw of lines) {
    const line = raw;

    if (line.trim() === '') {
      blocks.push({ type: 'emptyLine' });
      continue;
    }

    // Section header: [Verse 1]
    const sectionMatch = line.match(/^\[(.+)\]$/);
    if (sectionMatch) {
      blocks.push({ type: 'sectionHeader', text: sectionMatch[1] });
      continue;
    }

    // Cue: {Instrumental 4 bars}
    const cueMatch = line.match(/^\{(.+)\}$/);
    if (cueMatch) {
      blocks.push({ type: 'cue', text: cueMatch[1] });
      continue;
    }

    // Chord line: starts with "C: "
    if (line.startsWith('C: ')) {
      blocks.push({ type: 'chordLine', text: line.slice(3) });
      continue;
    }

    blocks.push({ type: 'lyricLine', text: line });
  }

  return blocks;
}
