// ─────────────────────────────────────────────
// handler.js — Sistema de comandos con plugins
// ─────────────────────────────────────────────

const config = require("./config.js");
const cargarPlugins = require("./pluginsLoader.js");

// Cargar todos los plugins
let plugins = cargarPlugins();

module.exports = async function handleMessage(sock, msg) {
    try {
        const from = msg.key.remoteJid;
        const isGroup = from.endsWith("@g.us");

        const texto =
            msg.message?.conversation ||
            msg.message?.extendedTextMessage?.text ||
            "";

        if (!texto) return;

        const prefix = ".";
        if (!texto.startsWith(prefix)) return;

        const args = texto.slice(prefix.length).trim().split(/ +/);
        const command = args.shift().toLowerCase();

        const sender = msg.key.participant || msg.key.remoteJid;
        const senderNumber = sender.split("@")[0];
        const isOwner = config.owner.includes(senderNumber);

        let groupMetadata, admins = [], isAdmin = false, isBotAdmin = false;

        if (isGroup) {
            groupMetadata = await sock.groupMetadata(from);
            admins = groupMetadata.participants
                .filter(p => p.admin)
                .map(p => p.id);

            isAdmin = admins.includes(sender);
            isBotAdmin = admins.includes(sock.user.id.split(":")[0] + "@s.whatsapp.net");
        }

        // Si el comando existe en plugins
        if (plugins[command]) {
            return plugins[command].exec({
                sock,
                msg,
                from,
                args,
                sender,
                senderNumber,
                isOwner,
                isGroup,
                isAdmin,
                isBotAdmin,
                config
            });
        }

        // Si no existe
        await sock.sendMessage(from, { text: "❓ Comando no reconocido." });

    } catch (e) {
        console.log("❌ Error en handler:", e);
    }
};
