import { useState } from "react";
import api from "../../services/api";

export default function PublicLookup() {
  const [cin, setCin] = useState("");
  const [status, setStatus] = useState("ALL");
  const [data, setData] = useState(null);
  const [err, setErr] = useState("");

  const search = async (e) => {
    e?.preventDefault();
    setErr("");
    try {
      const { data } = await api.get("/public/client-batches", {
        params: { cin, status },
      });
      setData(data);
    } catch (e) {
      setErr(e?.response?.data?.error || "Error");
    }
  };

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-xl shadow p-4">
        <h2 className="font-semibold text-green-900">Track my batches (CIN)</h2>
        <form className="mt-3 flex gap-2" onSubmit={search}>
          <input
            className="border rounded px-3 py-2 flex-1"
            placeholder="Enter your CIN"
            value={cin}
            onChange={(e) => setCin(e.target.value)}
          />
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
          <button className="bg-green-700 text-white rounded px-4">View</button>
        </form>
        {err && <div className="text-red-600 text-sm mt-2">{err}</div>}
      </div>

      {data && (
        <div className="bg-white rounded-xl shadow p-4">
          <h3 className="font-medium mb-2">
            Client:{" "}
            {data.client
              ? `${data.client.name} (${data.client.cin})`
              : "Not found"}
          </h3>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-green-50">
                <tr>
                  <th className="text-left p-2">Received</th>
                  <th className="text-left p-2">Weight (kg)</th>
                  <th className="text-left p-2">Status</th>
                  <th className="text-left p-2">Oil (L)</th>
                  <th className="text-left p-2">Total Fee</th>
                  <th className="text-left p-2">Payment</th>
                </tr>
              </thead>
              <tbody>
                {(data.batches || []).map((b) => (
                  <tr key={b._id} className="border-t">
                    <td className="p-2">
                      {new Date(b.receivedAt).toLocaleString()}
                    </td>
                    <td className="p-2">{b.weightKg}</td>
                    <td className="p-2">{b.status}</td>
                    <td className="p-2">{b.oilQuantityL}</td>
                    <td className="p-2">{b.totalFee}</td>
                    <td className="p-2">{b.paymentStatus}</td>
                  </tr>
                ))}
                {(!data.batches || data.batches.length === 0) && (
                  <tr>
                    <td className="p-2" colSpan="6">
                      No batches.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
