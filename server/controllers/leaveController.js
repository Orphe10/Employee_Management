import Employee from "../models/Employee.js"
import LeaveApplication from "../models/leaveApplicationSchema.js";

// Demande de congé
// POST /api/leaves
export const createLeave = async (req, res) => {
    try {
        const session = req.session;   
        const employee = await Employee.findOne({ userId: session.userId });

        if (!employee) return res.status(404).json({ error: "Employé introuvable" });

        if (employee.isDeleted) {
            return res.status(403).json({ error: "Votre compte est désactivé. Vous ne pouvez pas demander de congé." })
        }

        const { type, startDate, endDate, reason } = req.body;

        if (!type || !startDate || !endDate || !reason) {
            return res.status(400).json({ error: "Champs manquants" });
        }

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        if (new Date(startDate) < today || new Date(endDate) <= today) {
            return res.status(400).json({ error: "Les dates de départ doivent être postérieures à la date du jour" });
        }

        if (new Date(endDate) < new Date(startDate)) {
            return res.status(400).json({ error: "La date de fin ne peut pas être antérieure à la date de début" });
        }

        const leave = await LeaveApplication.create({
            employeeId: employee._id,
            type,
            startDate: new Date(startDate),
            endDate: new Date(endDate),
            reason,
            status: "EN ATTENTE",
        })

        return res.json({ success: true, data: leave });

    } catch (error) {
        return res.status(500).json({ error: "Échec" })
    }
}

// Get leaves
// GET /api/leaves
export const getLeaves = async (req, res) => {
    try {
        const session = req.session;
        const isAdmin = session.role === "ADMIN";

        if (isAdmin) {
            const { status } = req.query;
            const where = status ? { status } : {};

            const leaves = await LeaveApplication.find(where).populate("employeeId").sort({ createdAt: -1 });

            const data = leaves.map((l) => {
                const obj = l.toObject();
                return {
                    ...obj,
                    id: obj._id.toString(),
                    employee: obj.employeeId?._id?.toString(),
                }
            })
            return res.json({ data });
        } else {
            const employee = await Employee.findOne({
                userId: session.userId,
            }).lean();

            if (!employee) return res.status(404).json({ error: "Introuvable" });

            const leaves = await LeaveApplication.find({
                employeeId: employee._id
            }).sort({ createdAt: -1 });

            return res.json({
                data: leaves,
                employee: { ...employee, id: employee._id.toString() }
            })
        }
    } catch (error) {
        return res.status(500).json({ error: "Échec" })
    }
}

// Update leave status
// PATCH /api/leaves
export const updateLeaveStatus = async (req, res) => {
    try {
        const { status } = req.body;

        if (!["EN ATTENTE", "APPROUVÉ", "REJETÉ"].includes(status)) {
            return res.status(400).json({ error: "Invalid status" });
        }

        const leave = await LeaveApplication.findByIdAndUpdate(req.params.id, { status }, { returnDocument: "after" })
        
        return res.json({success: true, data: leave})
    } catch (error) {
        return res.status(500).json({ error: "Échec" })
    }
}