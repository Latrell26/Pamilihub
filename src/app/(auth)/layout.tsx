export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/50 p-4">
      <div className="max-w-md w-full bg-card p-6 rounded-lg shadow-sm border border-border">
        {children}
      </div>
    </div>
  );
}
