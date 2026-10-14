
import { Toaster } from "react-hot-toast"
import { Navigate, Route, Routes } from "react-router-dom"
import LoginLanding from "./pages/LoginLanding"
import Layout from "./pages/Layout"
import Dashboard from "./pages/Dashboard"
import Employees from "./pages/Employees"
import Attendance from "./pages/Attendance"
import Leave from "./pages/Leave"
import PaysLips from "./pages/PaysLips"
import Settings from "./pages/Settings"
import PrintPayslip from "./pages/PrintPayslip"
import LoginForm from "./components/LoginForm"

const App = () => {
  return (
    <>
          {/* CLÉ 1 : Composant global requis pour afficher les toasts partout dans l'application */}
      <Toaster />
      {/* Route isolée (sans barre latérale/header global) */}
      <Routes>
         {/* CLÉ 2 : Route parente (Layout Pattern).
            Toutes les routes enfants partageront la même structure visuelle 
            (ex: Sidebar, Navbar) définie dans Layout via la balise <Outlet /> */}
        <Route path="/login" element={<LoginLanding />} />

        <Route path="/login/admin" element={<LoginForm role="admin" title="Portail d'Administration" subtitle="Connectez-vous pour gérer l'organisation" />} />
        <Route path="/login/employee" element={<LoginForm role="employee" title="Portail des Employés" subtitle="Connectez-vous pour accéder à votre compte" />} />

        <Route element={<Layout />} >
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/employee" element={<Employees />} />
          <Route path="/attendance" element={<Attendance />} />
          <Route path="/leave" element={<Leave />} />
          <Route path="/payslips" element={<PaysLips />} />
          <Route path="/settings" element={<Settings />} />
        </Route>
        <Route path="/print/payslips/:id" element={<PrintPayslip />} />
                {/* CLÉ 4 : Route Fallback ("Catch-all").
            Attrape toutes les URLs inexistantes (*) et redirige vers /dashboard.
            'replace' évite d'empiler l'URL invalide dans l'historique du navigateur. */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </>
  )
}

export default App