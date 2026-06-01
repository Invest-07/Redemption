import './App.css'

function Navbar() {
  return (
    <nav className="navbar">
      <span className="logo">Owl Rock</span>
      <div className="nav-right">
        <a href="#">Portfolio</a>
        <a href="#">About</a>
        <div className="divider"></div>
        <button className="nav-btn">로그인</button>
      </div>
    </nav>
  )
}

function App() {
  return (
    <div className="page">
      <Navbar />
    </div>
  )
}

export default App