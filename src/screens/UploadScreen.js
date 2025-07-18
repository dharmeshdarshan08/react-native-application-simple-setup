// UploadScreen.js
import React, {
  useState,
  useEffect,
  useCallback,
  useMemo
} from 'react';
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
  ActivityIndicator,
  Image,
} from 'react-native';
import {
  pick,
  types,
  keepLocalCopy,
  isErrorWithCode,
  errorCodes,
} from '@react-native-documents/picker';
import { launchCamera } from 'react-native-image-picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';
import Icon from 'react-native-vector-icons/Feather';
import { useSelector, useDispatch } from 'react-redux';
import { uploadFileDocumentEntry } from '../features/auth/authSlice';
import { useFocusEffect } from '@react-navigation/native';

// constant arrays lifted out of the component
const CATEGORIES = ['Personal', 'Professional'];
const PERSONAL_OPTIONS = ['John', 'Tom', 'Emily'];
const PROFESSIONAL_OPTIONS = ['Accounts', 'HR', 'IT', 'Finance'];

export default function UploadScreen() {
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
  const [submitAttempted, setSubmitAttempted] = useState(false);

  const status = useSelector(s => s.auth.status);
  const error = useSelector(s => s.auth.error);
  const dispatch = useDispatch();

  // reset validation flag whenever screen is focused
  useFocusEffect(useCallback(() => {
    setSubmitAttempted(false);
  }, []));

  // fetch tags once
  useEffect(() => {
    fetch('https://your-api-endpoint.com/tags')
      .then(r => r.json())
      .then(d => setAvailableTags(d.tags))
      .catch(console.warn);
  }, []);

  // memoized filtered suggestions
  const filteredTags = useMemo(() => {
    const q = tagInput.toLowerCase();
    return availableTags.filter(
      t => t.toLowerCase().includes(q) && !tags.includes(t)
    );
  }, [availableTags, tagInput, tags]);

  const formattedDate = useMemo(
    () => date.toISOString().split('T')[0],
    [date]
  );

  const ensurePermissions = useCallback(async () => {
    if (Platform.OS !== 'android') return true;
    const toRequest = [PermissionsAndroid.PERMISSIONS.CAMERA];
    if (Platform.Version < 29) {
      toRequest.push(PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE);
    }
    const results = await PermissionsAndroid.requestMultiple(toRequest);
    const okCamera = results[PermissionsAndroid.PERMISSIONS.CAMERA] === PermissionsAndroid.RESULTS.GRANTED;
    const okStorage = toRequest.includes(PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE)
      ? results[PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE] === PermissionsAndroid.RESULTS.GRANTED
      : true;
    if (!okCamera || !okStorage) {
      Alert.alert(
        'Permissions required',
        'Camera—and storage on older Android—permission is required to take and save photos.'
      );
      return false;
    }
    return true;
  }, []);

  const pickDocument = useCallback(async () => {
    try {
      const [file] = await pick({ type: [types.pdf, 'image/*'] });
      setFileName(file.name || '');
      const [copy] = await keepLocalCopy({
        files: [{
          fileName: file.name || '',
          uri: file.uri,
          convertVirtualFileToType: file.convertibleToMimeTypes?.[0],
        }],
        destination: 'documentDirectory',
      });
      setFileUri(copy.status === 'success' ? copy.localUri : file.uri);
    } catch (err) {
      if (!(isErrorWithCode(err) && err.code === errorCodes.OPERATION_CANCELED)) {
        console.warn(err);
      }
    }
  }, []);

  const pickImage = useCallback(async () => {
    if (!(await ensurePermissions())) return;
    launchCamera({ mediaType: 'photo', saveToPhotos: false }, res => {
      if (res.didCancel) return;
      if (res.errorCode) {
        console.warn(res.errorMessage);
        return;
      }
      const asset = res.assets[0];
      setFileName(asset.fileName || '');
      setFileUri(asset.uri);
    });
  }, [ensurePermissions]);

  const showFileOptions = useCallback(() => {
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
  }, [pickImage, pickDocument]);

  const addTag = useCallback(
    t => {
      if (!t || tags.includes(t)) return setTagInput('');
      setTags(ts => [...ts, t]);
      if (!availableTags.includes(t)) {
        fetch('https://your-api-endpoint.com/tags', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ tag: t }),
        })
          .then(r => r.json())
          .then(() => setAvailableTags(at => [...at, t]))
          .catch(console.warn);
      }
      setTagInput('');
    },
    [availableTags, tags]
  );

  const onChangeDate = useCallback((_, sel) => {
    setShowDatePicker(false);
    if (sel) setDate(sel);
  }, []);

  const handleSubmit = useCallback(async () => {
    setSubmitAttempted(true);
    if (!fileUri || !category || !subCategory || !remarks.trim() || !tags.length || tags.some(t => !t.trim())) {
      return;
    }
    const data = {
      major_head: category,
      minor_head: subCategory,
      document_date: `${String(date.getDate()).padStart(2, '0')}-${String(date.getMonth() + 1).padStart(2, '0')}-${date.getFullYear()}`,
      document_remarks: remarks,
      tags: tags.map(t => ({ tag_name: t })),
      user_id: 'dharmesh',
    };
    const file = {
      uri: fileUri,
      name: fileName || 'document',
      type: fileName.endsWith('.pdf') ? 'application/pdf' : 'image/jpeg',
    };
    try {
      const action = await dispatch(uploadFileDocumentEntry({ file, data }));
      if (uploadFileDocumentEntry.fulfilled.match(action)) {
        Alert.alert('Success', 'Your document has been uploaded successfully.');
        // reset all
        setFileName(''); setFileUri(''); setCategory('');
        setSubCategory(''); setDate(new Date()); setRemarks('');
        setTags([]); setTagInput(''); setSubmitAttempted(false);
      } else {
        const msg = action.payload?.message || error || 'Upload failed';
        Alert.alert('Upload failed', msg);
      }
    } catch (err) {
      Alert.alert('Upload failed', err.message || 'An error occurred.');
    }
  }, [fileUri, category, subCategory, remarks, tags, date, fileName, dispatch, error]);

  // choose options array based on category
  const subOptions = useMemo(
    () => category === 'Personal' ? PERSONAL_OPTIONS : PROFESSIONAL_OPTIONS,
    [category]
  );

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}><Text style={styles.headerTitle}>Upload Document</Text></View>
      <ScrollView contentContainerStyle={styles.container}>
        {/* File */}
        <Text style={styles.label}>Select File{submitAttempted && !fileUri && <Text style={styles.req}> *</Text>}</Text>
        <TouchableOpacity style={styles.fileButton} onPress={showFileOptions}>
          <Image
            source={require('../assets/icon/file.png')}
            style={styles.fileButtonIcon}
          />
          <Text style={styles.fileBtnTxt}>{fileName || 'Choose File'}</Text>
        </TouchableOpacity>
        {submitAttempted && !fileUri && <Text style={styles.error}>This field is required.</Text>}

        {/* Category */}
        <Text style={styles.label}>Category{submitAttempted && !category && <Text style={styles.req}> *</Text>}</Text>
        <View style={styles.pickerWrap}>
          <Picker selectedValue={category} onValueChange={v => { setCategory(v); setSubCategory('') }}>
            <Picker.Item label="Select Category" value="" />
            {CATEGORIES.map(c => <Picker.Item key={c} label={c} value={c} />)}
          </Picker>
        </View>
        {submitAttempted && !category && <Text style={styles.error}>This field is required.</Text>}

        {/* Sub */}
        <Text style={styles.label}>Sub-Category{submitAttempted && !subCategory && <Text style={styles.req}> *</Text>}</Text>
        <View style={styles.pickerWrap}>
          <Picker enabled={!!category} selectedValue={subCategory} onValueChange={setSubCategory}>
            <Picker.Item label="Select Sub-Category" value="" />
            {subOptions.map(o => <Picker.Item key={o} label={o} value={o} />)}
          </Picker>
        </View>
        {submitAttempted && !subCategory && <Text style={styles.error}>This field is required.</Text>}

        {/* Date */}
        <Text style={styles.label}>Document Date{submitAttempted && !date && <Text style={styles.req}> *</Text>}</Text>
        <TouchableOpacity style={styles.input} onPress={() => setShowDatePicker(true)}>
          <Text>{formattedDate}</Text>
        </TouchableOpacity>
        {showDatePicker && <DateTimePicker value={date} mode="date" display={Platform.OS === 'ios' ? 'spinner' : 'default'} onChange={onChangeDate} />}
        {submitAttempted && !date && <Text style={styles.error}>This field is required.</Text>}

        {/* Tags */}
        <Text style={styles.label}>Tags{submitAttempted && (!tags.length || tags.some(t => !t.trim())) && <Text style={styles.req}> *</Text>}</Text>
        <View style={styles.tagWrap}>
          {tags.map(t => <View key={t} style={styles.chip}><Text>{t}</Text></View>)}
          <TextInput
            style={styles.inputFlex}
            placeholder="Add tag"
            value={tagInput}
            onChangeText={setTagInput}
            onSubmitEditing={() => addTag(tagInput.trim())}
          />
        </View>
        {submitAttempted && (!tags.length || tags.some(t => !t.trim())) && <Text style={styles.error}>This field is required.</Text>}
        <FlatList
          data={filteredTags}
          keyExtractor={i => i}
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.suggestion} onPress={() => addTag(item)}>
              <Text>{item}</Text>
            </TouchableOpacity>
          )}
          style={styles.suggestions}
          keyboardShouldPersistTaps="handled"
          initialNumToRender={5}
        />

        {/* Remarks */}
        <Text style={styles.label}>Remarks{submitAttempted && !remarks.trim() && <Text style={styles.req}> *</Text>}</Text>
        <TextInput
          style={[styles.input, { height: 80 }]}
          placeholder="Enter remarks"
          multiline
          value={remarks}
          onChangeText={setRemarks}
        />
        {submitAttempted && !remarks.trim() && <Text style={styles.error}>This field is required.</Text>}

        {/* Submit */}
        <TouchableOpacity
          style={[styles.submitBtn, status === 'loading' && styles.loading]}
          onPress={handleSubmit}
          disabled={status === 'loading'}
        >
          {status === 'loading'
            ? <ActivityIndicator color="#fff" />
            : <Text style={styles.submitTxt}>Upload</Text>
          }
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const { width } = Dimensions.get('window');
const TAB_HEIGHT = 60;

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#fff' },
  header: { justifyContent: 'center', backgroundColor: '#3FB1C6', padding: 16, alignItems: 'center' },
  headerTitle: { color: '#fff', fontSize: 18, fontWeight: '600' },
  container: { padding: 24, paddingBottom: TAB_HEIGHT + 24 },
  label: { fontSize: 14, color: '#555', marginBottom: 6 },
  req: { color: 'red', fontWeight: 'bold' },
  fileButton: { flexDirection: 'row', alignItems: 'center', padding: 12, borderWidth: 1, borderColor: '#CCC', borderRadius: 8, marginBottom: 16, backgroundColor: '#FAFAFA' },
  fileBtnTxt: { marginLeft: 8, color: '#333', fontSize: 14 },
  pickerWrap: { borderWidth: 1, borderColor: '#CCC', borderRadius: 8, marginBottom: 16, backgroundColor: '#FAFAFA' },
  input: { height: 48, borderWidth: 1, borderColor: '#CCC', borderRadius: 8, paddingHorizontal: 12, backgroundColor: '#FAFAFA', marginBottom: 16, justifyContent: 'center' },
  inputFlex: { flex: 1, height: 48, borderWidth: 1, borderColor: '#CCC', borderRadius: 8, paddingHorizontal: 12, backgroundColor: '#FAFAFA', marginBottom: 16 },
  tagWrap: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', borderWidth: 1, borderColor: '#CCC', borderRadius: 8, padding: 8, backgroundColor: '#FAFAFA', marginBottom: 16 },
  chip: { backgroundColor: '#E0E0E0', borderRadius: 16, paddingHorizontal: 8, paddingVertical: 4, marginRight: 8, marginBottom: 8 },
  suggestions: { maxHeight: 100, marginBottom: 16 },
  suggestion: { padding: 8, backgroundColor: '#FFF', borderBottomWidth: 1, borderColor: '#EEE' },
  error: { color: 'red', fontSize: 12, marginBottom: 8, marginLeft: 4 },
  submitBtn: { height: 50, backgroundColor: '#3FB1C6', borderRadius: 8, justifyContent: 'center', alignItems: 'center', marginTop: 16 },
  loading: { opacity: 0.6 },
  submitTxt: { color: '#fff', fontSize: 16, fontWeight: '600' },
fileButtonIcon: {
  width: 32,
  height: 32,
  resizeMode: 'contain'
}
});
