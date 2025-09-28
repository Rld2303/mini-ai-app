import React, { useState } from 'react';

const entityFieldsMap = {
  Student: ['Name', 'Email', 'Age'],
  Course: ['Title', 'Code', 'Credits'],
  Grade: ['Student', 'Course', 'Grade'],
  User: ['Name', 'Email'],
  Item: ['Name', 'Description']
};

export default function GeneratedUI({ reqs }) {
  const [activeRole, setActiveRole] = useState(reqs?.Roles?.[0] || 'User');

  if (!reqs) return null;

  return (
    <section className="bg-white shadow-xl rounded-2xl p-8">
      <h2 className="text-3xl font-extrabold mb-8 text-gray-800 tracking-wide">{reqs.AppName || "Generated App"}</h2>

      {/* Roles as Tabs */}
      <div className="flex space-x-4 mb-6 border-b border-gray-200">
        {reqs.Roles.map(r => (
          <button
            key={r}
            className={`px-6 py-3 rounded-t-lg font-medium transition-colors duration-200 transform hover:scale-105 ${r === activeRole 
              ? "bg-gradient-to-r from-blue-600 to-indigo-700 text-white shadow-lg" 
              : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
            onClick={() => setActiveRole(r)}
          >
            {r}
          </button>
        ))}
      </div>

      {/* Features as Badges */}
      <div className="flex flex-wrap gap-3 mb-8">
        {reqs.Features.map(f => (
          <span key={f} className="bg-purple-100 text-purple-700 font-semibold px-4 py-2 rounded-full text-sm shadow-sm">
            {f}
          </span>
        ))}
      </div>

      {/* Entities as Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {reqs.Entities.map(ent => {
          const fields = entityFieldsMap[ent] || ['Name', 'Description'];
          return (
            <div key={ent} className="bg-gray-50 p-6 rounded-2xl shadow-inner border border-gray-200 transform transition-transform hover:translate-y-[-5px] duration-300">
              <h3 className="text-xl font-bold mb-4 text-gray-800">{ent} Form</h3>
              <form className="space-y-4">
                {fields.map(f => (
                  <div className="mb-2" key={f}>
                    <label className="block text-sm font-medium text-gray-600 mb-1">{f}</label>
                    <input
                      type="text"
                      placeholder={f}
                      className="w-full border border-gray-300 rounded-md p-2 text-gray-800 focus:ring-2 focus:ring-blue-400"
                    />
                  </div>
                ))}
                <div className="flex justify-end">
                  <button type="button" className="mt-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-bold px-5 py-2 rounded-full shadow-md hover:from-blue-600 hover:to-blue-700 transition-colors">
                    Save {ent}
                  </button>
                </div>
              </form>
            </div>
          );
        })}
      </div>
    </section>
  );
}