import { ArrowRightIcon, SheetIcon, ShieldIcon, UserIcon } from "lucide-react"
import LoginLeftSide from "../components/LoginLeftSide"
import { Link } from "react-router-dom"

const LoginLanding = () => {
  const portalOptions = [
    {
      to:"/login/admin",
      title:"Portail d'Administration",
      description: "Gérer les collaborateurs, les services, la paie et les configurations du système.",
      icon:ShieldIcon
    },
    {
      to:"/login/employee",
      title:"Portail des Employés",
      description: "Consultez votre profil, suivez vos présences, demandez des congés et accédez à vos bulletins de paie.",
      icon:UserIcon
    },
  ]
  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      <LoginLeftSide/>
      <div className="w-full md:w-1/2 flex flex-col items-center justify-center p-6 sm:p-12 lg:p-16 relative overflow-y-auto min-h-screen">
        <div className="w-full max-w-md animate-fade-in relative z-10">
          {/* Header */}
          <div className="mb-10§ text-center md:text-left">
            <h2 className="text-3xl font-medium text-slate-900 tracking-tight mb-3">Bon Retour Parmi Nous</h2>
            <p className="text-slate-500">Sélectionnez votre portail pour accéder au système en toute sécurité. </p>
          </div>
          {/* Portals List */}
          <div className="space-y-4">
            {portalOptions.map((portal) => (
              <Link key={portal.to} to={portal.to} className="group block bg-slate-50 border border-slate-200 rounded-lg p-5 sm:p-6 transition-all duration-300 hover:border-indigo-400 hover:bg-indigo-50">
                <div>
                  <h3>{portal.title}</h3>
                  <ArrowRightIcon className="w-4 h-4 text-slate-400 group-hover:text-indigo-600 group-hover:translate-x-1 transition-all duration-300"/>
                </div>
              </Link>
            ))

            }
          </div>
          {/* Footer */}
          <div className="mt-12 text-center md:text-left text-sm text-slate-400">
            <p>@ {new Date().getFullYear()} Lucacio. Tous droits réservés. </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LoginLanding