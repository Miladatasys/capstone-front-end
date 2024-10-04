# Usa una imagen oficial de Node.js (versión v21.6.0)
FROM node:21.6.0

# Establece el directorio de trabajo dentro del contenedor
WORKDIR /app

# Copia el archivo package.json y package-lock.json al contenedor
COPY package*.json ./

# Instala Expo CLI y las dependencias necesarias con versiones específicas
RUN npm install -g expo-cli@6.0.8 && npm install

# Copia todo el código de la aplicación al contenedor
COPY . .

# Expone el puerto que utiliza Expo (8081 por defecto)
EXPOSE 8081

# Comando para iniciar la aplicación con Expo
CMD ["npx", "expo", "start", "--tunnel"]
