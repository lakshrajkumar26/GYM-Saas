require("dotenv").config();
const { defineConfig } = require("prisma/config");

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is missing");
}

module.exports = defineConfig({
  migrate: {
    datasource: {
      name: "db",                 // 🔴 THIS WAS MISSING
      url: process.env.DATABASE_URL,
    },
  },
  dbPush: {
    datasource: {
      name: "db",                 // 🔴 THIS WAS MISSING
      url: process.env.DATABASE_URL,
    },
  },
});
