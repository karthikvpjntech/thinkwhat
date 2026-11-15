import * as Location from 'expo-location';
import { Linking } from 'react-native';
import { GEOFENCE_TASK } from './geofenceTask';
import { GEOFENCE_RADIUS_M, MAX_REGIONS } from '../config';

export type Shop = { id: string; latitude: number; longitude: number };

/** Foreground first, then background ("Allow all the time"). Must be called from UI. */
export async function requestLocationPermissions(): Promise<boolean> {
  const fg = await Location.requestForegroundPermissionsAsync();
  if (fg.status !== 'granted') return false;
  const bg = await Location.requestBackgroundPermissionsAsync();
  if (bg.status !== 'granted') {
    if (!bg.canAskAgain) Linking.openSettings();
    return false;
  }
  return true;
}

function distance(a: { latitude: number; longitude: number }, b: { latitude: number; longitude: number }) {
  const R = 6371e3, toRad = (d: number) => (d * Math.PI) / 180;
  const dLat = toRad(b.latitude - a.latitude), dLng = toRad(b.longitude - a.longitude);
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(a.latitude)) * Math.cos(toRad(b.latitude)) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}

/** Register the nearest N shops as native geofences (OS-level; survives app kill). */
export async function registerShopGeofences(shops: Shop[]) {
  if (!(await requestLocationPermissions())) return false;
  const here = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
  const regions: Location.LocationRegion[] = shops
    .map((s) => ({ s, d: distance(here.coords, s) }))
    .sort((x, y) => x.d - y.d)
    .slice(0, MAX_REGIONS)
    .map(({ s }) => ({
      identifier: s.id, latitude: s.latitude, longitude: s.longitude,
      radius: GEOFENCE_RADIUS_M, notifyOnEnter: true, notifyOnExit: false,
    }));
  if (await Location.hasStartedGeofencingAsync(GEOFENCE_TASK)) await Location.stopGeofencingAsync(GEOFENCE_TASK);
  if (regions.length) await Location.startGeofencingAsync(GEOFENCE_TASK, regions);
  return true;
}

export async function stopGeofencing() {
  if (await Location.hasStartedGeofencingAsync(GEOFENCE_TASK)) await Location.stopGeofencingAsync(GEOFENCE_TASK);
}
