// group-config.js

module.exports = async (m, { conn, args, command, isAdmin, isOwner, isBotAdmin }) => {

    if (!m.isGroup)
        return m.reply("❗ Este comando solo funciona en grupos.");

    if (!isAdmin && !isOwner)
        return m.reply("❗ Solo los admins pueden usar este comando.");

    if (!isBotAdmin)
        return m.reply("❗ Necesito ser admin para realizar esta acción.");

    // Acción: abrir o cerrar
    let action = (args[0] || "").toLowerCase();

    switch (action) {

        // =========================
        //         ABRIR GRUPO
        // =========================
        case "abrir":
        case "open":
            await m.react("🔓");

            // Abre el grupo
            await conn.groupSettingUpdate(m.chat, "not_announcement");

            // NO mandamos mensaje, lo manda enable.js
        break;


        // =========================
        //        CERRAR GRUPO
        // =========================
        case "cerrar":
        case "close":
            await m.react("🔒");

            // Cierra el grupo
            await conn.groupSettingUpdate(m.chat, "announcement");

            // NO mandamos mensaje, lo manda enable.js
        break;


        // =========================
        //         AYUDA
        // =========================
        default:
            return m.reply(
                `⚙️ *Configuración del grupo*\n\n` +
                `Usa:\n` +
                `🔓 .grupo abrir\n` +
                `🔒 .grupo cerrar`
            );
    }
};



// =====================================
// 📌 HANDLER AL FINAL DEL ARCHIVO
// =====================================
module.exports.cmd = ["grupo"];
module.exports.help = ["grupo (abrir/cerrar)"];
module.exports.tags = ["group"];
