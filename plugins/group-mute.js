// group-mute.js
import { delay } from '@adiwajshing/baileys';

let mutedUsers = {}; // { 'groupId': [userId1, userId2] }

export async function handleMute(conn, message) {
    const { from, sender, body } = message;
    const command = body.trim().toLowerCase();

    // Solo admin puede usarlo
    const groupMetadata = await conn.groupMetadata(from);
    const isAdmin = groupMetadata.participants
        .find(p => p.id === sender)?.admin;
    if (!isAdmin) return;

    if (command.startsWith('.mute ')) {
        const userToMute = command.split(' ')[1].replace(/@|\s/g, '') + '@s.whatsapp.net';
        if (!mutedUsers[from]) mutedUsers[from] = [];
        if (!mutedUsers[from].includes(userToMute)) mutedUsers[from].push(userToMute);

        await conn.sendMessage(from, { 
            text: `@${userToMute.split('@')[0]} ha sido muteado 🔇`, 
            mentions: [userToMute] 
        });
    } else if (command.startsWith('.unmute ')) {
        const userToUnmute = command.split(' ')[1].replace(/@|\s/g, '') + '@s.whatsapp.net';
        if (mutedUsers[from]) {
            mutedUsers[from] = mutedUsers[from].filter(u => u !== userToUnmute);
        }

        await conn.sendMessage(from, { 
            text: `@${userToUnmute.split('@')[0]} ha sido desmuteado 🔊`, 
            mentions: [userToUnmute] 
        });
    }
}

// Función que revisa cada mensaje enviado en el grupo
export async function checkMuted(conn, message) {
    const { from, sender, key } = message;
    if (mutedUsers[from] && mutedUsers[from].includes(sender)) {
        // Borra el mensaje enviado
        await conn.sendMessage(from, { delete: key });
    }
}

// Para integrar con el sistema de ayuda de comandos
export const handler = {};
handler.help = ['mute', 'unmute'];
handler.tags = ['group'];
handler.command = /^\.?(mute|unmute)$/i;
