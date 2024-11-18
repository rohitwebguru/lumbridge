
import localFont from "next/font/local";
import { Toaster } from 'react-hot-toast';
import { getServerSession } from "next-auth";
import SessionProviderClientComponent from "./components/SessionProviderClientComponent"; // Adjust path if necessary

import "./globals.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata = {
  title: "Lumbridge",
  description: "Create Link to give Permissions",
};

export default async function RootLayout({ children }) {
  // const session = await getServerSession();
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
       
          <SessionProviderClientComponent>
            {children}
          </SessionProviderClientComponent>
        
      </body>
    </html>
  );
}
