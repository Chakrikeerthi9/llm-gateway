"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

const API = process.env.NEXT_PUBLIC_API_URL;

export default function Tenants() {
  const [tenants, setTenants] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API}/tenants`)
      .then(r => r.json())
      .then(data => { setTenants(data); setLoading(false); });
  }, []);

  return (
    <div className="min-h-screen bg-gray-950 text-white p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <Link href="/" className="text-gray-400 text-sm hover:text-white">← Back</Link>
            <h1 className="text-3xl font-bold mt-2">Tenants</h1>
          </div>
        </div>

        {loading ? (
          <p className="text-gray-400">Loading...</p>
        ) : (
          <div className="bg-gray-900 rounded-xl border border-gray-800">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-gray-400 border-b border-gray-800">
                  <th className="text-left p-4">Name</th>
                  <th className="text-left p-4">Plan</th>
                  <th className="text-right p-4">Credits (DB)</th>
                  <th className="text-right p-4">Status</th>
                  <th className="text-right p-4">Created</th>
                </tr>
              </thead>
              <tbody>
                {tenants.map((t) => (
                  <tr key={t.id} className="border-b border-gray-800 hover:bg-gray-800">
                    <td className="p-4 font-medium text-white">{t.name}</td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        t.plan === "pro" ? "bg-blue-900 text-blue-300" : "bg-gray-700 text-gray-300"
                      }`}>{t.plan}</span>
                    </td>
                    <td className="p-4 text-right text-green-400 font-mono">{t.credits}</td>
                    <td className="p-4 text-right">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        t.is_active ? "bg-green-900 text-green-300" : "bg-red-900 text-red-300"
                      }`}>{t.is_active ? "active" : "inactive"}</span>
                    </td>
                    <td className="p-4 text-right text-gray-400 text-xs">
                      {new Date(t.created_at).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}