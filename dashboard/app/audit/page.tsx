"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function Audit() {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/admin?endpoint=audit?limit=50`)
      .then(r => r.json())
      .then(data => { setLogs(data); setLoading(false); });
  }, []);

  return (
    <div className="min-h-screen bg-gray-950 text-white p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <Link href="/" className="text-gray-400 text-sm hover:text-white">← Back</Link>
          <h1 className="text-3xl font-bold mt-2">Audit Log</h1>
          <p className="text-gray-400 mt-1">Last 50 requests</p>
        </div>

        {loading ? (
          <p className="text-gray-400">Loading...</p>
        ) : (
          <div className="bg-gray-900 rounded-xl border border-gray-800">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-gray-400 border-b border-gray-800">
                  <th className="text-left p-4">Time</th>
                  <th className="text-left p-4">Model</th>
                  <th className="text-right p-4">Input</th>
                  <th className="text-right p-4">Output</th>
                  <th className="text-right p-4">Cost</th>
                  <th className="text-right p-4">Latency</th>
                  <th className="text-right p-4">Cached</th>
                </tr>
              </thead>
              <tbody>
                {logs.map((log) => (
                  <tr key={log.id} className="border-b border-gray-800 hover:bg-gray-800">
                    <td className="p-4 text-gray-400 text-xs">
                      {new Date(log.created_at).toLocaleTimeString()}
                    </td>
                    <td className="p-4">
                      <span className="px-2 py-1 bg-gray-800 rounded text-xs font-mono text-blue-300">
                        {log.model}
                      </span>
                    </td>
                    <td className="p-4 text-right text-gray-300">{log.input_tokens}</td>
                    <td className="p-4 text-right text-gray-300">{log.output_tokens}</td>
                    <td className="p-4 text-right text-green-400 font-mono">
                      ${log.cost_usd.toFixed(6)}
                    </td>
                    <td className="p-4 text-right text-gray-300">{log.latency_ms}ms</td>
                    <td className="p-4 text-right">
                      {log.cached ? (
                        <span className="px-2 py-1 bg-purple-900 text-purple-300 rounded text-xs">HIT</span>
                      ) : (
                        <span className="px-2 py-1 bg-gray-700 text-gray-400 rounded text-xs">MISS</span>
                      )}
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