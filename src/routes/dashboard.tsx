import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  Shield, Bell, Activity, Database, Users, AlertTriangle, CheckCircle2,
  Search, ChevronRight, ArrowLeft, FileText, Settings, Filter,
  Fingerprint, XCircle,
} from "lucide-react";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Dashboard · ChainGuard" },
      { name: "description", content: "Pantau akses data pribadi Anda secara real-time pada ledger blockchain." },
    ],
  }),
  component: Dashboard,
});

type LogStatus = "valid" | "alert" | "pending";
interface LogEntry {
  id: string;
  time: string;
  entity: string;
  category: string;
  purpose: string;
  permission: string;
  status: LogStatus;
  block: number;
  hash: string;
  nik: string;
  ownerName: string;
}

const LOGS: LogEntry[] = [
  { id: "1", time: "14:32:08", entity: "BPJS Kesehatan", category: "Rekam Medis", purpose: "Verifikasi klaim asuransi", permission: "read:medical", status: "valid", block: 482109, hash: "0xa3f192e8", nik: "3201234567893821", ownerName: "Andi Pratama" },
  { id: "2", time: "14:28:51", entity: "Bank Mandiri", category: "Identitas", purpose: "KYC pembukaan rekening", permission: "read:identity", status: "valid", block: 482107, hash: "0x7c2b41d9", nik: "3201234567893821", ownerName: "Andi Pratama" },
  { id: "3", time: "14:21:14", entity: "Unknown Entity (TX-9E44)", category: "NIK & Alamat", purpose: "Tujuan tidak dideklarasikan", permission: "—", status: "alert", block: 482104, hash: "0x9e44bb02", nik: "3201234567893821", ownerName: "Andi Pratama" },
  { id: "4", time: "13:58:02", entity: "Tokopedia", category: "Profil", purpose: "Update alamat pengiriman", permission: "write:profile", status: "valid", block: 482099, hash: "0x5d187a3c", nik: "3175098712340007", ownerName: "Siti Nurhaliza" },
  { id: "5", time: "13:44:37", entity: "Gojek", category: "Lokasi", purpose: "Pencocokan driver terdekat", permission: "read:location", status: "valid", block: 482094, hash: "0x2f81cc45", nik: "3175098712340007", ownerName: "Siti Nurhaliza" },
  { id: "6", time: "12:55:19", entity: "Telkomsel", category: "Kontak", purpose: "Verifikasi nomor telepon", permission: "read:phone", status: "pending", block: 482082, hash: "0x88a30f12", nik: "3273014509881122", ownerName: "Budi Santoso" },
  { id: "7", time: "11:30:41", entity: "Pemerintah Daerah", category: "Identitas", purpose: "Validasi domisili", permission: "read:identity", status: "valid", block: 482061, hash: "0x4c19ee77", nik: "3273014509881122", ownerName: "Budi Santoso" },
  { id: "8", time: "10:12:55", entity: "Data Broker XY", category: "Profil", purpose: "Aktivitas marketing", permission: "—", status: "alert", block: 482044, hash: "0xbb04dd91", nik: "3273014509881122", ownerName: "Budi Santoso" },
];

function Dashboard() {
  const [filter, setFilter] = useState<"all" | LogStatus>("all");
  const [query, setQuery] = useState("");
  const [nik, setNik] = useState("");
  const [submittedNik, setSubmittedNik] = useState("");

  const nikDigits = submittedNik.replace(/\D/g, "");

  const filtered = useMemo(
    () =>
      LOGS.filter((l) => (filter === "all" ? true : l.status === filter))
        .filter((l) => (nikDigits ? l.nik.includes(nikDigits) : true))
        .filter((l) =>
          [l.entity, l.category, l.purpose, l.permission, l.nik, l.ownerName]
            .join(" ")
            .toLowerCase()
            .includes(query.toLowerCase()),
        ),
    [filter, query, nikDigits],
  );

  const alerts = LOGS.filter((l) => l.status === "alert").length;

  return (
    <div className="min-h-screen bg-surface">
      <div className="flex">
        <Sidebar />
        <main className="flex-1">
          <TopBar alerts={alerts} />

          <div className="mx-auto max-w-7xl space-y-6 p-6 lg:p-8">
            <Header />
            <NikSearch
              nik={nik}
              setNik={setNik}
              submittedNik={submittedNik}
              onSubmit={() => setSubmittedNik(nik)}
              onClear={() => {
                setNik("");
                setSubmittedNik("");
              }}
              resultCount={nikDigits ? filtered.length : null}
            />
            <KpiGrid />
            <div className="grid gap-6 lg:grid-cols-[1.6fr_1fr]">
              <ActivityCard
                filter={filter}
                setFilter={setFilter}
                query={query}
                setQuery={setQuery}
                logs={filtered}
              />
              <div className="space-y-6">
                <PermissionsCard />
                <AlertsCard />
              </div>
            </div>
            <BlockchainCard />
          </div>
        </main>
      </div>
    </div>
  );
}

function NikSearch({
  nik, setNik, submittedNik, onSubmit, onClear, resultCount,
}: {
  nik: string;
  setNik: (v: string) => void;
  submittedNik: string;
  onSubmit: () => void;
  onClear: () => void;
  resultCount: number | null;
}) {
  const formatted = nik.replace(/\D/g, "").slice(0, 16);
  const isValidLength = formatted.length === 16;
  return (
    <div className="rounded-xl border border-border bg-card p-5 shadow-card">
      <div className="flex flex-wrap items-end gap-4">
        <div className="flex items-center gap-3">
          <div className="grid h-10 w-10 place-items-center rounded-md bg-accent/10 text-accent">
            <Fingerprint className="h-5 w-5" />
          </div>
          <div>
            <h2 className="font-display text-base font-semibold">Cari berdasarkan NIK</h2>
            <p className="mt-0.5 text-xs text-muted-foreground">
              Telusuri jejak akses untuk Nomor Induk Kependudukan tertentu.
            </p>
          </div>
        </div>
        <form
          className="flex flex-1 flex-wrap items-center gap-2"
          onSubmit={(e) => {
            e.preventDefault();
            setNik(formatted);
            onSubmit();
          }}
        >
          <div className="relative min-w-[260px] flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              value={formatted}
              onChange={(e) => setNik(e.target.value)}
              inputMode="numeric"
              maxLength={16}
              placeholder="Masukkan 16 digit NIK..."
              className="h-10 w-full rounded-md border border-input bg-background pl-9 pr-3 font-mono text-sm tracking-wider outline-none transition-colors focus:border-ring"
            />
          </div>
          <button
            type="submit"
            disabled={formatted.length === 0}
            className="h-10 rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-50"
          >
            Telusuri
          </button>
          {submittedNik && (
            <button
              type="button"
              onClick={onClear}
              className="grid h-10 w-10 place-items-center rounded-md border border-border bg-background text-muted-foreground transition-colors hover:text-foreground"
              aria-label="Reset pencarian NIK"
            >
              <XCircle className="h-4 w-4" />
            </button>
          )}
        </form>
      </div>

      {submittedNik && (
        <div className="mt-4 flex flex-wrap items-center gap-3 rounded-md border border-border bg-surface px-3 py-2 text-xs">
          <span className="font-mono uppercase tracking-wider text-muted-foreground">NIK aktif</span>
          <span className="font-mono font-medium text-foreground">{submittedNik}</span>
          <span className="text-muted-foreground">·</span>
          {resultCount !== null && resultCount > 0 ? (
            <span className="text-success">{resultCount} entri ditemukan</span>
          ) : (
            <span className="text-destructive">Tidak ada entri untuk NIK ini</span>
          )}
        </div>
      )}

      {nik && !isValidLength && !submittedNik && (
        <p className="mt-3 font-mono text-[10px] text-warning">
          NIK terdiri dari 16 digit · saat ini {formatted.length}/16
        </p>
      )}
    </div>
  );
}

function Sidebar() {
  const items = [
    { icon: Activity, label: "Aktivitas", active: true },
    { icon: Bell, label: "Notifikasi" },
    { icon: Database, label: "Data Saya" },
    { icon: Users, label: "Pihak Terhubung" },
    { icon: FileText, label: "Laporan" },
    { icon: Settings, label: "Pengaturan" },
  ];
  return (
    <aside className="sticky top-0 hidden h-screen w-60 shrink-0 border-r border-border bg-background p-4 lg:block">
      <Link to="/" className="flex items-center gap-2 px-2 py-2">
        <div className="grid h-8 w-8 place-items-center rounded-md bg-primary text-primary-foreground">
          <Shield className="h-4 w-4" />
        </div>
        <span className="font-display text-sm font-bold tracking-tight">CHAINGUARD</span>
      </Link>

      <nav className="mt-6 space-y-1">
        {items.map((it) => (
          <button
            key={it.label}
            className={`flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors ${
              it.active
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:bg-surface hover:text-foreground"
            }`}
          >
            <it.icon className="h-4 w-4" />
            {it.label}
          </button>
        ))}
      </nav>

      <Link
        to="/"
        className="mt-6 flex items-center gap-2 rounded-md px-3 py-2 text-xs text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="h-3.5 w-3.5" /> Kembali ke beranda
      </Link>

      <div className="absolute bottom-4 left-4 right-4 rounded-lg border border-border bg-surface p-3">
        <p className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">Node Status</p>
        <div className="mt-2 flex items-center gap-2 text-xs">
          <span className="h-2 w-2 rounded-full bg-success pulse-dot" />
          <span className="font-medium">Synced · 12 peers</span>
        </div>
        <p className="mt-1 font-mono text-[10px] text-muted-foreground">Block #482,109</p>
      </div>
    </aside>
  );
}

function TopBar({ alerts }: { alerts: number }) {
  return (
    <div className="sticky top-0 z-30 border-b border-border bg-background/80 backdrop-blur-xl">
      <div className="flex h-14 items-center justify-between px-6">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span className="font-mono text-xs">/dashboard</span>
          <ChevronRight className="h-3 w-3" />
          <span className="text-foreground">Aktivitas</span>
        </div>
        <div className="flex items-center gap-3">
          <button className="relative grid h-9 w-9 place-items-center rounded-md border border-border bg-card transition-colors hover:bg-surface">
            <Bell className="h-4 w-4" />
            {alerts > 0 && (
              <span className="absolute -right-1 -top-1 grid h-4 min-w-4 place-items-center rounded-full bg-destructive px-1 font-mono text-[10px] font-medium text-destructive-foreground">
                {alerts}
              </span>
            )}
          </button>
          <div className="flex items-center gap-3 rounded-md border border-border bg-card px-3 py-1.5">
            <div className="grid h-7 w-7 place-items-center rounded-full bg-accent text-accent-foreground font-display text-xs font-bold">A</div>
            <div className="text-xs">
              <p className="font-medium leading-tight">Andi Pratama</p>
              <p className="font-mono text-[10px] text-muted-foreground">NIK ****3821</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Header() {
  return (
    <div className="flex flex-wrap items-end justify-between gap-4">
      <div>
        <p className="font-mono text-xs uppercase tracking-wider text-accent">// audit trail</p>
        <h1 className="mt-1 font-display text-3xl font-bold tracking-tight">Selamat datang, Andi</h1>
        <p className="mt-1 text-sm text-muted-foreground">Ringkasan aktivitas akses data pribadi Anda hari ini.</p>
      </div>
      <div className="rounded-md border border-border bg-card px-4 py-2 font-mono text-xs">
        <span className="text-muted-foreground">last sync · </span>
        <span className="text-foreground">2 detik lalu</span>
      </div>
    </div>
  );
}

function KpiGrid() {
  const kpis = [
    { label: "Akses hari ini", value: "47", delta: "+12%", icon: Activity, tone: "text-foreground" },
    { label: "Pihak terhubung", value: "12", delta: "stable", icon: Users, tone: "text-foreground" },
    { label: "Alert aktif", value: "2", delta: "perlu tindakan", icon: AlertTriangle, tone: "text-destructive" },
    { label: "Total blok dicatat", value: "1,284", delta: "permanen", icon: Database, tone: "text-foreground" },
  ];
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {kpis.map((k) => (
        <div key={k.label} className="rounded-xl border border-border bg-card p-5 shadow-card">
          <div className="flex items-center justify-between">
            <p className="text-xs text-muted-foreground">{k.label}</p>
            <k.icon className={`h-4 w-4 ${k.tone}`} />
          </div>
          <p className={`mt-3 font-display text-3xl font-bold tracking-tight ${k.tone}`}>{k.value}</p>
          <p className="mt-1 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">{k.delta}</p>
        </div>
      ))}
    </div>
  );
}

function ActivityCard({
  filter, setFilter, query, setQuery, logs,
}: {
  filter: "all" | LogStatus;
  setFilter: (f: "all" | LogStatus) => void;
  query: string;
  setQuery: (q: string) => void;
  logs: LogEntry[];
}) {
  const tabs: Array<{ k: "all" | LogStatus; l: string }> = [
    { k: "all", l: "Semua" },
    { k: "valid", l: "Valid" },
    { k: "alert", l: "Alert" },
    { k: "pending", l: "Pending" },
  ];

  return (
    <div className="rounded-xl border border-border bg-card shadow-card">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border p-5">
        <div>
          <h2 className="font-display text-lg font-semibold">Aktivitas Akses Data</h2>
          <p className="mt-0.5 text-xs text-muted-foreground">Setiap entri tercatat permanen di blockchain.</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Cari entitas..."
              className="h-9 w-48 rounded-md border border-input bg-background pl-8 pr-3 text-xs outline-none transition-colors focus:border-ring"
            />
          </div>
          <button className="grid h-9 w-9 place-items-center rounded-md border border-border bg-background transition-colors hover:bg-surface">
            <Filter className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      <div className="flex gap-1 border-b border-border p-2">
        {tabs.map((t) => (
          <button
            key={t.k}
            onClick={() => setFilter(t.k)}
            className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
              filter === t.k ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-surface"
            }`}
          >
            {t.l}
          </button>
        ))}
      </div>

      <div className="divide-y divide-border">
        {logs.length === 0 && (
          <p className="p-8 text-center text-sm text-muted-foreground">Tidak ada entri untuk filter ini.</p>
        )}
        {logs.map((log) => (
          <div key={log.id} className="grid grid-cols-[auto_1fr_auto] items-center gap-4 px-5 py-4 transition-colors hover:bg-surface">
            <StatusBadge status={log.status} />
            <div className="min-w-0">
              <div className="flex items-baseline gap-2">
                <p className="truncate font-medium">{log.entity}</p>
                <span className="font-mono text-[10px] text-muted-foreground">{log.time}</span>
              </div>
              <p className="mt-0.5 truncate text-xs text-muted-foreground">
                <span className="text-foreground/80">{log.category}</span> · {log.purpose}
              </p>
              <div className="mt-1.5 flex items-center gap-2 font-mono text-[10px] text-muted-foreground">
                <span className="rounded bg-surface px-1.5 py-0.5">{log.permission}</span>
                <span>block #{log.block.toLocaleString()}</span>
                <span>{log.hash}</span>
              </div>
            </div>
            <button className="text-xs text-accent transition-colors hover:underline">Detail →</button>
          </div>
        ))}
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: LogStatus }) {
  const map = {
    valid: { c: "bg-success/10 text-success border-success/20", i: <CheckCircle2 className="h-4 w-4" /> },
    alert: { c: "bg-destructive/10 text-destructive border-destructive/20", i: <AlertTriangle className="h-4 w-4" /> },
    pending: { c: "bg-warning/10 text-warning border-warning/20", i: <Activity className="h-4 w-4" /> },
  } as const;
  const s = map[status];
  return (
    <div className={`grid h-10 w-10 place-items-center rounded-md border ${s.c}`}>{s.i}</div>
  );
}

function PermissionsCard() {
  const perms = [
    { name: "BPJS Kesehatan", scope: "read:medical", until: "Berlaku 90 hari", active: true },
    { name: "Bank Mandiri", scope: "read:identity", until: "Sesi tunggal", active: true },
    { name: "Tokopedia", scope: "write:profile", until: "Berlaku 1 tahun", active: true },
    { name: "Gojek", scope: "read:location", until: "Selama transaksi", active: true },
    { name: "Telkomsel", scope: "read:phone", until: "Menunggu izin", active: false },
  ];
  return (
    <div className="rounded-xl border border-border bg-card shadow-card">
      <div className="border-b border-border p-5">
        <h2 className="font-display text-lg font-semibold">Izin Aktif</h2>
        <p className="mt-0.5 text-xs text-muted-foreground">Pihak yang Anda izinkan mengakses data.</p>
      </div>
      <div className="divide-y divide-border">
        {perms.map((p) => (
          <div key={p.name} className="flex items-center justify-between px-5 py-3.5">
            <div className="min-w-0">
              <p className="truncate text-sm font-medium">{p.name}</p>
              <p className="mt-0.5 font-mono text-[10px] text-muted-foreground">{p.scope} · {p.until}</p>
            </div>
            <button
              className={`relative h-5 w-9 rounded-full transition-colors ${p.active ? "bg-accent" : "bg-muted"}`}
              aria-label="toggle"
            >
              <span className={`absolute top-0.5 h-4 w-4 rounded-full bg-white transition-all ${p.active ? "left-[18px]" : "left-0.5"}`} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

function AlertsCard() {
  return (
    <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-5">
      <div className="flex items-start gap-3">
        <div className="grid h-10 w-10 shrink-0 place-items-center rounded-md bg-destructive/10 text-destructive">
          <AlertTriangle className="h-5 w-5" />
        </div>
        <div className="min-w-0">
          <p className="font-display font-semibold text-destructive">Peringatan: Akses Tidak Sah</p>
          <p className="mt-1 text-xs text-foreground/80">
            <span className="font-medium">Unknown Entity (TX-9E44)</span> mencoba mengakses <span className="font-mono">NIK & alamat</span> Anda tanpa izin yang valid.
          </p>
          <div className="mt-3 flex gap-2">
            <button className="rounded-md bg-destructive px-3 py-1.5 text-xs font-medium text-destructive-foreground">Blokir & Laporkan</button>
            <button className="rounded-md border border-border bg-background px-3 py-1.5 text-xs font-medium">Tinjau</button>
          </div>
        </div>
      </div>
    </div>
  );
}

function BlockchainCard() {
  const blocks = Array.from({ length: 6 }, (_, i) => ({
    n: 482109 - i,
    h: `0x${Math.random().toString(16).slice(2, 10)}...${Math.random().toString(16).slice(2, 6)}`,
    tx: Math.floor(Math.random() * 8) + 1,
    t: `${i * 12}s ago`,
  }));
  return (
    <div className="rounded-xl border border-border bg-card shadow-card">
      <div className="flex items-center justify-between border-b border-border p-5">
        <div>
          <h2 className="font-display text-lg font-semibold">Ledger Blockchain</h2>
          <p className="mt-0.5 text-xs text-muted-foreground">Blok terbaru pada jaringan ChainGuard.</p>
        </div>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-success/10 px-2.5 py-1 text-xs font-medium text-success">
          <span className="h-1.5 w-1.5 rounded-full bg-success pulse-dot" /> Mining
        </span>
      </div>
      <div className="grid gap-px overflow-hidden bg-border md:grid-cols-3 lg:grid-cols-6">
        {blocks.map((b) => (
          <div key={b.n} className="bg-card p-4 transition-colors hover:bg-surface">
            <p className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">block</p>
            <p className="mt-1 font-display text-xl font-bold tracking-tight text-accent">#{b.n.toLocaleString()}</p>
            <p className="mt-2 truncate font-mono text-[10px] text-muted-foreground">{b.h}</p>
            <div className="mt-3 flex items-center justify-between text-[10px] text-muted-foreground">
              <span>{b.tx} tx</span>
              <span>{b.t}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
