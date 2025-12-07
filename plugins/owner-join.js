// owner-join.js — El bot entra al grupo por link y detecta si ya está dentro

let handler = async (m, { conn, text }) => {

    if (!global.owner.includes(m.sender.split("@")[0]))
        return m.reply("❌ Solo el owner puede usar este comando.")

    if (!text)
        return m.reply("📌 Envia el link del grupo.\n\nEjemplo:\n.ownerjoin https://chat.whatsapp.com/XXXX")

    // Detectar link
    let link = text.match(/chat\.whatsapp\.com\/([0-9A-Za-z]+)/)
    if (!link) return m.reply("❌ Link inválido.")

    let code = link[1]

    // Reacción
    await conn.sendMessage(m.chat, {
        react: { text: "🔗", key: m.key }
    })

    try {
        // Obtener información del grupo del link
        let groupInfo = await conn.groupGetInviteInfo(code)
        let groupId = groupInfo.id

        // DETECTAR SI EL BOT YA ESTÁ EN EL GRUPO
        let isInGroup = groupInfo.participants
            .some(p => p.id === conn.user.jid)

        if (isInGroup) {
            await conn.sendMessage(m.chat, {
                react: { text: "✔️", key: m.key }
            })
            return m.reply(`🤖 Ya estoy dentro del grupo *${groupInfo.subject}*, no necesito unirme.`)
        }

        // Unirse al grupo
        let res = await conn.groupAcceptInvite(code)

        // Audio URL
        let audioURL = "AQUI_TU_AUDIO.mp3" // Reemplaza con tu link HTTPS

        // Saludo al entrar
        await conn.sendMessage(res, {
            text: `🤖 *El bot se ha unido al grupo*\n\n¡Hola a todos! 😄`
        })

        // Enviar audio
        await conn.sendMessage(res, {
            audio: { url: audioURL },
            mimetype: "audio/mpeg",
            ptt: true
        })

        // Reacción
        await conn.sendMessage(res, {
            react: { text: "👋", key: m.key }
        })

    } catch (e) {
        console.log(e)
        return m.reply("⚠️ No pude unirme al grupo. Verifica el link o puede estar vencido.")
    }
}

handler.help = ["join <link>"]
handler.tags = ["owner"]
handler.command = ["join"]

handler.owner = true

export default handler
