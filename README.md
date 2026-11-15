# ThinkWhat – Auth, Geofencing & Proximity Alerts

apps/api    – NestJS (JWT + refresh, device tokens, BullMQ alerts, FCM, Redis debounce)
apps/mobile – Expo (background geofencing, offline queue with Redux Toolkit)

## API env (.env)
DATABASE_URL=postgres://user:pass@localhost:5432/thinkwhat
REDIS_HOST=localhost
REDIS_PORT=6379
JWT_ACCESS_SECRET=change-me
JWT_REFRESH_SECRET=change-me-too
JWT_ACCESS_TTL=15m
JWT_REFRESH_TTL=30d
FIREBASE_SERVICE_ACCOUNT_JSON={"project_id":"...","client_email":"...","private_key":"..."}
ALERT_DEBOUNCE_SECONDS=1800

## API deps
npm i @nestjs/common @nestjs/core @nestjs/platform-express @nestjs/config @nestjs/typeorm typeorm pg \
  @nestjs/jwt @nestjs/passport passport passport-jwt bcrypt class-validator class-transformer \
  @nestjs/bullmq bullmq ioredis firebase-admin
npm i -D @types/bcrypt @types/passport-jwt

## Mobile deps
npx expo install expo-location expo-task-manager expo-secure-store @react-native-community/netinfo \
  @react-native-async-storage/async-storage @react-native-firebase/app @react-native-firebase/messaging
npm i @reduxjs/toolkit react-redux redux-persist

Note: background geofencing does NOT work in Expo Go – use a dev build (`npx expo run:android|ios` or EAS).
