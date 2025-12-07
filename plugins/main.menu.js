import fs from "fs";
import config from "../config.js";

const menuImage = "https://pin.it/1GvjoRsct";       // << PON AQUÍ IMAGEN
const audioMenu = "https://youtu.be/pBn5g314d5g?si=rIomEdArtZCN1Ikr";         // << PON AQUÍ AUDIO

// ====== EMOJIS POR CATEGORÍA ======
// El nombre debe coincidir con el nombre del archivo .js de cada plugin
const emojis = {
    "group": "👥",
    "owner": "👑",
    "fun": "🎉",
    "tools": "🛠️",
    "welcome": "👋",
    "antilink": "⛔",
    "menu": "📜",
    "admin": "🧰",
    "tagall": "📣",
    "hidetag": "👤",
    "play": "🎵",
    "config": "⚙️",
};

export default {
    command: ["menu", "help", "ayuda"],

    async run({ sock, m }) {

        // ====== REACCION INICIAL ======
        await sock.sendMessage(m.chat, { react: { text: "📨", key: m.key } });

        // ====== DETERMINAR SALUDO ======
        const hora = new Date().getHours();
        const saludo =
            hora < 6 ? "Buenas madrugadas" :
            hora < 12 ? "Buenos días" :
            hora < 18 ? "Buenas tardes" :
            "Buenas noches";

        const pushname = m.pushName || "amigo";

        // ====== LEER PLUGINS ======
        const pluginFolder = "./plugins";
        const comandos = [];

        for (const file of fs.readdirSync(pluginFolder)) {
            if (!file.endsWith(".js")) continue;

            try {
                const plugin = (await import(`../plugins/${file}`)).default;
                if (!plugin?.command) continue;

                const nombre = file.replace(".js", "");
                const emoji = emojis[nombre] || "📌";

                const cmds = Array.isArray(plugin.command) ? plugin.command : [plugin.command];

                comandos.push({
                    archivo: nombre,
                    emoji,
                    cmds
                });

            } catch (e) {
                console.log("Error cargando plugin:", file);
            }
        }

        // ordenar
        comandos.sort((a, b) => a.archivo.localeCompare(b.archivo));

        // ====== CREAR LISTA ======
        const lista = comandos
            .map(p =>
                `${p.emoji} *${p.archivo}*\n   ➤ ${p.cmds.join(", ")}`
            )
            .join("\n\n");

        // ====== MENÚ FINAL ======
        const menu = `
🌐 *${config.botName}*
👋 Hola *${pushname}*, ${saludo}

📚 *Menú de comandos*
${lista}

──────────────────
🔹 Prefijo: *${config.prefix}*
🔹 Bot: *${config.botName}*
🔹 Owner: *${config.ownerName || "Gabo"}*
🔹 Versión: 1.0.0
──────────────────
        `;

        // ====== ENVIAR MENÚ CON IMAGEN ======
        await sock.sendMessage(
            m.chat,
            {
                image: { url: menuImage },
                caption: menu
            },
            { quoted: m }
        );

        // ====== AUDIO DE MENÚ ======
        await sock.sendMessage(
            m.chat,
            {
                audio: { url: audioMenu },
                mimetype: "audio/mpeg",
                ptt: true
            }
        );

        // ====== REACCIÓN FINAL ======
        await sock.sendMessage(m.chat, { react: { text: "✅", key: m.key } });
    },
};


// =======================
//     HANDLER DEL MENU
// =======================
export const handler = {
    help: ["menu", "help", "ayuda"],
    tags: ["menu"],
    command: ["menu", "help", "ayuda"]
};
