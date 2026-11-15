import * as SecureStore from 'expo-secure-store';
const A = 'tw_access', R = 'tw_refresh';
export const tokenStorage = {
  get: async () => ({ access: await SecureStore.getItemAsync(A), refresh: await SecureStore.getItemAsync(R) }),
  set: async (access: string, refresh: string) => { await SecureStore.setItemAsync(A, access); await SecureStore.setItemAsync(R, refresh); },
  clear: async () => { await SecureStore.deleteItemAsync(A); await SecureStore.deleteItemAsync(R); },
};
