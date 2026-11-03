import jwt from "jsonwebtoken";

export const protect = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({ error: "Non autorisé" });
        }
        const token = authHeader.split(" ")[1];

        // Décodage du jeton
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        req.session = decoded;

        //next() permet à la requête d'atteindre le contrôleur
        next();
    } catch (error) {
        if (error.name === "TokenExpiredError") {
            return res.status(401).json({ error: "Session expirée, veuillez vous reconnecter" });
        }
        return res.status(401).json({ error: "Non autorisé" })
    }
}

export const protectAdmin = (req, res, next) => {
    // Si l'utilisateur n'est même pas authentifié
    if (!req.session) {
        return res.status(401).json({ error: "Authentification préalable requise" });
    }
    //Seul un utilisateur possédant le rôle ADMIN peut poursuivre la requête.
    if (req?.session?.role !== "ADMIN") {
        return res.status(403).json({ error: "Accès administrateur requis" })
    }
    next();
}