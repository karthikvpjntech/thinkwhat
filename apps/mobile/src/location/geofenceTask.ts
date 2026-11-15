// MUST be imported at the top level of the app entry (index.js / App.tsx) so the
// task is defined when the OS relaunches the app in the background.
import * as TaskManager from 'expo-task-manager';
import * as Location from 'expo-location';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { apiFetch } from '../services/api';

export const GEOFENCE_TASK = 'thinkwhat-geofence-task';
const PENDING_KEY = 'tw_pending_alerts';

type GeofenceEvent = { eventType: Location.GeofencingEventType; region: Location.LocationRegion };

async function sendTrigger(shopId: string, lat: number, lng: number) {
  try {
    await apiFetch('/alerts/trigger', { method: 'POST', body: JSON.stringify({ shopId, lat, lng }) });
  } catch {
    // offline in background → persist, flushed on next network restore (see syncMiddleware)
    const list = JSON.parse((await AsyncStorage.getItem(PENDING_KEY)) ?? '[]');
    list.push({ shopId, lat, lng, at: Date.now() });
    await AsyncStorage.setItem(PENDING_KEY, JSON.stringify(list.slice(-50)));
  }
}

export async function flushPendingAlerts() {
  const list: { shopId: string; lat: number; lng: number; at: number }[] =
    JSON.parse((await AsyncStorage.getItem(PENDING_KEY)) ?? '[]');
  if (!list.length) return;
  await AsyncStorage.removeItem(PENDING_KEY);
  const fresh = list.filter((a) => Date.now() - a.at < 30 * 60_000); // stale entries are pointless
  for (const a of fresh) await sendTrigger(a.shopId, a.lat, a.lng);
}

TaskManager.defineTask<GeofenceEvent>(GEOFENCE_TASK, async ({ data, error }) => {
  if (error || !data) return;
  if (data.eventType !== Location.GeofencingEventType.Enter) return;
  const { identifier, latitude, longitude } = data.region;
  if (identifier) await sendTrigger(identifier, latitude, longitude);
});
