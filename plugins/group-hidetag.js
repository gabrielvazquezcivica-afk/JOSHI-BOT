const handler = async (m, { conn, participants, text, command }) => {
try {
    // Reacción al comando
    await conn.sendMessage(m.chat, { react: { text: "👀", key: m.key } });

    // Validar admin
    const groupMetadata = await conn.groupMetadata(m.chat);
    const senderAdmin = groupMetadata.participants.find(p => p.id === m.sender)?.admin;
    if (!senderAdmin) return m.reply("⚠️ *Solo los admins pueden usar este comando.*");

    // Crear lista de menciones
    let users = participants.map(v => v.id);

    // Si es texto
    if (text) {
        await conn.sendMessage(m.chat, { 
            text: text,
            mentions: users
        });
        return;
    }

    // Si es multimedia (imagen, video, audio, sticker)
    if (m.quoted) {
        let q = m.quoted;

        let type = q.mtype;

        if (type === "imageMessage") {
            return conn.sendMessage(m.chat, {
                image: await q.download(),
                caption: q.text || "",
                mentions: users
            });
        }

        if (type === "videoMessage") {
            return conn.sendMessage(m.chat, {
                video: await q.download(),
                caption: q.text || "",
                mentions: users
            });
        }

        if (type === "audioMessage") {
            return conn.sendMessage(m.chat, {
                audio: await q.download(),
                ptt: true,
                mentions: users
            });
        }

        if (type === "stickerMessage") {
            return conn.sendMessage(m.chat, {
                sticker: await q.download(),
                mentions: users
            });
        }

        return m.reply("⚠️ *No reconozco este tipo de mensaje para oculto.*");
    }

    // Si no enviaron texto ni respondieron a nada
    return m.reply(`⚠️ *Debes escribir un mensaje o responder a uno.*\n\nEjemplo:\n.hidetag Hola a todos`);

} catch (e) {
    console.log(e)
    await conn.sendMessage(m.chat, { react: { text: "❌", key: m.key } });
    return m.reply("❌ *Error al ejecutar hidetag.*");
}
};

handler.help = ["hidetag", "n"];
handler.tags = ["group"];
handler.command = ["hidetag", "ht", "tagoculto"];
handler.group = true;
handler.admin = true;

export default handler;
