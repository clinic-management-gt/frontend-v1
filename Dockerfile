FROM node:20-alpine AS builder
WORKDIR /app
COPY ./frontend-app ./

# Build args para variables de entorno de Vite
ARG VITE_API_URL=""
ARG VITE_API_HOST_PREFIX="/api"

# Exportarlas como ENV para que Vite las use durante el build
ENV VITE_API_URL=$VITE_API_URL
ENV VITE_API_HOST_PREFIX=$VITE_API_HOST_PREFIX

RUN npm install && npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
