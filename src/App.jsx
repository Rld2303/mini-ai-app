import React, { useState } from 'react'
import RequirementForm from './components/RequirementForm'
import GeneratedUI from './components/GeneratedUI'
import './index.css'
import History from "./components/History";


export default function App() {
  const [reqs, setReqs] = useState(null)

  return (
    <div className="app">
      <header>
        <h1>Mini AI App Builder — Demo</h1>
        <p className="sub">Describe an app, click generate — watch a mock UI appear.</p>
      </header>

      <main>
        <RequirementForm onExtract={setReqs} />
        {reqs && <GeneratedUI reqs={reqs} />}
      <History />
      </main>
      
      <footer>Demo mode — backend/AI integration next</footer>
    </div>
  )
}
