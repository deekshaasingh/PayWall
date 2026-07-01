"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../lib/AuthContext";
import * as api from "../lib/api";

export default function Dashboard() {
  const { token, ready, logout } = useAuth();
  const router = useRouter();

  const [balance, setBalance] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [insights, setInsights] = useState(null);
  const [addAmount, setAddAmount] = useState("");
  const [receiverEmail, setReceiverEmail] = useState("");
  const [sendAmount, setSendAmount] = useState("");
  const [message, setMessage] = useState(null);

  useEffect(() => {
    if (ready && !token) router.push("/login");
  }, [ready, token, router]);

  const loadData = async () => {
    try {
      const wallet = await api.getWallet();
      const history = await api.getTransactions();
      const stats = await api.getInsights();
      setBalance(wallet.balance);
      setTransactions(history.transactions);
      setInsights(stats);
    } catch (err) {
      setMessage({ type: "error", text: err.message });
    }
  };

  useEffect(() => {
    if (token) loadData();
  }, [token]);

  const handleAddMoney = async (e) => {
    e.preventDefault();
    setMessage(null);
    try {
      await api.addMoney(Number(addAmount));
      setAddAmount("");
      setMessage({ type: "success", text: "Money added." });
      loadData();
    } catch (err) {
      setMessage({ type: "error", text: err.message });
    }
  };

  const handleTransfer = async (e) => {
    e.preventDefault();
    setMessage(null);
    try {
      await api.transferMoney(receiverEmail, Number(sendAmount));
      setReceiverEmail("");
      setSendAmount("");
      setMessage({ type: "success", text: "Transfer sent." });
      loadData();
    } catch (err) {
      setMessage({ type: "error", text: err.message });
    }
  };

  if (!ready || !token) return null;

  return (
    <main className="min-h-screen px-6 py-8 max-w-4xl mx-auto">
      <nav className="flex items-center justify-between mb-8">
        <span className="font-display font-bold text-lg">PayFlow</span>
        <button onClick={logout} className="text-sm text-[var(--mist)] hover:text-[var(--paper)]">
          Log out
        </button>
      </nav>

      {message && (
        <div
          className={`rounded-lg px-4 py-3 mb-6 text-sm border ${
            message.type === "error"
              ? "bg-[var(--coral)]/10 border-[var(--coral)]/30 text-[var(--coral)]"
              : "bg-[var(--grow)]/10 border-[var(--grow)]/30 text-[var(--grow)]"
          }`}
        >
          {message.text}
        </div>
      )}

      <div className="bg-[var(--panel)] border border-[var(--panel-light)] rounded-xl p-8 mb-6">
        <p className="text-[var(--mist)] text-sm mb-2">Available balance</p>
        <p className="font-mono-num text-5xl font-medium">
          ₹{balance !== null ? balance.toLocaleString("en-IN") : "—"}
        </p>
      </div>

      {insights && (
        <div className="bg-[var(--panel)] border border-[var(--panel-light)] rounded-xl p-6 mb-6">
          <h3 className="font-display font-bold mb-4">This week</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div>
              <p className="text-[var(--mist)] text-xs mb-1">Sent</p>
              <p className="font-mono-num text-xl">
                ₹{insights.thisWeekSent.toLocaleString("en-IN")}
              </p>
              <p
                className="text-xs mt-1 font-mono-num"
                style={{
                  color: insights.percentChange <= 0 ? "var(--grow)" : "var(--coral)",
                }}
              >
                {insights.percentChange >= 0 ? "+" : ""}
                {insights.percentChange}% vs last week
              </p>
            </div>
            <div>
              <p className="text-[var(--mist)] text-xs mb-1">Received</p>
              <p className="font-mono-num text-xl">
                ₹{insights.thisWeekReceived.toLocaleString("en-IN")}
              </p>
            </div>
            <div>
              <p className="text-[var(--mist)] text-xs mb-1">Transfers made</p>
              <p className="font-mono-num text-xl">{insights.transactionCountThisWeek}</p>
            </div>
            <div>
              <p className="text-[var(--mist)] text-xs mb-1">Most sent to</p>
              <p className="text-sm truncate">
                {insights.topCounterparty || "—"}
              </p>
              {insights.topCounterparty && (
                <p className="font-mono-num text-xs text-[var(--mist)] mt-0.5">
                  ₹{insights.topCounterpartyAmount.toLocaleString("en-IN")} total
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-4 mb-6">
        <form
          onSubmit={handleAddMoney}
          className="bg-[var(--panel)] border border-[var(--panel-light)] rounded-xl p-6"
        >
          <h3 className="font-display font-bold mb-4">Add money</h3>
          <input
            type="number"
            required
            min="1"
            placeholder="Amount"
            value={addAmount}
            onChange={(e) => setAddAmount(e.target.value)}
            className="w-full bg-[var(--ink)] border border-[var(--panel-light)] rounded-lg px-4 py-2.5 mb-3 font-mono-num"
          />
          <button
            type="submit"
            className="w-full bg-[var(--grow)] text-[var(--ink)] rounded-lg py-2.5 font-medium hover:opacity-90 transition-opacity"
          >
            Add money
          </button>
        </form>

        <form
          onSubmit={handleTransfer}
          className="bg-[var(--panel)] border border-[var(--panel-light)] rounded-xl p-6"
        >
          <h3 className="font-display font-bold mb-4">Send money</h3>
          <input
            type="email"
            required
            placeholder="Receiver's email"
            value={receiverEmail}
            onChange={(e) => setReceiverEmail(e.target.value)}
            className="w-full bg-[var(--ink)] border border-[var(--panel-light)] rounded-lg px-4 py-2.5 mb-3"
          />
          <input
            type="number"
            required
            min="1"
            placeholder="Amount"
            value={sendAmount}
            onChange={(e) => setSendAmount(e.target.value)}
            className="w-full bg-[var(--ink)] border border-[var(--panel-light)] rounded-lg px-4 py-2.5 mb-3 font-mono-num"
          />
          <button
            type="submit"
            className="w-full bg-[var(--flow)] text-white rounded-lg py-2.5 font-medium hover:opacity-90 transition-opacity"
          >
            Send
          </button>
        </form>
      </div>

      <div className="bg-[var(--panel)] border border-[var(--panel-light)] rounded-xl p-6">
        <h3 className="font-display font-bold mb-4">Transaction history</h3>

        {transactions.length === 0 ? (
          <p className="text-[var(--mist)] text-sm">No transactions yet.</p>
        ) : (
          <div className="flex flex-col gap-3">
            {transactions.map((tx) => (
              <div
                key={tx._id}
                className="flex items-center justify-between py-3 border-b border-[var(--panel-light)] last:border-0"
              >
                <div className="flex items-center gap-3">
                  <span
                    className="w-2 h-2 rounded-full"
                    style={{
                      background: tx.receiver === tx.sender ? "var(--mist)" : "var(--flow)",
                    }}
                  />
                  <div>
                    <p className="text-sm">
                      {tx.sender} → {tx.receiver}
                    </p>
                    <p className="text-xs text-[var(--mist)]">
                      {new Date(tx.createdAt).toLocaleString()}
                    </p>
                  </div>
                </div>
                <span className="font-mono-num text-sm">₹{tx.amount.toLocaleString("en-IN")}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}