import fetch from 'node-fetch'; // Si usas Node 18+, fetch ya viene incluido
import path from 'path';

// Lista de emojis (igual que antes)
const emojis = ['😂','🤣','😍','🥰','😎','😜','🤪','🤩','😏','😇','🥳','🤯','😱','😅','😆','😋','😛','😝','😤','😢','😭','😡','🤬','💀','👻','👽','🤖','🎃','😺','😸','😹','😻','😼','😽','🙀'];

function shuffle(array) {
    return array.sort(() => Math.random() - 0.5);
}

export async function tagAll(conn, message) {
    const { from, sender } = message;

    const groupMetadata = await conn.groupMetadata(from);
    const participants = groupMetadata.participants.map(p => p.id);

    const isAdmin = groupMetadata.participants.find(p => p.id === sender)?.admin;
    if (!isAdmin) return;

    const shuffledEmojis = shuffle([...emojis]);
    const mentionsText = participants.map((p, i) => {
        const emoji = shuffledEmojis[i % shuffledEmojis.length];
        return `${emoji} @${p.split('@')[0]}`;
    }).join(' ');

    // URL de tu audio
    const audioURL = 'https://youtu.be/jKgxKoUtHPs?si=jgRJ4gQUBAhK0o8u'; // <--- Aquí pones tu link HTTPS

    // Descargar audio desde la URL
    const res = await fetch(audioURL);
    if (!res.ok) return;
    const audioBuffer = await res.arrayBuffer();

    // Enviar mensaje con audio y menciones
    await conn.sendMessage(from, {
        audio: Buffer.from(audioBuffer),
        mimetype: 'audio/mpeg',
        ptt: true,
        caption: mentionsText,
        mentions: participants
    });
}

// Integración con sistema de ayuda
export const handler = {};
handler.help = ['todos'];
handler.tags = ['group'];
handler.command = /^\.?(todos)$/i;
