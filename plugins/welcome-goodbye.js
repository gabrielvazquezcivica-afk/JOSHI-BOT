const fs = require('fs');
const path = './config-welcome.json';

module.exports = async (conn, m, update) => {
    try {
        if (!update || !update[0]) return;

        let action = update[0].action;
        let participants = update[0].participants;
        let id = update[0].id;

        // Cargar configuración
        let config = fs.existsSync(path)
            ? JSON.parse(fs.readFileSync(path))
            : { welcome: {}, bye: {} };

        // Foto del grupo
        let pp_group;
        try { pp_group = await conn.profilePictureUrl(id, "image"); } catch { pp_group = null; }

        for (let user of participants) {

            // Foto del usuario
            let pp_user;
            try { pp_user = await conn.profilePictureUrl(user, "image"); } catch { pp_user = null; }

            // MENSAJE PERSONALIZADO O PREDETERMINADO
            const welcomeMsg =
                config.welcome[id] ||
                `🌟 *BIENVENIDO/A* 🌟\n@user ha entrado al grupo.\n\n> JOSHI-BOT`;

            const byeMsg =
                config.bye[id] ||
                `👋 *ADIÓS* 👋\n@user ha salido del grupo.\n\n> JOSHI-BOT`;

            // Remplazar @user
            const textWelcome = welcomeMsg.replace(/@user/g, '@' + user.split("@")[0]);
            const textBye = byeMsg.replace(/@user/g, '@' + user.split("@")[0]);

            // BIENVENIDA
            if (action === "add") {
                if (pp_user) {
                    await conn.sendMessage(id, {
                        image: { url: pp_user },
                        caption: textWelcome,
                        mentions: [user]
                    });
                } else {
                    await conn.sendMessage(id, { text: textWelcome, mentions: [user] });
                }
            }

            // DESPEDIDA
            if (action === "remove") {
                if (pp_user) {
                    await conn.sendMessage(id, {
                        image: { url: pp_user },
                        caption: textBye,
                        mentions: [user]
                    });
                } else {
                    await conn.sendMessage(id, { text: textBye, mentions: [user] });
                }
            }
        }

    } catch (e) {
        console.log("Error en welcome-goodbye:", e);
    }
};
