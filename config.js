// ===============================
//        CONFIGURACIÓN GLOBAL
// ===============================

// Nombre del bot
global.botName = "JOSHI-BOT";           // <=== AQUÍ PONES EL NOMBRE DEL BOT

// Dueño del bot
global.owner = ["523310167470"];       // Número del owner

// Número del bot
global.botNumber = "18549995761";

// Prefijo de comandos
global.prefix = ".";

// ==== APIS ====
global.APIs = {
    zenz: 'https://zenzapis.xyz',
    lol: 'https://api.lolhuman.xyz',
    neko: 'https://neko-api.com'
};

// ==== API KEYS ====
global.APIKeys = {
    'https://zenzapis.xyz': 'your-api-key-here',
    'https://api.lolhuman.xyz': 'your-api-key-here',
    'https://neko-api.com': 'your-api-key-here'
};

// ===============================
//        AUTO-RELOAD CONFIG
// ===============================

import fs from "fs";
let file = new URL(import.meta.url).pathname;

fs.watchFile(file, () => {
    fs.unwatchFile(file);
    console.log(`\n[ AUTO-RELOAD ] Se actualizó → ${file}`);
    import(`${import.meta.url}?update=${Date.now()}`);
});

export default config;
