const fs = require('fs');
const path = './config-welcome.json';

module.exports = {
    name: "setbye",
    alias: ["sbye"],
    desc: "Configurar mensaje de despedida",
    category: "group",
    async execute(m, { conn, text, isAdmin }) {

        if (!m.isGroup) return m.reply("Este comando solo funciona en grupos.");
        if (!isAdmin) return m.reply("Solo administradores pueden usar este comando.");
        if (!text) return m.reply("Escribe el mensaje de despedida.\nEjemplo:\n.setbye Adiós @user, cuídate!");

        let config = fs.existsSync(path)
            ? JSON.parse(fs.readFileSync(path))
            : { welcome: {}, bye: {} };

        config.bye[m.chat] = text;

        fs.writeFileSync(path, JSON.stringify(config, null, 2));

        m.reply("✅ *Mensaje de despedida actualizado para este grupo.*");
    }
};
