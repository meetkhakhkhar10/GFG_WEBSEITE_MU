import React from "react";
import { Navigate } from "react-router-dom";
import atgfgAuth from "@/src/services/atgfgAuth";

interface Props {
  children: React.ReactNode;
}

export default function AtgfgProtectedRoute({ children }: Props) {
  const isAuth = atgfgAuth.isAuthenticated();

  if (!isAuth) {
    return <Navigate to="/atgfg" replace />;
  }

  return <>{children}</>;
}
