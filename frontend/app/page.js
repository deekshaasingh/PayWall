export default function Home() {
  return (
    <main className="min-h-screen flex flex-col">
      <nav className="flex items-center justify-between px-8 py-6 max-w-6xl mx-auto w-full">
        <span className="font-display font-bold text-lg tracking-tight">
          PayFlow
        </span>
        <div className="flex gap-6 items-center text-sm text-[var(--mist)]">
          <a href="/login" className="hover:text-[var(--paper)] transition-colors">
            Log in
          </a>
          <a href="/signup" className="px-4 py-2 rounded-lg bg-[var(--flow)] text-white hover:opacity-90 transition-opacity">
            Get started
          </a>
        </div>
      </nav>

      <section className="flex-1 flex flex-col items-center justify-center px-6 text-center gap-8 py-16">
        <span className="font-mono-num text-xs uppercase tracking-[0.2em] text-[var(--mist)]">
          Wallets · Transfers · Ledgers
        </span>

        <h1 className="font-display font-extrabold text-5xl md:text-7xl max-w-3xl leading-[1.05]">
          Watch your money move.
        </h1>

        <p className="text-[var(--mist)] max-w-md text-lg">
          A backend built from scratch — auth, wallets, transfers, and a full
          transaction ledger. No black boxes.
        </p>

        <svg viewBox="0 0 600 160" className="w-full max-w-2xl mt-4">
          <path
            d="M40,120 C200,20 400,20 560,120"
            fill="none"
            stroke="var(--panel-light)"
            strokeWidth="2"
            strokeDasharray="4 8"
          />
          <circle r="6" fill="var(--flow)">
            <animateMotion
              dur="3s"
              repeatCount="indefinite"
              path="M40,120 C200,20 400,20 560,120"
            />
          </circle>
          <text x="30" y="145" fill="var(--mist)" fontSize="13" fontFamily="var(--font-mono)">
            You
          </text>
          <text x="525" y="145" fill="var(--mist)" fontSize="13" fontFamily="var(--font-mono)">
            Receiver
          </text>
        </svg>

        <div className="flex gap-4 mt-2">
          <a href="/signup" className="px-6 py-3 rounded-lg bg-[var(--flow)] text-white font-medium hover:opacity-90 transition-opacity">
            Create an account
          </a>
          <a href="/login" className="px-6 py-3 rounded-lg border border-[var(--panel-light)] text-[var(--paper)] font-medium hover:bg-[var(--panel)] transition-colors">
            Log in
          </a>
        </div>
      </section>

      <section className="grid md:grid-cols-3 gap-4 max-w-5xl mx-auto w-full px-6 pb-20">
        {[
          {
            title: "Wallets",
            desc: "Every account holds a live balance, backed by a real database, not a mock.",
          },
          {
            title: "Transfers",
            desc: "Send money between accounts with balance checks and instant settlement.",
          },
          {
            title: "Ledger",
            desc: "Every transfer is recorded — sender, receiver, amount, timestamp, status.",
          },
        ].map((item) => (
          <div
            key={item.title}
            className="bg-[var(--panel)] border border-[var(--panel-light)] rounded-xl p-6"
          >
            <h3 className="font-display font-bold text-lg mb-2">{item.title}</h3>
            <p className="text-[var(--mist)] text-sm">{item.desc}</p>
          </div>
        ))}
      </section>
    </main>
  );
}