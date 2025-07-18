import React, { useState, useEffect } from 'react';
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Platform,
  Alert,
  FlatList,
  PermissionsAndroid,
} from 'react-native';
import {
  pick,
  types,
  keepLocalCopy,
  isErrorWithCode,
  errorCodes
} from '@react-native-documents/picker';
import { launchCamera } from 'react-native-image-picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';
import Icon from 'react-native-vector-icons/Feather';
import { useSelector } from 'react-redux';

export default function UploadScreen({ navigation }) {
  const [fileName, setFileName] = useState('');
  const [fileUri, setFileUri] = useState('');
  const [category, setCategory] = useState('');
  const [subCategory, setSubCategory] = useState('');
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [remarks, setRemarks] = useState('');
  const [availableTags, setAvailableTags] = useState([]);
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState('');
  const token = useSelector(state => state.auth.token);
  // For future authenticated requests, add this header:
  // headers: { Authorization: `Bearer ${token}` }

  const categories = ['Personal', 'Professional'];
  const personalOptions = ['John', 'Tom', 'Emily'];
  const professionalOptions = ['Accounts', 'HR', 'IT', 'Finance'];

  useEffect(() => {
    fetch('https://your-api-endpoint.com/tags')
      .then(res => res.json())
      .then(data => setAvailableTags(data.tags))
      .catch(err => console.warn(err));
  }, []);

  const showFileOptions = () => {
    Alert.alert(
      'Upload Document',
      'Select an option',
      [
        { text: 'Take Photo', onPress: pickImage },
        { text: 'Choose File', onPress: pickDocument },
        { text: 'Cancel', style: 'cancel' },
      ],
      { cancelable: true }
    );
  };

  const pickDocument = async () => {
    try {
      const results = await pick({ type: [types.pdf, 'image/*'] });
      const file = results[0];
      setFileName(file.name || '');

      const copies = await keepLocalCopy({
        files: [{
          fileName: file.name || '',
          uri: file.uri,
          convertVirtualFileToType: file.convertibleToMimeTypes?.[0],
        }],
        destination: 'documentDirectory',
      });
      const copy = copies[0];
      setFileUri(copy.status === 'success' ? copy.localUri : file.uri);
    } catch (err) {
      if (isErrorWithCode(err) && err.code === errorCodes.OPERATION_CANCELED) {
        return;
      }
      console.warn(err);
    }
  };

  async function ensureCameraAndStoragePermissions() {
    if (Platform.OS !== 'android') return true;

    // always need CAMERA
    const toRequest = [PermissionsAndroid.PERMISSIONS.CAMERA];

    // on Android 10 and below, camera temp files land in external storage:
    if (Platform.Version < 29) {
      toRequest.push(PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE);
    }

    const results = await PermissionsAndroid.requestMultiple(toRequest);

    const cameraGranted =
      results[PermissionsAndroid.PERMISSIONS.CAMERA] ===
      PermissionsAndroid.RESULTS.GRANTED;

    const storageGranted =
      toRequest.includes(PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE)
        ? results[PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE] ===
          PermissionsAndroid.RESULTS.GRANTED
        : true;

    if (!cameraGranted || !storageGranted) {
      Alert.alert(
        'Permissions required',
        'Camera—and storage on older Android—permission is required to take and save photos.'
      );
      return false;
    }
    return true;
  }

  const pickImage = async () => {
    if (!(await ensureCameraAndStoragePermissions())) return;

    launchCamera(
      { mediaType: 'photo', saveToPhotos: false },
      response => {
        if (response.didCancel) return;
        if (response.errorCode) {
          console.warn(response.errorMessage);
          return;
        }
        const asset = response.assets[0];
        setFileName(asset.fileName || '');
        setFileUri(asset.uri);
      }
    );
  };

  const onChangeDate = (e, selected) => {
    setShowDatePicker(false);
    if (selected) setDate(selected);
  };
  const formattedDate = date.toISOString().split('T')[0];

  const addTag = t => {
    if (!t || tags.includes(t)) return setTagInput('');
    setTags(prev => [...prev, t]);
    if (!availableTags.includes(t)) {
      fetch('https://your-api-endpoint.com/tags', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tag: t }),
      })
        .then(res => res.json())
        .then(() => setAvailableTags(prev => [...prev, t]))
        .catch(err => console.warn(err));
    }
    setTagInput('');
  };

  const filteredTags = availableTags.filter(
    x => x.toLowerCase().includes(tagInput.toLowerCase()) && !tags.includes(x)
  );

  const handleSubmit = () => {
    // build your FormData here, then POST...
    Alert.alert('Document uploaded!');
    navigation.navigate('Home');
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Upload Document</Text>
      </View>
      <ScrollView contentContainerStyle={styles.container}>
        {/* File Picker */}
        <Text style={styles.label}>Select File</Text>
        <TouchableOpacity style={styles.fileButton} onPress={showFileOptions}>
          <Icon name="file-plus" size={20} color="#3FB1C6" />
          <Text style={styles.fileButtonText}>{fileName || 'Choose File'}</Text>
        </TouchableOpacity>

        {/* Category */}
        <Text style={styles.label}>Category</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={category}
            onValueChange={v => { setCategory(v); setSubCategory(''); }}
          >
            <Picker.Item label="Select Category" value="" />
            {categories.map(c => <Picker.Item key={c} label={c} value={c} />)}
          </Picker>
        </View>

        {/* Sub-Category */}
        <Text style={styles.label}>Sub-Category</Text>
        <View style={styles.pickerContainer}>
          <Picker
            enabled={!!category}
            selectedValue={subCategory}
            onValueChange={setSubCategory}
          >
            <Picker.Item label="Select Sub-Category" value="" />
            {(category === 'Personal' ? personalOptions : professionalOptions)
              .map(i => <Picker.Item key={i} label={i} value={i} />)}
          </Picker>
        </View>

        {/* Date Picker */}
        <Text style={styles.label}>Document Date</Text>
        <TouchableOpacity
          style={[styles.input, { justifyContent: 'center' }]}
          onPress={() => setShowDatePicker(true)}
        >
          <Text>{formattedDate}</Text>
        </TouchableOpacity>
        {showDatePicker && (
          <DateTimePicker
            value={date}
            mode="date"
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            onChange={onChangeDate}
          />
        )}

        {/* Tags */}
        <Text style={styles.label}>Tags</Text>
        <View style={styles.tagInputContainer}>
          {tags.map(t => (
            <View key={t} style={styles.chip}>
              <Text style={styles.chipText}>{t}</Text>
            </View>
          ))}
          <TextInput
            style={[styles.input, { flex: 1 }]}
            placeholder="Add tag"
            value={tagInput}
            onChangeText={setTagInput}
            onSubmitEditing={() => addTag(tagInput.trim())}
          />
        </View>
        {filteredTags.length > 0 && (
          <FlatList
            data={filteredTags}
            keyExtractor={item => item}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.suggestion}
                onPress={() => addTag(item)}
              >
                <Text>{item}</Text>
              </TouchableOpacity>
            )}
            style={styles.suggestionsList}
          />
        )}

        {/* Remarks */}
        <Text style={styles.label}>Remarks</Text>
        <TextInput
          style={[styles.input, { height: 80 }]}
          placeholder="Enter remarks"
          multiline
          value={remarks}
          onChangeText={setRemarks}
        />

        {/* Submit */}
        <TouchableOpacity
          style={styles.submitBtn}
          onPress={handleSubmit}
          disabled={!fileUri}
        >
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
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#CCC',
    borderRadius: 8,
    marginBottom: 16,
    backgroundColor: '#FAFAFA',
  },
  input: {
    height: 48,
    borderWidth: 1,
    borderColor: '#CCC',
    borderRadius: 8,
    paddingHorizontal: 12,
    backgroundColor: '#FAFAFA',
    marginBottom: 16,
  },
  tagInputContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#CCC',
    borderRadius: 8,
    padding: 8,
    backgroundColor: '#FAFAFA',
    marginBottom: 16,
  },
  chip: {
    backgroundColor: '#E0E0E0',
    borderRadius: 16,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginRight: 8,
    marginBottom: 8,
  },
  chipText: { fontSize: 12 },
  suggestionsList: { maxHeight: 100, marginBottom: 16 },
  suggestion: {
    padding: 8,
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderColor: '#EEE',
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
});
