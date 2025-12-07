import makeWASocket, {
    DisconnectReason,
    useMultiFileAuthState,
    fetchLatestBaileysVersion
} from "@whiskeysockets/baileys";

import fs from "fs";
import path from "path";
import handler from "./handler.js";
import config from "./config.js";
import chalk from "chalk";
import moment from "moment-timezone";

console.log(chalk.hex("#ff69b4")(`
=====================================
      🟢 Iniciando ${config.botName}...
      🔹 by Gabo
=====================================
`));

async function startBot() {
    const { state, saveCreds } = await useMultiFileAuthState("./session");
    const { version } = await fetchLatestBaileysVersion();

    const sock = makeWASocket({
        version,
        printQRInTerminal: false,
        auth: state,
        browser: [config.botName, "Chrome", "5.0"]
    });

    // ===== CODEBOT (SIN QR) =====
    if (!sock.authState?.creds?.registered) {
        const code = await sock.requestPairingCode(config.botNumber);
        console.log(chalk.green(`\n🔗 Ingresa este CODEBOT en tu WhatsApp:\n\n👉  ${code}\n`));
    }

    // ===== EVENTO DE MENSAJES =====
    sock.ev.on("messages.upsert", async ({ messages }) => {
        const msg = messages[0];
        if (!msg.message) return;

        try {
            const senderName = msg.pushName || msg.key.participant || "Desconocido";
            const chatId = msg.key.remoteJid || "Desconocido";
            const isGroup = chatId.endsWith("@g.us");
            const chatName = isGroup ? chatId : "Chat privado";

            // Detectar comando
            const text = msg.message.conversation || msg.message.extendedTextMessage?.text || "";
            const prefix = config.prefix || ".";
            let command = "";
            if (text.startsWith(prefix)) {
                command = text.slice(prefix.length).split(" ")[0].toLowerCase();
            }

            // Log organizado
            console.log(
                chalk.blue(`[${moment().format("HH:mm:ss")}]`),
                chalk.yellow(`Usuario: ${senderName}`),
                chalk.green(`Grupo/Chat: ${chatName}`),
                command ? chalk.magenta(`Comando: ${command}`) : ""
            );

            await handler(sock, msg);
        } catch (e) {
            console.log(chalk.red("❌ ERROR EN EL HANDLER:"), e);
        }
    });

    // ===== AUTO GUARDAR CREDENCIALES =====
    sock.ev.on("creds.update", saveCreds);

    // ===== RECONEXIÓN AUTOMÁTICA =====
    sock.ev.on("connection.update", (update) => {
        const { connection, lastDisconnect } = update;

        if (connection === "close") {
            const reason = lastDisconnect?.error?.output?.statusCode;
            console.log(chalk.red("🔴 Conexión cerrada:"), reason);

            if (reason !== DisconnectReason.loggedOut) {
                console.log(chalk.yellow("🟡 Reconectando..."));
                startBot();
            } else {
                console.log(chalk.red("🔴 Debes volver a registrar la sesión."));
            }
        } else if (connection === "open") {
            console.log(chalk.green("🟢 Conectado a WhatsApp ✔"));
        }
    });

    return sock;
}

startBot();

// ========================================
//   AUTO-RELOAD DEL HANDLER Y PLUGINS
// ========================================
const pluginDir = "./plugins";

const reloadModule = async (filePath) => {
    try {
        const modulePath = path.resolve(filePath);
        const moduleUrl = `file://${modulePath}`;
        await import(moduleUrl + `?update=${Date.now()}`);
        console.log(chalk.cyan(`♻️ Recargado: ${filePath}`));
    } catch (err) {
        console.log(chalk.red("❌ Error recargando módulo:"), err);
    }
};

fs.watch("./handler.js", async () => {
    await reloadModule("./handler.js");
});

fs.watch(pluginDir, async (_, filename) => {
    if (filename.endsWith(".js")) {
        await reloadModule(`${pluginDir}/${filename}`);
    }
});
