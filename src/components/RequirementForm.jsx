import React, { useState } from 'react';
import { FiZap } from 'react-icons/fi';


const capitalize = s => s[0].toUpperCase() + s.slice(1);

export default function RequirementForm({ onExtract }) {
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);

  // This is a simple mock extractor for demonstration purposes.
  function mockExtract(input) {
    const lower = input.toLowerCase();
    let appName = 'My App';
    const called = input.match(/called\s+([A-Za-z0-9\s]+)/i);
    if (called) appName = called[1].split(/[.,]/)[0].trim();
    else {
      const m = input.match(/app (?:to|for)\s+([A-Za-z\s]+)/i);
      if (m) appName = m[1].split(/[.,]/)[0].trim().split(' ').slice(0, 3).map(capitalize).join(' ') + ' App';
    }

    const tokens = (input.match(/\b[a-zA-Z]+\b/g) || []).map(t => t.toLowerCase());
    const entityCandidates = new Set();
    tokens.forEach(t => {
      if (t.length > 3 && t.endsWith('s')) entityCandidates.add(capitalize(t.replace(/s$/, '')));
    });
    ['student', 'course', 'grade', 'user', 'order', 'product', 'ticket', 'event', 'post', 'comment'].forEach(w => {
      if (lower.includes(w)) entityCandidates.add(capitalize(w));
    });

    const entities = Array.from(entityCandidates).slice(0, 6);
    if (entities.length === 0) entities.push('Item');

    const roles = [];
    ['teacher', 'student', 'admin', 'manager', 'user', 'customer', 'guest'].forEach(r => {
      if (lower.includes(r)) roles.push(capitalize(r));
    });
    if (roles.length === 0) roles.push('User');

    const verbs = ['add', 'create', 'enrol', 'enroll', 'manage', 'view', 'edit', 'delete', 'search', 'report', 'login', 'signup', 'upload'];
    const features = new Set();
    verbs.forEach(v => {
      if (lower.includes(v)) {
        if (['enrol', 'enroll'].includes(v)) features.add('Enrol students');
        else features.add(capitalize(v) + '...');
      }
    });
    if (features.size === 0) features.add('Basic CRUD');

    return {
      AppName: appName,
      Entities: entities,
      Roles: roles,
      Features: Array.from(features)
    };
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    setLoading(true);

    // Use a small delay to simulate the server response time.
    setTimeout(() => {
      const data = mockExtract(text);
      onExtract(data);
      setLoading(false);
    }, 1000); // 1-second delay
  };

  return (
    <section className="bg-white shadow-xl rounded-2xl p-8 transform transition-transform hover:scale-[1.01] duration-300">
      <form onSubmit={handleSubmit} className="space-y-6">
        <label htmlFor="desc" className="block font-semibold text-xl text-gray-700">Describe your app idea:</label>
        <textarea
          id="desc"
          placeholder='e.g., "I need a CRM for a small business to manage clients, sales, and appointments."'
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={6}
          className="w-full border border-gray-300 rounded-lg p-4 focus:ring-4 focus:ring-blue-300 transition-colors duration-200"
        />
        <div className="flex justify-center">
          <button
            type="submit"
            disabled={loading || !text.trim()}
            className="w-full max-w-sm bg-blue-600 text-white font-bold py-4 rounded-full shadow-lg hover:bg-blue-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 transform hover:scale-105"
          >
            {loading ? (
              <>
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Analyzing...</span>
              </>
            ) : (
              <>
                <FiZap className="w-5 h-5" /> <span>Generate Mock UI</span>
              </>
            )}
          </button>
        </div>
      </form>
    </section>
  );
}