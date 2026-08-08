# Web Portfolio

Proyek Fullstack Web Portfolio menggunakan React (Vite), Node.js (Express), PostgreSQL, dan Prisma ORM.

## Arsitektur

Terdiri dari 3 services:
1. **postgres** - Database PostgreSQL
2. **backend** - Node.js Express REST API
3. **frontend** - React Dashboard/Portfolio Frontend (Vite)

## Cara Menjalankan (Docker)

1. **Build dan start semua services:**
   ```bash
   docker-compose up --build
   ```

2. **Atau jalankan di background:**
   ```bash
   docker-compose up -d --build
   ```

3. **Akses aplikasi:**
   - Frontend: http://localhost:2000
   - Backend API: http://localhost:3000

## Cara Menjalankan (Local / Tanpa Docker)

1. Jalankan `npm run install:all` dari root folder.
2. Setup environment variable (terutama DATABASE_URL di `.env` backend).
3. Jalankan `npm run prisma:generate` dan `npm run prisma:migrate`.
4. Jalankan `npm run dev` untuk menyalakan frontend dan backend secara bersamaan.
