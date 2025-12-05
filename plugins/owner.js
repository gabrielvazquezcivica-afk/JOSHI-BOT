module.exports = {
    command: "owner",
    exec: async ({ sock, from, isOwner, config }) => {
        if (!isOwner)
            return sock.sendMessage(from, { text: config.mensajes.soloOwner });

        await sock.sendMessage(from, { text: "Eres el owner ✔️" });
    }
};
