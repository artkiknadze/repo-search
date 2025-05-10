/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import "./App.css";

function App() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSearch = async () => {
    if (!query.trim()) return;

    setLoading(true);
    setError(null);
    setResults([]);

    try {
      const response = await fetch(
        `https://api.github.com/search/repositories?q=${encodeURIComponent(
          query
        )}&sort=stars&order=desc`
      );

      if (!response.ok) {
        throw new Error(`Search failed: ${response.statusText}`);
      }

      const data = await response.json();
      setResults(data.items);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4 text-center">
        GitHub Repo Search
      </h1>
      <div className="flex gap-2 mb-4">
        <input
          type="text"
          placeholder="Search repositories..."
          className="flex-1 border rounded-lg p-2"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button className="border rounded-lg p-2 bg-black text-white" onClick={handleSearch} disabled={loading}>
          {loading ? "Searching..." : "Search"}
        </button>
      </div>

      {error && <p className="text-red-500">Error: {error}</p>}

      <div className="grid gap-4">
        {results.map((repo: any) => (
          <div
            key={repo.id}
            className="border rounded-lg p-4 bg-white"
          >
            <a
              href={repo.html_url}
              target="_blank"
              className="text-xl font-semibold text-blue-600 hover:underline"
            >
              {repo.full_name}
            </a>
            <p className="text-sm text-gray-600">{repo.description}</p>
            <p className="text-sm mt-2">
              ⭐️ {repo.stargazers_count} | 🍴 {repo.forks_count}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
