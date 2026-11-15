import { Platform } from 'react-native';
import messaging from '@react-native-firebase/messaging';
import { apiFetch } from './api';
import { tokenStorage } from './tokenStorage';

async function getFcmToken() {
  try {
    await messaging().requestPermission();
    return await messaging().getToken();
  } catch { return undefined; }
}

type AuthRes = { accessToken: string; refreshToken: string; user: { id: string; email: string } };

export async function signIn(email: string, password: string) {
  const res = await apiFetch<AuthRes>('/auth/signin', {
    method: 'POST', body: JSON.stringify({ email, password, fcmToken: await getFcmToken(), platform: Platform.OS }),
  });
  await tokenStorage.set(res.accessToken, res.refreshToken);
  return res.user;
}
export async function signUp(email: string, password: string, name?: string) {
  const res = await apiFetch<AuthRes>('/auth/signup', {
    method: 'POST', body: JSON.stringify({ email, password, name, fcmToken: await getFcmToken(), platform: Platform.OS }),
  });
  await tokenStorage.set(res.accessToken, res.refreshToken);
  return res.user;
}
export async function signOut() {
  const fcmToken = await getFcmToken();
  await apiFetch('/auth/logout', { method: 'POST', body: JSON.stringify({ fcmToken }) }).catch(() => {});
  await tokenStorage.clear();
}
