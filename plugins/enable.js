// enable.js
import fs from 'fs';
import path from 'path';

const configPath = path.join('./enable.json');

// Cargar configuración al iniciar
let enabledCommands = {};
if (fs.existsSync(configPath)) {
    enabledCommands = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
} else {
    fs.writeFileSync(configPath, JSON.stringify(enabledCommands, null, 2));
}

// Guardar cambios en JSON
function saveConfig() {
    fs.writeFileSync(configPath, JSON.stringify(enabledCommands, null, 2));
}

/**
 * Activar un comando en un grupo
 * @param {string} groupId 
 * @param {string} command 
 */
export function enableCommand(groupId, command) {
    if (!enabledCommands[groupId]) enabledCommands[groupId] = [];
    if (!enabledCommands[groupId].includes(command)) {
        enabledCommands[groupId].push(command);
        saveConfig();
    }
}

/**
 * Desactivar un comando en un grupo
 * @param {string} groupId 
 * @param {string} command 
 */
export function disableCommand(groupId, command) {
    if (!enabledCommands[groupId]) return;
    enabledCommands[groupId] = enabledCommands[groupId].filter(c => c !== command);
    saveConfig();
}

/**
 * Verificar si un comando está habilitado en un grupo
 * @param {string} groupId 
 * @param {string} command 
 * @returns {boolean}
 */
export function isCommandEnabled(groupId, command) {
    if (!enabledCommands[groupId]) return true; // Por defecto activo si no hay configuración
    return enabledCommands[groupId].includes(command);
}

/**
 * Comando admin para habilitar/deshabilitar plugins
 * @param {*} conn 
 * @param {*} message 
 */
export async function toggleCommand(conn, message) {
    const { from, sender, body } = message;
    const args = body.trim().split(/\s+/);
    const command = args[0].toLowerCase();
    const targetCommand = args[1];

    if (!targetCommand) return await conn.sendMessage(from, { text: 'Debes indicar el comando a activar/desactivar.' });

    // Solo admins
    const groupMetadata = await conn.groupMetadata(from);
    const isAdmin = groupMetadata.participants.find(p => p.id === sender)?.admin;
    if (!isAdmin) return;

    switch (targetCommand.toLowerCase()) {
        case 'antilink':
            if (command === '.enable') enableCommand(from, 'antilink');
            else if (command === '.disable') disableCommand(from, 'antilink');
            break;

        case 'welcome':
            if (command === '.enable') enableCommand(from, 'welcome');
            else if (command === '.disable') disableCommand(from, 'welcome');
            break;

        case 'modoadmin':
            if (command === '.enable') enableCommand(from, 'modoadmin');
            else if (command === '.disable') disableCommand(from, 'modoadmin');
            break;

        default:
            await conn.sendMessage(from, { text: `❌ Comando desconocido: ${targetCommand}` });
            return;
    }

    const status = command === '.enable' ? 'activado' : 'desactivado';
    await conn.sendMessage(from, { text: `✅ ${targetCommand} ${status} en este grupo.` });
}

// ------------------- HANDLER -------------------
export const handler = {};
handler.help = ['enable', 'disable'];
handler.tags = ['group'];
handler.command = /^\.?(enable|disable)$/i;
handler.group = true; // Solo para grupos
handler.admin = true; // Solo admins pueden usar
handler.function = toggleCommand; // Función que se ejecuta
