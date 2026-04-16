export interface Song {
  id: string;
  title: string;
  artist: string;
  lyrics: string;
}

export const DEFAULT_SONGS: Song[] = [
  { id: '1', title: "Beggin'", artist: 'Måneskin', lyrics: '' },
  { id: '2', title: 'Shut Up and Dance', artist: 'Walk the Moon', lyrics: '' },
  { id: '3', title: 'Are You Gonna Be My Girl', artist: 'Jet', lyrics: '' },
  { id: '4', title: "Don't Stop Believin'", artist: 'Journey', lyrics: '' },
  { id: '5', title: 'Holiday', artist: 'Green Day', lyrics: '' },
  { id: '6', title: 'Gimme! Gimme! Gimme!', artist: 'ABBA', lyrics: '' },
];

const STORAGE_KEY = 'stage-tabs-songs';

export function loadSongs(): Song[] {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved) as Song[];
      // Merge with defaults in case structure changed
      return DEFAULT_SONGS.map(def => {
        const found = parsed.find(s => s.id === def.id);
        return found ? { ...def, ...found } : def;
      });
    }
  } catch {}
  return DEFAULT_SONGS;
}

export function saveSongs(songs: Song[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(songs));
}
