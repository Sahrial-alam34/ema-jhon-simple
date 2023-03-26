import { useState } from 'react'
import viteLogo from '/vite.svg'
import './App.css'
import Header from './components/Header/Header'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="App">
     <Header></Header>
    </div>
  )
}

export default App
