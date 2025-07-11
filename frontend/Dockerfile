# Node.js 18 LTS imajını kullan
FROM node:18-alpine

# Çalışma dizinini belirle
WORKDIR /app

# Package.json ve package-lock.json dosyalarını kopyala
COPY package*.json ./

# Bağımlılıkları yükle
RUN npm install --legacy-peer-deps

# Uygulama kodlarını kopyala
COPY . .

# Production build oluştur
RUN npm run build

# Port'u aç
EXPOSE 3000

# Uygulamayı başlat
CMD ["npm", "start"] 