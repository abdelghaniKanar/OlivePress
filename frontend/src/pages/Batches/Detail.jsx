import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../../services/api";

const statusOptions = [
  "RECEIVED",
  "ON_HOLD",
  "PROCESSING",
  "COMPLETED",
  "DELIVERED",
];
const paymentOptions = ["UNPAID", "PARTIAL", "PAID"];

export default function BatchDetail() {
  const { id } = useParams();
  const [b, setB] = useState(null);
  const [oil, setOil] = useState("");
  const [status, setStatus] = useState("");
  const [payment, setPayment] = useState("");
  const [savingProd, setSavingProd] = useState(false);
  const [savingStatus, setSavingStatus] = useState(false);
  const [savingPayment, setSavingPayment] = useState(false);
  const bounceBack = (setter) => setTimeout(() => setter(false), 800);

  const load = async () => {
    const { data } = await api.get(`/batches/${id}`);
    setB(data);
    setStatus(data.status);
    setPayment(data.paymentStatus);
    setOil(data.oilQuantityL || "");
  };
  useEffect(() => {
    load();
  }, [id]);

  const saveProduction = async () => {
    setSavingProd(true);
    await api.patch(`/batches/${id}/production`, { oilQuantityL: Number(oil) });
    await load();
    bounceBack(setSavingProd);
  };
  const saveStatus = async () => {
    setSavingStatus(true);
    await api.patch(`/batches/${id}/status`, { status });
    await load();
    bounceBack(setSavingStatus);
  };
  const savePayment = async () => {
    setSavingPayment(true);
    await api.patch(`/batches/${id}/payment`, { paymentStatus: payment });
    await load();
    bounceBack(setSavingPayment);
  };

  if (!b) return <div>Loading…</div>;

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow p-4">
        <h2 className="font-semibold text-green-900">Batch Detail</h2>
        <div className="text-sm text-gray-600">
          Client: {b.clientId?.name} ({b.clientId?.cin})
        </div>
        <div className="mt-2 grid md:grid-cols-3 gap-4">
          <div className="p-3 rounded border">
            <div className="text-xs text-gray-500">Weight (kg)</div>
            <div className="font-medium">{b.weightKg}</div>
          </div>
          <div className="p-3 rounded border">
            <div className="text-xs text-gray-500">Oil (L)</div>
            <div className="font-medium">{b.oilQuantityL}</div>
          </div>
          <div className="p-3 rounded border">
            <div className="text-xs text-gray-500">Total Fee</div>
            <div className="font-medium">{b.totalFee}</div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow p-4">
        <button
          onClick={async () => {
            if (!confirm("Delete this batch?")) return;
            await api.delete(`/batches/${id}`);
            window.history.back();
          }}
          className="px-3 py-2 rounded bg-red-600 text-white text-sm"
        >
          Delete Batch
        </button>
      </div>

      <div className="bg-white rounded-xl shadow p-4 grid md:grid-cols-3 gap-4">
        <div>
          <div className="font-medium mb-2">Production</div>
          <div className="flex gap-2">
            <input
              className="border rounded px-3 py-2"
              placeholder="Oil (L)"
              value={oil}
              onChange={(e) => setOil(e.target.value)}
            />
            <button
              onClick={saveProduction}
              className={`rounded px-3 ${savingProd ? "bg-emerald-400 text-white" : "bg-green-700 text-white"}`}
            >
              {savingProd ? "Saved" : "Save"}
            </button>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            Must be > 0 before setting COMPLETED.
          </p>
        </div>

        <div>
          <div className="font-medium mb-2">Status</div>
          <div className="flex gap-2">
            <select
              className="border rounded px-3 py-2"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              {statusOptions.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
            <button
              onClick={saveStatus}
              className={`rounded px-3 ${savingStatus ? "bg-emerald-400 text-white" : "bg-green-700 text-white"}`}
            >
              {savingStatus ? "Updated" : "Update"}
            </button>
          </div>
        </div>

        <div>
          <div className="font-medium mb-2">Payment</div>
          <div className="flex gap-2">
            <select
              className="border rounded px-3 py-2"
              value={payment}
              onChange={(e) => setPayment(e.target.value)}
            >
              {paymentOptions.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
            <button
              onClick={savePayment}
              className={`rounded px-3 ${savingPayment ? "bg-emerald-400 text-white" : "bg-green-700 text-white"}`}
            >
              {savingPayment ? "Updated" : "Update"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
