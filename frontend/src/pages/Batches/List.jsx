import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api";

export default function BatchesList() {
  const [status, setStatus] = useState("ALL");
  const [cin, setCin] = useState("");
  const [items, setItems] = useState([]);
  const [creating, setCreating] = useState(false);
  const [createMsg, setCreateMsg] = useState("");
  const [form, setForm] = useState({
    clientCIN: "",
    weightKg: "",
    feePerKg: "",
    variety: "",
    notes: "",
  });

  const load = async () => {
    const { data } = await api.get("/batches", { params: { status, cin } });
    setItems(data);
  };
  useEffect(() => {
    load();
  }, []);

  return (
    <div className="space-y-6">
      {/* Quick create */}
      <div className="bg-white rounded-xl shadow p-4">
        <h2 className="font-semibold text-green-900">Create Batch</h2>
        {createMsg && <div className="text-sm mt-2">{createMsg}</div>}
        <form
          className="mt-3 grid md:grid-cols-5 gap-3"
          onSubmit={async (e) => {
            e.preventDefault();
            setCreating(true);
            setCreateMsg("");
            try {
              await api.post("/batches", {
                clientCIN: form.clientCIN.trim(),
                weightKg: Number(form.weightKg),
                feePerKg: form.feePerKg ? Number(form.feePerKg) : undefined,
                variety: form.variety || undefined,
                notes: form.notes || undefined,
              });
              setForm({
                clientCIN: "",
                weightKg: "",
                feePerKg: "",
                variety: "",
                notes: "",
              });
              setCreateMsg("Batch created");
              await load();
            } catch (e) {
              setCreateMsg(e?.response?.data?.error || "Error");
            } finally {
              setCreating(false);
            }
          }}
        >
          <input
            className="border rounded px-3 py-2"
            placeholder="Client CIN"
            value={form.clientCIN}
            onChange={(e) => setForm({ ...form, clientCIN: e.target.value })}
          />
          <input
            className="border rounded px-3 py-2"
            placeholder="Weight (kg)"
            value={form.weightKg}
            onChange={(e) => setForm({ ...form, weightKg: e.target.value })}
          />
          <input
            className="border rounded px-3 py-2"
            placeholder="Fee/kg (opt)"
            value={form.feePerKg}
            onChange={(e) => setForm({ ...form, feePerKg: e.target.value })}
          />
          <input
            className="border rounded px-3 py-2"
            placeholder="Variety"
            value={form.variety}
            onChange={(e) => setForm({ ...form, variety: e.target.value })}
          />
          <input
            className="border rounded px-3 py-2"
            placeholder="Notes"
            value={form.notes}
            onChange={(e) => setForm({ ...form, notes: e.target.value })}
          />
          <button
            disabled={creating}
            className={`md:col-span-5 rounded px-4 py-2 ${creating ? "bg-green-300" : "bg-green-700 text-white"}`}
          >
            {creating ? "Creating…" : "Create"}
          </button>
        </form>
      </div>

      <div className="bg-white rounded-xl shadow p-4">
        <h2 className="font-semibold text-green-900">Batches</h2>
        <div className="mt-3 flex flex-wrap gap-2">
          <select
            className="border rounded px-3 py-2"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            {[
              "ALL",
              "RECEIVED",
              "ON_HOLD",
              "PROCESSING",
              "COMPLETED",
              "DELIVERED",
            ].map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
          <input
            className="border rounded px-3 py-2"
            placeholder="Filter by CIN"
            value={cin}
            onChange={(e) => setCin(e.target.value)}
          />
          <button
            className="bg-green-700 text-white rounded px-4"
            onClick={load}
          >
            Refresh
          </button>
        </div>
        <div className="mt-3 overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-green-50">
              <tr>
                <th className="p-2 text-left">Client</th>
                <th className="p-2 text-left">Weight</th>
                <th className="p-2 text-left">Status</th>
                <th className="p-2 text-left">Oil</th>
                <th className="p-2 text-left">Total Fee</th>
                <th className="p-2 text-left">Payment</th>
                <th className="p-2 text-left">Action</th>
              </tr>
            </thead>
            <tbody>
              {items.map((b) => (
                <tr key={b._id} className="border-t">
                  <td className="p-2">
                    {b.clientId?.name} ({b.clientId?.cin})
                  </td>
                  <td className="p-2">{b.weightKg}</td>
                  <td className="p-2">{b.status}</td>
                  <td className="p-2">{b.oilQuantityL}</td>
                  <td className="p-2">{b.totalFee}</td>
                  <td className="p-2">{b.paymentStatus}</td>
                  <td className="p-2 flex gap-2">
                    <Link
                      className="text-green-700 underline"
                      to={`/batches/${b._id}`}
                    >
                      Open
                    </Link>
                    <button
                      onClick={async () => {
                        if (!confirm("Delete this batch?")) return;
                        await api.delete(`/batches/${b._id}`);
                        await load();
                      }}
                      className="text-red-700 underline"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              {items.length === 0 && (
                <tr>
                  <td className="p-2" colSpan="7">
                    No batches.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
