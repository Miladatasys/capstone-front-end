# Usa una versión estable de Node.js (LTS)
FROM node:16-alpine

# Establece el directorio de trabajo dentro del contenedor
WORKDIR /app

# Copia los archivos package.json y package-lock.json al contenedor
COPY package*.json ./

# Instala todas las dependencias del proyecto (incluyendo Expo)
RUN npm install

# Copia todo el código fuente al contenedor
COPY . .

# Expone el puerto que Expo usa (19000)
EXPOSE 19000

# Comando para iniciar Expo con túnel
CMD ["npm", "run", "start",  "--tunnel"]

