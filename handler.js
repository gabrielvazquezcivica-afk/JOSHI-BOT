import config from './config.js'
import fs from 'fs'
import path from 'path'

export default async function handler(conn, m) {
    try {
        // Verifica que el mensaje exista
        if (!m || !m.message) return;

        const from = m.key.remoteJid;
        const isGroup = from.endsWith('@g.us');
        const sender = m.key.participant || m.key.remoteJid;
        
        // Texto del mensaje
        const type = Object.keys(m.message)[0];
        const body = 
            type === 'conversation' ? m.message.conversation :
            type === 'extendedTextMessage' ? m.message.extendedTextMessage.text :
            type === 'imageMessage' ? (m.message.imageMessage.caption || '') :
            type === 'videoMessage' ? (m.message.videoMessage.caption || '') :
            '';

        // Detectar prefijo
        const prefix = config.PREFIX;
        const isCmd = body.startsWith(prefix);
        const command = isCmd ? body.slice(prefix.length).trim().split(/ +/).shift().toLowerCase() : '';
        const args = isCmd ? body.trim().split(/ +/).slice(1) : [];

        // Cargar plugins (.js) dinámicamente
        const pluginFolder = './plugins';
        const plugins = fs.readdirSync(pluginFolder).filter(f => f.endsWith('.js'));

        for (let file of plugins) {
            try {
                const pluginPath = path.resolve(pluginFolder, file);
                const plugin = (await import('file://' + pluginPath)).default;

                // Si el plugin está hecho para eventos (ej. antilink)
                if (plugin && plugin.event && typeof plugin.event === 'function') {
                    await plugin.event({ conn, m, body, isGroup, sender, config });
                }

                // Si es comando
                if (isCmd && plugin && plugin.command) {
                    if (plugin.command.includes(command)) {
                        
                        // Verificar si solo owner puede usarlo
                        if (plugin.owner && !config.OWNER_NUMBERS.includes(sender.split('@')[0])) {
                            return conn.sendMessage(from, { text: config.MSG.notOwner }, { quoted: m });
                        }

                        // Ejecutar plugin
                        await plugin.run({ conn, m, args, from, isGroup, sender, command, config });
                    }
                }
            } catch (err) {
                console.log("Error en plugin:", err);
            }
        }

    } catch (e) {
        console.log("Error Handler:", e);
    }
}
