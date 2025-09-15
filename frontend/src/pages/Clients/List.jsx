import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api";

export default function ClientsList() {
  const [q, setQ] = useState("");
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({
    cin: "",
    name: "",
    phone: "",
    address: "",
  });
  const [message, setMessage] = useState("");

  const load = async () => {
    const { data } = await api.get("/clients", { params: { q } });
    setItems(data);
  };
  useEffect(() => {
    load();
  }, []);

  const search = async (e) => {
    e.preventDefault();
    await load();
  };

  const create = async (e) => {
    e.preventDefault();
    try {
      await api.post("/clients", form);
      setForm({ cin: "", name: "", phone: "", address: "" });
      setMessage("Client created");
      await load();
    } catch (e) {
      setMessage(e?.response?.data?.error || "Error");
    }
  };

  return (
    <div className="grid md:grid-cols-2 gap-6">
      <div className="bg-white rounded-xl shadow p-4">
        <h2 className="font-semibold text-green-900">Clients</h2>
        <form className="mt-3 flex gap-2" onSubmit={search}>
          <input
            className="border rounded px-3 py-2 flex-1"
            placeholder="Search by CIN or Name"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
          <button className="bg-green-700 text-white rounded px-4">
            Search
          </button>
        </form>
        <div className="mt-3 divide-y">
          {items.map((c) => (
            <Link
              key={c._id}
              to={`/clients/${c._id}`}
              className="block p-2 hover:bg-green-50"
            >
              <div className="font-medium">{c.name}</div>
              <div className="text-xs text-gray-500">
                {c.cin} · {c.phone}
              </div>
            </Link>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-xl shadow p-4">
        <h2 className="font-semibold text-green-900">Add Client</h2>
        {message && <div className="text-sm mt-2">{message}</div>}
        <form className="mt-3 space-y-3" onSubmit={create}>
          <input
            className="w-full border rounded px-3 py-2"
            placeholder="CIN"
            value={form.cin}
            onChange={(e) => setForm({ ...form, cin: e.target.value })}
          />
          <input
            className="w-full border rounded px-3 py-2"
            placeholder="Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
          <input
            className="w-full border rounded px-3 py-2"
            placeholder="Phone"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
          />
          <input
            className="w-full border rounded px-3 py-2"
            placeholder="Address"
            value={form.address}
            onChange={(e) => setForm({ ...form, address: e.target.value })}
          />
          <button className="bg-green-700 text-white rounded px-4 py-2">
            Save
          </button>
        </form>
      </div>
    </div>
  );
}
