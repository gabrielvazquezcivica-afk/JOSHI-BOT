# ---- BASE ----
FROM node:20-alpine

# Directorio de trabajo dentro del contenedor
WORKDIR /app

# Instalar dependencias necesarias del sistema
RUN apk update && apk add --no-cache \
    git \
    bash \
    ffmpeg \
    imagemagick \
    wget \
    python3 \
    py3-pip \
    build-base

# Copiar package.json y package-lock.json (si existe)
COPY package*.json ./

# Instalar dependencias del bot
RUN npm install --legacy-peer-deps

# Copiar el resto del bot al contenedor
COPY . .

# Asegurar permisos de ejecución
RUN chmod +x start.sh || true
RUN chmod -R 755 /app

# Puerto (si usas API del bot; si no, puedes borrarlo)
EXPOSE 3000

# Comando final para iniciar el bot
CMD ["npm", "start"]
