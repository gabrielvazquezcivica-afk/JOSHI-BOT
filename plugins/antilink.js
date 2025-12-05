// antilink.js
import fs from 'fs';
import path from 'path';

// Importar la función de enable.js para verificar si el comando está activo
import { isCommandEnabled } from './enable.js'; // Asegúrate que enable.js exporte esta función

// Archivo JSON para persistir antilink activado por grupo
const configPath = path.join('./antilink.json');

let antilinkGroups = {};
if (fs.existsSync(configPath)) {
    antilinkGroups = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
} else {
    fs.writeFileSync(configPath, JSON.stringify(antilinkGroups, null, 2));
}

function saveConfig() {
    fs.writeFileSync(configPath, JSON.stringify(antilinkGroups, null, 2));
}

// Detecta tipo de link
function detectLinkType(text) {
    if (/wa\.me\/[0-9]+/i.test(text)) return 'WhatsApp';
    if (/t\.me\/[^\s]+/i.test(text)) return 'Telegram';
    if (/youtu\.be\/[^\s]+|youtube\.com\/[^\s]+/i.test(text)) return 'YouTube';
    if (/instagram\.com\/[^\s]+/i.test(text)) return 'Instagram';
    if (/tiktok\.com\/[^\s]+/i.test(text)) return 'TikTok';
    if (/https?:\/\/[^\s]+/i.test(text)) return 'URL';
    return null;
}

// Función principal que se llama desde el mensaje entrante
export async function antilinkHandler(conn, message) {
    const { from, key, message: msgObj } = message;

    // Solo grupos
    if (!from.endsWith('@g.us')) return;

    // Revisar si antilink está activado en el grupo
    if (!antilinkGroups[from]) return;

    // Verificar si el comando "antilink" está habilitado en enable.js
    if (!isCommandEnabled(from, 'antilink')) return;

    const text = msgObj.conversation || msgObj.extendedTextMessage?.text;
    if (!text) return;

    const linkType = detectLinkType(text);
    if (!linkType) return;

    try {
        const sender = message.sender;

        // Borrar mensaje
        await conn.sendMessage(from, { delete: key });

        // Mensaje personalizado según tipo de link
        let response = `⚠️ @${sender.split('@')[0]}, se ha borrado tu mensaje porque contenía un link prohibido.`;

        switch (linkType) {
            case 'WhatsApp':
                response = `⚠️ @${sender.split('@')[0]}, enlaces de WhatsApp no están permitidos.`;
                break;
            case 'Telegram':
                response = `⚠️ @${sender.split('@')[0]}, enlaces de Telegram no están permitidos.`;
                break;
            case 'YouTube':
                response = `⚠️ @${sender.split('@')[0]}, enlaces de YouTube están prohibidos.`;
                break;
            case 'Instagram':
                response = `⚠️ @${sender.split('@')[0]}, enlaces de Instagram no están permitidos.`;
                break;
            case 'TikTok':
                response = `⚠️ @${sender.split('@')[0]}, enlaces de TikTok eliminados.`;
                break;
            case 'URL':
                response = `⚠️ @${sender.split('@')[0]}, enlaces externos no están permitidos.`;
                break;
        }

        await conn.sendMessage(from, {
            text: response,
            mentions: [sender]
        });
    } catch (err) {
        console.log('Error al borrar mensaje de link:', err);
    }
}

// Funciones para activar/desactivar antilink desde admin
export async function toggleAntilink(conn, message) {
    const { from, sender, body } = message;
    const args = body.trim().split(/\s+/);
    const command = args[0].toLowerCase();

    // Solo admins
    const groupMetadata = await conn.groupMetadata(from);
    const isAdmin = groupMetadata.participants.find(p => p.id === sender)?.admin;
    if (!isAdmin) return;

    if (command === '.antilinkon') {
        antilinkGroups[from] = true;
        saveConfig();
        await conn.sendMessage(from, { text: '✅ Antilink activado en este grupo.' });
    } else if (command === '.antilinkoff') {
        antilinkGroups[from] = false;
        saveConfig();
        await conn.sendMessage(from, { text: '❌ Antilink desactivado en este grupo.' });
    }
                                 }
