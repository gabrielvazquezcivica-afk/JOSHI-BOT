const fs = require('fs');
const path = './config-welcome.json';

module.exports = {
    name: "setwelcome",
    alias: ["swelcome"],
    desc: "Configurar mensaje de bienvenida",
    category: "group",
    async execute(m, { conn, text, isAdmin }) {

        if (!m.isGroup) return m.reply("Este comando solo funciona en grupos.");
        if (!isAdmin) return m.reply("Solo administradores pueden usar este comando.");
        if (!text) return m.reply("Escribe el mensaje de bienvenida.\nEjemplo:\n.setwelcome Bienvenido @user a este grupo!");

        let config = fs.existsSync(path)
            ? JSON.parse(fs.readFileSync(path))
            : { welcome: {}, bye: {} };

        config.welcome[m.chat] = text;

        fs.writeFileSync(path, JSON.stringify(config, null, 2));

        m.reply("✅ *Mensaje de bienvenida actualizado para este grupo.*");
    }
};
