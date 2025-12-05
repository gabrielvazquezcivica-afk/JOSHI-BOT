// antilink.js
import { isCommandEnabled } from './enable.js';

const linkRegex = /(https?:\/\/[^\s]+|wa\.me\/[0-9]+|t\.me\/[^\s]+|instagram\.com\/[^\s]+|youtu\.be\/[^\s]+|youtube\.com\/[^\s]+|tiktok\.com\/[^\s]+)/i;

export async function antilinkHandler(conn, message) {
    const { from, key, message: msgObj, sender } = message;

    if (!from.endsWith('@g.us')) return;
    if (!isCommandEnabled(from, 'antilink')) return;

    const text = msgObj.conversation || msgObj.extendedTextMessage?.text;
    if (!text || !linkRegex.test(text)) return;

    try {
        await conn.sendMessage(from, { delete: key });
        await conn.sendMessage(from, {
            text: `⚠️ @${sender.split('@')[0]}, tu mensaje contenía un link prohibido y fue eliminado.`,
            mentions: [sender]
        });
    } catch (err) {
        console.log('Error en antilink:', err);
    }
}
