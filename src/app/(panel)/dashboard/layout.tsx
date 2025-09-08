import type { Metadata } from "next";

import { Sidebar } from './_components/sidebar';

export const metadata: Metadata = {
  title: "OdontoPRO",
  description: "Check the dashboard of OdontoPRO!",
};

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <Sidebar >
      { children }
    </Sidebar>
  );
}
