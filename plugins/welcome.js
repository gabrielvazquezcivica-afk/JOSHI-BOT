// welcome.js
import { isCommandEnabled } from './enable.js';

//////////////////////////////////////////////////////////////
// Aquí coloca los links HTTPS de los audios
const audioWelcome = 'https://youtu.be/p0ARd6JgGqg?si=MAK-S7BdtneopDHX';
const audioBye = 'https://youtu.be/H7yzKi3rYxk?si=gQrN_YGWvKjOptGX';
//////////////////////////////////////////////////////////////

export async function welcomeHandler(conn, message) {
    const { from, message: msgObj } = message;

    // Solo grupos
    if (!from.endsWith('@g.us')) return;

    // Verificar si welcome está habilitado
    if (!isCommandEnabled(from, 'welcome')) return;

    // Detectar participantes que entran o salen
    const participantsAdded = msgObj?.groupParticipants?.filter(p => p.action === 'add');
    const participantsRemoved = msgObj?.groupParticipants?.filter(p => p.action === 'remove');

    // Función para enviar foto, mensaje y audio
    async function sendWelcome(userId, isWelcome = true) {
        try {
            // Obtener foto de perfil del usuario, si no tiene usar la del bot
            let profilePic;
            try {
                profilePic = await conn.getProfilePicture(userId);
            } catch {
                profilePic = await conn.getProfilePicture(conn.user.id); // Foto del bot
            }

            const text = isWelcome
                ? `👋 Bienvenido @${userId.split('@')[0]} al grupo!`
                : `😢 @${userId.split('@')[0]} ha salido del grupo.`;

            // Enviar foto con mensaje
            await conn.sendMessage(from, {
                image: { url: profilePic },
                caption: text,
                mentions: [userId]
            });

            // Enviar audio
            const audioUrl = isWelcome ? audioWelcome : audioBye;
            await conn.sendMessage(from, {
                audio: { url: audioUrl },
                mimetype: 'audio/mpeg'
            });
        } catch (err) {
            console.log('Error en welcomeHandler:', err);
        }
    }

    // Procesar entradas
    if (participantsAdded && participantsAdded.length > 0) {
        for (let user of participantsAdded) {
            await sendWelcome(user.id, true);
        }
    }

    // Procesar salidas
    if (participantsRemoved && participantsRemoved.length > 0) {
        for (let user of participantsRemoved) {
            await sendWelcome(user.id, false);
        }
    }
}

// Función opcional para personalizar mensaje por grupo
export const setWelcomeMessage = (groupId, messageText) => {
    // Puedes implementar almacenamiento de mensajes personalizados por grupo
};
