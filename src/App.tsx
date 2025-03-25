// import { useState } from 'react'
import ComboBox from './components/ComboBox'
import './App.css'

function App() {
  const fruits = [
    'Apple',
    'Banana',
    'Cherry',
    'Date',
    'Elderberry',
    'Fig',
    'Grape',
    'Honeydew',
    'Kiwi',
    'Lemon',
    'Mango'
  ]

  return (
    <div className="container">
      <h1>Accessible ComboBox Demo</h1>
      <ComboBox options={fruits} />
    </div>
  )
}

export default App