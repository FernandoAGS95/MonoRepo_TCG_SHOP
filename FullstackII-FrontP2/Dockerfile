# FullstackII-FrontP2/Dockerfile

# Etapa de build
FROM node:20-alpine AS build
WORKDIR /app

# Copiamos definiciones de dependencias
COPY package.json package-lock.json* ./
RUN npm ci

# Copiamos el resto del código
COPY . .

# Build de producción (usa tu config actual de Vite)
RUN npm run build

# Etapa de runtime: Nginx sirviendo el build
FROM nginx:alpine
WORKDIR /usr/share/nginx/html

# Limpiar contenido por defecto
RUN rm -rf ./*

# Copiar build de Vite
COPY --from=build /app/dist ./

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
