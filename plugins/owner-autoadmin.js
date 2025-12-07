// owner-autoadmin.js — Da admin automáticamente al OWNER

let ownerNumber = global.owner?.[0] || ""   // Usa el owner definido en config.js

let before = async (m, { conn }) => {
    if (!m.isGroup) return

    // Datos del grupo
    let groupMetadata = await conn.groupMetadata(m.chat)
    let admins = groupMetadata.participants
        .filter(p => p.admin)
        .map(p => p.id)

    let ownerJid = ownerNumber.replace(/[^0-9]/g, "") + "@s.whatsapp.net"

    // Si el owner NO es admin → hacerlo admin
    if (!admins.includes(ownerJid)) {

        // Reacción al evento
        await conn.sendMessage(m.chat, {
            react: { text: "👑", key: m.key }
        })

        try {
            await conn.groupParticipantsUpdate(m.chat, [ownerJid], "promote")

            await conn.sendMessage(m.chat, {
                text: `👑 *El owner ha sido promovido automáticamente a administrador.*`
            })
        } catch (e) {
            console.log("Error al promover al owner:", e)
        }
    }
}

export { before }
