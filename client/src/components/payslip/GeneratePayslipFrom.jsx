import { Loader2, Plus, X } from "lucide-react";
import { useState } from "react"

const GeneratePayslipFrom = ({ employees }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    if (!isOpen) return (
        <button onClick={() => setIsOpen(true)} className="btn-primary flex items-center gap-2">
            <Plus className="w-4 h-4" /> Générer une fiche de paie
        </button>
    )

    const handleSubmit = async (e) => {
        e.preventDefault();
    }

    return (
        <div className="fixed inset-0 bg-black/400 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="card max-w-lg w-full p-6 animate-slide-up">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-bold text-slate-900">Générer une fiche de paie mensuelle</h3>
                    <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-slate-600 p-1">
                        <X size={20} />
                    </button>
                </div>
                <form  onSubmit={handleSubmit}>
                    {/* Sélectionner un salarié */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Salarié</label>
                        <select name="employeeId" required>
                            {employees.map((e) => (
                                <option key={e.id} value={e.id} >
                                    {e.firstName} {e.lastName} ({e.position})
                                </option>
                            ))}
                        </select>
                    </div>
                    {/* Sélectionnez le mois et l'année */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700">Mois</label>
                            <select name="month">
                                {Array.from({ length: 12 }, (_, i) => i + 1).map
                                    ((m) => (
                                        <option key={m} value={m}>{m}</option>
                                    ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Année</label>
                            <input type="number" name="year" defaultValue={new Date().getFullYear()} />
                        </div>
                    </div>
                    {/* Salaire de base */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Salaire de base</label>
                        <input type="number" name="basicSalary" placeholder="5000" required />
                    </div>
                    {/* Indemnités & Déductions */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Indemnités</label>
                            <input type="number" name="allowances" defaultValue="0" required />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Déductions</label>
                            <input type="number" name="deductions" defaultValue="0"  />
                        </div>
                    </div>
                    {/* Boutons */}
                    <div className="flex justify-end gap-3 pt-2">
                        <button onClick={() => setIsOpen(false)} type="button" className="btn-secondary">Annuler</button>
                        <button disabled={loading} type="submit" className="btn-primary flex items-center">{loading && <Loader2 className="w-4 h-4 mr-2 animate-spin"/> }Générer</button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default GeneratePayslipFrom