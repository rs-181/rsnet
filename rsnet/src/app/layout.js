import "./globals.css";
import { AuthProvider } from "@/lib/AuthContext";

export const metadata = {
  title: "RS Net — Build a website without writing a line of code",
  description:
    "RS Net is a 100% visual, drag-and-drop website builder. Free multi-page hosting, no code required.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
