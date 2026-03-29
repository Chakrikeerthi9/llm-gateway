"use client";
import { useEffect, useState } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

const API = process.env.NEXT_PUBLIC_API_URL;

export default function Home() {
  const [health, setHealth] = useState<any>(null);
  const [cacheStats, setCacheStats] = useState<any>(null);
  const [costSummary, setCostSummary] = useState<any[]>([]);

  useEffect(() => {
    fetch(`${API}/health`).then(r => r.json()).then(setHealth);
    fetch(`${API}/cache/stats`).then(r => r.json()).then(setCacheStats);
    fetch(`${API}/audit/cost-summary`).then(r => r.json()).then(setCostSummary);
  }, []);

  const totalRequests = costSummary.reduce((a, b) => a + b.total_requests, 0);
  const totalCost = costSummary.reduce((a, b) => a + b.total_cost_usd, 0);
  const totalCacheHits = costSummary.reduce((a, b) => a + b.cache_hits, 0);
  const cacheHitRate = totalRequests > 0 ? ((totalCacheHits / totalRequests) * 100).toFixed(1) : "0";

  return (
    <div className="min-h-screen bg-gray-950 text-white p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white">LLM Gateway</h1>
          <p className="text-gray-400 mt-1">Production observability dashboard</p>
        </div>

        {/* Status */}
        <div className="flex gap-3 mb-8">
          {health && Object.entries(health).map(([k, v]) => (
            <span key={k} className={`px-3 py-1 rounded-full text-sm font-medium ${v === "ok" ? "bg-green-900 text-green-300" : "bg-red-900 text-red-300"}`}>
              {k}: {v as string}
            </span>
          ))}
        </div>

        {/* Metrics */}
        <div className="grid grid-cols-4 gap-4 mb-8">
          {[
            { label: "Total Requests", value: totalRequests, color: "text-blue-400" },
            { label: "Total Cost", value: `$${totalCost.toFixed(6)}`, color: "text-green-400" },
            { label: "Cache Hit Rate", value: `${cacheHitRate}%`, color: "text-purple-400" },
            { label: "Cached Entries", value: cacheStats?.total_cached_entries ?? 0, color: "text-orange-400" },
          ].map(({ label, value, color }) => (
            <div key={label} className="bg-gray-900 rounded-xl p-5 border border-gray-800">
              <div className="text-gray-400 text-sm mb-1">{label}</div>
              <div className={`text-2xl font-bold ${color}`}>{value}</div>
            </div>
          ))}
        </div>

        {/* Cost per tenant */}
        <div className="bg-gray-900 rounded-xl p-6 border border-gray-800 mb-6">
          <h2 className="text-lg font-semibold mb-4">Cost by Tenant</h2>
          {costSummary.length === 0 ? (
            <p className="text-gray-500">No data yet</p>
          ) : (
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={costSummary}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
                <XAxis dataKey="tenant_name" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip contentStyle={{ backgroundColor: "#111827", border: "1px solid #374151" }} />
                <Line type="monotone" dataKey="total_cost_usd" stroke="#3b82f6" strokeWidth={2} dot />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Tenant table */}
        <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
          <h2 className="text-lg font-semibold mb-4">Tenant Summary</h2>
          <table className="w-full text-sm">
            <thead>
              <tr className="text-gray-400 border-b border-gray-800">
                <th className="text-left pb-3">Tenant</th>
                <th className="text-right pb-3">Requests</th>
                <th className="text-right pb-3">Cost</th>
                <th className="text-right pb-3">Avg Latency</th>
                <th className="text-right pb-3">Cache Hit Rate</th>
              </tr>
            </thead>
            <tbody>
              {costSummary.map((t) => (
                <tr key={t.tenant_id} className="border-b border-gray-800 hover:bg-gray-800">
                  <td className="py-3 text-white font-medium">{t.tenant_name}</td>
                  <td className="py-3 text-right text-gray-300">{t.total_requests}</td>
                  <td className="py-3 text-right text-green-400">${t.total_cost_usd.toFixed(6)}</td>
                  <td className="py-3 text-right text-gray-300">{t.avg_latency_ms}ms</td>
                  <td className="py-3 text-right text-purple-400">{t.cache_hit_rate}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}