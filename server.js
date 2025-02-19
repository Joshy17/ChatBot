const express = require("express");
const cors = require("cors");
const { SessionsClient } = require("@google-cloud/dialogflow-cx");
const path = require("path");

const app = express();
app.use(cors());
app.use(express.json());

app.use(express.static(path.join(__dirname)));

// 📌 Incluir credenciales directamente en el código (NO RECOMENDADO)
const credentials = {
  type: "service_account",
  project_id: "chatbot-449903",
  private_key_id: "460b0aa0becd97b6578a8b9b192499a56ef5edef",
  private_key: "-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQDHwTWp...",
  client_email: "chatbotucr@chatbot-449903.iam.gserviceaccount.com",
  client_id: "112137619942569171127",
  auth_uri: "https://accounts.google.com/o/oauth2/auth",
  token_uri: "https://oauth2.googleapis.com/token",
  auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
  client_x509_cert_url: "https://www.googleapis.com/robot/v1/metadata/x509/chatbotucr%40chatbot-449903.iam.gserviceaccount.com",
  universe_domain: "googleapis.com"
};

// 📌 Conectar directamente a Dialogflow CX
const sessionClient = new SessionsClient({
  credentials,
  apiEndpoint: "us-central1-dialogflow.googleapis.com",
});

const projectId = "chatbot-449903";
const location = "us-central1";
const agentId = "4dbd125e-2f3b-4960-bb42-eedf05247e75";

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
    return response.queryResult.responseMessages
        .map(msg => (msg.text ? msg.text.text[0] : ""))
        .join("\n");
}

app.post("/send-message", async (req, res) => {
    const { message } = req.body;
    const sessionId = "123456";

    try {
        const response = await sendMessageToDialogflowCX(message, sessionId);
        res.json({ reply: response });
    } catch (error) {
        console.error("❌ Error en Dialogflow CX:", error);
        res.status(500).json({ error: "Error al conectar con Dialogflow CX" });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});
