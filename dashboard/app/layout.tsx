import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "LLM Gateway Dashboard",
  description: "Production observability for LLM Gateway",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-gray-950">
        <nav className="bg-gray-900 border-b border-gray-800 px-8 py-4">
          <div className="max-w-6xl mx-auto flex items-center gap-8">
            <span className="font-bold text-white text-lg">⚡ LLM Gateway</span>
            <a href="/" className="text-gray-400 hover:text-white text-sm transition-colors">Overview</a>
            <a href="/tenants" className="text-gray-400 hover:text-white text-sm transition-colors">Tenants</a>
            <a href="/audit" className="text-gray-400 hover:text-white text-sm transition-colors">Audit Log</a>
          </div>
        </nav>
        {children}
      </body>
    </html>
  );
}