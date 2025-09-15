import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function Login() {
  const { login } = useAuth();
  const nav = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [err, setErr] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    setErr("");
    try {
      await login(form.email, form.password);
      nav("/clients");
    } catch (e) {
      setErr(e?.response?.data?.error || "Login failed");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 bg-white rounded-xl shadow p-6">
      <h1 className="text-xl font-semibold text-green-900 mb-4">Sign in</h1>
      {err && <div className="mb-3 text-red-600 text-sm">{err}</div>}
      <form className="space-y-3" onSubmit={submit}>
        <input
          className="w-full border rounded px-3 py-2"
          placeholder="Email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />
        <input
          className="w-full border rounded px-3 py-2"
          placeholder="Password"
          type="password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />
        <button className="w-full bg-green-700 text-white rounded py-2">
          Login
        </button>
      </form>
      <p className="text-xs text-gray-500 mt-3">
        Tip: admin@mill.local / admin123
      </p>
    </div>
  );
}
