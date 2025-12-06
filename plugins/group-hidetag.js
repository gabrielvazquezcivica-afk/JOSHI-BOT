const handler = async (m, { conn, text, participants }) => {
try {

    await conn.sendMessage(m.chat, { react: { text: "👀", key: m.key } });

    if (!m.isGroup) return m.reply("⚠️ *Solo funciona en grupos.*");

    const metadata = await conn.groupMetadata(m.chat);
    const senderAdmin = metadata.participants.find(p => p.id === m.sender)?.admin;
    if (!senderAdmin) return m.reply("⚠️ *Solo los admins pueden usar este comando.*");

    const users = participants.map(u => u.id);

    // Si no mandan texto y no responden nada
    if (!text && !m.quoted) 
        return m.reply("⚠️ *Debes escribir algo o responder un mensaje.*");

    // Texto + firma del bot
    const botName = "JOSHI-BOT"; // <-- cámbialo si quieres
    const finalText = `${text || ""}\n\n> ${botName}`;

    // Detectar si viene multimedia
    let quoted = m.quoted ? m.quoted : m;
    let mime = (quoted.msg || quoted).mimetype || "";

    // MULTIMEDIA
    if (/image|video|sticker|audio/.test(mime)) {

        let buffer = await quoted.download();

        // IMAGEN
        if (/image/.test(mime)) {
            return await conn.sendMessage(m.chat, {
                image: buffer,
                caption: finalText,
                mentions: users
            });
        }

        // VIDEO
        if (/video/.test(mime)) {
            return await conn.sendMessage(m.chat, {
                video: buffer,
                caption: finalText,
                mentions: users
            });
        }

        // STICKER
        if (/sticker/.test(mime)) {

            // Enviar sticker
            await conn.sendMessage(m.chat, {
                sticker: buffer,
                mentions: users
            });

            // Enviar texto con firma
            return await conn.sendMessage(m.chat, {
                text: finalText,
                mentions: users
            });
        }

        // AUDIO
        if (/audio/.test(mime)) {

            await conn.sendMessage(m.chat, {
                audio: buffer,
                ptt: true,
                mentions: users
            });

            // Enviar texto con firma
            return await conn.sendMessage(m.chat, {
                text: finalText,
                mentions: users
            });
        }

    }

    // SOLO TEXTO
    return await conn.sendMessage(m.chat, {
        text: finalText,
        mentions: users
    });

} catch (e) {
    console.log(e);
    await conn.sendMessage(m.chat, { react: { text: "❌", key: m.key } });
    m.reply("❌ *Error en hidetag.*");
}
};

handler.help = ["n"];
handler.tags = ["group"];
handler.command = ["n"];
handler.group = true;
handler.admin = true;

export default handler;
