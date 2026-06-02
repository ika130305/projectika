import { createFileRoute, Link } from "@tanstack/react-router";
import { Shield, Eye, Bell, Link2, Lock, Activity, ArrowRight, CheckCircle2 } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "ChainGuard — Deteksi Penyalahgunaan Data Pribadi Berbasis Blockchain" },
      { name: "description", content: "Platform transparansi data pribadi: catat setiap akses, deteksi penyalahgunaan, dan kendali penuh di tangan Anda — diamankan oleh blockchain." },
      { property: "og:title", content: "ChainGuard — Transparansi Data Pribadi" },
      { property: "og:description", content: "Setiap akses data tercatat di blockchain. Tidak bisa dimanipulasi. Notifikasi instan saat ada penyalahgunaan." },
    ],
  }),
  component: LandingPage,
});

function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Nav />
      <Hero />
      <Stats />
      <Features />
      <HowItWorks />
      <LedgerPreview />
      <CTA />
      <Footer />
    </div>
  );
}

function Nav() {
  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        <Link to="/" className="flex items-center gap-2">
          <div className="grid h-8 w-8 place-items-center rounded-md bg-primary text-primary-foreground">
            <Shield className="h-4 w-4" />
          </div>
          <span className="font-display text-sm font-bold tracking-tight">CHAINGUARD</span>
        </Link>
        <nav className="hidden items-center gap-8 text-sm md:flex">
          <a href="#features" className="text-muted-foreground transition-colors hover:text-foreground">Fitur</a>
          <a href="#how" className="text-muted-foreground transition-colors hover:text-foreground">Cara Kerja</a>
          <a href="#ledger" className="text-muted-foreground transition-colors hover:text-foreground">Ledger</a>
        </nav>
        <Link
          to="/dashboard"
          className="group inline-flex items-center gap-1.5 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-all hover:opacity-90"
        >
          Buka Dashboard
          <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
        </Link>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-hero text-primary-foreground">
      <div className="absolute inset-0 bg-grid opacity-50" />
      <div className="absolute -top-40 -right-40 h-96 w-96 rounded-full bg-accent/20 blur-3xl" />
      <div className="absolute -bottom-40 -left-40 h-96 w-96 rounded-full bg-accent/10 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-6 py-24 md:py-32">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs font-mono uppercase tracking-wider backdrop-blur">
              <span className="h-1.5 w-1.5 rounded-full bg-success pulse-dot" />
              Block #482,109 · Verified
            </div>
            <h1 className="mt-6 font-display text-5xl font-bold leading-[1.05] tracking-tight md:text-6xl lg:text-7xl">
              Setiap akses
              <br />
              data Anda
              <br />
              <span className="text-accent">tercatat selamanya.</span>
            </h1>
            <p className="mt-6 max-w-lg text-balance text-base text-primary-foreground/70 md:text-lg">
              ChainGuard mendeteksi penyalahgunaan data pribadi dengan mencatat setiap aktivitas akses di blockchain — transparan, permanen, dan tidak dapat dimanipulasi.
            </p>
            <div className="mt-10 flex flex-wrap items-center gap-4">
              <Link
                to="/dashboard"
                className="group inline-flex items-center gap-2 rounded-md bg-accent px-6 py-3 text-sm font-medium text-accent-foreground shadow-glow transition-all hover:opacity-90"
              >
                Lihat Dashboard Simulasi
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <a href="#how" className="text-sm text-primary-foreground/70 transition-colors hover:text-primary-foreground">
                Bagaimana cara kerjanya? →
              </a>
            </div>
          </div>

          <div className="relative">
            <HeroCard />
          </div>
        </div>
      </div>
    </section>
  );
}

function HeroCard() {
  const rows = [
    { t: "BPJS Kesehatan", a: "Akses rekam medis", s: "valid", h: "0xa3f1...92e8" },
    { t: "Bank Mandiri", a: "Verifikasi identitas", s: "valid", h: "0x7c2b...41d9" },
    { t: "Unknown Entity", a: "Akses NIK & alamat", s: "alert", h: "0x9e44...bb02" },
    { t: "Tokopedia", a: "Update profil", s: "valid", h: "0x5d18...7a3c" },
  ];
  return (
    <div className="rounded-xl border border-white/10 bg-surface-elevated p-1 shadow-trust">
      <div className="rounded-lg bg-card p-5 text-card-foreground">
        <div className="flex items-center justify-between border-b border-border pb-4">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">Live Activity Log</p>
            <p className="mt-1 font-display text-lg font-semibold">Audit Trail · NIK ****3821</p>
          </div>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-success/10 px-2.5 py-1 text-xs font-medium text-success">
            <span className="h-1.5 w-1.5 rounded-full bg-success pulse-dot" /> Synced
          </span>
        </div>

        <div className="mt-4 space-y-2">
          {rows.map((r, i) => (
            <div
              key={i}
              className={`flex items-center justify-between rounded-md border px-3 py-2.5 transition-colors ${
                r.s === "alert"
                  ? "border-destructive/30 bg-destructive/5"
                  : "border-border bg-surface"
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`grid h-8 w-8 place-items-center rounded-md ${r.s === "alert" ? "bg-destructive/10 text-destructive" : "bg-accent/10 text-accent"}`}>
                  {r.s === "alert" ? <Bell className="h-4 w-4" /> : <CheckCircle2 className="h-4 w-4" />}
                </div>
                <div>
                  <p className="text-sm font-medium leading-tight">{r.t}</p>
                  <p className="text-xs text-muted-foreground">{r.a}</p>
                </div>
              </div>
              <p className="font-mono text-[11px] text-muted-foreground">{r.h}</p>
            </div>
          ))}
        </div>

        <div className="mt-4 flex items-center justify-between border-t border-border pt-4 text-xs">
          <span className="font-mono text-muted-foreground">block #482,109</span>
          <span className="font-mono text-muted-foreground">SHA-256 · immutable</span>
        </div>
      </div>
    </div>
  );
}

function Stats() {
  const items = [
    { v: "100%", l: "Transparansi akses data" },
    { v: "<2s", l: "Notifikasi penyalahgunaan" },
    { v: "0", l: "Manipulasi yang mungkin" },
    { v: "24/7", l: "Pengawasan otomatis" },
  ];
  return (
    <section className="border-b border-border bg-surface">
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-px overflow-hidden md:grid-cols-4">
        {items.map((it, i) => (
          <div key={i} className="bg-background p-8">
            <p className="font-display text-4xl font-bold tracking-tight">{it.v}</p>
            <p className="mt-2 text-sm text-muted-foreground">{it.l}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function Features() {
  const items = [
    { icon: Eye, title: "Transparansi Total", desc: "Lihat siapa yang mengakses data Anda, kapan, dan untuk tujuan apa — dalam waktu nyata." },
    { icon: Link2, title: "Ledger Blockchain", desc: "Setiap aktivitas direkam ke dalam blok yang permanen dan tidak dapat diubah." },
    { icon: Bell, title: "Notifikasi Instan", desc: "Dapatkan peringatan langsung saat ada akses yang tidak sesuai izin Anda." },
    { icon: Lock, title: "Kontrol Izin Granular", desc: "Atur siapa boleh akses, untuk berapa lama, dan untuk data apa saja." },
    { icon: Activity, title: "Deteksi Anomali", desc: "Algoritma mendeteksi pola akses mencurigakan dan menandainya untuk peninjauan." },
    { icon: Shield, title: "Integritas Terjamin", desc: "Hash kriptografis memastikan data audit tidak pernah berubah sejak ditulis." },
  ];
  return (
    <section id="features" className="mx-auto max-w-7xl px-6 py-24">
      <div className="max-w-2xl">
        <p className="font-mono text-xs uppercase tracking-wider text-accent">// fitur</p>
        <h2 className="mt-3 font-display text-4xl font-bold tracking-tight md:text-5xl">
          Kendali penuh,<br />tanpa ruang manipulasi.
        </h2>
      </div>
      <div className="mt-16 grid gap-px overflow-hidden rounded-xl border border-border bg-border md:grid-cols-2 lg:grid-cols-3">
        {items.map((it, i) => (
          <div key={i} className="group bg-card p-8 transition-colors hover:bg-surface">
            <div className="grid h-11 w-11 place-items-center rounded-md bg-primary text-primary-foreground transition-transform group-hover:scale-110">
              <it.icon className="h-5 w-5" />
            </div>
            <h3 className="mt-6 font-display text-lg font-semibold">{it.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{it.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function HowItWorks() {
  const steps = [
    { n: "01", t: "Akses Diminta", d: "Pihak ketiga (bank, rumah sakit, e-commerce) meminta akses data pribadi pengguna." },
    { n: "02", t: "Smart Contract Verifikasi", d: "Sistem memeriksa izin yang telah Anda berikan dan menentukan validitas akses." },
    { n: "03", t: "Rekam ke Blockchain", d: "Aktivitas akses dihash dan ditulis ke blok baru — permanen dan dapat diverifikasi." },
    { n: "04", t: "Notifikasi & Audit", d: "Anda mendapat notifikasi. Jika tidak sesuai izin, alert merah dikirim seketika." },
  ];
  return (
    <section id="how" className="border-y border-border bg-surface py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="max-w-2xl">
          <p className="font-mono text-xs uppercase tracking-wider text-accent">// cara kerja</p>
          <h2 className="mt-3 font-display text-4xl font-bold tracking-tight md:text-5xl">
            Empat langkah, satu rantai bukti.
          </h2>
        </div>
        <div className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {steps.map((s, i) => (
            <div key={i} className="relative rounded-xl border border-border bg-card p-6 shadow-card">
              <p className="font-mono text-xs text-accent">{s.n}</p>
              <h3 className="mt-4 font-display text-lg font-semibold">{s.t}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{s.d}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function LedgerPreview() {
  const blocks = Array.from({ length: 14 }, (_, i) => ({
    h: `0x${Math.random().toString(16).slice(2, 6)}...${Math.random().toString(16).slice(2, 6)}`,
    e: ["BPJS Kesehatan", "Bank BCA", "Gojek", "Pemerintah Daerah", "Tokopedia", "Telkomsel"][i % 6],
    p: ["read:medical", "read:identity", "read:location", "read:profile", "write:profile"][i % 5],
    n: 482109 - i,
  }));
  const loop = [...blocks, ...blocks];

  return (
    <section id="ledger" className="mx-auto max-w-7xl px-6 py-24">
      <div className="grid items-center gap-12 lg:grid-cols-[1fr_1.2fr]">
        <div>
          <p className="font-mono text-xs uppercase tracking-wider text-accent">// ledger</p>
          <h2 className="mt-3 font-display text-4xl font-bold tracking-tight md:text-5xl">
            Bukti yang tidak bisa dihapus.
          </h2>
          <p className="mt-6 text-muted-foreground">
            Tidak ada satu pun pihak — termasuk operator sistem — yang dapat menghapus atau memodifikasi catatan akses setelah ditulis. Distribusi node menjamin konsensus dan integritas.
          </p>
          <ul className="mt-6 space-y-3 text-sm">
            {["Hash SHA-256 per blok", "Konsensus terdistribusi", "Audit publik dapat diverifikasi", "Tanda tangan kriptografis"].map((x) => (
              <li key={x} className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-success" /> {x}
              </li>
            ))}
          </ul>
        </div>

        <div className="relative h-[440px] overflow-hidden rounded-xl border border-border bg-card shadow-trust">
          <div className="absolute inset-x-0 top-0 z-10 h-12 bg-gradient-to-b from-card to-transparent" />
          <div className="absolute inset-x-0 bottom-0 z-10 h-12 bg-gradient-to-t from-card to-transparent" />
          <div className="ledger-scroll p-4 font-mono text-xs">
            {loop.map((b, i) => (
              <div key={i} className="mb-2 grid grid-cols-[auto_1fr_auto] items-center gap-3 rounded-md border border-border bg-surface px-3 py-2.5">
                <span className="text-accent">#{b.n.toLocaleString()}</span>
                <div>
                  <p className="text-foreground">{b.e}</p>
                  <p className="text-[10px] text-muted-foreground">{b.p}</p>
                </div>
                <span className="text-muted-foreground">{b.h}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function CTA() {
  return (
    <section className="bg-gradient-hero px-6 py-24 text-primary-foreground">
      <div className="mx-auto max-w-4xl text-center">
        <h2 className="font-display text-4xl font-bold tracking-tight md:text-5xl">
          Saatnya data Anda<br />kembali milik Anda.
        </h2>
        <p className="mx-auto mt-6 max-w-xl text-primary-foreground/70">
          Coba dashboard simulasi untuk merasakan transparansi dan kontrol penuh atas data pribadi Anda.
        </p>
        <Link
          to="/dashboard"
          className="group mt-10 inline-flex items-center gap-2 rounded-md bg-accent px-7 py-3.5 text-sm font-medium text-accent-foreground shadow-glow transition-all hover:opacity-90"
        >
          Coba Dashboard <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </Link>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-border bg-surface py-10">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-6 text-sm text-muted-foreground md:flex-row">
        <div className="flex items-center gap-2">
          <Shield className="h-4 w-4" />
          <span className="font-display font-semibold text-foreground">CHAINGUARD</span>
          <span>· Deteksi Penyalahgunaan Data Pribadi</span>
        </div>
        <p className="font-mono text-xs">© 2026 · Built on immutable trust</p>
      </div>
    </footer>
  );
}
