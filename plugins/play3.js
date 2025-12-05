// play3.js
import { isCommandEnabled } from './enable.js';
import ytdl from '@distube/ytdl-core';
import fetch from 'node-fetch';

const API_KEY = "AIzaSyBDC1a2MaAyr2DE2qDnN9IVInwkWFZB348"; // <-- TU API DE YOUTUBE

export const handler = {
    help: ['play3'],
    tags: ['music'],
    command: /^\.?(play3)$/i,
    group: true,
    async function(conn, message) {

        const { from, sender, body } = message;
        const text = body.split(/\s+/).slice(1).join(" ");

        if (!text) return await conn.sendMessage(from, { text: "Debes escribir un nombre o link." });

        // --- MODADMIN: RESTRICCIÓN ---
        if (isCommandEnabled(from, 'modoadmin')) {

            const groupMetadata = await conn.groupMetadata(from);
            const isAdmin = groupMetadata.participants.find(p => p.id === sender)?.admin;

            if (!isAdmin) return; // No mensaje, NO AVISA
        }

        try {
            // Reacción 1
            await conn.sendMessage(from, { react: { text: "🔍", key: message.key } });

            // BUSCAR EN YOUTUBE
            const ytUrl = `https://www.googleapis.com/youtube/v3/search?key=${API_KEY}&part=snippet&type=video&q=${encodeURIComponent(text)}&maxResults=1`;

            const res = await fetch(ytUrl);
            const data = await res.json();

            if (!data.items || data.items.length === 0) {
                if (!isCommandEnabled(from, 'modoadmin')) {
                    await conn.sendMessage(from, { text: "No encontré resultados." });
                }
                return;
            }

            const videoId = data.items[0].id.videoId;
            const videoUrl = `https://www.youtube.com/watch?v=${videoId}`;

            // DESCARGAR MP3
            const stream = ytdl(videoUrl, {
                filter: "audioonly",
                quality: "highestaudio"
            });

            let chunks = [];
            for await (const chunk of stream) {
                chunks.push(chunk);
            }

            const audioBuffer = Buffer.concat(chunks);

            // Reacción 2
            await conn.sendMessage(from, { react: { text: "🎵", key: message.key } });

            // ENVIAR AUDIO COMO DOCUMENTO
            await conn.sendMessage(from, {
                document: audioBuffer,
                mimetype: "audio/mpeg",
                fileName: `music-${videoId}.mp3`
            });

        } catch (err) {
            console.log("Error en play3:", err);
            if (!isCommandEnabled(from, 'modoadmin')) {
                await conn.sendMessage(from, { text: "Hubo un error al procesar tu solicitud." });
            }
        }
    }
};
