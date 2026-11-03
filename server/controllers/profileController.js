import Employee from "../models/Employee.js";

// Récupérer le profil de l'utilisateur connecté (salarié ou administrateur)
// GET /api/profile
export const getProfile = async (req, res) => {
    try {
        const session = req.session;

        //Vérifie que la session existe bien
        if (!session?.userId) {
            return res.status(401).json({ error: "Session non valide ou expirée" });
        }

        //Recherche de la fiche salarié liée à l'identifiant du compte
        const employee = await Employee.findOne({ userId: session.userId })

        if (!employee) {
            //L'utilisateur qui s'est authentifié n'est pas un salarié - revenir au profil d'administrateur 
            return res.json({
                firstName: "Admin",
                lastName: "",
                email: session.email,
            })
        }
        return res.json(employee)
    } catch (error) {
        return res.json({ error: "Impossible de récupérer le profil" })
    }
}

// Update profile
// PUT /api/profile
export const updateProfile = async (req, res) => {
    try {
        const session = req.session;

        //Vérifie que la session existe bien
        if (!session?.userId) {
            return res.status(401).json({ error: "Session non valide ou expirée" });
        }
        const employee = await Employee.findOne({ userId: session.userId })

        if (!employee) return res.status(404).json({ error: "Employé introuvable" });

        //interdiction de modification si le compte est désactivé (soft delete)
        if (employee.isDeleted) {
            return res.status(403).json({ error: "Votre compte est désactivé. Vous ne pouvez pas mettre à jour votre profil." })
        }
        await Employee.findByIdAndUpdate(employee._id, {
            bio: req.body.bio
        });
        return res.json({ success: true });
    } catch (error) {
        return res.json({ error: "Échec de la mise à jour du profil" });
    }
}