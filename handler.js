// ─────────────────────────────────────────────
// handler.js — Motor principal de comandos
// ─────────────────────────────────────────────

const config = require("./config.js");

module.exports = async function handleMessage(sock, msg) {
    try {
        const from = msg.key.remoteJid;
        const isGroup = from.endsWith("@g.us");

        // Detectar texto
        const texto =
            msg.message?.conversation ||
            msg.message?.extendedTextMessage?.text ||
            "";

        if (!texto) return;

        // Prefijo
        const prefix = ".";
        if (!texto.startsWith(prefix)) return;

        // Separar comando y argumentos
        const args = texto.slice(prefix.length).trim().split(/ +/);
        const command = args.shift().toLowerCase();

        // Información útil
        const sender = msg.key.participant || msg.key.remoteJid;
        const senderNumber = sender.split("@")[0];

        const isOwner = config.owner.includes(senderNumber);

        let groupMetadata, groupAdmins = [], isAdmin = false, isBotAdmin = false;

        if (isGroup) {
            groupMetadata = await sock.groupMetadata(from);
            groupAdmins = groupMetadata.participants
                .filter(p => p.admin)
                .map(p => p.id);

            isAdmin = groupAdmins.includes(sender);
            isBotAdmin = groupAdmins.includes(sock.user.id.split(":")[0] + "@s.whatsapp.net");
        }

        // ───────────────────────────────────────
        //            COMANDOS AQUÍ
        // ───────────────────────────────────────

        switch (command) {

            // Ejemplo simple: .ping
            case "ping":
                await sock.sendMessage(from, { text: "Pong 🏓" });
                break;

            // Solo owner
            case "owner":
                if (!isOwner) {
                    return sock.sendMessage(from, { text: config.mensajes.soloOwner });
                }
                await sock.sendMessage(from, { text: "Eres el owner ✔️" });
                break;

            // Comando que requiere admin del grupo
            case "admin":
                if (!isGroup)
                    return sock.sendMessage(from, { text: config.mensajes.soloGrupos });

                if (!isAdmin)
                    return sock.sendMessage(from, { text: config.mensajes.userNoAdmin });

                await sock.sendMessage(from, { text: "Eres admin del grupo ✔️" });
                break;

            // Comando que requiere que el bot sea admin
            case "botadmin":
                if (!isGroup)
                    return sock.sendMessage(from, { text: config.mensajes.soloGrupos });

                if (!isBotAdmin)
                    return sock.sendMessage(from, { text: config.mensajes.botNoAdmin });

                await sock.sendMessage(from, { text: "El bot es admin ✔️" });
                break;

            default:
                await sock.sendMessage(from, { text: "❓ Comando no reconocido." });
                break;
        }

    } catch (e) {
        console.log("❌ Error en handler:", e);
        try {
            await sock.sendMessage(msg.key.remoteJid, { text: config.mensajes.error });
        } catch {}
    }
};
