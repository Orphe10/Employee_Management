import { Building2Icon, CalendarIcon, FileTextIcon, UsersIcon } from "lucide-react"
import { Link } from "react-router-dom"


const AdminDashboard = ({ data }) => {

    const stats = [
        {
            icon: UsersIcon,
            value: data.totalEmployees,
            label: "Nombre total d'employés",
            description: "Effectif actif ",
        },
        {
            icon: Building2Icon,
            value: data.totalDepartments,
            label: "Départements",
            description: "Unités organisationnelles",
        },
        {
            icon: CalendarIcon,
            value: data.todayAttendance,
            label: "Présences du jour",
            description: "Je me suis enregistré aujourd'hui",
        },
        {
            icon: FileTextIcon,
            value: data.pendingLeaves,
            label: "Congés en attente",
            description: "En attente de validation",
        },
    ]

    return (
        <div className="animate-fade-in">
            <div className="page-header">
                <h1 className="page-title">Tableau de bord</h1>
                <p className="page-subtitle">
                    Bon retour parmi nous, Admin ! Voici un aperçu de la situation.
                </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 mb-8">
                {stats.map((s) => (
                    <div key={s.label} className="card card-hover p-5 sm:p-6 relative overflow-hidden group flex items-center justify-between">
                        <div>
                            <div className="absolute left-0 top-0 bottom-0 w-1 rounded-r-full bg-slate-500/70 group-hover:bg-indigo-500/70" />
                            <p className="text-sm font-medium text-slate-700">
                                {s.label}
                            </p>
                            <p className="text-2xl font-bold text-slate-900 mt-1"> {s.value} </p>
                        </div>
                        <s.icon className="size-10 p-2.5 rounded-lg bg-slate-100 text-slate-500 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors" />
                    </div>
                ))
                }
            </div>

        </div>
    )
}

export default AdminDashboard
