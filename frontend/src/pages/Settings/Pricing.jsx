import { useEffect, useState } from "react";
import api from "../../services/api";

export default function Pricing() {
  const [fee, setFee] = useState("");
  const [currency, setCurrency] = useState("MAD");
  const [msg, setMsg] = useState("");

  const load = async () => {
    const { data } = await api.get("/settings/pricing");
    if (data) {
      setFee(data.defaultFeePerKg);
      setCurrency(data.currency || "MAD");
    }
  };
  useEffect(() => {
    load();
  }, []);

  const save = async (e) => {
    e.preventDefault();
    await api.put("/settings/pricing", {
      defaultFeePerKg: Number(fee),
      currency,
    });
    setMsg("Saved");
  };

  return (
    <div className="bg-white rounded-xl shadow p-4 max-w-md">
      <h2 className="font-semibold text-green-900">Pricing (Admin)</h2>
      {msg && <div className="text-sm text-green-700 mt-2">{msg}</div>}
      <form className="mt-3 space-y-3" onSubmit={save}>
        <input
          className="w-full border rounded px-3 py-2"
          placeholder="Default fee per kg"
          value={fee}
          onChange={(e) => setFee(e.target.value)}
        />
        <input
          className="w-full border rounded px-3 py-2"
          placeholder="Currency"
          value={currency}
          onChange={(e) => setCurrency(e.target.value)}
        />
        <button className="bg-green-700 text-white rounded px-4 py-2">
          Save
        </button>
      </form>
    </div>
  );
}
