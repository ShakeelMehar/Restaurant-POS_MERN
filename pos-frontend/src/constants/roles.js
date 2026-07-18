// Canonical role source of truth for the frontend. Machine values must match the backend
// (pos-backend/constants/roles.js). Use ROLE_LABELS for anything shown to the user.
export const ROLES = {
  SUPER_ADMIN: "super_admin",
  ADMIN: "admin",
  CASHIER: "cashier",
};

export const ROLE_LABELS = {
  super_admin: "Super Admin",
  admin: "Admin",
  cashier: "Cashier",
};
