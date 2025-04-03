
# Build stage for frontend
FROM node:20-alpine as build

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# Production stage
FROM node:20-alpine

# Install nginx
RUN apk add --no-cache nginx

# Setup email server directory
WORKDIR /app/email-server
COPY email-server /app/email-server
RUN npm install express body-parser cors nodemailer dotenv

# Copy nginx config
COPY nginx.conf /etc/nginx/http.d/default.conf

# Copy built frontend assets
WORKDIR /app
COPY --from=build /app/dist /usr/share/nginx/html

# Create startup script
RUN echo '#!/bin/sh\nnginx\ncd /app/email-server && node email-server.js\n' > /app/start.sh && chmod +x /app/start.sh

EXPOSE 80 3000

CMD ["/app/start.sh"]
