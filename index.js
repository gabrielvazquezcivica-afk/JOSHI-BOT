// ─────────────────────────────────────────────
// index.js — Bot básico sin menú
// ─────────────────────────────────────────────

const {
    default: makeWASocket,
    useMultiFileAuthState,
    DisconnectReason
} = require("@whiskeysockets/baileys");

const pino = require("pino");
const qrcode = require("qrcode-terminal");

async function iniciarBot() {
    const { state, saveCreds } = await useMultiFileAuthState("./session");

    const sock = makeWASocket({
        logger: pino({ level: "silent" }),
        auth: state,
        printQRInTerminal: true
    });

    // Manejo de conexión
    sock.ev.on("connection.update", (update) => {
        const { qr, connection, lastDisconnect } = update;

        if (qr) {
            console.log("Escanea este QR para conectar el bot:");
            qrcode.generate(qr, { small: true });
        }

        if (connection === "close") {
            const code = lastDisconnect?.error?.output?.statusCode;

            if (code === DisconnectReason.loggedOut) {
                console.log("❌ Sesión cerrada. Borra la carpeta 'session' y vuelve a iniciar.");
            } else {
                console.log("🔄 Reconectando...");
                iniciarBot();
            }
        }

        if (connection === "open") {
            console.log("✔️ Bot conectado correctamente!");
        }
    });

    sock.ev.on("creds.update", saveCreds);

    // Respuesta mínima para probar
    sock.ev.on("messages.upsert", async ({ messages }) => {
        const msg = messages[0];
        if (!msg.message) return;

        const from = msg.key.remoteJid;
        const texto =
            msg.message.conversation ||
            msg.message.extendedTextMessage?.text ||
            "";

        // Respuesta básica
        if (texto.toLowerCase() === "ping") {
            await sock.sendMessage(from, { text: "Pong 🏓" });
        }
    });
}

iniciarBot();
