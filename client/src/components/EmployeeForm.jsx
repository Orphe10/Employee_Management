import { useState } from "react";
import { useNavigate } from "react-router-dom"
import { DEPARTMENTS } from "../assets/assets";
import { Loader2Icon } from "lucide-react";


const EmployeeForm = ({ initialData, onSuccess, onCancel }) => {

    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const isEditMode = !!initialData;
    const handleSubmit = async (e) => {
        e.preventDefault();
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6 max-w-3xl animate-fade-in" >
            {/* Informations sur le personnel */}
            <div className="card p-5 sm:p-6">
                <h3 className="font-medium mb-6 pb-4 border-b border-slate-100">Données personnelles</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-sm text-slate-700">
                    <div>
                        <label className="block mb-2">Nom de famille</label>
                        <input name="lastName" required defaultValue={initialData?.lastName} />
                    </div>
                    <div>
                        <label className="block mb-2">Prénom</label>
                        <input name="firstName" required defaultValue={initialData?.firstName} />
                    </div>
                    <div>
                        <label className="block mb-2">Numéro de téléphone</label>
                        <input name="phone" required defaultValue={initialData?.phone} />
                    </div>
                    <div>
                        <label className="block mb-2">Date d'inscription</label>
                        <input type="date" name="joinDate" required defaultValue={initialData?.joinDate ? new Date(initialData.joinDate).toISOString().split("T")[0] : ""} />
                    </div>
                    <div className="sm:col-span-2">
                        <label className="block mb-2">Biographie (facultatif)</label>
                        <textarea className="resize-none" name="bio" defaultValue={initialData?.bio} rows={3} placeholder="Brève description......" />
                    </div>
                </div>
            </div>
            {/* Détails de l'emploi */}
            <div className="card p-5 sm:p-6">
                <h3 className="text-base font-medium text-slate-900 mb-6 pb-4 border-b border-slate-100">Détails relatifs à l'emploi</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-sm text-slate-700">
                    <div>
                        <label className="block mb-2">Département</label>
                        <select name="department" defaultValue={initialData?.department || ""}>
                            <option value="">Sélectionnez un service</option>
                            {DEPARTMENTS.map((deptName) => (
                                <option key={deptName} value={deptName} >{deptName}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block mb-2">Numéro de téléphone</label>
                        <input name="phone" required defaultValue={initialData?.phone} />
                    </div>
                    <div>
                        <label className="block mb-2">Salaire de base</label>
                        <input type="number" name="basicSalary" min="0" step="0.01" required defaultValue={initialData?.basicSalary || 0} />
                    </div>
                    <div>
                        <label className="block mb-2">Indemnités</label>
                        <input type="number" name="allowances" min="0" step="0.01" required defaultValue={initialData?.allowances} />
                    </div>
                    <div>
                        <label className="block mb-2">Déductions</label>
                        <input type="number" name="deductions" min="0" step="0.01" required defaultValue={initialData?.deductions || 0} />
                    </div>
                    {isEditMode && (
                        <div>
                            <label className="block mb-2">Statut</label>
                            <select name="employmentStatus" defaultValue={initialData?.employmentStatus}>
                                <option value="ACTIVE" >Actif</option>
                                <option value="INACTIVE" >Inactif</option>
                            </select>
                        </div>
                    )

                    }
                </div>
            </div>
            {/* Configuration du compte */}
            <div className="card p-5 sm:p-6">
                <h3 className="text-base font-medium text-slate-900 mb-6 pb-4 border-b border-slate-100">Configuration du compte</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-sm text-slate-700">
                    <div className="sm:col-span-2">
                        <label className="block mb-2">E-mail professionnel</label>
                        <input type="email" name="email" required defaultValue={initialData?.email} />
                    </div>
                    <div>
                        <label className="block mb-2">Nom de famille</label>
                        <input name="lastName" required defaultValue={initialData?.lastName} />
                    </div>
                    {!isEditMode && (
                        <div>
                            <label className="block mb-2">Mot de passe temporaire</label>
                            <input type="password" name="password" required />
                        </div>
                    )}
                    {isEditMode && (
                        <div>
                            <label className="block mb-2">Modifier le mot de passe (facultatif)</label>
                            <input type="password" name="password" placeholder="Leave blank to keep current" />
                        </div>
                    )}
                    <div>
                        <label className="block mb-2">Rôle système</label>
                        <select name="role" defaultValue={initialData?.user?.role || "SALARIÉ"}>
                            <option value="EMPLOYEE">Salarié</option>
                            <option value="ADMIN">Admin</option>
                        </select>
                    </div>
                </div>
            </div>
            {/* Bouton */}
            <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 pt-2">
                <button type="button" className="btn-secondary" onClick={() => onCancel ? onCancel() : navigate(-1)}>
                    Annuler
                </button>
                <button type="submit" disabled={loading} className="btn-primary flex items-center justify-center" >
                    {loading && <Loader2Icon className="w-4 h-4 mr-2 animate-spin" />}
                    {isEditMode ? "Mettre à jour les informations d'un salarié" : "Créer un salarié"}
                </button>
            </div>
        </form>
    )
}

export default EmployeeForm
