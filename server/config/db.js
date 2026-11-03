import mongoose from "mongoose";

/**
 * Établit une connexion à la base de données MongoDB.
 * Écoute l'événement de connexion réussie afin de confirmer
 * que la base de données est correctement connectée.
 * Utilise l'URI de connexion définie dans les variables
 * d'environnement pour établir la connexion à MongoDB.
 * Gère les éventuelles erreurs de connexion et affiche
 * un message d'erreur en cas d'échec.
 */

const connectDB = async () => {
    try {
        // Écoute l'événement signalant une connexion réussie à MongoDB.
        mongoose.connection.on('connected', () => console.log("Database connected"))
        // Établit la connexion à MongoDB à partir de l'URI configurée.
        await mongoose.connect(process.env.MONGODB_URI)
    } catch (error) {
        // Affiche un message d'erreur si la connexion à la base de données échoue.
        console.error("Database connection failed", error.message)
    }
}

export default connectDB;