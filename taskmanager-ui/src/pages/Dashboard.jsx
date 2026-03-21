import { useState } from "react";
import API from "../services/api";
import ReactMarkdown from "react-markdown";
import { Link } from "react-router-dom";

function Dashboard() {
  const [task, setTask] = useState("");
  const [aiResult, setAiResult] = useState("");

  const generateAI = async () => {
    if (!task) {
      alert("Enter a task first");
      return;
    }

    try {
      const res = await API.post("/ai/generate", task || "test task", {
        headers: { "Content-Type": "text/plain" }
      });

      setAiResult(String(res.date));
    } catch (err) {
      console.error(err);
      alert("AI failed");
    }
    
  };

  return (
    <div className="flex h-screen bg-gray-100">

      {/* Sidebar */}
      <div className="w-64 bg-gray-900 text-white p-6">
        <h2 className="text-2xl font-bold mb-8">⚡ TaskManager</h2>

        <div className="space-y-3 text-gray-200 font-medium">

          <Link to="/dashboard"
            className="block p-2 rounded hover:bg-gray-700 hover:text-white">
            Dashboard
          </Link>

          <Link to="/projects"
            className="block p-2 rounded hover:bg-gray-700 hover:text-white">
            Projects
          </Link>

          <Link to="/settings"
            className="block p-2 rounded hover:bg-gray-700 hover:text-white">
            Settings
          </Link>

        </div>
      </div>

      {/* Main */}
      <div className="flex-1 flex flex-col">

        {/* Topbar */}
        <div className="bg-white p-4 shadow flex justify-between">
          <h1 className="text-xl font-semibold text-gray-800">Dashboard</h1>
          <p className="text-gray-500">Welcome 👋</p>
        </div>

        {/* Content */}
        <div className="p-6">

          {/* AI Card */}
          <div className="bg-white p-6 rounded-2xl shadow-md mb-6">
            <h2 className="text-lg font-semibold mb-3">✨ AI Task Generator</h2>

            <input
              className="w-full border p-3 rounded mb-4 focus:outline-none focus:ring-2 focus:ring-purple-400"
              placeholder="Enter task..."
              onChange={(e)=>setTask(e.target.value)}
            />

            <button
              onClick={generateAI}
              className="bg-purple-500 hover:bg-purple-600 text-white px-5 py-2 rounded-lg">
              Generate
            </button>
          </div>

          {/* AI Result */}
          {aiResult && (
            <div className="bg-white p-6 rounded-2xl shadow-md break-words overflow-auto">
              <h2 className="text-lg font-semibold mb-3">Generated Task</h2>

              {!aiResult && (
                <p className="text-gray-400">No AI result yet...</p>
              )}

              {aiResult && typeof aiResult === "string" && (
                <div className="prose max-w-none">
                <ReactMarkdown>
                  {aiResult}
                </ReactMarkdown>
                </div>
              )}
            </div>
          )}

        </div>
      </div>
    </div>
  );
}

export default Dashboard;