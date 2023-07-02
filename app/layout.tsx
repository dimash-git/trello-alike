import Modal from "@/components/Modal";
import "./globals.css";

export const metadata = {
  title: "ToDo App",
  description: "Generated by me",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-[#f5f6f8]">
        {children}
        <Modal />
      </body>
    </html>
  );
}
