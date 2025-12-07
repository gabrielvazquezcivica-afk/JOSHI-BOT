// setwelcome.js — Cambia la bienvenida personalizada por grupo

let handler = async (m, { conn, args, text }) => {

    if (!m.isGroup) 
        return m.reply("❌ Este comando solo funciona en grupos.")

    let chat = global.db.data.chats[m.chat]
    if (!chat) global.db.data.chats[m.chat] = {}

    // Si no escriben texto → mostrar la bienvenida actual
    if (!text) {
        let actual = chat.welcome ? chat.welcome : "No hay bienvenida establecida."
        return m.reply(
            `📩 *Bienvenida actual del grupo:*\n\n${actual}\n\n` +
            `👉 *Usa:* .setwelcome mensaje`
        )
    }

    // Guardar nueva bienvenida
    chat.welcome = text

    await conn.sendMessage(m.chat, {
        react: { text: "✅", key: m.key }
    })

    await m.reply(
        `🎉 *Bienvenida actualizada*\n\n` +
        `Nuevo mensaje:\n${text}`
    )
}

handler.help = ["setwelcome <texto>"]
handler.tags = ["group"]
handler.command = ["setwelcome"]

handler.group = true
handler.admin = true

export default handler
