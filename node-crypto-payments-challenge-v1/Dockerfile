FROM node:20-alpine

# Set the working directory
WORKDIR /usr/src/app

# Copy only package.json and package-lock.json first for better caching
COPY package*.json ./

# Install dependencies (including dev)
RUN npm ci

# Copy the rest of the application code
COPY tsconfig.json ./
COPY src ./src
COPY src/infrastructure/files ./src/infrastructure/files
COPY src/config/customer-addresses.json ./src/config/customer-addresses.json

# Copia el script de espera
COPY wait-for-it.sh /wait-for-it.sh
RUN chmod +x /wait-for-it.sh

# Build the TypeScript code
RUN npm run build

# Copia el archivo de configuración al directorio dist/config
RUN mkdir -p dist/config && cp src/config/customer-addresses.json dist/config/customer-addresses.json

# Remove development dependencies for production
RUN npm prune --production

# Set the working directory to dist for runtime
WORKDIR /usr/src/app/dist

# Expose the application port
EXPOSE 3000

# Usa wait-for-it.sh para esperar a la base de datos antes de arrancar la app
CMD ["/wait-for-it.sh", "db:5432", "--", "node", "index.js"]