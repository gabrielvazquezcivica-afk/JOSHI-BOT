const fs = require("fs");
const dbFile = "./database/config-grupos.json";

// Crear archivo si no existe
if (!fs.existsSync(dbFile)) {
    fs.writeFileSync(dbFile, JSON.stringify({}));
}

function cargarDB() {
    return JSON.parse(fs.readFileSync(dbFile));
}

function guardarDB(data) {
    fs.writeFileSync(dbFile, JSON.stringify(data, null, 2));
}

module.exports = {
    command: "enable",
    alias: ["on", "off", "activar", "desactivar", "config"],
    exec: async ({ sock, msg, from, isGroup, isAdmin, isOwner, config, args }) => {
        try {
            if (!isGroup)
                return sock.sendMessage(from, { text: config.mensajes.noGrupo });

            if (!isAdmin && !isOwner)
                return sock.sendMessage(from, { text: config.mensajes.noAdmin });

            if (args.length < 2)
                return sock.sendMessage(from, { 
                    text: `❗ *Uso correcto:*\n.enable <función> <on/off>\n\nEjemplo:\n.enable antilink on`
                });

            const opcion = args[0].toLowerCase();
            const estado = args[1].toLowerCase();

            const validos = ["on", "off"];
            if (!validos.includes(estado)) {
                return sock.sendMessage(from, { text: "❗ Usa: on / off" });
            }

            // Cargar base de datos
            const db = cargarDB();
            if (!db[from]) db[from] = {};

            // Guardar el cambio
            db[from][opcion] = estado === "on";
            guardarDB(db);

            await sock.sendMessage(from, {
                text: `⚙️ *Configuración actualizada*\n\n🔧 Función: *${opcion}*\n📌 Estado: *${estado.toUpperCase()}*`
            });

        } catch (e) {
            console.log("Error en enable.js:", e);
        }
    }
};
