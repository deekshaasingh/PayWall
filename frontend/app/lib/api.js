const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

async function request(path, options = {}) {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("payflow_token") : null;

  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Something went wrong");
  }

  return data;
}

export const signup = (name, email, password) =>
  request("/signup", { method: "POST", body: JSON.stringify({ name, email, password }) });

export const login = (email, password) =>
  request("/login", { method: "POST", body: JSON.stringify({ email, password }) });

export const getWallet = () => request("/wallet");

export const addMoney = (amount) =>
  request("/wallet/add-withdraw", { method: "POST", body: JSON.stringify({ amount }) });

export const transferMoney = (receiverEmail, amount) =>
  request("/transfer", { method: "POST", body: JSON.stringify({ receiverEmail, amount }) });

export const getTransactions = () => request("/transactions");