import './App.css'
import Dice from './Dice'

function Navbar() {
  return (
    <nav className="navbar">
      <span className="logo">Owl Rock</span>
      <div className="nav-right">
        <div className="divider"></div>
        <button className="nav-btn">로그인</button>
      </div>
    </nav>
  )
}

function App() {
  const handleFaceClick = (label) => {
    alert(`${label} 페이지로 이동!`)
  }

  return (
    <div className="page">
      <Navbar />
      <div className="dice-container">
        <Dice onFaceClick={handleFaceClick} />
      </div>
    </div>
  )
}

export default App