import React, { useState } from 'react';
import { FiZap } from 'react-icons/fi';

// 🚨🚨 IMPORTANT: REPLACE THIS PLACEHOLDER WITH YOUR LIVE RENDER BACKEND URL 🚨🚨
// Example: https://mini-ai-app-backend.onrender.com
const RENDER_BACKEND_URL = "https://mini-ai-app.onrender.com"; 

const capitalize = s => s[0].toUpperCase() + s.slice(1);

export default function RequirementForm({ onExtract }) {
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);

  // NOTE: The mockExtract function has been removed to switch to the live API.

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    setLoading(true);

    try {
        // 1. Fetch Request to the Live Render Backend API
        const response = await fetch(`${RENDER_BACKEND_URL}/api/requirements`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            // Send the user's description to the backend for AI processing
            body: JSON.stringify({ description: text.trim() }),
        });

        if (!response.ok) {
            // Throw an error if the server response is not successful (e.g., 404, 500)
            throw new Error(`HTTP error! Status: ${response.status}. Check your Render logs.`);
        }

        const data = await response.json();
        
        // 2. Pass the extracted requirements (AppName, Entities, Roles, Features) to the parent component
        // Assuming your backend sends the structured data under a 'result' key
        onExtract(data.result); 

        // 3. Clear the input field after successful generation
        setText(''); 
        
    } catch (error) {
        console.error("API call failed:", error);
        // Show an alert to the user if the network request fails
        alert("Error generating requirements. Please ensure your backend is live on Render.");
    } finally {
        setLoading(false);
    }
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