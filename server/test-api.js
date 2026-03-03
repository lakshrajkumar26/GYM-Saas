const axios = require('axios');

async function testAPI() {
  try {
    console.log('Testing API endpoints...');
    
    // Test server health
    const response = await axios.get('http://localhost:5000/api/auth/login', {
      validateStatus: () => true // Accept any status code
    });
    
    console.log('✅ Server is responding');
    console.log('Status:', response.status);
    
    // Test CORS headers
    console.log('CORS Headers:');
    console.log('Access-Control-Allow-Origin:', response.headers['access-control-allow-origin']);
    console.log('Access-Control-Allow-Methods:', response.headers['access-control-allow-methods']);
    
  } catch (error) {
    console.error('❌ API test failed:', error.message);
  }
}

testAPI();