import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Expense Genie AI",
  description: "Turn your bank transactions into personal money stories",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full bg-slate-100 text-slate-900" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
