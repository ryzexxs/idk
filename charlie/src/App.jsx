import React from 'react'
import Header from './components/Header'
import About from './components/About'
import Work from './components/Work'
import Contact from './components/Contact'
import Footer from './components/Footer'
import profileImg from '../img/profile.webp'

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="max-w-2xl mx-auto px-6 pb-24">
        <About profileImg={profileImg} />
        <Work />
        <Contact />
      </main>
      <Footer />
    </div>
  )
}

export default App
