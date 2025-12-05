export default {
    name: "autodetect",
    event: async ({ conn, m, config }) => {
        try {
            // Solo eventos de grupos
            if (!m.messageStubType) return;
            const from = m.key.remoteJid;
            const actor = m.participant || m.key.participant || "Desconocido";

            let text = "";

            switch (m.messageStubType) {

                case 20: // Promover admin
                    text = `⚠️ *Cambio detectado*\n\n👤 Usuario promovido\n👑 *Acción realizada por:* @${actor.split("@")[0]}`;
                    break;

                case 21: // Degradar admin
                    text = `⚠️ *Cambio detectado*\n\n👤 Usuario degradado\n🔻 *Acción realizada por:* @${actor.split("@")[0]}`;
                    break;

                case 22: // Añadir usuarios
                    text = `⚠️ *Cambio detectado*\n\n👥 Usuario añadido\n➕ *Acción realizada por:* @${actor.split("@")[0]}`;
                    break;

                case 23: // Eliminar usuario
                    text = `⚠️ *Cambio detectado*\n\n🚫 Usuario eliminado\n❌ *Acción realizada por:* @${actor.split("@")[0]}`;
                    break;

                case 25: // Cambiar nombre del grupo
                    text = `⚠️ *Cambio detectado*\n\n✏️ Se cambió el *nombre del grupo*\n👤 *Acción realizada por:* @${actor.split("@")[0]}`;
                    break;

                case 26: // Cambiar foto del grupo
                    text = `⚠️ *Cambio detectado*\n\n🖼️ Se cambió la *foto del grupo*\n👤 *Acción realizada por:* @${actor.split("@")[0]}`;
                    break;

                case 28: // Cambiar descripción
                    text = `⚠️ *Cambio detectado*\n\n📄 Se cambió la *descripción del grupo*\n👤 *Acción realizada por:* @${actor.split("@")[0]}`;
                    break;

                case 29: // Ajuste de configuración "solo admins"
                    text = `⚠️ *Cambio detectado*\n\n🔐 El grupo ahora es *solo admins*\n⚙️ *Cambiado por:* @${actor.split("@")[0]}`;
                    break;

                case 30: // Ajuste de configuración "todos pueden mandar mensajes"
                    text = `⚠️ *Cambio detectado*\n\n🔓 El grupo ahora permite que *todos envíen mensajes*\n⚙️ *Cambiado por:* @${actor.split("@")[0]}`;
                    break;

                default:
                    return;
            }

            await conn.sendMessage(from, { 
                text, 
                mentions: [actor] 
            });
        } catch (e) {
            console.log("Error autodetect:", e);
        }
    }
                           }
