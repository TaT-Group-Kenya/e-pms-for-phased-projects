"use client";

import React, { useState, ReactNode } from "react";
import SidebarMenuSimple from "../layout/SidebarMenu/SidebarMenuSimple";
import Header from "../layout/Header";
import AuthProvider from "./AuthProvider";
import Footer from "../layout/Footer";

interface AuthenticatedSimpleLayoutProps {
  children: ReactNode;
  dashboardHref: string;
}

const AuthenticatedSimpleLayout: React.FC<AuthenticatedSimpleLayoutProps> = ({ children, dashboardHref }) => {
  const [active, setActive] = useState<boolean>(false);
  const toggleActive = () => setActive(!active);

  return (
    <AuthProvider>
      <div className={`main-content-wrap transition-all ${active ? "active" : ""}`}>
        <>
          <SidebarMenuSimple dashboardHref={dashboardHref} />
          <Header toggleActive={toggleActive} />
        </>
        <div className="main-content transition-all flex flex-col overflow-hidden min-h-screen">
          {children}
          <Footer />
        </div>
      </div>
    </AuthProvider>
  );
};

export default AuthenticatedSimpleLayout;
