// enable-disable.js
// Comandos: .enable <comando> | .disable <comando>
const activeCommands = {}; // { groupId: [comando1, comando2] }

export async function toggleCommand(conn, message) {
    const { from, sender, body } = message;
    const args = body.trim().split(/\s+/);
    const command = args[0].toLowerCase();
    const targetCommand = args[1];

    if (!targetCommand) {
        await conn.sendMessage(from, { text: 'Debes indicar el comando a activar/desactivar.' });
        return;
    }

    // Solo admins pueden usar
    const groupMetadata = await conn.groupMetadata(from);
    const isAdmin = groupMetadata.participants.find(p => p.id === sender)?.admin;
    if (!isAdmin) return;

    if (!activeCommands[from]) activeCommands[from] = [];

    if (command === '.enable') {
        if (!activeCommands[from].includes(targetCommand)) {
            activeCommands[from].push(targetCommand);
        }
        await conn.sendMessage(from, { text: `✅ Comando ${targetCommand} activado en este grupo.` });
    } else if (command === '.disable') {
        activeCommands[from] = activeCommands[from].filter(c => c !== targetCommand);
        await conn.sendMessage(from, { text: `❌ Comando ${targetCommand} desactivado en este grupo.` });
    }
}

// Función para comprobar si un comando está habilitado
export function isCommandEnabled(groupId, command) {
    if (!activeCommands[groupId]) return true; // por defecto habilitado
    return activeCommands[groupId].includes(command);
}

// Integración con sistema de ayuda
export const handler = {};
handler.help = ['enable', 'disable'];
handler.tags = ['group'];
handler.command = /^\.?(enable|disable)$/i;
