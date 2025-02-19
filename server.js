const express = require("express");
const cors = require("cors");
const { SessionsClient } = require("@google-cloud/dialogflow-cx"); // Librería correcta para CX
const path = require("path");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

app.use(express.static(path.join(__dirname)));

// 🔹 Cargar credenciales de Dialogflow CX
process.env.GOOGLE_APPLICATION_CREDENTIALS = path.join(__dirname, "chatbot-credenciales.json");

const projectId = "chatbot-449903"; // ID del proyecto en Google Cloud
const location = "us-central1"; // Ubicación del agente en Dialogflow CX
const agentId = "4dbd125e-2f3b-4960-bb42-eedf05247e75"; // ID del agente en Dialogflow CX

// 📌 Se agrega el `apiEndpoint` correcto
const sessionClient = new SessionsClient({
    apiEndpoint: "us-central1-dialogflow.googleapis.com", // Agrega esto
});


async function sendMessageToDialogflowCX(text, sessionId) {
    const sessionPath = sessionClient.projectLocationAgentSessionPath(
        projectId, location, agentId, sessionId
    );

    const request = {
        session: sessionPath,
        queryInput: {
            text: { text: text },
            languageCode: "es",
        },
    };

    const [response] = await sessionClient.detectIntent(request);

    console.log("🔍 Respuesta completa de Dialogflow CX:", JSON.stringify(response, null, 2));

    return response.queryResult.responseMessages
        .map(msg => msg.text ? msg.text.text[0] : "")
        .join("\n");
}


// 🔹 Endpoint para recibir mensajes del frontend
app.post("/send-message", async (req, res) => {
    const { message } = req.body;
    const sessionId = "123456";

    console.log(`📩 Usuario: ${message}`);

    try {
        const response = await sendMessageToDialogflowCX(message, sessionId);
        console.log(`🤖 Bot: ${response}`); // ✅ Solo muestra el mensaje limpio

        res.json({ reply: response });
    } catch (error) {
        console.error("❌ Error en Dialogflow CX:", error);
        res.status(500).json({ error: "Error al conectar con Dialogflow CX" });
    }
});
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
