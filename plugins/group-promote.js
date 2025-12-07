// group-promote.js

default async (m, { conn }) => {
    try {

    if (!m.isGroup)
        return m.reply("❗ Este comando solo funciona en grupos.");

    if (!isAdmin && !isOwner)
        return m.reply("❗ Solo los admins pueden usar este comando.");

    if (!isBotAdmin)
        return m.reply("❗ Necesito ser admin para dar admins.");

    let user;
    
    // Opción 1: Respondieron a un mensaje
    if (m.quoted) {
        user = m.quoted.sender;

    // Opción 2: Mención @usuario
    } else if (m.mentionedJid?.length > 0) {
        user = m.mentionedJid[0];

    // Si no hay mención ni respuesta
    } else {
        return m.reply("❗ Menciona a un usuario o responde a un mensaje para darle admin.");
    }

    // Verificar si está en el grupo
    let miembro = participants.find(p => p.id === user);
    if (!miembro)
        return m.reply("❗ Ese usuario no está en el grupo.");

    // Verificar si YA es admin
    if (miembro.admin)
        return m.reply("❗ Ese usuario ya es admin.");

    // Reacción al comando
    await m.react("😎");

    try {
        await conn.groupParticipantsUpdate(m.chat, [user], "promote");
    } catch (e) {
        return m.reply("⚠️ No pude otorgar el admin.");
    }
};



// ======================================
// 📌 HANDLER AL FINAL DEL ARCHIVO
// ======================================
module.exports.cmd = ["promote", "daradmin", "gpromote", "adm"];
module.exports.help = ["promote (@user o responder mensaje)"];
module.exports.tags = ["group"];
