// autodetec.js – Detecta eventos del grupo automáticamente

let before = async (m, { conn }) => {
    if (!m.isGroup) return

    let botName = global.db.data.settings[conn.user.jid]?.botName || 'JOSHI-BOT'

    // ——— DETECCIÓN DE EVENTOS DEL GRUPO ——— //
    if (m.mtype === "groupUpdateMessage") {
        let up = m.message.groupUpdateMessage

        // CAMBIO DE NOMBRE
        if (up.groupName) {
            await conn.sendMessage(m.chat, {
                text: `🔔 *Nuevo nombre del grupo:*\n${up.groupName}`
            })
        }

        // CAMBIO DE DESCRIPCIÓN
        if (up.groupDescription) {
            await conn.sendMessage(m.chat, {
                text: `📝 *Se actualizó la descripción del grupo.*`
            })
        }

        // CAMBIO DE FOTO DEL GRUPO
        if (up.groupPhoto) {
            await conn.sendMessage(m.chat, {
                text: `🖼️ *La foto del grupo fue actualizada.*`
            })
        }

        // GRUPO CERRADO / ABIERTO
        if (up.announcement !== undefined) {
            if (up.announcement) {
                await conn.sendMessage(m.chat, {
                    text: `🚫 *El grupo está cerrado. Solo administradores pueden enviar mensajes.*`
                })
            } else {
                await conn.sendMessage(m.chat, {
                    text: `📣 *El grupo está abierto. Todos pueden enviar mensajes.*`
                })
            }
        }

        // SOLO ADMINS PUEDEN EDITAR INFO
        if (up.restrict !== undefined) {
            if (up.restrict) {
                await conn.sendMessage(m.chat, {
                    text: `🔒 *Solo administradores pueden editar la información del grupo.*`
                })
            } else {
                await conn.sendMessage(m.chat, {
                    text: `🔓 *Todos pueden editar la información del grupo.*`
                })
            }
        }
    }

    // ——— NUEVOS ADMINS / QUITAR ADMINS ——— //
    if (m.mtype === "groupParticipantsUpdate") {
        let ev = m.message.groupParticipantsUpdate
        let users = ev.participants

        for (let user of users) {

            // NUEVO ADMIN
            if (ev.action === "promote") {
                await conn.sendMessage(m.chat, {
                    text: `⭐ *Nuevo administrador:* @${user.split("@")[0]}`,
                    mentions: [user]
                })
            }

            // ADMIN REMOVIDO
            if (ev.action === "demote") {
                await conn.sendMessage(m.chat, {
                    text: `⚠️ *Administrador removido:* @${user.split("@")[0]}`,
                    mentions: [user]
                })
            }
        }
    }
}

export { before }
