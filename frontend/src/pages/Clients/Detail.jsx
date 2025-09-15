import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../../services/api";

export default function ClientDetail() {
  const { id } = useParams();
  const [client, setClient] = useState(null);
  const [batches, setBatches] = useState([]);
  const [batchForm, setBatchForm] = useState({
    weightKg: "",
    feePerKg: "",
    variety: "",
    notes: "",
  });

  const load = async () => {
    const { data: client } = await api.get(`/clients/${id}`);
    setClient(client);
    const { data: list } = await api.get("/batches", {
      params: { cin: client.cin, status: "ALL" },
    });
    setBatches(list);
  };
  useEffect(() => {
    load();
  }, [id]);

  const addBatch = async (e) => {
    e.preventDefault();
    await api.post("/batches", {
      clientId: id,
      weightKg: Number(batchForm.weightKg),
      feePerKg: batchForm.feePerKg ? Number(batchForm.feePerKg) : undefined,
      variety: batchForm.variety,
      notes: batchForm.notes,
    });
    setBatchForm({ weightKg: "", feePerKg: "", variety: "", notes: "" });
    await load();
  };

  if (!client) return <div>Loading…</div>;

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow p-4">
        <h2 className="font-semibold text-green-900">{client.name}</h2>
        <div className="text-sm text-gray-600">
          {client.cin} · {client.phone} · {client.address}
        </div>
      </div>

      <div className="bg-white rounded-xl shadow p-4">
        <h3 className="font-medium mb-3">Add Batch</h3>
        <form className="grid md:grid-cols-4 gap-3" onSubmit={addBatch}>
          <input
            className="border rounded px-3 py-2"
            placeholder="Weight (kg)"
            value={batchForm.weightKg}
            onChange={(e) =>
              setBatchForm({ ...batchForm, weightKg: e.target.value })
            }
          />
          <input
            className="border rounded px-3 py-2"
            placeholder="Fee / kg (optional)"
            value={batchForm.feePerKg}
            onChange={(e) =>
              setBatchForm({ ...batchForm, feePerKg: e.target.value })
            }
          />
          <input
            className="border rounded px-3 py-2"
            placeholder="Variety (optional)"
            value={batchForm.variety}
            onChange={(e) =>
              setBatchForm({ ...batchForm, variety: e.target.value })
            }
          />
          <input
            className="border rounded px-3 py-2"
            placeholder="Notes (optional)"
            value={batchForm.notes}
            onChange={(e) =>
              setBatchForm({ ...batchForm, notes: e.target.value })
            }
          />
          <button className="bg-green-700 text-white rounded px-4 py-2 md:col-span-4">
            Create Batch
          </button>
        </form>
      </div>

      <div className="bg-white rounded-xl shadow p-4">
        <h3 className="font-medium mb-3">Batches</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-green-50">
              <tr>
                <th className="p-2 text-left">Received</th>
                <th className="p-2 text-left">Weight</th>
                <th className="p-2 text-left">Status</th>
                <th className="p-2 text-left">Oil (L)</th>
                <th className="p-2 text-left">Total Fee</th>
              </tr>
            </thead>
            <tbody>
              {batches.map((b) => (
                <tr key={b._id} className="border-t">
                  <td className="p-2">
                    {new Date(b.receivedAt).toLocaleString()}
                  </td>
                  <td className="p-2">{b.weightKg}</td>
                  <td className="p-2">{b.status}</td>
                  <td className="p-2">{b.oilQuantityL}</td>
                  <td className="p-2">{b.totalFee}</td>
                </tr>
              ))}
              {batches.length === 0 && (
                <tr>
                  <td className="p-2" colSpan="5">
                    No batches
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
