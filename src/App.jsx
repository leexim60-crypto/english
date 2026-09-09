import { useState, useEffect } from 'react'
import Navbar from './components/Navbar.jsx'
import HelpModal from './components/HelpModal.jsx'
import Flashcards from './components/Flashcards.jsx'
import Quiz from './components/Quiz.jsx'
import DailySentence from './components/DailySentence.jsx'
import WordBook from './components/WordBook.jsx'
import Phrases from './components/Phrases.jsx'
import { useWords } from './hooks/useWords.js'
import { clearReview } from './utils/review.js'

export default function App() {
  const [tab, setTab] = useState('home')
  const [helpOpen, setHelpOpen] = useState(false)
  const { words, sentences, counts, source, loading } = useWords()

  // 生词本（收藏），持久化到 localStorage
  const [favorites, setFavorites] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('favorites') || '[]')
    } catch {
      return []
    }
  })
  useEffect(() => {
    localStorage.setItem('favorites', JSON.stringify(favorites))
  }, [favorites])

  const toggleFavorite = (id) => {
    const removing = favorites.includes(id)
    setFavorites((prev) =>
      removing ? prev.filter((f) => f !== id) : [...prev, id]
    )
    // 从生词本移除时，同步清理复习调度数据
    if (removing) clearReview(id)
  }

  return (
    <div className="app">
      <Navbar
        tab={tab}
        setTab={setTab}
        favoritesCount={favorites.length}
        source={source}
        loading={loading}
        onHelp={() => setHelpOpen(true)}
      />
      <main className="main">
        {tab === 'home' && (
          <DailySentence
            onGo={() => setTab('cards')}
            onReview={() => setTab('wordbook')}
            onHelp={() => setHelpOpen(true)}
            sentences={sentences}
            counts={counts}
            favorites={favorites}
          />
        )}
        {tab === 'cards' && (
          <Flashcards
            words={words}
            counts={counts}
            source={source}
            favorites={favorites}
            toggleFavorite={toggleFavorite}
          />
        )}
        {tab === 'quiz' && (
          <Quiz words={words} source={source} favorites={favorites} toggleFavorite={toggleFavorite} />
        )}
        {tab === 'phrases' && <Phrases source={source} />}
        {tab === 'wordbook' && (
          <WordBook words={words} favorites={favorites} toggleFavorite={toggleFavorite} />
        )}
      </main>
      <footer className="footer">
        <p>🎓 英语学习网 · 每天进步一点点 · Keep Learning!</p>
      </footer>
      <HelpModal open={helpOpen} onClose={() => setHelpOpen(false)} />
    </div>
  )
}
