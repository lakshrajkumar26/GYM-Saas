const jwt = require("jsonwebtoken");
require("dotenv").config();

// Get token from command line argument
const token = process.argv[2];

if (!token) {
  console.log("Usage: node test-token.js <your-jwt-token>");
  console.log("\nGet your token from:");
  console.log("1. Browser DevTools > Application > Local Storage");
  console.log("2. Or from login response\n");
  process.exit(1);
}

try {
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  console.log("✅ Token is valid!\n");
  console.log("📋 Decoded Token:");
  console.log(JSON.stringify(decoded, null, 2));
  console.log();
} catch (error) {
  console.log("❌ Token is invalid!");
  console.log("Error:", error.message);
  console.log();
}
