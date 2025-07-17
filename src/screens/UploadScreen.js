// UploadScreen.js
import React, { useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Platform
} from 'react-native';
// import DocumentPicker from 'react-native-document-picker';
import Icon from 'react-native-vector-icons/Feather';

export default function UploadScreen({ navigation }) {
  const [fileName, setFileName] = useState('');
  const [majorHead, setMajorHead] = useState('');
  const [minorHead, setMinorHead] = useState('');
  const [docDate, setDocDate] = useState('');
  const [remarks, setRemarks] = useState('');
  const [tags, setTags] = useState('');

  const pickDocument = async () => {
    try {
      const res = await DocumentPicker.pickSingle({
        type: [DocumentPicker.types.allFiles],
      });
      setFileName(res.name);
    } catch (err) {
      if (!DocumentPicker.isCancel(err)) console.warn(err);
    }
  };

  const handleSubmit = () => {
    // TODO: call upload API (e.g. via Redux or axios)
    alert('Document uploaded!');
    navigation.navigate('Home');
  };

  return (
    <SafeAreaView style={styles.safe}>
      {/* Header */}
      <View style={styles.header}>
        {/* <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="chevron-left" size={24} color="#fff" />
        </TouchableOpacity> */}
        <Text style={styles.headerTitle}>Upload Document</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.container}>
        {/* File Picker */}
        <Text style={styles.label}>Select File</Text>
        <TouchableOpacity style={styles.fileButton} 
        // onPress={pickDocument}
        >
          <Icon name="file-plus" size={20} color="#3FB1C6" />
          <Text style={styles.fileButtonText}>
            {fileName || 'Choose File'}
          </Text>
        </TouchableOpacity>

        {/* Major Head */}
        <Text style={styles.label}>Major Head</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g. Company"
          value={majorHead}
          onChangeText={setMajorHead}
        />

        {/* Minor Head */}
        <Text style={styles.label}>Minor Head</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g. Work Order"
          value={minorHead}
          onChangeText={setMinorHead}
        />

        {/* Document Date */}
        <Text style={styles.label}>Document Date </Text>
        <TextInput
          style={styles.input}
          placeholder="YYYY-MM-DD"
          value={docDate}
          onChangeText={setDocDate}
        />

        {/* Remarks */}
        <Text style={styles.label}>Remarks</Text>
        <TextInput
          style={[styles.input, { height: 80 }]}
          placeholder="Enter any remarks"
          multiline
          value={remarks}
          onChangeText={setRemarks}
        />

        {/* Tags */}
        <Text style={styles.label}>Tags</Text>
        <TextInput
          style={styles.input}
          placeholder="Comma separated tags"
          value={tags}
          onChangeText={setTags}
        />

        {/* Submit Button */}
        <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit} disabled={!fileName}>
          <Text style={styles.submitText}>Upload</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const { width } = Dimensions.get('window');
const TAB_HEIGHT = 60;

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#fff' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#3FB1C6',
    padding: 16,
  },
  headerTitle: { color: '#fff', fontSize: 18, fontWeight: '600' },
  container: { padding: 24, paddingBottom: TAB_HEIGHT + 24 },
  label: { fontSize: 14, color: '#555', marginBottom: 6 },
  fileButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderWidth: 1,
    borderColor: '#CCC',
    borderRadius: 8,
    marginBottom: 16,
    backgroundColor: '#FAFAFA',
  },
  fileButtonText: { marginLeft: 8, color: '#333', fontSize: 14 },
  input: {
    height: 48,
    borderWidth: 1,
    borderColor: '#CCC',
    borderRadius: 8,
    paddingHorizontal: 12,
    backgroundColor: '#FAFAFA',
    marginBottom: 16,
  },
  submitBtn: {
    height: 50,
    backgroundColor: '#3FB1C6',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
  },
  submitText: { color: '#fff', fontSize: 16, fontWeight: '600' },
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
  activeTab: { backgroundColor: '#3399AA', borderRadius: 30, padding: 8 },
  tabText: { color: '#fff', fontSize: 12, marginTop: 4 },
});
