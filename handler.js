import fs from "fs";
import path from "path";
import config from "./config.js";

const commands = new Map();
const dir = "./plugins";

// === CARGAR ARCHIVOS DE /plugins ===
for (let file of fs.readdirSync(dir)) {
    if (file.endsWith(".js")) {
        let plugin = await import(path.resolve(`${dir}/${file}`));
        if (!plugin.default) continue;

        let cmd = plugin.default;

        if (cmd.commands) {
            for (let x of cmd.commands) {
                commands.set(x, cmd);
            }
        }
    }
}

// === HANDLER PRINCIPAL ===
export default async function handler(sock, msg) {
    try {
        const from = msg.key.remoteJid;
        const type = Object.keys(msg.message || {})[0];
        const body =
            type === "conversation"
                ? msg.message.conversation
                : type === "extendedTextMessage"
                ? msg.message.extendedTextMessage.text
                : "";

        if (!body) return;

        const prefix = config.prefix;

        if (!body.startsWith(prefix)) return;

        const args = body.slice(prefix.length).trim().split(/ +/);
        const command = args.shift().toLowerCase();

        const sender = msg.key.participant || msg.key.remoteJid;
        const isGroup = from.endsWith("@g.us");
        const metadata = isGroup ? await sock.groupMetadata(from) : {};
        const admins = isGroup ? metadata.participants.filter(v => v.admin).map(v => v.id) : [];
        const isAdmin = admins.includes(sender);
        const isOwner = sender.includes(config.owner);
        const isBotAdmin = admins.includes(sock.user.id.split(":")[0] + "@s.whatsapp.net");

        const cmdFile = commands.get(command);
        if (!cmdFile) return;

        // === CHEQUEOS ===
        if (cmdFile.owner && !isOwner)
            return sock.sendMessage(from, { text: "⚠️ Solo el owner puede usar este comando." }, { quoted: msg });

        if (cmdFile.group && !isGroup)
            return sock.sendMessage(from, { text: "⚠️ Este comando solo funciona en grupos." }, { quoted: msg });

        if (cmdFile.admin && !isAdmin)
            return sock.sendMessage(from, { text: "⚠️ Solo admins pueden usar este comando." }, { quoted: msg });

        if (cmdFile.botAdmin && !isBotAdmin)
            return sock.sendMessage(from, { text: "⚠️ Necesito ser administrador." }, { quoted: msg });

        if (cmdFile.modoadmin) {
            if (config.modoadmin === true && !isAdmin && !isOwner) {
                return; // Modo admin activado ⇒ NO responde 
            }
        }

        // === EJECUTAR COMANDO ===
        await cmdFile.run({
            sock,
            msg,
            args,
            command,
            from,
            isGroup,
            isAdmin,
            isBotAdmin,
            isOwner,
            metadata,
            prefix
        });

    } catch (e) {
        console.log("ERROR HANDLER:", e);
    }
}
