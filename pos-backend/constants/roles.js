// Canonical role source of truth for the entire backend.
// Machine values are snake_case, no spaces. Never compare against ad-hoc string literals.
const ROLES = {
    SUPER_ADMIN: "super_admin",
    ADMIN: "admin",
    CASHIER: "cashier",
};

const ROLE_VALUES = Object.values(ROLES);

module.exports = { ROLES, ROLE_VALUES };
