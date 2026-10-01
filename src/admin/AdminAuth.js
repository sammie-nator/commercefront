import api from "../api/axios";

// The server is the real gatekeeper (it checks the session token on every
// request). These helpers only decide what the UI shows.

export const saveAdminSession = ({ token, expiresAt, admin }) => {
  localStorage.setItem("adminToken", token);
  localStorage.setItem("adminName", admin.name);
  localStorage.setItem("adminRole", admin.role);
  localStorage.setItem("adminExpires", String(new Date(expiresAt).getTime()));
};

export const clearAdminSession = () => {
  ["adminToken", "adminName", "adminRole", "adminExpires"].forEach((k) => localStorage.removeItem(k));
};

export const isAdminAuthed = () => {
  const token = localStorage.getItem("adminToken");
  const expires = Number(localStorage.getItem("adminExpires") || 0);
  return !!token && expires > Date.now();
};

export const getAdminRole = () => localStorage.getItem("adminRole") || "staff";
export const getAdminName = () => localStorage.getItem("adminName") || "admin";
export const isOwner = () => getAdminRole() === "owner";

export const adminLogout = async () => {
  try {
    await api.post("/admin/logout");
  } catch {
    // ignore — we clear locally either way
  }
  clearAdminSession();
  window.location.href = "/admin/login";
};
