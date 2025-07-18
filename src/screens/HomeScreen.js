// HomeScreen.js
import React from 'react';
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  Image,
  FlatList,
  Dimensions,
  TouchableOpacity
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { useSelector } from 'react-redux';

// Sample data for demonstration
const DOCUMENTS = [
  { id: '1', title: 'Relieving...', image: require('../../src/assets/image/pdf.png') },
  { id: '2', title: 'My Passport', image: require('../../src/assets/image/poto.png') },
  { id: '3', title: 'Invoice.pdf', image: require('../../src/assets/image/pdf.png') },
  { id: '4', title: 'Profile Pic', image: require('../../src/assets/image/poto.png') },
  { id: '1', title: 'Relieving...', image: require('../../src/assets/image/pdf.png') },
  { id: '2', title: 'My Passport', image: require('../../src/assets/image/poto.png') },
  { id: '3', title: 'Invoice.pdf', image: require('../../src/assets/image/pdf.png') },
  { id: '4', title: 'Profile Pic', image: require('../../src/assets/image/poto.png') }
];

export default function HomeScreen() {
  const token = useSelector(state => state.auth.token);
  // For future authenticated requests, add this header:
  // headers: { Authorization: `Bearer ${token}` }
  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <TouchableOpacity style={styles.moreBtn}>
        <Icon name="more-vertical" size={20} color="#666" />
      </TouchableOpacity>
      <Image source={item.image} style={styles.cardImage} />
      <Text style={styles.cardText} numberOfLines={1} ellipsizeMode="tail">
        {item.title}
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.safe}>
      {/* Header */}
      <View style={styles.header}>
        {/* <TouchableOpacity onPress={() => navigation.goBack()}>
               <Icon name="chevron-left" size={24} color="#fff" />
             </TouchableOpacity> */}
        <Text style={styles.headerTitle}>Gallery</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* Document Grid */}
      <FlatList
        data={DOCUMENTS}
        keyExtractor={(item) => item.id}
        numColumns={2}
        contentContainerStyle={styles.list}
        renderItem={renderItem}
      />
    </SafeAreaView>
  );
}

const { width } = Dimensions.get('window');
const cardSize = (width - 48) / 2; // 24px padding + gaps

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#fff' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#3FB1C6',
    padding: 16,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
    flexDirection: 'row',
    alignItems: 'center',
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 12,
  },
  name: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
  },
  email: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
  },

  list: {
    padding: 16,
    paddingBottom: 80,
  },
  card: {
    backgroundColor: '#FAFAFA',
    borderRadius: 12,
    margin: 8,
    width: cardSize,
    padding: 8,
    position: 'relative',
  },
  moreBtn: {
    position: 'absolute',
    top: 8,
    right: 8,
    zIndex: 1,
  },
  cardImage: {
    width: '100%',
    height: cardSize * 0.6,
    borderRadius: 8,
    marginBottom: 8,
  },
  cardText: {
    fontSize: 14,
    color: '#333',
    textAlign: 'center',
  },

  tabBar: {
    position: 'absolute',
    bottom: 16,
    left: 16,
    right: 16,
    height: 60,
    backgroundColor: '#3FB1C6',
    borderRadius: 30,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  tabItem: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabText: {
    color: '#fff',
    fontSize: 12,
    marginTop: 4,
  },
});
