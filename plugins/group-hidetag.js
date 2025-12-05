module.exports = {
    command: "hidetag","n","notify","noty"
    alias: ["ht", "oculto", "ghost"],
    exec: async ({ sock, msg, from, isGroup, isAdmin, config, args }) => {
        try {

            if (!isGroup)
                return sock.sendMessage(from, { text: config.mensajes.noGrupo });

            if (!isAdmin)
                return sock.sendMessage(from, { text: config.mensajes.noAdmin });

            const texto = args.length > 0 ? args.join(" ") : "";

            // Obtener participantes
            const metadata = await sock.groupMetadata(from);
            const participantes = metadata.participants;
            const menciones = participantes.map(p => p.id);

            // Detectar si el mensaje tiene multimedia
            const hasMedia =
                msg.message.imageMessage ||
                msg.message.videoMessage ||
                msg.message.audioMessage ||
                msg.message.stickerMessage;

            // 1️⃣ HIDETAG SOLO TEXTO
            if (!hasMedia) {
                return sock.sendMessage(from, {
                    text: texto,
                    mentions: menciones
                });
            }

            // 2️⃣ HIDETAG CON MULTIMEDIA
            const buffer = await sock.downloadMediaMessage(msg);

            if (msg.message.imageMessage) {
                return sock.sendMessage(from, {
                    image: buffer,
                    caption: texto,
                    mentions: menciones
                });
            }

            if (msg.message.videoMessage) {
                return sock.sendMessage(from, {
                    video: buffer,
                    caption: texto,
                    mentions: menciones
                });
            }

            if (msg.message.audioMessage) {
                return sock.sendMessage(from, {
                    audio: buffer,
                    mimetype: "audio/mp4",
                    ptt: false,
                    mentions: menciones
                });
            }

            if (msg.message.stickerMessage) {
                return sock.sendMessage(from, {
                    sticker: buffer,
                    mentions: menciones
                });
            }

        } catch (e) {
            console.log("Error en hidetag:", e);
        }
    }
};
