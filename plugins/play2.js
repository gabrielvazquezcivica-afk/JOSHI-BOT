// play2.js
import axios from "axios";
import ytdl from "@distube/ytdl-core";
import { isCommandEnabled } from "./enable.js";

// ---------- AQUI VA TU API KEY ----------
const YT_API = "AIzaSyBDC1a2MaAyr2DE2qDnN9IVInwkWFZB348";
// -----------------------------------------

export const playVideoHandler = async (conn, m) => {
    try {
        const { from, sender, body } = m;

        if (!from.endsWith("@g.us")) return;

        // Verificar modoadmin
        const modoadminActivo = isCommandEnabled(from, "modoadmin");
        const groupMetadata = await conn.groupMetadata(from);
        const isAdmin = groupMetadata.participants.find(p => p.id === sender)?.admin;

        // Si modoadmin está activado y NO es admin → ignorar
        if (modoadminActivo && !isAdmin) return;

        const text = body.slice(6).trim();
        if (!text)
            return await conn.sendMessage(from, { text: "Debes escribir un nombre de video." });

        // Reacción mientras busca
        await conn.sendMessage(from, { react: { text: "📹", key: m.key } });

        // Buscar video
        const searchUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&q=${encodeURIComponent(text)}&key=${YT_API}&maxResults=1`;
        const response = await axios.get(searchUrl);

        if (!response.data.items.length)
            return await conn.sendMessage(from, { text: "No encontré videos." });

        const video = response.data.items[0];
        const videoId = video.id.videoId;
        const title = video.snippet.title;
        const channel = video.snippet.channelTitle;
        const thumbnail = video.snippet.thumbnails.high.url;
        const videoUrl = `https://www.youtube.com/watch?v=${videoId}`;

        // Obtener duración
        const infoUrl = `https://www.googleapis.com/youtube/v3/videos?id=${videoId}&part=contentDetails&key=${YT_API}`;
        const info = await axios.get(infoUrl);
        const duracionISO = info.data.items[0].contentDetails.duration;

        // ISO → duración normal
        const parseDuration = (d) => {
            const m = d.match(/PT(\d+H)?(\d+M)?(\d+S)?/);
            const h = (m[1] || "0H").replace("H", "");
            const mi = (m[2] || "0M").replace("M", "");
            const s = (m[3] || "0S").replace("S", "");
            return `${h !== "0" ? h + ":" : ""}${mi.padStart(2, "0")}:${s.padStart(2, "0")}`;
        };
        const duracion = parseDuration(duracionISO);

        // Tarjeta informativa
        await conn.sendMessage(from, {
            image: { url: thumbnail },
            caption: `🎬 *${title}*

👤 *Autor:* ${channel}
⏱️ *Duración:* ${duracion}
🔗 *Link:* ${videoUrl}

📥 *Descargando video...*`
        });

        // Descargar video MP4
        const videoStream = ytdl(videoUrl, {
            filter: "videoandaudio",
            quality: "highest"
        });

        // Unir los chunks a un Buffer
        const chunks = [];
        for await (const chunk of videoStream) chunks.push(chunk);
        const videoBuffer = Buffer.concat(chunks);

        // Enviar el VIDEO
        await conn.sendMessage(from, {
            video: videoBuffer,
            mimetype: "video/mp4",
            fileName: `${title}.mp4`,
            caption: title
        });

        // Reacción final ✔️
        await conn.sendMessage(from, { react: { text: "✅", key: m.key } });

    } catch (e) {
        console.log("Error en play2:", e);
    }
};

// ----------- HANDLER -------------
export const handler = {};
handler.help = ["play2"];
handler.tags = ["video"];
handler.command = /^\.play2$/i;
handler.group = true;
handler.function = playVideoHandler;
