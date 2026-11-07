import React from "react";
import { Navigate } from "react-router-dom";
import multiEventPortalClient from "@/src/services/multiEventPortalClient";

interface Props {
  children: React.ReactNode;
}

export default function AtgfgProtectedRoute({ children }: Props) {
  const token = multiEventPortalClient.getEventToken();

  if (!token) {
    return <Navigate to="/event-portal" replace />;
  }

  return <>{children}</>;
}

