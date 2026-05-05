import React from 'react';
import { StyleSheet, Text, View, SafeAreaView, ScrollView, TouchableOpacity } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Briefcase, User, Search, Bell } from 'lucide-react-native';

export default function App() {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="auto" />
      <View style={styles.header}>
        <Text style={styles.logo}>OpportuNet</Text>
        <TouchableOpacity>
          <Bell size={24} color="#333" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.hero}>
          <Text style={styles.title}>Find Your Dream Job</Text>
          <Text style={styles.subtitle}>Connecting talents with regional opportunities in Karnataka.</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Featured Jobs</Text>
          {[1, 2, 3].map((i) => (
            <View key={i} style={styles.jobCard}>
              <View style={styles.jobInfo}>
                <Text style={styles.jobTitle}>Software Engineer</Text>
                <Text style={styles.jobCompany}>Tech Solutions Ltd.</Text>
                <Text style={styles.jobLocation}>Bengaluru, KA</Text>
              </View>
              <TouchableOpacity style={styles.applyButton}>
                <Text style={styles.applyButtonText}>Apply</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>
      </ScrollView>

      <View style={styles.navBar}>
        <TouchableOpacity style={styles.navItem}>
          <Search size={24} color="#3b82f6" />
          <Text style={[styles.navText, { color: '#3b82f6' }]}>Jobs</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <Briefcase size={24} color="#666" />
          <Text style={styles.navText}>Applied</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <User size={24} color="#666" />
          <Text style={styles.navText}>Profile</Text>
        </TouchableOpacity>
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  logo: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#3b82f6',
  },
  content: {
    flex: 1,
  },
  hero: {
    padding: 25,
    backgroundColor: '#3b82f6',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  section: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#1e293b',
  },
  jobCard: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 20,
    marginBottom: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  jobInfo: {
    flex: 1,
  },
  jobTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1e293b',
  },
  jobCompany: {
    fontSize: 14,
    color: '#64748b',
    marginTop: 4,
  },
  jobLocation: {
    fontSize: 14,
    color: '#94a3b8',
    marginTop: 2,
  },
  applyButton: {
    backgroundColor: '#3b82f6',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 8,
  },
  applyButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  navBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 10,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
  },
  navItem: {
    alignItems: 'center',
  },
  navText: {
    fontSize: 12,
    marginTop: 4,
    color: '#64748b',
  },
});
