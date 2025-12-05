const fs = require("fs");

module.exports = {
    command: "tagall",
    alias: ["todos", "invocar", "call"],
    exec: async ({ sock, msg, from, isGroup, isAdmin, config, args }) => {
        try {

            if (!isGroup) 
                return sock.sendMessage(from, { text: config.mensajes.noGrupo });

            if (!isAdmin) 
                return sock.sendMessage(from, { text: config.mensajes.noAdmin });

            // ============================
            //   EMOJI PERSONALIZABLE
            // ============================
            const emoji = config.emojis?.tagall || "🎧", "🐲", "🐬", "🪐", "⚡", "👾"; 
            // Puedes cambiarlo en config.js así:
            // emojis: { tagall: "⚡" }
            // ============================

            // Texto opcional
            const texto = args.length > 0 ? args.join(" ") : "📢 *Mención general:*";

            // Info del grupo
            const metadata = await sock.groupMetadata(from);
            const participantes = metadata.participants;

            let mensaje = `📣 *TAG ALL*\n${texto}\n\n`;
            const menciones = [];

            // MENCIONAR A TODOS CON EMOJI
            for (let p of participantes) {
                const id = p.id;
                menciones.push(id);

                mensaje += `${emoji} @${id.split("@")[0]}\n`;
            }

            // Enviar el mensaje
            await sock.sendMessage(from, {
                text: mensaje,
                mentions: menciones
            });

            // ============================
            //     ENVIAR AUDIO
            // ============================
            const audioPath = "./media/tagall.mp3";

            if (fs.existsSync(audioPath)) {
                await sock.sendMessage(from, {
                    audio: { url: "https://youtu.be/jKgxKoUtHPs?si=jZd-fgCWeYu9hSkh" },
                    mimetype: "audio/mp4"
                });
            } else {
                console.log("⚠️ No se encontró ./media/tagall.mp3");
            }

        } catch (e) {
            console.log("Error en tagall:", e);
        }
    }
};
