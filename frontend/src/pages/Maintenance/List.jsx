import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import api from "../../services/api";

export default function Maintenance() {
  const { user } = useAuth();
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({
    type: "CLEANING",
    title: "",
    machine: "",
    scheduledAt: "",
  });

  const load = async () => {
    const { data } = await api.get(
      "/maintenance",
      user.role === "ADMIN" ? {} : { params: { assignee: user.id } }
    );
    setItems(data);
  };
  useEffect(() => {
    load();
  }, []);

  const create = async (e) => {
    e.preventDefault();
    await api.post("/maintenance", form);
    setForm({ type: "CLEANING", title: "", machine: "", scheduledAt: "" });
    await load();
  };

  const start = (id) => api.patch(`/maintenance/${id}/start`).then(load);
  const done = (id) =>
    api.patch(`/maintenance/${id}/done`, { notes: "OK" }).then(load);

  return (
    <div className="grid md:grid-cols-2 gap-6">
      {user.role === "ADMIN" && (
        <div className="bg-white rounded-xl shadow p-4">
          <h2 className="font-semibold text-green-900">Plan Task</h2>
          <form className="mt-3 grid gap-3" onSubmit={create}>
            <select
              className="border rounded px-3 py-2"
              value={form.type}
              onChange={(e) => setForm({ ...form, type: e.target.value })}
            >
              <option>MAINTENANCE</option>
              <option>CLEANING</option>
            </select>
            <input
              className="border rounded px-3 py-2"
              placeholder="Title"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
            />
            <input
              className="border rounded px-3 py-2"
              placeholder="Machine (optional)"
              value={form.machine}
              onChange={(e) => setForm({ ...form, machine: e.target.value })}
            />
            <input
              className="border rounded px-3 py-2"
              type="datetime-local"
              value={form.scheduledAt}
              onChange={(e) =>
                setForm({ ...form, scheduledAt: e.target.value })
              }
            />
            <button className="bg-green-700 text-white rounded px-4 py-2">
              Create
            </button>
          </form>
        </div>
      )}

      <div className="bg-white rounded-xl shadow p-4">
        <h2 className="font-semibold text-green-900">Tasks</h2>
        <div className="mt-3 space-y-2">
          {items.map((t) => (
            <div key={t._id} className="border rounded p-3">
              <div className="font-medium">
                {t.title}{" "}
                <span className="text-xs px-2 py-0.5 rounded bg-green-100 ml-2">
                  {t.type}
                </span>
              </div>
              <div className="text-xs text-gray-500">
                When: {new Date(t.scheduledAt).toLocaleString()} · Status:{" "}
                {t.status}
              </div>
              <div className="mt-2 flex gap-2">
                {(user.role === "ADMIN" || user.role === "WORKER") &&
                  t.status === "PLANNED" && (
                    <button
                      onClick={() => start(t._id)}
                      className="px-3 py-1 rounded bg-amber-600 text-white"
                    >
                      Start
                    </button>
                  )}
                {(user.role === "ADMIN" || user.role === "WORKER") &&
                  t.status === "IN_PROGRESS" && (
                    <button
                      onClick={() => done(t._id)}
                      className="px-3 py-1 rounded bg-green-700 text-white"
                    >
                      Done
                    </button>
                  )}
              </div>
            </div>
          ))}
          {items.length === 0 && <div className="text-sm">No tasks.</div>}
        </div>
      </div>
    </div>
  );
}
