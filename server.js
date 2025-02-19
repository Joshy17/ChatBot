const express = require("express");
const cors = require("cors");
const { SessionsClient } = require("@google-cloud/dialogflow-cx"); // Librería correcta para CX
const path = require("path");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

app.use(express.static(path.join(__dirname)));

// 🔹 Cargar credenciales desde la variable de entorno
const credentials = JSON.parse(process.env.chatbotcredenciales);

const projectId = "chatbot-449903"; // ID del proyecto en Google Cloud
const location = "us-central1"; // Ubicación del agente en Dialogflow CX
const agentId = "4dbd125e-2f3b-4960-bb42-eedf05247e75"; // ID del agente en Dialogflow CX

// 📌 Inicializar cliente de Dialogflow CX con credenciales de entorno
const sessionClient = new SessionsClient({
    credentials: {
        client_email: credentials.client_email,
        private_key: credentials.private_key
    },
    apiEndpoint: "us-central1-dialogflow.googleapis.com",
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
        console.log(`🤖 Bot: ${response}`);

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
