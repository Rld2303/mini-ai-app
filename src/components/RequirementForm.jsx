import React, { useState } from 'react'

const capitalize = s => s[0].toUpperCase() + s.slice(1)

export default function RequirementForm({ onExtract }) {
  const [text, setText] = useState('')
  const [loading, setLoading] = useState(false)

  // This is a simple mock extractor for demonstration purposes.
  function mockExtract(input) {
    const lower = input.toLowerCase()

    // App name: try "called X" or "app to/for ..."
    let appName = 'My App'
    const called = input.match(/called\s+([A-Za-z0-9\s]+)/i)
    if (called) appName = called[1].split(/[.,]/)[0].trim()
    else {
      const m = input.match(/app (?:to|for)\s+([A-Za-z\s]+)/i)
      if (m) appName = m[1].split(/[.,]/)[0].trim().split(' ').slice(0, 3).map(capitalize).join(' ') + ' App'
    }

    // Entities: detect common words/endings
    const tokens = (input.match(/\b[a-zA-Z]+\b/g) || []).map(t => t.toLowerCase())
    const entityCandidates = new Set()
    tokens.forEach(t => {
      if (t.length > 3 && t.endsWith('s')) entityCandidates.add(capitalize(t.replace(/s$/, '')))
    })
    // common entities fallback
    ['student', 'course', 'grade', 'user', 'order', 'product', 'ticket', 'event', 'post', 'comment'].forEach(w => {
      if (lower.includes(w)) entityCandidates.add(capitalize(w))
    })

    const entities = Array.from(entityCandidates).slice(0, 6)
    if (entities.length === 0) entities.push('Item')

    // Roles
    const roles = []
    ['teacher', 'student', 'admin', 'manager', 'user', 'customer', 'guest'].forEach(r => {
      if (lower.includes(r)) roles.push(capitalize(r))
    })
    if (roles.length === 0) roles.push('User')

    // Features (crud-ish)
    const verbs = ['add', 'create', 'enrol', 'enroll', 'manage', 'view', 'edit', 'delete', 'search', 'report', 'login', 'signup', 'upload']
    const features = new Set()
    verbs.forEach(v => {
      if (lower.includes(v)) {
        if (['enrol', 'enroll'].includes(v)) features.add('Enrol students')
        else features.add(capitalize(v) + '...')
      }
    })
    if (features.size === 0) features.add('Basic CRUD')

    return {
      AppName: appName,
      Entities: entities,
      Roles: roles,
      Features: Array.from(features)
    }
  }
  
  // The original duplicate `handleSubmit` function that uses a backend fetch call.
  // The first `handleSubmit` function has been removed to fix the error.
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    setLoading(true);

    try {
      // NOTE: This fetch call requires a running backend server.
      // If you do not have a backend, you can uncomment the setTimeout below
      // and use the mockExtract function instead.
      const res = await fetch("http://localhost:5000/api/extract", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ description: text })
      });
      const data = await res.json();
      onExtract(data);
    } catch (err) {
      console.error("Failed to fetch requirements:", err);
      // NOTE: `alert()` is not used here as it's not supported in this environment.
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="card form-card">
      <form onSubmit={handleSubmit}>
        <label htmlFor="desc"><strong>Describe the app</strong></label>
        <textarea
          id="desc"
          placeholder='e.g. "I want an app to manage student courses and grades. Teachers add courses, students enrol, admins generate reports."'
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={5}
        />
        <div className="row">
          <button type="submit" disabled={loading || !text.trim()}>
            {loading ? 'Analyzing…' : 'Generate Mock UI'}
          </button>
        </div>
      </form>
    </section>
  )
}
