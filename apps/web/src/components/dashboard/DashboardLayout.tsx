import {
  useState,
  type ReactNode,
} from "react";

import type { UserRole } from "../../types/auth";

import DashboardSidebar from "./DashboardSidebar";
import DashboardHeader from "./DashboardHeader";

import "./dashboard.css";

type DashboardLayoutProps = {
  role: UserRole;
  children: ReactNode;
};

function DashboardLayout({
  role,
  children,
}: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] =
    useState(false);

  return (
    <div className="dashboard-shell">
      <DashboardSidebar
        role={role}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <div className="dashboard-main">
        <DashboardHeader
          role={role}
          onMenuClick={() =>
            setSidebarOpen(true)
          }
        />

        <main className="dashboard-content">
          {children}
        </main>
      </div>
    </div>
  );
}

export default DashboardLayout;