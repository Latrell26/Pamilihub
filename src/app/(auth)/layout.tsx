import Link from "next/link";

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center bg-gradient-to-b from-muted/20 via-background to-background p-4 sm:p-6">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-1">
          <Link href="/" className="inline-flex items-center gap-2 font-bold text-lg text-foreground hover:opacity-90 transition-opacity">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary text-primary-foreground font-black text-xs">
              P
            </span>
            <span>Pamilihub</span>
          </Link>
          <p className="text-xs text-muted-foreground">San Pablo City Local Food Delicacies</p>
        </div>

        <div className="bg-card p-6 sm:p-8 rounded-2xl shadow-sm border border-border">
          {children}
        </div>
      </div>
    </div>
  );
}
