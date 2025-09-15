import { useEffect, useState } from "react";
import api from "../../services/api";

export default function DashboardAdmin() {
  const [kpi, setKpi] = useState(null);
  const load = async () => {
    const { data } = await api.get("/metrics/today");
    setKpi(data);
  };
  useEffect(() => {
    load();
  }, []);
  if (!kpi) return <div>Loading…</div>;

  const Card = ({ title, value, hint }) => (
    <div className="p-4 rounded-xl border bg-white shadow">
      <div className="text-sm text-gray-500">{title}</div>
      <div className="text-2xl font-semibold text-green-900">{value}</div>
      {hint && <div className="text-xs text-gray-400">{hint}</div>}
    </div>
  );

  return (
    <div className="grid md:grid-cols-4 gap-4">
      <Card title="Total Clients" value={kpi.totalClients} />
      <Card title="Receptions Today" value={kpi.receptionsToday} />
      <Card title="Kg Received Today" value={kpi.kgReceivedToday} />
      <Card title="Liters Produced Today" value={kpi.litersProducedToday} />
    </div>
  );
}
