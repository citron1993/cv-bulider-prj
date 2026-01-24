import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { Routes,Route } from "react-router-dom"
import PreviewCV from "./commponents/previewCV"
import Editor from "./commponents/Editor"
import Navigation from './commponents/Navigation'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
    <Navigation/>
     <Routes>
        <Route path='edit' element={<Editor/>}/>
         <Route path='preview' element={<PreviewCV/>}/>

     </Routes>
    </>
  )
}

export default App
