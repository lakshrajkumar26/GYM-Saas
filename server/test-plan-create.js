const axios = require("axios");
require("dotenv").config();

const API_URL = "http://localhost:5000/api";

async function testPlanCreate() {
  try {
    console.log("🔐 Logging in as admin...\n");
    
    // Login
    const loginRes = await axios.post(`${API_URL}/auth/login`, {
      email: "admin@gym.com",
      password: "admin123"
    });
    
    const { token, user } = loginRes.data;
    console.log("✅ Login successful!");
    console.log(`User: ${user.name}`);
    console.log(`Role: ${user.role}\n`);
    
    // Test creating a plan
    console.log("📝 Creating a test plan...\n");
    
    const planRes = await axios.post(
      `${API_URL}/plans`,
      {
        name: "Test Plan",
        price: 999,
        duration: 30
      },
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );
    
    console.log("✅ Plan created successfully!");
    console.log(JSON.stringify(planRes.data, null, 2));
    console.log();
    
  } catch (error) {
    console.error("❌ Error:", error.response?.data || error.message);
    console.log();
  }
}

testPlanCreate();
