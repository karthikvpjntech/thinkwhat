import React, { useState } from 'react';
import { Button, Text, TextInput, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import * as Location from 'expo-location';
import { createRequirement, selectPendingCount } from '../store/requirementsSlice';
import type { AppDispatch, RootState } from '../store';

export default function CreateRequirementScreen() {
  const dispatch = useDispatch<AppDispatch>();
  const [title, setTitle] = useState('');
  const online = useSelector((s: RootState) => s.network.isOnline);
  const pending = useSelector(selectPendingCount);

  const submit = async () => {
    const pos = await Location.getLastKnownPositionAsync();
    dispatch(createRequirement({ title, lat: pos?.coords.latitude ?? 0, lng: pos?.coords.longitude ?? 0 }));
    setTitle('');
  };

  return (
    <View style={{ padding: 16, gap: 12 }}>
      {!online && <Text>You're offline – requirements will sync automatically.</Text>}
      {pending > 0 && <Text>{pending} waiting to sync</Text>}
      <TextInput placeholder="What do you need?" value={title} onChangeText={setTitle} />
      <Button title="Post requirement" onPress={submit} disabled={!title} />
    </View>
  );
}
