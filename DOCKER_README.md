# Étude Projesi - Docker Kurulumu

Bu proje Docker kullanarak container ortamında çalıştırılabilir.

## Gereksinimler

- Docker Desktop
- Docker Compose

## Kurulum ve Çalıştırma

### 1. Tüm Servisleri Başlatma

```bash
# Ana dizinde çalıştırın
docker-compose up --build
```

Bu komut şu servisleri başlatacak:
- **Frontend**: http://localhost:3001
- **Backend API**: http://localhost:5001
- **Redis**: localhost:6379
- **MongoDB**: **Atlas (bulut) ile entegre**

> **Not:** Uygulamanız MongoDB Atlas (bulut) ile entegredir. Local MongoDB servisi kullanılmaz.

### 2. Sadece Backend'i Çalıştırma

```bash
cd backend
docker-compose up --build
```

### 3. Sadece Frontend'i Çalıştırma

```bash
cd frontend
docker build -t etude-frontend .
docker run -p 3001:3000 etude-frontend
```

## Servis Detayları

### Frontend (Next.js)
- **Port**: 3001 (container içinde 3000)
- **URL**: http://localhost:3001
- **Container**: etude-frontend

### Backend (Node.js/Express)
- **Port**: 5001 (container içinde 5000)
- **URL**: http://localhost:5001
- **Container**: etude-backend
- **API**: http://localhost:5001/api

### Redis
- **Port**: 6379
- **Container**: etude-redis

### MongoDB
- **Atlas (bulut) ile entegre**
- **Connection String**: `MONGO_URI` environment variable'ında tanımlı
- **Local MongoDB servisi kullanılmaz**

## Docker Komutları

```bash
# Servisleri başlat
docker-compose up

# Arka planda çalıştır
docker-compose up -d

# Servisleri durdur
docker-compose down

# Logları görüntüle
docker-compose logs

# Belirli servisin loglarını görüntüle
docker-compose logs backend
docker-compose logs frontend

# Container'ları yeniden oluştur
docker-compose up --build

# Tüm container'ları ve volume'ları sil
docker-compose down -v
```

## Environment Variables

Backend için gerekli environment variables docker-compose.yml dosyasında tanımlanmıştır:

- `MONGO_URI`: MongoDB Atlas connection string
- `JWT_SECRET`: JWT token secret key
- `REDIS_URL`: Redis connection URL
- `FRONTEND_URL`: Frontend URL

## Sorun Giderme

### Port Çakışması
Eğer portlar kullanımdaysa, docker-compose.yml dosyasındaki port mapping'leri değiştirin:

```yaml
ports:
  - "3002:3000"  # Frontend için farklı port
  - "5002:5000"  # Backend için farklı port
```

### Container Logları
```bash
# Backend logları
docker-compose logs backend

# Frontend logları
docker-compose logs frontend
```

### Container'a Bağlanma
```bash
# Backend container'ına bağlan
docker exec -it etude-backend sh

# Frontend container'ına bağlan
docker exec -it etude-frontend sh
```

## Production Deployment

Production ortamında:
1. Environment variables'ları güvenli bir şekilde yönetin
2. JWT_SECRET'ı güçlü bir değerle değiştirin
3. HTTPS kullanın
4. MongoDB Atlas gibi managed database kullanın
5. Redis için managed service kullanın

## Not

Bu Docker kurulumu development ve test amaçlıdır. Production deployment için ek güvenlik önlemleri alınmalıdır. 