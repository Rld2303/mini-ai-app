import React, { useEffect, useState } from "react";

export default function History() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/api/history")
      .then(res => res.json())
      .then(data => setItems(data))
      .catch(err => console.error("History fetch error:", err));
  }, []);

  if (!items.length) return null;

  return (
    <section className="card">
      <h2>History (last {items.length})</h2>
      <ul>
        {items.map((item, i) => (
          <li key={i}>
            <strong>{item.result?.AppName || "Untitled App"}</strong><br />
            <small>{item.description}</small>
          </li>
        ))}
      </ul>
    </section>
  );
}
