// modoadmin.js
import { isCommandEnabled } from './enable.js';

export async function modoadminHandler(conn, message) {
    const { from, sender, message: msgObj } = message;

    if (!from.endsWith('@g.us')) return;
    if (!isCommandEnabled(from, 'modoadmin')) return;

    const groupMetadata = await conn.groupMetadata(from);
    const isUserAdmin = groupMetadata.participants.find(p => p.id === sender)?.admin;

    if (!isUserAdmin) {
        try {
            await conn.sendMessage(from, {
                text: `⚠️ @${sender.split('@')[0]}, este comando solo puede ser usado por admins.`,
                mentions: [sender]
            });
        } catch (err) {
            console.log('Error en modoadmin:', err);
        }
    }

    // Aquí puedes agregar más funciones de moderación para admins
}
