"use client";

import React, { useState, ReactNode } from "react";
import SidebarMenu from "../layout/SidebarMenu";
import Header from "../layout/Header";
import AuthProvider from "./AuthProvider";
import Footer from "../layout/Footer";

interface AuthenticatedLayoutProps {
  children: ReactNode;
}

const AuthenticatedLayout: React.FC<AuthenticatedLayoutProps> = ({ children }) => {

  const [active, setActive] = useState<boolean>(false);

  const toggleActive = () => {
    setActive(!active);
  };

  return (
    <AuthProvider>
      <div
        className={`main-content-wrap transition-all ${active ? "active" : ""}`}
      >
        <>
          <SidebarMenu toggleActive={toggleActive} />

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

export default AuthenticatedLayout;
