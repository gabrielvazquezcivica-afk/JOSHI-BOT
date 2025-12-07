// setbye.js — Cambia la despedida personalizada por grupo

let handler = async (m, { conn, args, text }) => {

    if (!m.isGroup)
        return m.reply("❌ Este comando solo funciona en grupos.")

    let chat = global.db.data.chats[m.chat]
    if (!chat) global.db.data.chats[m.chat] = {}

    // Si no escriben texto → mostrar la despedida actual
    if (!text) {
        let actual = chat.bye ? chat.bye : "No hay despedida establecida."
        return m.reply(
            `👋 *Despedida actual del grupo:*\n\n${actual}\n\n` +
            `👉 *Usa:* .setbye mensaje`
        )
    }

    // Guardar nueva despedida
    chat.bye = text

    await conn.sendMessage(m.chat, {
        react: { text: "👋", key: m.key }
    })

    await m.reply(
        `✅ *Despedida actualizada*\n\n` +
        `Nuevo mensaje:\n${text}`
    )
}

handler.help = ["setbye <texto>"]
handler.tags = ["group"]
handler.command = ["setbye"]

handler.group = true
handler.admin = true

export default handler
