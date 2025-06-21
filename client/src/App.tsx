import { Switch, Route, Redirect } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider, useAuth } from "@/contexts/auth-context";
import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";
import { BackendStatus } from "@/components/ui/backend-status";
import LoginPage from "@/pages/login";
import DashboardPage from "@/pages/dashboard";
import TransactionsPage from "@/pages/transactions";
import SitesPage from "@/pages/sites";
import DevicesPage from "@/pages/devices";
import NotFound from "@/pages/not-found";

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  
  if (!isAuthenticated) {
    return <Redirect to="/login" />;
  }
  
  return <>{children}</>;
}

function DashboardLayout({ children, title, breadcrumb }: { 
  children: React.ReactNode; 
  title: string;
  breadcrumb?: string;
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      <div className="ml-64">
        <Header title={title} breadcrumb={breadcrumb} />
        <main className="p-6">
          <BackendStatus />
          {children}
        </main>
      </div>
    </div>
  );
}

function Router() {
  const { isAuthenticated } = useAuth();

  return (
    <Switch>
      <Route path="/login">
        {isAuthenticated ? <Redirect to="/dashboard" /> : <LoginPage />}
      </Route>
      
      <Route path="/dashboard">
        <ProtectedRoute>
          <DashboardLayout title="Dashboard">
            <DashboardPage />
          </DashboardLayout>
        </ProtectedRoute>
      </Route>
      
      <Route path="/transactions">
        <ProtectedRoute>
          <DashboardLayout title="Transactions" breadcrumb="Transactions">
            <TransactionsPage />
          </DashboardLayout>
        </ProtectedRoute>
      </Route>
      
      <Route path="/sites">
        <ProtectedRoute>
          <DashboardLayout title="Merchant Sites" breadcrumb="Sites">
            <SitesPage />
          </DashboardLayout>
        </ProtectedRoute>
      </Route>
      
      <Route path="/devices">
        <ProtectedRoute>
          <DashboardLayout title="POS Devices" breadcrumb="Devices">
            <DevicesPage />
          </DashboardLayout>
        </ProtectedRoute>
      </Route>
      
      <Route path="/">
        {isAuthenticated ? <Redirect to="/dashboard" /> : <Redirect to="/login" />}
      </Route>
      
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
