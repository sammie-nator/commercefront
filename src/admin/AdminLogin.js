import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../api/axios";
import { isAdminAuthed, saveAdminSession } from "./AdminAuth";

const AdminLogin = () => {
  const navigate = useNavigate();
  const [needsSetup, setNeedsSetup] = useState(false);
  const [checking, setChecking] = useState(true);
  const [name, setName] = useState("");
  const [pin, setPin] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (isAdminAuthed()) {
      navigate("/admin", { replace: true });
      return;
    }
    api
      .get("/admin/setup-status")
      .then((res) => setNeedsSetup(res.data.needsSetup))
      .catch(() => {})
      .finally(() => setChecking(false));
  }, [navigate]);

  const submit = async (e) => {
    e.preventDefault();
    if (!/^\d{4}$/.test(pin)) {
      toast.error("PIN must be exactly 4 digits");
      return;
    }
    setBusy(true);
    try {
      const { data } = await api.post(needsSetup ? "/admin/setup" : "/admin/login", { name, pin });
      saveAdminSession(data);
      navigate("/admin", { replace: true });
    } catch (err) {
      toast.error(err.response?.data?.message || "Login failed");
      setPin("");
    } finally {
      setBusy(false);
    }
  };

  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-ink/60 text-sm font-display font-semibold">Loading…</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <form onSubmit={submit} className="card w-full max-w-sm p-6 sm:p-8">
        <p className="eyebrow mb-1">{needsSetup ? "First-time setup" : "Staff only"}</p>
        <h1 className="font-display font-extrabold text-2xl mb-1">
          Mumi <span className="text-accent-600">Admin</span>
        </h1>
        <p className="text-sm text-ink/60 mb-5">
          {needsSetup
            ? "Create the owner account: choose your name and a 4-digit PIN."
            : "Enter your name and 4-digit PIN."}
        </p>

        <label className="block text-sm font-display font-bold mb-3">
          Name
          <input
            required
            autoFocus
            autoComplete="username"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="field"
          />
        </label>

        <label className="block text-sm font-display font-bold mb-5">
          4-digit PIN
          <input
            required
            type="password"
            inputMode="numeric"
            autoComplete="current-password"
            maxLength={4}
            value={pin}
            onChange={(e) => setPin(e.target.value.replace(/\D/g, ""))}
            className="field tracking-[0.5em] text-center"
          />
        </label>

        <button type="submit" disabled={busy} className="btn-primary w-full">
          {busy ? "Please wait…" : needsSetup ? "Create owner account" : "Log in"}
        </button>

        <Link to="/" className="block text-center text-xs text-ink/50 hover:underline mt-4">
          ← Back to store
        </Link>
      </form>
    </div>
  );
};

export default AdminLogin;
