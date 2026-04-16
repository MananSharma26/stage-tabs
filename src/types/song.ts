export interface Song {
  id: string;
  title: string;
  artist?: string;
  key?: string;
  capo?: number;
  order: number;
  content: string; // markup format
  lastScrollOffset: number;
  createdAt: string;
  updatedAt: string;
}

export interface AppSettings {
  fontSize: number;       // base px, default 18
  darkMode: boolean;
  stageLock: boolean;     // prevent accidental edits during performance
  keepAwake: boolean;
}

export type Screen = 'setlist' | 'song' | 'edit' | 'tuner' | 'settings';

// Parsed content block types
export type Block =
  | { type: 'sectionHeader'; text: string }
  | { type: 'cue'; text: string }
  | { type: 'chordLine'; text: string }
  | { type: 'lyricLine'; text: string }
  | { type: 'emptyLine' };
