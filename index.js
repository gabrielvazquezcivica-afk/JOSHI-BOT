import makeWASocket, {
    DisconnectReason,
    useMultiFileAuthState,
    fetchLatestBaileysVersion
} from "@whiskeysockets/baileys";

import fs from "fs";
import path from "path";
import hanndler from "handler";
import config from "./config.js";

console.log("🟢 Iniciando JOSHI-BOT...");

// ==========================
// FUNCIÓN PARA GUARDAR LOGS
// ==========================
function saveLog(text) {
    const fecha = new Date().toLocaleString("es-MX");
    const line = `[${fecha}] ${text}\n`;

    fs.appendFileSync("./logs.txt", line, "utf8");
}

// ========================================
//        SISTEMA PRINCIPAL DEL BOT
// ========================================
async function startBot() {

    const { state, saveCreds } = await useMultiFileAuthState("./session");
    const { version } = await fetchLatestBaileysVersion();

    const sock = makeWASocket({
        version,
        printQRInTerminal: false,
        auth: state,
        browser: ["JOSHI-BOT", "Chrome", "5.0"]
    });

    // === CODEBOT SIN QR ===
    if (!sock.authState?.creds?.registered) {
        const code = await sock.requestPairingCode(config.botNumber);
        console.log(`\n🔗 Ingresa este CODEBOT en tu WhatsApp:\n👉 ${code}\n`);
    }

    // ==================================================
    //   EVENTO DE MENSAJES + LOG EN CONSOLA + ARCHIVO
    // ==================================================
    sock.ev.on("messages.upsert", async ({ messages }) => {
        const msg = messages[0];
        if (!msg.message) return;

        const sender = msg.pushName || "Usuario";
        const from = msg.key.remoteJid;
        const isGroup = from.endsWith("@g.us");

        let groupName = "Chat privado";
        let role = "Miembro";

        if (isGroup) {
            const metadata = await sock.groupMetadata(from);
            groupName = metadata.subject;

            const participant = metadata.participants.find(p => p.id === msg.key.participant);
            if (participant?.admin) role = participant.admin === "admin" ? "Admin" : "Super Admin";
        }

        // Determinar tipo de contenido
        let tipo = "Mensaje";
        const tipos = Object.keys(msg.message)[0];
        tipo = tipos;

        const logMsg = `
=====================================
💬 NUEVO MENSAJE
👤 Usuario: ${sender}
⭐ Rol: ${role}
🏠 Grupo: ${groupName}
📌 Tipo: ${tipo}
=====================================
`;

        console.log(logMsg);
        saveLog(logMsg);

        // Procesar comandos en handler
        try {
            await handler(sock, msg);
        } catch (err) {
            console.log("❌ ERROR EN EL HANDLER:", err);
        }
    });

    // Guardar credenciales
    sock.ev.on("creds.update", saveCreds);

    // Reconexión automática
    sock.ev.on("connection.update", (update) => {
        const { connection, lastDisconnect } = update;

        if (connection === "close") {
            const reason = lastDisconnect?.error?.output?.statusCode;
            console.log("🔴 Conexión cerrada:", reason);

            if (reason !== DisconnectReason.loggedOut) {
                console.log("🟡 Reconectando...");
                startBot();
            } else {
                console.log("🔴 Debes volver a registrar la sesión.");
            }
        } else if (connection === "open") {
            console.log("\n🟢 JOSHI-BOT Conectado a WhatsApp ✔\n");
        }
    });

    return sock;
}

startBot();

// ======================================================
//   AUTO-RELOAD DEL HANDLER Y PLUGINS (HOT-RELOAD)
// ======================================================
const pluginDir = "./plugins";

fs.watch("./handler.js", () => {
    console.log("♻️ Handler recargado");
    delete import.cache[path.resolve("./handler.js")];
});

fs.watch(pluginDir, (_, filename) => {
    if (filename?.endsWith(".js")) {
        console.log(`♻️ Plugin recargado: ${filename}`);
        // Reemplazar delete import.cache con:
const pluginPath = path.resolve('./handler.js');
delete (await import.meta.resolve(pluginPath));filename}`)];
    }
});
