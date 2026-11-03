import Employee from "../models/Employee.js";
import bcrypt from "bcrypt"
import User from "../models/User.js";

// Récupérer la liste des employés actifs (non supprimés)
// GET /api/employees
export const getEmployees = async (req, res) => {
    try {
        const { department } = req.query;
        const where = {};
        if (department) where.department = department;

        const employees = await (await Employee.find(where)).toSorted({ createdAt: -1 }).populate("userId", "email role").lean();

        const result = employees.map((emp) => ({
            ...emp,
            id: emp._id.toString(),
            user: emp.userId ? { email: emp.userId.email, role: emp.userId.role } : null
        }))
        return res.json(result);
    } catch (error) {
        return res.status(500).json({ error: "Impossible de récupérer la liste des employés" })
    }
}


// POST /api/employees
export const createEmployee = async (req, res) => {
    try {
        const { firstName, lastName, email, phone, position, department, basicSalary, allowances, deductions, joinDate, password, role, bio } = req.body;

        if (!email || !password || !firstName || !lastName) {
            return res.status(400).json({ error: "Champs obligatoires manquants" })
        }

        const hashed = await bcrypt.hash(password, 10);
        const user = await User.create({
            email,
            password: hashed,
            role: role || "EMPLOYEE"
        });

        const employee = await Employee.create({
            userId: user._id,
            firstName,
            lastName,
            email,
            phone,
            phone,
            position,
            department: department || "Ingénierie",
            basicSalary: Number(basicSalary) || 0,
            allowances: Number(allowances) || 0,
            deductions: Number(deductions) || 0,
            joinDate: new Date(joinDate),
            bio: bio || "",
        })

        return res.status(201).json({ success: true, employee });

    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({ error: "Cette adresse e-mail existe déjà" });
        }
        console.error("Create employee error:", error);

        return res.status(500).json({ error: "Échec de la création du salarié" });
    }
}

// Update employee
// PUT /api/employees/:id
export const updateEmployee = async (req, res) => {
    try {
        const { id } = req.params;
        const { firstName, lastName, email, phone, position, department, basicSalary, allowances, deductions, password, role, bio, employmentStatus } = req.body;

        const employee = await Employee.findById(id);
        if (!employee) return res.status(404).json({ error: "Employé introuvable" });

        //Mise à jour propre des champs
        const employeeUpdate = {
            ...(firstName && { firstName }),
            ...(lastName && { lastName }),
            ...(email && { email }),
            ...(phone !== undefined && { phone }),
            ...(position !== undefined && { position }),
            ...(department && { department }),
            ...(basicSalary !== undefined && { basicSalary: Number(basicSalary) }),
            ...(allowances !== undefined && { allowances: Number(allowances) }),
            ...(deductions !== undefined && { deductions: Number(deductions) }),
            ...(employmentStatus && { employmentStatus }),
            ...(joinDate && { joinDate: new Date(joinDate) }),
            ...(bio !== undefined && { bio }),
        };

        await Employee.findByIdAndUpdate(id, employeeUpdate);

        //Update use record
        const userUpdate = { email };
        if (role) userUpdate.role = role;
        if (password) userUpdate.password = await bcrypt.hash(password, 10);
        await User.findByIdAndUpdate(employee.userId, userUpdate);

        return res.json({ success: true });

    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({ error: "Cette adresse e-mail existe déjà" });
        }
        console.error("Create employee error:", error);
        return res.status(500).json({ error: "Échec de la mise à jour des informations sur l'employé" });
    }
}


// Delete employee
// DELETE /api/employees/:id
export const deleteEmployee = async (req, res) => {
    try {
        const { id } = req.params;

        const employee = await Employee.findById(id);
        if (!employee) return res.status(404).json({ error: "Employé introuvable" });

        employee.isDeleted = true;
        employee.employmentStatus = "INACTIVE";
        await employee.save();

        return res.json({ succes: true });

    } catch (error) {
        return res.status(500).json({ error: "Échec de la suppression de l'employé" })
    }
}
