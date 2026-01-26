import "./globals.css";

export const metadata = {
  title: "Iron Gym",
  description: "Train Hard. Stay Fit."
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-black text-white">
        {children}
      </body>
    </html>
  );
}
