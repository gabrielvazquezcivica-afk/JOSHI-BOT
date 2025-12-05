// ─────────────────────────────────────────────
// pluginsLoader.js — Carga dinámica de plugins
// ─────────────────────────────────────────────

const fs = require("fs");
const path = require("path");

function cargarPlugins() {
    const pluginsDir = path.join(__dirname, "plugins");
    const archivos = fs.readdirSync(pluginsDir);

    let plugins = {};

    archivos.forEach(file => {
        if (file.endsWith(".js")) {
            const pluginPath = path.join(pluginsDir, file);
            const plugin = require(pluginPath);

            if (plugin.command) {
                plugins[plugin.command] = plugin;
            }
        }
    });

    return plugins;
}

module.exports = cargarPlugins;
