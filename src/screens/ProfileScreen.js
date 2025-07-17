// ProfileScreen.js
import React, { useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  Switch,
  Share,
  Dimensions
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';

export default function ProfileScreen({ navigation }) {
  const [isDarkMode, setIsDarkMode] = useState(false);

  const onToggleMode = () => setIsDarkMode(prev => !prev);

  const onShare = async () => {
    try {
      await Share.share({
        message: 'Check out this great app: https://example.com',
      });
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Image
            source={require('../../src/assets/image/poto.png')}
            style={styles.avatar}
          />
          <TouchableOpacity style={styles.editBtn}>
            <Icon name="edit-3" size={20} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.name}>Dharmesh Darshan</Text>
          <Text style={styles.email}>dharmesh.darshan8@gmail.com</Text>
        </View>

        {/* General Settings */}
        <Text style={styles.sectionHeader}>General Settings</Text>
        <View style={styles.row}>
          <Icon name="moon" size={20} color="#3FB1C6" style={styles.rowIcon} />
          <View style={styles.rowText}>
            <Text style={styles.rowTitle}>Mode</Text>
            <Text style={styles.rowSubtitle}>Dark & Light</Text>
          </View>
          <Switch
            value={isDarkMode}
            onValueChange={onToggleMode}
            thumbColor="#fff"
            trackColor={{ false: '#ccc', true: '#3FB1C6' }}
          />
        </View>
        <TouchableOpacity style={styles.row}>
          <Icon name="key" size={20} color="#3FB1C6" style={styles.rowIcon} />
          <Text style={styles.rowTitle}>Change Password</Text>
          <Icon name="chevron-right" size={20} color="#999" />
        </TouchableOpacity>

        {/* Information */}
        <Text style={styles.sectionHeader}>Information</Text>
        <TouchableOpacity style={styles.row}>
          <Icon name="smartphone" size={20} color="#3FB1C6" style={styles.rowIcon} />
          <Text style={styles.rowTitle}>About App</Text>
          <Icon name="chevron-right" size={20} color="#999" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.row}>
          <Icon name="file-text" size={20} color="#3FB1C6" style={styles.rowIcon} />
          <Text style={styles.rowTitle}>Terms & Conditions</Text>
          <Icon name="chevron-right" size={20} color="#999" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.row}>
          <Icon name="shield" size={20} color="#3FB1C6" style={styles.rowIcon} />
          <Text style={styles.rowTitle}>Privacy Policy</Text>
          <Icon name="chevron-right" size={20} color="#999" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.row} onPress={onShare}>
          <Icon name="share-2" size={20} color="#3FB1C6" style={styles.rowIcon} />
          <Text style={styles.rowTitle}>Share This App</Text>
          <Icon name="chevron-right" size={20} color="#999" />
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const { width } = Dimensions.get('window');
const TAB_HEIGHT = 60;

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#fff' },
  container: { paddingBottom: TAB_HEIGHT + 16 },
  header: {
    backgroundColor: '#3FB1C6',
    alignItems: 'center',
    paddingVertical: 32,
    position: 'relative',
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: '#fff',
  },
  editBtn: {
    position: 'absolute',
    top: 32 + 100 - 20,
    right: (width / 2) - 60,
    backgroundColor: '#3FB1C6',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  name: {
    fontSize: 20,
    fontWeight: '700',
    color: '#fff',
    marginTop: 12,
  },
  email: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.85)',
    marginTop: 4,
  },
  sectionHeader: {
    backgroundColor: '#eee',
    paddingVertical: 8,
    paddingHorizontal: 16,
    color: '#777',
    fontSize: 12,
    fontWeight: '600',
    // marginTop: 16,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderColor: '#eee',
  },
  rowIcon: { marginRight: 12 },
  rowText: { flex: 1 },
  rowTitle: { fontSize: 16, color: '#333' },
  rowSubtitle: { fontSize: 12, color: '#666' },
  tabBar: {
    position: 'absolute',
    bottom: 16,
    left: 16,
    right: 16,
    height: TAB_HEIGHT,
    backgroundColor: '#3FB1C6',
    borderRadius: TAB_HEIGHT / 2,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  tabItem: { justifyContent: 'center', alignItems: 'center' },
  tabText: { color: '#fff', fontSize: 12, marginTop: 4 },
});
