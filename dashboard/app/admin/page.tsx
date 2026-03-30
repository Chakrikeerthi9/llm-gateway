"use client";
import { useState } from "react";

const API = process.env.NEXT_PUBLIC_API_URL;
const ADMIN_KEY = process.env.NEXT_PUBLIC_ADMIN_KEY || "";

export default function Admin() {
  const [name, setName] = useState("");
  const [plan, setPlan] = useState("starter");
  const [credits, setCredits] = useState(1000);
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  async function createTenant() {
    setLoading(true);
    const res = await fetch(`${API}/tenants`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Admin-Key": ADMIN_KEY
      },
      body: JSON.stringify({ name, plan, credits })
    });
    const data = await res.json();
    setResult(data);
    setLoading(false);
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Admin — Create Tenant</h1>

        <div className="bg-gray-900 rounded-xl p-6 border border-gray-800 space-y-4">
          <div>
            <label className="text-sm text-gray-400 block mb-2">Company Name</label>
            <input
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="MedNote Inc"
            />
          </div>
          <div>
            <label className="text-sm text-gray-400 block mb-2">Plan</label>
            <select
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white"
              value={plan}
              onChange={e => setPlan(e.target.value)}
            >
              <option value="starter">Starter</option>
              <option value="pro">Pro</option>
            </select>
          </div>
          <div>
            <label className="text-sm text-gray-400 block mb-2">Credits</label>
            <input
              type="number"
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white"
              value={credits}
              onChange={e => setCredits(Number(e.target.value))}
            />
          </div>
          <button
            onClick={createTenant}
            disabled={loading || !name}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-700 rounded-lg py-3 font-semibold transition-colors"
          >
            {loading ? "Creating..." : "Create Tenant"}
          </button>
        </div>

        {result && (
          <div className="mt-6 bg-gray-900 rounded-xl p-6 border border-green-800">
            <h2 className="text-green-400 font-bold mb-4">✅ Tenant Created</h2>
            <div className="space-y-2 text-sm font-mono">
              <div><span className="text-gray-400">ID:</span> <span className="text-white">{result.id}</span></div>
              <div><span className="text-gray-400">Name:</span> <span className="text-white">{result.name}</span></div>
              <div><span className="text-gray-400">Plan:</span> <span className="text-white">{result.plan}</span></div>
              <div><span className="text-gray-400">Credits:</span> <span className="text-green-400">{result.credits}</span></div>
            </div>
            <div className="mt-4 p-3 bg-yellow-900 rounded-lg border border-yellow-700">
              <p className="text-yellow-400 text-xs font-bold mb-1">⚠️ Send this tenant ID to generate their JWT token</p>
              <code className="text-yellow-300 text-xs break-all">{result.id}</code>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}