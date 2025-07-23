// Simple Node.js script to test API connection
const fetch = require("node-fetch");

async function testAPI() {
  try {
    console.log("🔍 Testing API connection...");
    console.log("📡 Calling: http://localhost:5280/api/Posts");

    const response = await fetch("http://localhost:5280/api/Posts", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });

    console.log("📡 Response status:", response.status);
    console.log("📡 Response ok:", response.ok);

    if (response.ok) {
      const data = await response.json();
      console.log("✅ Success! Posts count:", data.length);
      console.log("📄 First post:", data[0]);
    } else {
      console.log("❌ Failed:", response.statusText);
      const errorText = await response.text();
      console.log("Error details:", errorText);
    }
  } catch (error) {
    console.error("❌ Connection error:", error.message);
  }
}

testAPI();
