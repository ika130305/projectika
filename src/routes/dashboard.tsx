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
  // Keluarga Wijaya (KK 3321100311700001)
  { id: "9", time: "09:48:22", entity: "Dukcapil", category: "Kartu Keluarga", purpose: "Pembaruan data KK", permission: "read:family", status: "valid", block: 482028, hash: "0x71ae22cd", nik: "3321100311700001", ownerName: "Hendra Wijaya" },
  { id: "10", time: "09:30:11", entity: "BPJS Kesehatan", category: "Rekam Medis", purpose: "Cek kepesertaan keluarga", permission: "read:medical", status: "valid", block: 482015, hash: "0x33fa90b1", nik: "3321100311700001", ownerName: "Hendra Wijaya" },
  { id: "11", time: "09:12:05", entity: "Bank BCA", category: "Identitas", purpose: "Verifikasi nasabah", permission: "read:identity", status: "valid", block: 482001, hash: "0x55cd11e2", nik: "3321100311700002", ownerName: "Maya Wijaya" },
  { id: "12", time: "08:54:39", entity: "Shopee", category: "Profil", purpose: "Update alamat pengiriman", permission: "write:profile", status: "valid", block: 481990, hash: "0x9012aaef", nik: "3321100311700002", ownerName: "Maya Wijaya" },
  { id: "13", time: "08:33:50", entity: "Unknown Entity (TX-7F12)", category: "NIK & Alamat", purpose: "Tujuan tidak dideklarasikan", permission: "—", status: "alert", block: 481978, hash: "0x7f12abcd", nik: "3321100311700002", ownerName: "Maya Wijaya" },
  { id: "14", time: "08:10:17", entity: "Sekolah SDN 03", category: "Identitas Anak", purpose: "Pendaftaran ulang siswa", permission: "read:identity", status: "valid", block: 481960, hash: "0x4488ee21", nik: "3321100311700003", ownerName: "Rio Wijaya" },
  { id: "15", time: "07:55:42", entity: "BPJS Kesehatan", category: "Rekam Medis", purpose: "Imunisasi anak", permission: "read:medical", status: "valid", block: 481947, hash: "0x22aa66bd", nik: "3321100311700004", ownerName: "Nadia Wijaya" },
  // Keluarga Susanto (Surabaya)
  { id: "16", time: "07:42:18", entity: "Bank Mandiri", category: "Identitas", purpose: "Pengajuan KPR", permission: "read:identity", status: "valid", block: 481932, hash: "0x12ab34cd", nik: "3578123405770011", ownerName: "Eko Susanto" },
  { id: "17", time: "07:21:55", entity: "Pajak Online", category: "NPWP", purpose: "Pelaporan SPT tahunan", permission: "read:tax", status: "valid", block: 481918, hash: "0x56ef78ab", nik: "3578123405770011", ownerName: "Eko Susanto" },
  { id: "18", time: "06:58:09", entity: "Unknown Entity (TX-3B17)", category: "NIK & NPWP", purpose: "Tujuan tidak dideklarasikan", permission: "—", status: "alert", block: 481902, hash: "0x3b17ffaa", nik: "3578123405770011", ownerName: "Eko Susanto" },
  { id: "19", time: "06:33:44", entity: "RS Premier Surabaya", category: "Rekam Medis", purpose: "Rawat jalan", permission: "read:medical", status: "valid", block: 481889, hash: "0x90ab12cd", nik: "3578123410820022", ownerName: "Linda Susanto" },
  { id: "20", time: "06:10:21", entity: "BPJS Ketenagakerjaan", category: "Kepegawaian", purpose: "Pencairan JHT", permission: "read:employment", status: "pending", block: 481871, hash: "0x77cc88dd", nik: "3578123410820022", ownerName: "Linda Susanto" },
  { id: "21", time: "05:48:50", entity: "Universitas Airlangga", category: "Identitas", purpose: "Pendaftaran mahasiswa baru", permission: "read:identity", status: "valid", block: 481855, hash: "0x44ee55ff", nik: "3578120207040033", ownerName: "Dewi Susanto" },
  // Keluarga Hartono (Bandung)
  { id: "22", time: "05:30:12", entity: "Bank BNI", category: "Identitas", purpose: "Pembukaan rekening payroll", permission: "read:identity", status: "valid", block: 481840, hash: "0xaa11bb22", nik: "3273019006850055", ownerName: "Rudi Hartono" },
  { id: "23", time: "05:12:33", entity: "BPJS Kesehatan", category: "Rekam Medis", purpose: "Klaim rawat inap", permission: "read:medical", status: "valid", block: 481826, hash: "0xcc33dd44", nik: "3273019006850055", ownerName: "Rudi Hartono" },
  { id: "24", time: "04:55:01", entity: "Telkomsel", category: "Kontak", purpose: "Aktivasi paket data", permission: "read:phone", status: "valid", block: 481812, hash: "0xee55ff66", nik: "3273012508870066", ownerName: "Wulan Hartono" },
  { id: "25", time: "04:30:47", entity: "Unknown Entity (TX-5C29)", category: "Profil", purpose: "Tujuan tidak dideklarasikan", permission: "—", status: "alert", block: 481798, hash: "0x5c29bbcc", nik: "3273012508870066", ownerName: "Wulan Hartono" },
  { id: "26", time: "04:11:25", entity: "Sekolah SMP 12", category: "Identitas Anak", purpose: "Daftar ulang", permission: "read:identity", status: "valid", block: 481782, hash: "0x99aa00bb", nik: "3273011403100077", ownerName: "Kevin Hartono" },
  // Keluarga Nasution (Medan)
  { id: "27", time: "03:48:19", entity: "Pemerintah Daerah", category: "Identitas", purpose: "Pengurusan KTP", permission: "read:identity", status: "valid", block: 481765, hash: "0x11cc22dd", nik: "1271050308780088", ownerName: "Reza Nasution" },
  { id: "28", time: "03:22:54", entity: "Bank BRI", category: "Identitas", purpose: "Pengajuan KUR", permission: "read:identity", status: "pending", block: 481749, hash: "0x33ee44ff", nik: "1271050308780088", ownerName: "Reza Nasution" },
  { id: "29", time: "02:58:30", entity: "Shopee", category: "Profil", purpose: "Verifikasi penjual", permission: "read:profile", status: "valid", block: 481733, hash: "0x66aa77bb", nik: "1271052012920099", ownerName: "Sari Nasution" },
  { id: "30", time: "02:33:14", entity: "Data Broker ZQ", category: "NIK & Alamat", purpose: "Aktivitas marketing", permission: "—", status: "alert", block: 481718, hash: "0x88cc99dd", nik: "1271052012920099", ownerName: "Sari Nasution" },
  // Keluarga Pramesti (Yogyakarta)
  { id: "31", time: "02:11:48", entity: "RS Sardjito", category: "Rekam Medis", purpose: "Kontrol kehamilan", permission: "read:medical", status: "valid", block: 481702, hash: "0xab12cd34", nik: "3471041811890101", ownerName: "Galih Pramesti" },
  { id: "32", time: "01:48:25", entity: "Bank BTN", category: "Identitas", purpose: "Cicilan rumah", permission: "read:identity", status: "valid", block: 481687, hash: "0xef56ab78", nik: "3471041811890101", ownerName: "Galih Pramesti" },
  { id: "33", time: "01:22:09", entity: "Gojek", category: "Lokasi", purpose: "Pencocokan driver", permission: "read:location", status: "valid", block: 481671, hash: "0xcd34ef56", nik: "3471042309910102", ownerName: "Intan Pramesti" },
  { id: "34", time: "00:55:42", entity: "Universitas Gadjah Mada", category: "Identitas", purpose: "Verifikasi alumni", permission: "read:identity", status: "valid", block: 481654, hash: "0x12ef34ab", nik: "3471042309910102", ownerName: "Intan Pramesti" },
  // Individu lainnya
  { id: "35", time: "00:30:17", entity: "Tokopedia", category: "Profil", purpose: "Verifikasi seller", permission: "read:profile", status: "valid", block: 481640, hash: "0x56cd78ef", nik: "3674051207950201", ownerName: "Yusuf Maulana" },
  { id: "36", time: "00:10:03", entity: "Unknown Entity (TX-AA88)", category: "NIK", purpose: "Tujuan tidak dideklarasikan", permission: "—", status: "alert", block: 481625, hash: "0xaa88bbcc", nik: "3674051207950201", ownerName: "Yusuf Maulana" },
  { id: "37", time: "23:48:31", entity: "OJK", category: "Identitas", purpose: "Cek SLIK", permission: "read:credit", status: "valid", block: 481609, hash: "0xdd99eeff", nik: "3215042811880301", ownerName: "Putri Lestari" },
  { id: "38", time: "23:21:08", entity: "Allianz", category: "Asuransi", purpose: "Pengajuan polis", permission: "read:insurance", status: "pending", block: 481592, hash: "0x11ff22aa", nik: "3215042811880301", ownerName: "Putri Lestari" },
  { id: "39", time: "22:55:46", entity: "Pemerintah Daerah", category: "Identitas", purpose: "Pengurusan paspor", permission: "read:identity", status: "valid", block: 481576, hash: "0x33aa44bb", nik: "5171010606820401", ownerName: "Made Wirawan" },
  { id: "40", time: "22:30:19", entity: "Bank Mandiri", category: "Identitas", purpose: "Penggantian kartu ATM", permission: "read:identity", status: "valid", block: 481560, hash: "0x55bb66cc", nik: "5171010606820401", ownerName: "Made Wirawan" },
];

const SAMPLE_NIKS = [
  { nik: "3201234567893821", label: "Andi Pratama" },
  { nik: "3175098712340007", label: "Siti Nurhaliza" },
  { nik: "3273014509881122", label: "Budi Santoso" },
  { nik: "3321100311700001", label: "Hendra Wijaya" },
  { nik: "3321100311700002", label: "Maya Wijaya" },
  { nik: "3321100311700003", label: "Rio Wijaya" },
  { nik: "3321100311700004", label: "Nadia Wijaya" },
  { nik: "3578123405770011", label: "Eko Susanto" },
  { nik: "3578123410820022", label: "Linda Susanto" },
  { nik: "3578120207040033", label: "Dewi Susanto" },
  { nik: "3273019006850055", label: "Rudi Hartono" },
  { nik: "3273012508870066", label: "Wulan Hartono" },
  { nik: "3273011403100077", label: "Kevin Hartono" },
  { nik: "1271050308780088", label: "Reza Nasution" },
  { nik: "1271052012920099", label: "Sari Nasution" },
  { nik: "3471041811890101", label: "Galih Pramesti" },
  { nik: "3471042309910102", label: "Intan Pramesti" },
  { nik: "3674051207950201", label: "Yusuf Maulana" },
  { nik: "3215042811880301", label: "Putri Lestari" },
  { nik: "5171010606820401", label: "Made Wirawan" },
];

const RECENT_BLOCKS = [
  { n: 482109, h: "0xa3f192e8...92e8", tx: 4, t: "0s ago" },
  { n: 482108, h: "0xd210ab38...51cf", tx: 7, t: "12s ago" },
  { n: 482107, h: "0x7c2b41d9...64ad", tx: 2, t: "24s ago" },
  { n: 482106, h: "0x6a7f19ef...8b30", tx: 6, t: "36s ago" },
  { n: 482105, h: "0xc84370ca...110d", tx: 3, t: "48s ago" },
  { n: 482104, h: "0x9e44bb02...e21a", tx: 8, t: "60s ago" },
];

const STORAGE_KEY = "chainguard:dashboard:v1";

function Dashboard() {
  const [filter, setFilter] = useState<"all" | LogStatus>("all");
  const [query, setQuery] = useState("");
  const [nik, setNik] = useState("");
  const [submittedNik, setSubmittedNik] = useState("");
  const [hydrated, setHydrated] = useState(false);

  // Load persisted state on mount (client only — avoids SSR hydration mismatch)
  useEffect(() => {
    try {
      const raw = typeof window !== "undefined" ? localStorage.getItem(STORAGE_KEY) : null;
      if (raw) {
        const s = JSON.parse(raw) as Partial<{ filter: "all" | LogStatus; query: string; nik: string; submittedNik: string }>;
        if (s.filter) setFilter(s.filter);
        if (typeof s.query === "string") setQuery(s.query);
        if (typeof s.nik === "string") setNik(s.nik);
        if (typeof s.submittedNik === "string") setSubmittedNik(s.submittedNik);
      }
    } catch {
      /* ignore */
    }
    setHydrated(true);
  }, []);

  // Persist whenever the filter / search state changes (after hydration)
  useEffect(() => {
    if (!hydrated || typeof window === "undefined") return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ filter, query, nik, submittedNik }));
    } catch {
      /* ignore quota errors */
    }
  }, [hydrated, filter, query, nik, submittedNik]);

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
              onSubmit={(v) => setSubmittedNik((v ?? nik).replace(/\D/g, "").slice(0, 16))}
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
  onSubmit: (value?: string) => void;
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

      <div className="mt-4 border-t border-border pt-3">
        <p className="mb-2 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
          NIK contoh tersedia (klik untuk telusuri)
        </p>
        <div className="flex flex-wrap gap-1.5">
          {SAMPLE_NIKS.map((s) => (
            <button
              key={s.nik}
              type="button"
              onClick={() => { setNik(s.nik); onSubmit(s.nik); }}
              className="group rounded-md border border-border bg-background px-2 py-1 text-left transition-colors hover:border-accent hover:bg-accent/5"
            >
              <span className="block font-mono text-[11px] text-foreground">{s.nik}</span>
              <span className="block text-[10px] text-muted-foreground group-hover:text-accent">{s.label}</span>
            </button>
          ))}
        </div>
      </div>
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
      <Link to="/dashboard" className="flex items-center gap-2 px-2 py-2">
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
              <div className="mt-1.5 flex flex-wrap items-center gap-2 font-mono text-[10px] text-muted-foreground">
                <span className="inline-flex items-center gap-1 rounded bg-accent/10 px-1.5 py-0.5 text-accent">
                  <Fingerprint className="h-3 w-3" /> NIK {log.nik}
                </span>
                <span className="rounded bg-surface px-1.5 py-0.5">{log.permission}</span>
                <span>block #{log.block.toLocaleString('en-US')}</span>
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
        {RECENT_BLOCKS.map((b) => (
          <div key={b.n} className="bg-card p-4 transition-colors hover:bg-surface">
            <p className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">block</p>
            <p className="mt-1 font-display text-xl font-bold tracking-tight text-accent">#{b.n.toLocaleString('en-US')}</p>
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
