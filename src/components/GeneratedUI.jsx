import React, { useState } from 'react'

const entityFieldsMap = {
  Student: ['Name', 'Email', 'Age'],
  Course: ['Title', 'Code', 'Credits'],
  Grade: ['Student', 'Course', 'Grade'],
  User: ['Name', 'Email'],
  Item: ['Name', 'Description']
}

export default function GeneratedUI({ reqs }) {
  const [activeRole, setActiveRole] = useState(reqs?.Roles?.[0] || 'User')

  if (!reqs) return null

  return (
    <section className="card generated">
      <h2>{reqs.AppName}</h2>

      <div className="roles">
        {reqs.Roles.map(r => (
          <button
            key={r}
            className={r === activeRole ? 'role active' : 'role'}
            onClick={() => setActiveRole(r)}
          >
            {r}
          </button>
        ))}
      </div>

      <div className="features">
        {reqs.Features.map(f => (
          <button key={f} className="feature">{f}</button>
        ))}
      </div>

      <div className="entities-grid">
        {reqs.Entities.map(ent => {
          const fields = entityFieldsMap[ent] || ['Name', 'Description']
          return (
            <div key={ent} className="entity-card">
              <h3>{ent} Form</h3>
              <form>
                {fields.map(f => (
                  <div className="field" key={f}>
                    <label>{f}</label>
                    <input placeholder={f} />
                  </div>
                ))}
                <div className="row">
                  <button type="button">Save {ent}</button>
                </div>
              </form>
            </div>
          )
        })}
      </div>
    </section>
  )
}
