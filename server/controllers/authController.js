import User from "../models/User.js";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"


// Connexion pour les employés et les administrateurs
// POST /api/auth/login
export const login = async (req, res) => {
    try {
        const { email, password, role_type } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: "Une adresse e-mail et un mot de passe sont obligatoires" })
        }

        // Recherche de l'utilisateur correspondant à l'adresse e-mail fournie.
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ error: "Identifiants non valides" });
        }

        if (role_type === "admin" && user.role !== "ADMIN") {
            return res.status(401).json({ error: "Non autorisé en tant qu'administrateur" });
        }

        if (role_type === "employee" && user.role !== "EMPLOYEE") {
            return res.status(401).json({ error: "Non autorisé en tant que employé" });
        }

        // Comparaison du mot de passe fourni avec le mot de passe chiffré enregistré en base de données.
        const isValid = await bcrypt.compare(password, user.password);

        if (!isValid) {
            return res.status(401).json({ error: "Invalid credentials" });
        }

        // Préparation des informations utilisateur qui seront intégrées au jeton d'authentification.
        const payload = {
            userId: user._id.toString(),
            role: user.role,
            email: user.email,
        }

        // Signature numérique du JWT avec une clé secrète (.env) et expiration sous 7 jours
        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "7d" });

        // Retourne les informations de l'utilisateur ainsi que son jeton d'authentification.
        return res.json({ user: payload, token });

    } catch (error) {
        console.error("Erreur de connexion :", error);
        return res.status(500).json({ error: "Échec de la connexion" });
    }
}

// Obtenir une session pour les employés et les administrateurs
// Get /api/auth/session

export const session = (req, res) => {
    // Récupération des informations de session de l'utilisateur authentifié.
    const session = req.session;
    if (!session?.userId) {
        return res.status(401).json({ error: "Session non authentifiée ou expirée" });
    }
    return res.json({ user: session });
}

/**
 * Contrôleur : Modification du mot de passe
 * Route      : POST /api/auth/change-password
 * Accès      : Protégé
 */
export const changePassword = async (req, res) => {
    try {
        const session = req.session;
        const { currentPassword, newPassword } = req.body;
        if (!currentPassword || !newPassword) {
            return res.status(400).json({ error: "Les deux mots de passe sont obligatoires" });
        }

        if (newPassword.length < 8) {
            return res.status(400).json({ error: "Le nouveau mot de passe doit contenir au moins 8 caractères" });
        }

        if (currentPassword === newPassword) {
            return res.status(400).json({ error: "Le nouveau mot de passe doit être différent de l'ancien" });
        }


        const user = await User.findById(session.userId);
        if (!user) return res.status(404).json({ error: "Utilisateur introuvable" });

        const isValid = await bcrypt.compare(currentPassword, user.password);

        if (!isValid) return res.status(400).json({ error: "Le mot de passe est incorrect" });
        const hashed = await bcrypt.hash(newPassword, 10);

        // Mise à jour du mot de passe de l'utilisateur dans la base de données.
        await User.findByIdAndUpdate(session.userId, { password: hashed })
        return res.json({ success: true });
    } catch (error) {
        return res.status(500).json({ error: "Échec de la modification du mot de passe" })
    }
}