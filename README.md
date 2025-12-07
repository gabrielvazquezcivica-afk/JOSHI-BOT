# JOSHI-BOT – MD  
<div align="center">

```
██████╗  ██████╗ ███████╗██╗  ██╗██╗██╗     
██╔══██╗██╔═══██╗██╔════╝██║ ██╔╝██║██║     
██████╔╝██║   ██║█████╗  █████╔╝ ██║██║     
██╔══██╗██║   ██║██╔══╝  ██╔═██╗ ██║██║     
██║  ██║╚██████╔╝███████╗██║  ██╗██║███████╗
╚═╝  ╚═╝ ╚═════╝ ╚══════╝╚═╝  ╚═╝╚═╝╚══════╝
                 By Gabo
```

### ⚡ Multi-Device WhatsApp Bot  
🥇 Rápido • 🛡 Estable • 🚀 100% Personalizable  

<br>

![Status](https://img.shields.io/badge/STATUS-ACTIVE-brightgreen)
![Node](https://img.shields.io/badge/Node-%3E=18.0-green)
![Baileys](https://img.shields.io/badge/Baileys-MD-blue)
![Linux](https://img.shields.io/badge/Linux-Support-orange)
![Termux](https://img.shields.io/badge/Termux-Full%20Support-yellow)

</div>

---

# 📌 **Índice**
1. [Características](#-características)
2. [Instalación en Termux](#-instalación-termux)
3. [Instalación en VPS](#-instalación-en-vps)
4. [Sesión sin QR (CODEBOT)](#-activar-sesión-sin-qr)
5. [Estructura del Proyecto](#-estructura-del-proyecto)
6. [Lista de Comandos](#-lista-de-comandos)
7. [Actualizar Bot](#-actualizar-bot)
8. [Errores Comunes](#-errores-comunes)
9. [FAQ](#-faq)
10. [Créditos](#-créditos)

---

# ⚡ **Características**
✔ Sistema MultiDevice (MD)  
✔ Sesión sin QR (CODEBOT)  
✔ Autoadmin para el Owner  
✔ Bienvenida/despedida modificable  
✔ Antilink avanzado  
✔ Modo Admin  
✔ Menú animado con GIF + Imagen + Audio  
✔ Logs avanzados en consola  
✔ Autoreload del handler y plugins  
✔ Detección automática de:  
- Cambios de nombre de grupo  
- Cambios de foto  
- Cambios de descripción  
- Admin añadido/removido  
- Modos de restricción del grupo  
✔ Más de 40 comandos de grupo  

---

# 📱 **Instalación Termux**

### **1. Actualizar Termux**
```bash
pkg update && pkg upgrade -y
```

### **2. Instalar Node y Git**
```bash
pkg install nodejs git -y
```

### **3. Clonar el repositorio**
```bash
git clone https://github.com/tuusuario/JOSHI-BOT
cd JOSHI-BOT
```

### **4. Instalar dependencias**
```bash
npm install
```

### **5. Configurar config.js**
Edita:
```
botNumber: "521XXXXXXXXXX",
ownerNumber: "521XXXXXXXXXX"
```

### **6. Iniciar**
```bash
node index.js
```

---

# 🖥 **Instalación en VPS**

```bash
sudo apt update && sudo apt upgrade -y
sudo apt install git nodejs npm -y
git clone https://github.com/tuusuario/JOSHI-BOT
cd JOSHI-BOT
npm install
node index.js
```

---

# 🔐 **Activar Sesión SIN QR (CODEBOT)**

Cuando el bot inicie mostrará:

```
🔗 Ingresa este CODEBOT en tu WhatsApp:

👉 1234-5678
```

Abre WhatsApp → "Vincular dispositivo" → Usa ese código.

---

# 📂 **Estructura del Proyecto**

```
JOSHI-BOT/
│
├── index.js
├── handler.js
├── config.js
│
├── plugins/
│   ├── main-menu.js
│   ├── enable.js
│   ├── play3.js
│   ├── group-hidetag.js
│   ├── group-tagall.js
│   ├── group-config.js
│   ├── group-kick.js
│   ├── group-promote.js
│   ├── group-demote.js
│   ├── group-delete.js
│   ├── autodetec.js
│   ├── setwelcome.js
│   ├── owner-join.js
│   ├── owner-autoadmin.js
│   └── ...
│
├── session/
├── package.json
└── README.md
```

---

# 🧾 **Lista de Comandos**

| Categoría | Comando | Explicación |
|----------|---------|-------------|
| 🔧 Config | `.enable` `.disable` | Activa/desactiva módulos |
| 🛡 Seguridad | `.antilink` | Borra links |
| 🎵 Música | `.play3` | Descarga música |
| 👥 Grupo | `.kick` `.promote` `.demote` `.tagall` `.hidetag` `.del` | Moderación |
| 🎉 Bienvenida | `.setwelcome` | Personalizar bienvenida |
| 🧰 Owner | `.join` `.autoadmin` | Herramientas del creador |
| 📌 Menú | `.menu` | Muestra el menú completo |

---

# 🔄 **Actualizar Bot**

```bash
git pull
npm install
```

---

# 🐞 **Errores Comunes**

### ❌ *"Cannot find module 'axios'"*
```
npm install axios
```

### ❌ *"Connection closed"*
Tu sesión expiró.  
Reinicia:
```
node index.js
```

### ❌ *"npm start missing script"*
Usa:
```
node index.js
```

---

# ❓ **Preguntas Frecuentes (FAQ)**

### **¿Puedo usar mi número principal?**  
Puedes, pero se recomienda usar uno secundario.

### **¿Corre 24/7?**  
Sí, en VPS o Termux con Screen.

### **¿Puede entrar a grupos automáticamente?**  
Sí, con:  
```
.join enlace
```

### **¿Consume muchos datos?**  
No, es muy ligero.

---

# 👑 **Créditos**
- **Gabo** – Autor original  
- **JOSHI-BOT MD** – Base del bot  
- **Baileys** – API MD  
- README generado por ChatGPT con mejoras profesionales  

---

# 🚀 FIN DEL README
