const express = require("express");
const cors = require("cors");
const { SessionsClient } = require("@google-cloud/dialogflow-cx");
const path = require("path");

const app = express();
app.use(cors());
app.use(express.json());

app.use(express.static(path.join(__dirname)));

const credentials = {
  type: "service_account",
  project_id: "chatbot-449903",
  private_key_id: "460b0aa0becd97b6578a8b9b192499a56ef5edef",
  "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQDHwTWp+IRsyhPm\nH3ex9gfdCLLWki6t8MIYTlIkeu/bOK+LWXR+oK+0dUBR89pVV/gtKvNKA6SWPQ4M\nIhtLjxGpojgVgeCNmY5uHm/0fhnGBL3HFIO80ly9QIsTLLkRwlIpZyUxcQHDmqhx\nW0/s/DeityAWeOGQAZmiZolyHkJO4Zs2v7SwoFNU/oJ7L842PqRqIvblkSdlybn5\n/sqDS26eW+/W4IcYFIvHOPRaEYlu1SYWyEuLcbTtoaqK96D/5W9xI3L3bbR/H8lz\np43QmSK2iPnQKM4fXfcoH9ineU4+a+5lviu+ResZ3N6PprgBYKbblPKzBbbBXTBs\nta8hwb3dAgMBAAECggEADLXlyRsoAKzPx6tbQvGBqOtrnHgFzLSkAnGYDCaJylHD\nkyLjOkbVl1kvTr0CY2mAaw4EwsITlX8XZzyTrw2l/+dzbnmVWn1EZmESb6THKrtU\n1hefQFhvD+3M9ls4qtbKF+9ZGwRyqnSAtmHV5qGv6pnWIAfwwRM7qEKiXqa/7Q6U\n5B4E+S7XVNA1Pg1678qLHVnfyNNUL4eNlkYA4odN/2MQRnlRLnCPwfG8a0/nk9mx\noAQ+mTQNfbJOaB3GrRMRvW+/EdpaqUXm0ii22zhpbC2RuZoq5+WgneL38nlUE5O5\n3lBmfCqddwORq0wWb5BUzG0yEHiRwQCFDvk8jtyiAQKBgQDkxl0O6sh/11YCy/Ik\n+WoVLFEEMeaGxjl96NpevXL3snhZhQuXRKvD9VJGkuIuAO5qWJpQhsNLkjFgN6xn\nDGaYv5NSfTQuuoy9TpZbHlCyHkcTkXF7HrBq24ZXz+yHPPIAqNcDN0YNf/3nSoUR\nzy66p4ME8oySFwmrV9FYewv43QKBgQDfhr8XzLWhxFg1olNNGO31rLA08BtQwWJP\nFmqG72yyDrPmHLHFrVgCZ5Ojjc7PZZjiVUO5tuSTLZgLEcAfaOqeD/qvwx4u77TG\nTS6vGqW19UrGpm2gfckXE7+qmZJUdfPW1mnwMGpI3pKg3SJHi9i+dARFNbzE7Pov\njCbMvG4JAQKBgQDN88Hc5wJfDIVS+TVhkeOtcfrxctbcZ+Fj91d3SMgSM2ni9UJN\nCLY1MEnEXQEfdxkrRd6ONfPkuZSX0Sb0khZe1sCS10I9+xUua2wyVWVCJL3J4Pqv\nYx5g5IXZ0cZWrUgTzeva6ky3ZI04Rj7rnH+t65Wow45HClRbGzDMneFWRQKBgQC/\nxdh/L8eJQW44ncsAM2o9Q+ptkK6uyytwFRhSKmpEHa8ktuuiYIVIktqtEMYlU9Im\nJOcVF5/l0dFHdfQyPo5EDAuU7j8gH9Il7CQoYSFZClkcM7+MWT7EiNIBKP7NbeFF\nKfH7+13EpQiB8Rcu8QGE7P6Y7nDFN1eyoXjMYMG7AQKBgDTf7bBdu+OXTUy0gZJ4\n5eMxe5D/GrD/Y+gblKMUKQ7gj5q00rVYxJL7TrNfT4sA8mifkO64mpuOCl+Lu53c\nCcJG1X+lGmha76rgdKBhHpEu/zRwnuJOVmPhE7vklmoIgTLMex8tI4hM4qkLMjNb\nLCqKW0qn5kjecGs+dQ72B+6W\n-----END PRIVATE KEY-----\n",
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
