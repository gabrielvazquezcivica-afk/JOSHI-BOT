const handler = async (m, { conn, text, participants }) => {
try {

    await conn.sendMessage(m.chat, { react: { text: "👀", key: m.key } });

    if (!m.isGroup) return m.reply("⚠️ *Solo funciona en grupos.*");

    const metadata = await conn.groupMetadata(m.chat);
    const senderAdmin = metadata.participants.find(p => p.id === m.sender)?.admin;
    if (!senderAdmin) return m.reply("⚠️ *Solo los admins pueden usar este comando.*");

    const users = participants.map(u => u.id);

    // Si no escribió texto y no respondió nada
    if (!text && !m.quoted) 
        return m.reply("⚠️ *Debes escribir un mensaje o responder uno.*");

    // Revisar si viene multimedia
    let quoted = m.quoted ? m.quoted : m;
    let mime = (quoted.msg || quoted).mimetype || "";

    // Si contiene multimedia
    if (/image|video|sticker|audio/.test(mime)) {

        let buffer = await quoted.download();

        if (/image/.test(mime)) {
            return await conn.sendMessage(m.chat, {
                image: buffer,
                caption: text || "",
                mentions: users
            });
        }

        if (/video/.test(mime)) {
            return await conn.sendMessage(m.chat, {
                video: buffer,
                caption: text || "",
                mentions: users
            });
        }

        if (/sticker/.test(mime)) {
            // Enviar sticker
            await conn.sendMessage(m.chat, {
                sticker: buffer,
                mentions: users
            });

            // Enviar texto si lo hay
            if (text) {
                await conn.sendMessage(m.chat, {
                    text: text,
                    mentions: users
                });
            }
            return;
        }

        if (/audio/.test(mime)) {
            // Enviar audio
            await conn.sendMessage(m.chat, {
                audio: buffer,
                ptt: true,
                mentions: users
            });

            // Enviar texto si lo hay
            if (text) {
                await conn.sendMessage(m.chat, {
                    text: text,
                    mentions: users
                });
            }
            return;
        }

    } else {
        // Solo texto
        return await conn.sendMessage(m.chat, {
            text: text,
            mentions: users
        });
    }

} catch (e) {
    console.log(e);
    await conn.sendMessage(m.chat, { react: { text: "❌", key: m.key } });
    m.reply("❌ *Error en hidetag.*");
}
};

handler.help = ["n","hidetag","tag"];
handler.tags = ["group"];
handler.command = ["n","hidetag","tag"];
handler.group = true;
handler.admin = true;

export default handler;
