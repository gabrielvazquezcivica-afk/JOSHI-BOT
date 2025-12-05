const fs = require('fs');

module.exports = {
    name: "hidetag",
    alias: ["ht"],
    desc: "Enviar mensajes ocultos mencionando a todos",
    category: "group",
    async execute(m, { conn, text, args, participants, command }) {

        if (!m.isGroup) return m.reply("Este comando solo funciona en grupos.");
        if (!text && !m.quoted) return m.reply(`Usa:\n.hidetag texto\n.hidetag (responde imagen/audio/video/etc)`);

        // Obtener menciones
        let users = participants.map(u => u.id);

        // Si el mensaje es texto
        if (text && !m.quoted) {
            return conn.sendMessage(m.chat, {
                text: `${text}\n\n> JOSHI-BOT`,
                mentions: users
            }, { quoted: m });
        }

        // Si el usuario respondió a un archivo (imagen, sticker, audio, video, etc)
        if (m.quoted) {

            let mime = m.quoted.mtype;

            // Descargar contenido
            let media = await m.quoted.download();
            let options = { 
                mentions: users,
                caption: `${text ? text : ''}\n\n> JOSHI-BOT`
            };

            if (/image/.test(mime)) {
                return conn.sendMessage(m.chat, { image: media, ...options }, { quoted: m });
            }

            if (/video/.test(mime)) {
                return conn.sendMessage(m.chat, { video: media, ...options }, { quoted: m });
            }

            if (/audio/.test(mime)) {
                return conn.sendMessage(m.chat, { audio: media, mimetype: 'audio/mpeg', ...options }, { quoted: m });
            }

            if (/sticker/.test(mime)) {
                return conn.sendMessage(m.chat, { sticker: media, ...options }, { quoted: m });
            }

            if (/document/.test(mime)) {
                return conn.sendMessage(m.chat, { document: media, ...options }, { quoted: m });
            }

            return m.reply("El tipo de archivo no es compatible.");
        }
    }
};
