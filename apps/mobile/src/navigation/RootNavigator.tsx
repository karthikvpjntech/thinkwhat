import React from 'react';
import { SafeAreaView, StyleSheet, Text, View } from 'react-native';
import CreateRequirementScreen from '../screens/CreateRequirementScreen.example';

export function RootNavigator() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>ThinkWhat</Text>
        <Text style={styles.headerSubtitle}>Geofencing & Proximity Alerts</Text>
      </View>
      <View style={styles.content}>
        <CreateRequirementScreen />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    padding: 20,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#0f172a',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#64748b',
    marginTop: 4,
  },
  content: {
    flex: 1,
    padding: 16,
  },
});
