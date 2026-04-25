import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Lore Guides",
  description:
    "Save the places you love. Collect them into guides. Share with friends.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
