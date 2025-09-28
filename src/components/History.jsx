import React, { useEffect, useState } from "react";

// Add mock data here for a guaranteed, stable demo
const mockHistoryData = [
  {
    _id: '1',
    description: 'CRM for small business to manage clients, sales, and appointments.',
    createdAt: new Date(Date.now() - 86400000).toLocaleString(), 
    result: { AppName: 'CRM Manager' }
  },
  {
    _id: '2',
    description: 'Student portal for course enrollment and grades tracking for a university.',
    createdAt: new Date(Date.now() - 172800000).toLocaleString(), 
    result: { AppName: 'EduTrack Pro' }
  },
];

export default function History() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // --- MOCK DATA IMPLEMENTATION ---
    // Remove the fetch call and use a setTimeout to simulate API delay
    const timer = setTimeout(() => {
        setItems(mockHistoryData);
        setLoading(false);
    }, 500); // 0.5-second delay to simulate network latency

    return () => clearTimeout(timer); // Cleanup timer on unmount
    // --- END MOCK IMPLEMENTATION ---

    // Original code removed:
    // fetch("http://localhost:5000/api/history")
    //   .then(res => res.json())
    //   .then(data => setItems(data))
    //   .catch(err => console.error("History fetch error:", err));
  }, []);

  if (loading) {
      return (
          <section className="bg-white shadow-xl rounded-2xl p-6 flex justify-center items-center h-24 mt-4">
              <svg className="animate-spin h-5 w-5 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span className="ml-3 text-gray-600">Loading history...</span>
          </section>
      );
  }

  // Use a modern, styled card for the history section
  return (
    <section className="bg-white shadow-xl rounded-2xl p-8 mt-8">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">Recent Generations (Demo Data)</h2>
      
      {items.length === 0 ? (
        <p className="text-gray-500">No history found.</p>
      ) : (
        <ul className="space-y-4">
          {items.map((item, i) => (
            <li key={i} className="p-4 border-l-4 border-indigo-500 bg-gray-50 rounded-lg shadow-sm transition-shadow hover:shadow-md">
              <p className="text-lg font-semibold text-gray-700">{item.result?.AppName || "Untitled App"}</p>
              <p className="text-sm text-gray-500 italic mt-1">
                "{item.description.substring(0, 80)}{item.description.length > 80 ? '...' : ''}"
              </p>
              <p className="text-xs text-gray-400 mt-2">Generated: {item.createdAt}</p>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}