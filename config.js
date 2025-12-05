// ─────────────────────────────────────────────
// config.js — Configuración global del bot
// ─────────────────────────────────────────────

// Número del dueño del bot (owner)
global.owner = ["5210000000000"]; 
// Ejemplo México: 521234567890

// Número oficial donde se conectará el bot
global.botNumber = "5210000000000";
// Asegúrate que sea el MISMO número con el que escaneas el QR

// Nombre del bot
global.botName = "OdeBot";

// APIs disponibles (puedes agregar más)
global.APIs = {
    ejemplo: "https://api.ejemplo.com",
    otro: "https://api.otro.com"
};

// Claves de APIs
global.APIKeys = {
    "https://api.ejemplo.com": "API_KEY_AQUI",
    "https://api.otro.com": "OTRA_API_KEY"
};

// ─────────────────────────────
//   MENSAJES DEL BOT
// ─────────────────────────────
global.mensajes = {

    // Cuando el bot NO es admin
    botNoAdmin: "⚠️ *El bot necesita ser administrador* para usar este comando.",

    // Cuando el usuario NO es admin
    userNoAdmin: "❌ *Este comando solo lo pueden usar los administradores.*",

    // Cuando el comando es solo para el owner
    soloOwner: "🔐 Este comando solo puede usarlo el *owner del bot*.",

    // Cuando el comando es solo para grupos
    soloGrupos: "👥 Este comando solo funciona en *grupos*.",

    // Cuando el comando es solo para chats privados
    soloPrivado: "📩 Este comando solo funciona en *privado*.",

    // Cuando falta un parámetro
    faltaParametro: "❗ Te faltan parámetros para ejecutar este comando.",

    // Cuando ocurre algún error
    error: "❗ Ocurrió un error inesperado, inténtalo de nuevo.",

    // Comando deshabilitado
    deshabilitado: "🚫 Este comando está temporalmente deshabilitado."
};

// ─────────────────────────────
// Exportación para usar en otros archivos
// ─────────────────────────────
module.exports = {
    owner: global.owner,
    botNumber: global.botNumber,
    botName: global.botName,
    APIs: global.APIs,
    APIKeys: global.APIKeys,
    mensajes: global.mensajes
};
