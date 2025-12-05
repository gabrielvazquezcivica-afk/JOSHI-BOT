// ─────────────────────────────────────────────
// AntiLink — Detecta links, advierte y borra mensaje
// ─────────────────────────────────────────────

module.exports = {
    command: "antilink", // No se usa como comando, pero se registra
    exec: async ({ sock, msg, from, isGroup, isBotAdmin, isAdmin, config }) => {
        try {
            if (!isGroup) return; // Solo funciona en grupos

            // Obtener texto del mensaje
            const texto =
                msg.message?.conversation ||
                msg.message?.extendedTextMessage?.text ||
                "";

            if (!texto) return;

            // Detectar enlaces
            const regexLink = /(https?:\/\/[^\s]+)/gi;
            const contieneLink = regexLink.test(texto);

            if (!contieneLink) return; // No hay link → ignorar

            // Si el bot NO es admin → no actuar
            if (!isBotAdmin) {
                return sock.sendMessage(from, {
                    text: config.mensajes.botNoAdmin
                });
            }

            // Si el que envía es admin → no borrar
            if (isAdmin) return;

            const usuario = msg.key.participant || msg.key.remoteJid;

            // Advertencia mencionando
            await sock.sendMessage(from, {
                text: `⚠️ *Advertencia:* @${usuario.split("@")[0]} envió un link no permitido.`,
                mentions: [usuario]
            });

            // Borrar el mensaje
            await sock.sendMessage(from, {
                delete: msg.key
            });

        } catch (e) {
            console.log("Error en AntiLink:", e);
        }
    }
};
