import { useState } from 'react';
import RequirementForm from './components/RequirementForm';
import GeneratedUI from './components/GeneratedUI';
import History from './components/History';

export default function App() {
  const [reqs, setReqs] = useState(null);
  const [refreshHistory, setRefreshHistory] = useState(false);

  const handleExtract = (data) => {
    setReqs(data);
    setRefreshHistory(prev => !prev); // toggle refresh so History refetches
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 text-gray-900">
      {/* Navbar */}
      <nav className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white px-6 py-4 shadow-xl">
        <h1 className="text-2xl font-bold tracking-wide">Mini AI App Builder</h1>
      </nav>

      {/* Main Content Area */}
      <main className="max-w-6xl mx-auto p-6 space-y-8 mt-12">
        <RequirementForm onExtract={handleExtract} />
        {reqs && <GeneratedUI reqs={reqs} />}
        <History refresh={refreshHistory} />
      </main>

      {/* Footer */}
      <footer className="text-center text-gray-600 py-6 border-t mt-16 bg-gray-50/50">
        © 2025 Mini AI App Builder. All Rights Reserved.
      </footer>
    </div>
  );
}
