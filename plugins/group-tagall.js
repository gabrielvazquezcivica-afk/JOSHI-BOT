import fetch from "node-fetch";

const handler = async (m, { conn, participants }) => {
try {

    // Reacción inicial
    await conn.sendMessage(m.chat, { react: { text: "📢", key: m.key } });

    if (!m.isGroup) return m.reply("⚠️ *Este comando solo funciona en grupos.*");

    const groupMetadata = await conn.groupMetadata(m.chat);
    const groupName = groupMetadata.subject;
    const totalMembers = participants.length;

    const senderAdmin = groupMetadata.participants.find(p => p.id === m.sender)?.admin;
    if (!senderAdmin) return m.reply("⚠️ *Solo los admins pueden usar este comando.*");

    // Imagen del grupo
    let groupImg;
    try {
        groupImg = await conn.profilePictureUrl(m.chat, "image");
    } catch {
        groupImg = "https://pin.it/12HjutZX0";
    }

    // Lista de menciones
    const users = participants.map(u => u.id);

    // +30 emojis
    const emojis = [
        "🔥","⚡","⭐","🌙","🌟","💥","✨","💫","🌈","🍀","🍃","🌸","🌺",
        "🌼","🌻","🌹","💐","🪷","🐰","🐶","🐱","🦊","🐼","🐵","🦁","🐯",
        "🐸","🐢","🐙","🦋","🐝","🐳","🐬","🦄","🐞","🌪","⛄","🎃","🎉"
    ];

    // Mensaje armado
    let finalMsg = `📢 *MENCIÓN GLOBAL: ${groupName}*\n👥 *Miembros: ${totalMembers}*\n\n`;

    for (let user of users) {
        const emoji = emojis[Math.floor(Math.random() * emojis.length)];
        finalMsg += `${emoji} @${user.split("@")[0]}\n`;
    }

    // Enviar imagen del grupo con menciones
    await conn.sendMessage(m.chat, {
        image: { url: groupImg },
        caption: finalMsg,
        mentions: users
    });

    // Enviar audio
    const audioURL = "https://youtu.be/jKgxKoUtHPs?si=eUfUH-TLM96vNPs2"; // <-- CAMBIA ESTO
    await conn.sendMessage(m.chat, {
        audio: { url: audioURL },
        mimetype: "audio/mpeg",
        ptt: true
    });

    await conn.sendMessage(m.chat, { react: { text: "⚡", key: m.key } });

} catch (e) {
    console.error(e);
    await conn.sendMessage(m.chat, { react: { text: "❌", key: m.key } });
    m.reply("❌ *Error al ejecutar tagall.*");
}
};

handler.help = ["tagall", "todos", "all"];
handler.tags = ["group"];
handler.command = ["tagall", "todos", "all"];
handler.group = true;
handler.admin = true;

export default handler;
