const API_BASE = import.meta.env.VITE_API_BASE as string;
const API_KEY = import.meta.env.VITE_API_KEY as string;

const headers = {
  "Content-Type": "application/json",
  "X-ApiKey": API_KEY
};


export async function fetchLastData(): Promise<any> {
  const res = await fetch(`${API_BASE}/last`, { headers });
  if (!res.ok) throw new Error("Failed to fetch last data");
  return res.json();
}

export async function fetchAllData(): Promise<any[]> {
  const res = await fetch(`${API_BASE}/all`, { headers });
  if (!res.ok) throw new Error("Failed to fetch all data");
  return res.json();
}

export async function fetchDailyData(): Promise<any[]> {
  const res = await fetch(`${API_BASE}/daily`, { headers });
  if (!res.ok) throw new Error("Failed to fetch daily data");
  return res.json();
}

export async function fetchWeeklyData(): Promise<any[]> {
  const res = await fetch(`${API_BASE}/weekly`, { headers });
  if (!res.ok) throw new Error("Failed to fetch weekly data");
  return res.json();
}

export async function fetchMonthlyData(): Promise<any[]> {
  const res = await fetch(`${API_BASE}/monthly`, { headers });
  if (!res.ok) throw new Error("Failed to fetch monthly data");
  return res.json();
}

export async function fetchLongestData(): Promise<any> {
  const res = await fetch(`${API_BASE}/long`, { headers });
  if (!res.ok) throw new Error("Failed to fetch longest data");
  return res.json();
}

export async function fetchLastPing(): Promise<any> {
  const res = await fetch(`${API_BASE}/lastping`, { headers });
  if (!res.ok) throw new Error("Failed to fetch last ping");
  return res.json();
}
