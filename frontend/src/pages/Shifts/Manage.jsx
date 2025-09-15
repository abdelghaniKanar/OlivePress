import { useEffect, useState } from "react";
import api from "../../services/api";

export default function ShiftsManage() {
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [workers, setWorkers] = useState([]);
  const [list, setList] = useState([]);

  const loadWorkers = async () => {
    // reuse users list from backend? If not present, you can filter by role=WORKER via GET /users (not implemented in MVP routes)
    // For now, load shifts list to see who is present
    const { data } = await api.get("/worker-shifts", { params: { date } });
    setList(data);
  };

  useEffect(() => {
    loadWorkers();
  }, [date]);

  const mark = async (workerId, present) => {
    await api.post("/worker-shifts", { workerId, date, present });
    await loadWorkers();
  };

  return (
    <div className="bg-white rounded-xl shadow p-4">
      <h2 className="font-semibold text-green-900">Worker Shifts</h2>
      <div className="mt-3 flex gap-2">
        <input
          type="date"
          className="border rounded px-3 py-2"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
      </div>
      <div className="mt-4 grid gap-2">
        {list.map((s) => (
          <div
            key={s._id}
            className="flex items-center justify-between border rounded p-2"
          >
            <div>
              <div className="font-medium">{s.workerId?.name}</div>
              <div className="text-xs text-gray-500">{s.workerId?.email}</div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => mark(s.workerId?._id, true)}
                className={`px-3 py-1 rounded ${s.present ? "bg-green-700 text-white" : "border"}`}
              >
                Present
              </button>
              <button
                onClick={() => mark(s.workerId?._id, false)}
                className={`px-3 py-1 rounded ${!s.present ? "bg-amber-600 text-white" : "border"}`}
              >
                Absent
              </button>
            </div>
          </div>
        ))}
        {list.length === 0 && (
          <div className="text-sm">No records for this date.</div>
        )}
      </div>
      <p className="text-xs text-gray-500 mt-3">
        Note: For full worker list management UI, we’d add a Users page (admin).
      </p>
    </div>
  );
}
