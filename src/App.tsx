import { useState, useRef, useEffect } from 'react'
import './index.css'
import { loadSongs, saveSongs, type Song } from './data/songs'

type View = 'perform' | 'edit'

export default function App() {
  const [songs, setSongs] = useState<Song[]>(() => loadSongs())
  const [currentIdx, setCurrentIdx] = useState(0)
  const [view, setView] = useState<View>('perform')
  const [editText, setEditText] = useState('')
  const [fontSize, setFontSize] = useState(18)

  // Swipe handling
  const touchStartX = useRef(0)
  const touchStartY = useRef(0)

  const song = songs[currentIdx]

  // Keep active tab visible when switching
  const tabsRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const el = tabsRef.current?.children[currentIdx] as HTMLElement
    el?.scrollIntoView({ block: 'nearest', inline: 'center' })
  }, [currentIdx])

  function goTo(idx: number) {
    if (idx < 0 || idx >= songs.length) return
    setCurrentIdx(idx)
    setView('perform')
  }

  function openEdit() {
    setEditText(song.lyrics)
    setView('edit')
  }

  function saveEdit() {
    const updated = songs.map((s, i) =>
      i === currentIdx ? { ...s, lyrics: editText } : s
    )
    setSongs(updated)
    saveSongs(updated)
    setView('perform')
  }

  function cancelEdit() {
    setView('perform')
  }

  function onTouchStart(e: React.TouchEvent) {
    touchStartX.current = e.touches[0].clientX
    touchStartY.current = e.touches[0].clientY
  }

  function onTouchEnd(e: React.TouchEvent) {
    const dx = e.changedTouches[0].clientX - touchStartX.current
    const dy = e.changedTouches[0].clientY - touchStartY.current
    // Only swipe if horizontal movement dominates
    if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 50) {
      if (dx < 0) goTo(currentIdx + 1)
      else goTo(currentIdx - 1)
    }
  }

  return (
    <div className="app">
      {/* Song tabs */}
      <div className="song-tabs" ref={tabsRef}>
        {songs.map((s, i) => (
          <button
            key={s.id}
            className={`song-tab${i === currentIdx ? ' active' : ''}`}
            onClick={() => goTo(i)}
          >
            {i + 1}. {s.title}
          </button>
        ))}
      </div>

      {/* Song header */}
      <div className="song-header">
        <div className="song-title">{song.title}</div>
        <div className="song-artist">{song.artist}</div>
      </div>

      {/* Action bar */}
      <div className="action-bar">
        {view === 'perform' ? (
          <>
            <button className="btn" onClick={openEdit}>✏️ Edit Lyrics</button>
            <div className="font-controls">
              <button className="font-btn" onClick={() => setFontSize(f => Math.max(14, f - 2))}>A−</button>
              <button className="font-btn" onClick={() => setFontSize(f => Math.min(28, f + 2))}>A+</button>
            </div>
          </>
        ) : (
          <>
            <button className="btn primary" onClick={saveEdit}>Save</button>
            <button className="btn" onClick={cancelEdit}>Cancel</button>
          </>
        )}
      </div>

      {/* Main content */}
      {view === 'perform' ? (
        <div
          className="lyrics-view"
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
        >
          {song.lyrics.trim() ? (
            <pre className="lyrics-text" style={{ fontSize }}>{song.lyrics}</pre>
          ) : (
            <div className="empty-state">
              <div style={{ fontSize: 40 }}>🎵</div>
              <p>No lyrics yet.<br />Tap <strong>Edit Lyrics</strong> to paste them in.</p>
            </div>
          )}
        </div>
      ) : (
        <div className="edit-view">
          <p className="edit-hint">Paste lyrics for <strong>{song.title}</strong>. They'll be saved on this device.</p>
          <textarea
            className="lyrics-textarea"
            value={editText}
            onChange={e => setEditText(e.target.value)}
            placeholder="Paste lyrics here..."
            autoFocus
          />
        </div>
      )}

      {/* Bottom nav arrows */}
      {view === 'perform' && (
        <div className="nav-arrows">
          <button className="nav-arrow" onClick={() => goTo(currentIdx - 1)} disabled={currentIdx === 0}>‹</button>
          <span className="nav-counter">{currentIdx + 1} / {songs.length}</span>
          <button className="nav-arrow" onClick={() => goTo(currentIdx + 1)} disabled={currentIdx === songs.length - 1}>›</button>
        </div>
      )}
    </div>
  )
}
