const bcrypt = require("bcrypt");

const mockDb = {
  users: [],
  tables: [],
  orders: [],
  payments: [],
};

// Initialize mock data
const initMockDb = async () => {
  const hashedPassword = await bcrypt.hash("password123", 10);
  mockDb.users.push({
    _id: "mock-admin-id",
    name: "Demo Admin",
    email: "admin@restro.com",
    password: hashedPassword,
    phone: "1234567890",
    role: "Admin"
  });

  // Pre-populate tables to match the frontend constants
  for (let i = 1; i <= 15; i++) {
    mockDb.tables.push({
      _id: `mock-table-${i}`,
      tableNo: i,
      seats: i % 2 === 0 ? 6 : 4,
      status: i % 3 === 0 ? "Booked" : "Available",
      currentOrder: null
    });
  }
};

initMockDb();

module.exports = mockDb;
