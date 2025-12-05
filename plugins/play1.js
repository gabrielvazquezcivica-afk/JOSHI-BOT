// play1.js
import axios from "axios";
import ytdl from "@distube/ytdl-core";
import { isCommandEnabled } from "./enable.js";

// ---------------- TU API KEY ----------------
const YT_API = "AQUI_TU_API_KEY"; // <--- REEMPLAZA ESTO
// --------------------------------------------

export const playHandler = async (conn, m) => {
    try {
        const { from, sender, body } = m;

        if (!from.endsWith("@g.us")) return;

        // Verificar modoadmin
        const modoadminActivo = isCommandEnabled(from, "modoadmin");
        const groupMetadata = await conn.groupMetadata(from);
        const isAdmin = groupMetadata.participants.find(p => p.id === sender)?.admin;

        // Si modoadmin está activo → solo admins pueden usar
        if (modoadminActivo && !isAdmin) return;

        const text = body.slice(5).trim();
        if (!text) return await conn.sendMessage(from, { text: "Debes escribir un nombre de canción." });

        // React emoji mientras busca
        await conn.sendMessage(from, { react: { text: "🎧", key: m.key } });

        // Buscar en YouTube
        const searchUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&q=${encodeURIComponent(text)}&key=${YT_API}&maxResults=1`;
        const response = await axios.get(searchUrl);

        if (!response.data.items.length)
            return await conn.sendMessage(from, { text: "No encontré resultados." });

        const video = response.data.items[0];
        const videoId = video.id.videoId;
        const videoTitle = video.snippet.title;
        const channel = video.snippet.channelTitle;
        const thumbnail = video.snippet.thumbnails.high.url;
        const videoUrl = `https://www.youtube.com/watch?v=${videoId}`;

        // Obtener duración y más datos
        const videoInfoUrl = `https://www.googleapis.com/youtube/v3/videos?id=${videoId}&part=contentDetails&key=${YT_API}`;
        const infoRes = await axios.get(videoInfoUrl);
        const duracionISO = infoRes.data.items[0].contentDetails.duration;

        // Convertir ISO 8601 → normal
        const parseDuration = (ytDur) => {
            const match = ytDur.match(/PT(\d+H)?(\d+M)?(\d+S)?/);
            const h = (match[1] || "0H").replace("H", "");
            const m = (match[2] || "0M").replace("M", "");
            const s = (match[3] || "0S").replace("S", "");
            return `${h !== "0" ? h + ":" : ""}${m.padStart(2, "0")}:${s.padStart(2, "0")}`;
        };
        const duracion = parseDuration(duracionISO);

        // Enviar tarjeta informativa
        await conn.sendMessage(from, {
            image: { url: thumbnail },
            caption: `🎶 *${videoTitle}*

👤 *Artista:* ${channel}
⏱️ *Duración:* ${duracion}
🔗 *Link:* ${videoUrl}

🎧 *Descargando audio...*`
        });

        // Descargar audio
        const audioStream = ytdl(videoUrl, {
            filter: "audioonly",
            quality: "highestaudio"
        });

        // Guardar el audio temporalmente
        const chunks = [];
        for await (const chunk of audioStream) chunks.push(chunk);
        const audioBuffer = Buffer.concat(chunks);

        // Enviar MP3
        await conn.sendMessage(from, {
            audio: audioBuffer,
            mimetype: "audio/mpeg",
            fileName: `${videoTitle}.mp3`
        });

        // React con palomita verde
        await conn.sendMessage(from, { react: { text: "✅", key: m.key } });

    } catch (e) {
        console.log("Error en play:", e);
    }
};

// ------------------- HANDLER -------------------
export const handler = {};
handler.help = ["play"];
handler.tags = ["music"];
handler.command = /^\.play$/i;  // (.play Nombre)
handler.group = true;
handler.function = playHandler;
