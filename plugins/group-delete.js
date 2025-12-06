// grupo-delete.js

module.exports = async (m, { conn, isAdmin, isOwner, isBotAdmin }) => {

    if (!m.isGroup)
        return m.reply("❗ Este comando solo funciona en grupos.");

    if (!isAdmin && !isOwner)
        return m.reply("❗ Solo los admins pueden usar este comando.");

    if (!isBotAdmin)
        return m.reply("❗ Necesito ser admin para eliminar mensajes.");

    // Debe responder a un mensaje
    if (!m.quoted)
        return m.reply("❗ Responde al mensaje que quieras borrar.\nEjemplo:\n.del <responde al mensaje>");

    // Obtener el mensaje a borrar
    let target = m.quoted.key;

    await m.react("🗑️");

    try {
        await conn.sendMessage(m.chat, {
            delete: target
        });
    } catch (e) {
        return m.reply("⚠️ No pude borrar ese mensaje.");
    }
};



// ===============================
// 📌 HANDLER AL FINAL DEL ARCHIVO
// ===============================
module.exports.cmd = ["del", "delete", "dl"];
module.exports.help = ["del (responde un mensaje)"];
module.exports.tags = ["group"];
