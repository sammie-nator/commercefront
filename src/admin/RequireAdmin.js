import { Navigate } from "react-router-dom";
import { isAdminAuthed, getAdminRole, clearAdminSession } from "./AdminAuth";

// <RequireAdmin>                       -> any logged-in admin (owner or staff)
// <RequireAdmin roles={["owner"]}>     -> owner only; staff are sent to `redirectTo`
const RequireAdmin = ({ children, roles, redirectTo = "/admin/orders" }) => {
  if (!isAdminAuthed()) {
    clearAdminSession();
    return <Navigate to="/admin/login" replace />;
  }
  if (roles && !roles.includes(getAdminRole())) {
    return <Navigate to={redirectTo} replace />;
  }
  return children;
};

export default RequireAdmin;
