const handler = async (m, { conn, participants, usedPrefix, command }) => {
try {
    // Reacción al usar el comando
    await conn.sendMessage(m.chat, { react: { text: "👢", key: m.key } });

    // Solo admins pueden usar
    const groupMetadata = await conn.groupMetadata(m.chat);
    const me = groupMetadata.participants.find(p => p.id === conn.user.jid);
    const isAdmin = me?.admin === "admin" || me?.admin === "superadmin";
    const senderAdmin = groupMetadata.participants.find(p => p.id === m.sender)?.admin;

    if (!senderAdmin) return m.reply("⚠️ *Solo admins pueden usar este comando.*");
    if (!isAdmin) return m.reply("⚠️ *Necesito ser admin para poder expulsar usuarios.*");

    // Obtener usuario por mención o respuesta
    let target;
    if (m.mentionedJid?.length) {
        target = m.mentionedJid[0];
    } else if (m.quoted) {
        target = m.quoted.sender;
    } else {
        return m.reply(`⚠️ *Debes mencionar a alguien o responder su mensaje.*\nEjemplo:\n${usedPrefix + command} @usuario`);
    }

    // Evitar expulsar a un admin
    const targetInGroup = groupMetadata.participants.find(p => p.id === target);
    if (targetInGroup?.admin) return m.reply("❌ *No puedo expulsar a un admin.*");

    // Ejecutar expulsión
    await conn.groupParticipantsUpdate(m.chat, [target], "remove");

    // Reacción de éxito
    await conn.sendMessage(m.chat, { react: { text: "✔️", key: m.key } });

    // Mensaje final
    await conn.sendMessage(m.chat, {
        text: `👢 *Usuario expulsado exitosamente.*`
    });

} catch (err) {
    m.reply("❌ *Error al intentar expulsar al usuario.*");
    console.log(err);
}
};

handler.help = ["kick", "ban", "echar"];
handler.tags = ["group"];
handler.command = ["kick", "ban", "echar"]; 
handler.group = true;
handler.admin = true;

export default handler;
