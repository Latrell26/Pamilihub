import Link from "next/link";

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // Negative margin cancels the root layout's bottom padding on auth pages.
    <div className="-mb-20 lg:-mb-8 flex min-h-screen flex-col bg-primary md:items-center md:justify-center md:p-6">
      <div className="flex w-full flex-1 flex-col md:max-w-md md:flex-none">
        {/* Pink hero */}
        <header className="relative  px-6 pb-14 pt-10 text-center text-primary-foreground">
          {/* Soft decorative circles */}
          <div className="pointer-events-none absolute -left-10 -top-10 h-40 w-40 rounded-full bg-white/10" />
          <div className="pointer-events-none absolute -right-8 top-16 h-28 w-28 rounded-full bg-white/10" />
          

          <Link
            href="/"
            className="relative inline-flex items-center gap-2.5 transition-opacity hover:opacity-90"
          >
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-xl font-black text-primary shadow-lg shadow-black/10">
              P
            </span>
            <span className="text-2xl font-black tracking-tight">
              Pamilihub
            </span>
          </Link>
          <p className="relative mt-3 text-sm font-medium text-white/90">
            San Pablo&apos;s best, delivered to your door
          </p>
        </header>

        {/* White sheet overlapping the hero */}
        <main className="-mt-6 flex-1 rounded-t-[2rem] bg-background px-6 pb-10 pt-8 shadow-2xl shadow-black/20 md:flex-none md:rounded-b-[2rem]">
          {children}
        </main>
      </div>
    </div>
  );
}