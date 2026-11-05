import Employee from "../models/Employee.js";
import Payslip from "../models/Payslip.js";


// Create payslips
// POST/api/paylips
export const createPayslip = async (req, res) => {
    try {
        const { employeeId, month, year, basicSalary, allowances, deductions } = req.body;

        if (!employeeId || !month || !year || !basicSalary) {
            return res.status(400).json({ error: "Tous les champs requis doivent être renseignés" });
        }

        // Calcul automatique du salaire net
        const netSalary = Number(basicSalary) + Number(allowances || 0) - Number(deductions || 0);

        const payslip = await Payslip.create({
            employeeId,
            month: Number(month),
            year: Number(year),
            basicSalary: Number(basicSalary),
            allowances: Number(allowances || 0),
            netSalary,
        })

        return res.status(201).json({ success: true, data: payslip })
    } catch (error) {
        // Détection de doublon (fiche déjà existante pour ce mois/année)
        if (error.code === 11000) {
            return res.status(400).json({ error: "Une fiche de paie existe déjà pour cet employé sur cette période" });
        }
        console.error("Erreur createPayslip :", error);
        return res.status(500).json({ error: "Échec de la génération de la fiche de paie" });
    }
}

// Récupérer la liste des bulletins de paie (Vue Admin ou vue Employé)
// GET/api/paylips
export const getPayslips = async (req, res) => {
    try {
        const session = req.session;
        const isAdmin = session.role === "ADMIN";

        if (isAdmin) {
            const payslip = await Payslip.find().populate("employeeId").sort({ createdAt: -1 }).lean();
            const data = payslip.map((p) => {
                const obj = p.toObject();
                return {
                    ...obj,
                    id: obj._id.toString(),
                    employee: obj.employeeId,
                    employeeId: obj.employeeId?._id?.toString(),
                }
            })
            return res.json({ data });
        } else {
            const employee = await Employee.findOne({ userId: session.userId })
            if (!employee) return res.status(404).json({ error: "Not found" });

            const payslips = await Payslip.find({ employeeId: employee._id }).sort({ createdAt: -1 }).lean();

            return res.json({ data: payslips })
        }
    } catch (error) {
        return res.status(500).json({ error: "Failed" })
    }
}

//  Get payslips by Id
// POST/api/paylips/:id
export const getPayslipsById = async (req, res) => {
    try {
        const payslip = await Payslip.findById(req.params.id).populate("employeeId").lean();

        if (!payslip) return res.status(404).json({ error: "Not found" });

        const result = {
            ...payslip,
            id: payslip._id.toString(),
            employee: payslip.employeeId,
        }

        return res.json(result);
    } catch (error) {
        return res.status(500).json({ error: "Failed" })
    }
}