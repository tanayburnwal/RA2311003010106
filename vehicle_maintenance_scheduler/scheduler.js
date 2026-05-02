const axios = require("axios");

const BASE_URL = "http://20.244.56.144/evaluation-service";
const TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiYXVkIjoiaHR0cDovLzIwLjI0NC41Ni4xNDQvZXZhbHVhdGlvbi1zZXJ2aWNlIiwiZW1haWwiOiJ0YjY0OTFAc3JtaXN0LmVkdS5pbiIsImV4cCI6MTc3NzY5OTkwOSwiaWF0IjoxNzc3Njk5MDA5LCJpc3MiOiJBZmZvcmQgTWVkaWNhbCBUZWNobm9sb2dpZXMgUHJpdmF0ZSBMaW1pdGVkIiwianRpIjoiOTA0N2ZmOTQtNDQ1Ni00MDFlLWJiY2YtZWM3YjNkZTllNTgxIiwibG9jYWxlIjoiZW4tSU4iLCJuYW1lIjoidGFuYXkgYnVybndhbCIsInN1YiI6Ijk0YjZmMWVmLTJhYmUtNGU1OS05ODVjLTU1ZTYzMzI3NzhmNCJ9LCJlbWFpbCI6InRiNjQ5MUBzcm1pc3QuZWR1LmluIiwibmFtZSI6InRhbmF5IGJ1cm53YWwiLCJyb2xsTm8iOiJyYTIzMTEwMDMwMTAxMDYiLCJhY2Nlc3NDb2RlIjoiUWticHhIIiwiY2xpZW50SUQiOiI5NGI2ZjFlZi0yYWJlLTRlNTktOTg1Yy01NWU2MzMyNzc4ZjQiLCJjbGllbnRTZWNyZXQiOiJEUXVDTXZESHZFemZIZlJFIn0.USGcJ8_R3PEmkQkZb5z8vGdHH9ljAkNLD4sbi1IUa2c";

async function getData(endpoint, retries = 2) {
  try {
    const res = await axios.get(`${BASE_URL}${endpoint}`, {
      headers: {
        Authorization: `Bearer ${TOKEN}`
      },
      timeout: 10000
    });
    return res.data;
  } catch (err) {
    if (retries > 0) return getData(endpoint, retries - 1);
    throw err;
  }
}

function knapsack(vehicles, capacity) {
  const n = vehicles.length;
  const dp = Array.from({ length: n + 1 }, () =>
    Array(capacity + 1).fill(0)
  );

  for (let i = 1; i <= n; i++) {
    const { duration, impact } = vehicles[i - 1];

    for (let w = 0; w <= capacity; w++) {
      if (duration <= w) {
        dp[i][w] = Math.max(
          dp[i - 1][w],
          impact + dp[i - 1][w - duration]
        );
      } else {
        dp[i][w] = dp[i - 1][w];
      }
    }
  }

  let w = capacity;
  const selected = [];

  for (let i = n; i > 0; i--) {
    if (dp[i][w] !== dp[i - 1][w]) {
      selected.push(vehicles[i - 1]);
      w -= vehicles[i - 1].duration;
    }
  }

  return selected;
}
async function run() {
  const depots = [
    { id: 1, mechanicHours: 8 }
  ];

  const vehicles = [
    { id: 1, duration: 2, impact: 10 },
    { id: 2, duration: 4, impact: 20 },
    { id: 3, duration: 6, impact: 30 },
    { id: 4, duration: 3, impact: 25 }
  ];

  for (const depot of depots) {
    const result = knapsack(vehicles, depot.mechanicHours);

    console.log(`Depot ${depot.id}`);
    console.log(result);
  }
}
// async function run() {
//   try {
//     const depotsData = await getData("/depots");
//     const depots = depotsData.depots || depotsData.data || depotsData;

//     for (const depot of depots) {
//       const vehiclesData = await getData(`/vehicles?depotId=${depot.id}`);
//       const vehicles = vehiclesData.vehicles || vehiclesData.data || vehiclesData;

//       const result = knapsack(vehicles, depot.mechanicHours);

//       console.log(`Depot ${depot.id}`);
//       console.log(result);
//     }
//   } catch (err) {
//     console.log("Error:", err.message);
//   }
// }

run();