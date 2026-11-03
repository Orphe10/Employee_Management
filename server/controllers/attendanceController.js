
import Attendance from "../models/Attendance.js";
import Employee from "../models/Employee.js";

//Pointage d'arrivée et de départ des salariés
//POST /api/attendance
export const clockInOut = async (req, res) => {
    try {
        // Récupération de la session de l'utilisateur connecté.
        const session = req.session;
        const employee = await Employee.findOne({ userId: session.userId })
        if (!employee) return res.status(404).json({ error: "Employé introuvable" });
        if (employee.isDeleted) return res.status(403).json({ error: "Votre compte est désactivé. Vous ne pouvez plus pointer à l'arrivée ni au départ." })
        // Initialisation de la date du jour à minuit pour identifier les pointages journaliers.

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        // Recherche d'un enregistrement de présence existant pour l'employé et la date actuelle.
        const existing = await Attendance.findOne({
            employeeId: employee._id,
            date: today,
        });

        // Récupération de la date et de l'heure actuelles.
        const now = new Date();

        if (!existing) {
            // Détermination du statut de présence en fonction de l'heure d'arrivée (retard après 09h00).
            const isLate = now.getHours() >= 9 && now.getMinutes() > 0;
            // Création d'un nouvel enregistrement de présence avec l'heure d'arrivée et le statut correspondant.
            const attendance = await Attendance.create({
                employeeId: employee._id,
                date: today,
                checkIn: now,
                status: isLate ? "RETARD" : "PRESENT"
            })

            return res.json({ success: true, type: "POINTAGE_ARRIVEE", data: attendance });
            // Si un pointage d'entrée existe, mais qu'aucun pointage de sortie n'a été effectué, procéder au pointage de sortie.
        } else if (!existing.checkOut) {
            // Calcul de la durée de travail à partir des heures d'entrée et de sortie.
            const checkInTime = new Date(existing.checkIn).getTime();
            const diffMs = now.getTime() - checkInTime;
            const diffHours = diffMs / (1000 * 60 * 60);
            // Enregistrement de l'heure de sortie de l'employé.
            existing.checkOut = now;

            /*Calculer les heures de travail et le type de jour*/
            // Conversion de la durée de travail en heures avec une précision de deux décimales.
            const workingHours = parseFloat(diffHours.toFixed(2));

            // Détermination du type de journée en fonction du nombre d'heures travaillées.
            let dayType = "courte journée";
            if (workingHours >= 8) dayType = "Journée-complète";
            else if (workingHours => 6) dayType = "Trois quarts de journée"
            else if (workingHours >= 4) dayType = "Demi-journée";
            else dayType = "courte journée";
        
            // Mise à jour des informations relatives à la durée et au type de journée.
            existing.workingHours = workingHours;
            existing.dayType = dayType;

            // Sauvegarde de l'enregistrement de présence mis à jour.
            await existing.save();
            return res.json({ success: true, type: "POINTAGE_DEPART", data: existing });
        } else {
            return res.json({ success: true, type: "POINTAGE_DEPART", data: existing, message: "Journée déjà clôturée"});
        }

    } catch (error) {
        console.error("Erreur de présence :", error);
        return res.status(500).json({ error: "Échec de l'opération" });
    }
}

// Consulter les données de présence d'un salarié
// GET /api/attendance
export const getAttendance = async (req, res) => {
    try {
        const session = req.session;
        const employee = await Employee.findOne({ userId: session.userId })
        if (!employee) return res.status(404).json({ error: "Employé introuvable" });

        // Récupération du nombre d'enregistrements à retourner (30 par défaut).
        const limit = parseInt(req.query.limit || 30);
        // Récupération de l'historique des présences de l'employé, trié par date décroissante.
        const history = await Attendance.find({ employeeId: employee._id }).sort({ date: -1 }).limit(limit)

        // Retourne l'historique des présences ainsi que le statut du compte employé.
        return res.json({
            data: history,
            employee: { isDeleted: employee.isDeleted }
        })

    } catch (error) {
        console.error("Erreur d'enregistrement des présences :", error);
        return res.status(500).json({ error: "Impossible de récupérer l'historique des présences." });
    }
}