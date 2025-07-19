// HomeScreen.js
import React, { useEffect, useState, useMemo } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  Image,
  FlatList,
  Dimensions,
  TouchableOpacity,
  TextInput,
  Modal,
  Platform,
  ActivityIndicator,
  Alert,
  ProgressBarAndroid,
  ProgressViewIOS,
  InteractionManager
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { searchDocumentEntry } from '../features/auth/authSlice';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';
import RNFS from 'react-native-fs';
import { zip } from 'react-native-zip-archive';
import Pdf from 'react-native-pdf'; // for PDF preview

export default function HomeScreen() {
  const dispatch = useDispatch();
  const documents = useSelector(state => state.auth.documents);
  const status = useSelector(state => state.auth.status);

  // Filter modal state
  const [filterVisible, setFilterVisible] = useState(false);
  const [majorHead, setMajorHead] = useState('');
  const [minorHead, setMinorHead] = useState('');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [tags, setTags] = useState('');
  const [uploadedBy, setUploadedBy] = useState('');
  const [showFromDatePicker, setShowFromDatePicker] = useState(false);
  const [showToDatePicker, setShowToDatePicker] = useState(false);

  // Preview modal state
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewDoc, setPreviewDoc] = useState(null);

  // Progress state for download all
  const [downloadProgress, setDownloadProgress] = useState(null); // null = not downloading, 0-1 = progress
  const [isDownloading, setIsDownloading] = useState(false);
  const cancelDownloadRef = React.useRef(false);

  // Cancel download handler
  const handleCancelDownload = () => {
    cancelDownloadRef.current = true;
    setIsDownloading(false);
    setDownloadProgress(null);
  };

  // Memoized filtered documents
  const filteredDocuments = useMemo(() => {
    let filtered = documents;
    if (majorHead) filtered = filtered.filter(doc => (doc.major_head || '').toLowerCase().includes(majorHead.toLowerCase()));
    if (minorHead) filtered = filtered.filter(doc => (doc.minor_head || '').toLowerCase().includes(minorHead.toLowerCase()));
    if (uploadedBy) filtered = filtered.filter(doc => (doc.uploaded_by || '').toLowerCase().includes(uploadedBy.toLowerCase()));
    if (tags) {
      const tagArr = tags.split(',').map(t => t.trim().toLowerCase()).filter(Boolean);
      if (tagArr.length > 0) {
        filtered = filtered.filter(doc =>
          (doc.tags || []).some(tagObj => tagArr.includes((tagObj.tag_name || '').toLowerCase()))
        );
      }
    }
    if (fromDate) {
      filtered = filtered.filter(doc => {
        if (!doc.document_date) return false;
        return new Date(doc.document_date) >= new Date(fromDate);
      });
    }
    if (toDate) {
      filtered = filtered.filter(doc => {
        if (!doc.document_date) return false;
        return new Date(doc.document_date) <= new Date(toDate);
      });
    }
    return filtered;
  }, [documents, majorHead, minorHead, tags, uploadedBy, fromDate, toDate]);

  // Fetch all documents on mount
  useEffect(() => {
    const payload = {
      major_head: '',
      minor_head: '',
      from_date: '',
      to_date: '',
      tags: [{ "tag_name": "" }, { "tag_name": "" }],
      uploaded_by: '',
      start: 0,
      length: 200,
      filterId: '',
      search: { value: '' },
    };
    dispatch(searchDocumentEntry(payload));
  }, [dispatch]);

  // File preview logic
  const handlePreview = (doc) => {
    setPreviewDoc(doc);
    setPreviewVisible(true);
  };

  // File download logic
  const handleDownload = async (doc) => {
    try {
      const fileUrl = doc.file_url;
      const fileName = fileUrl.split('/').pop().split('?')[0];
      // const destPath = `${RNFS.DocumentDirectoryPath}/${fileName}`;
      // const ret = RNFS.downloadFile({ fromUrl: fileUrl, toFile: destPath });
      await ret.promise;
      Alert.alert('Download complete', `Saved to ${destPath}`);
    } catch (err) {
      Alert.alert('Download failed', err.message);
    }
  };

  // Download all files in filteredDocuments as a ZIP in Downloads (Android) or app folder (iOS)
  const handleDownloadAll = async () => {
    // try {
    //   setDownloadProgress(0);
    //   setIsDownloading(true);
    //   cancelDownloadRef.current = false;
    //   // 1. Download all files to a temp folder in app's document directory
    //   const tempDir = `${RNFS.DocumentDirectoryPath}/temp_downloads`;
    //   await RNFS.mkdir(tempDir);

    //   const files = filteredDocuments.filter(doc => doc.file_url);
    //   const total = files.length;
    //   let completed = 0;
    //   let failed = 0;
    //   const MAX_CONCURRENT_DOWNLOADS = 3;
    //   // Helper to download a single file
    //   const downloadFile = async (doc) => {
    //     if (cancelDownloadRef.current) return null;
    //     const fileUrl = doc.file_url;
    //     const fileName = fileUrl.split('/').pop().split('?')[0];
    //     const destPath = `${tempDir}/${fileName}`;
    //     try {
    //       const ret = RNFS.downloadFile({ fromUrl: fileUrl, toFile: destPath });
    //       await ret.promise;
    //       return destPath;
    //     } catch (e) {
    //       failed++;
    //       return null;
    //     } finally {
    //       completed++;
    //       if (completed % 2 === 0 || completed === total) {
    //         setDownloadProgress(completed / total);
    //         await new Promise(res => setTimeout(res, 10));
    //       }
    //     }
    //   };
    //   // Download in batches
    //   let localFiles = [];
    //   for (let i = 0; i < files.length; i += MAX_CONCURRENT_DOWNLOADS) {
    //     if (cancelDownloadRef.current) break;
    //     const batch = files.slice(i, i + MAX_CONCURRENT_DOWNLOADS);
    //     await new Promise(res => InteractionManager.runAfterInteractions(res));
    //     const results = await Promise.all(batch.map(downloadFile));
    //     localFiles = localFiles.concat(results.filter(Boolean));
    //   }
    //   if (cancelDownloadRef.current) {
    //     await RNFS.unlink(tempDir);
    //     setDownloadProgress(null);
    //     setIsDownloading(false);
    //     cancelDownloadRef.current = false;
    //     Alert.alert('Download canceled', 'The download was canceled.');
    //     return;
    //   }
    //   // 2. Zip the files
    //   const zipFileName = 'documents.zip';
    //   const zipPath = `${tempDir}/${zipFileName}`;
    //   await zip(tempDir, zipPath);
    //   // 3. Move ZIP to Downloads (Android) or alert (iOS)
    //   if (Platform.OS === 'android') {
    //     const downloadsPath = `${RNFS.DownloadDirectoryPath}/${zipFileName}`;
    //     await RNFS.moveFile(zipPath, downloadsPath);
    //     Alert.alert('Download complete', `ZIP saved to Downloads: ${downloadsPath}${failed ? `\n${failed} files failed to download.` : ''}`);
    //   } else {
    //     Alert.alert('Download complete', `ZIP saved to app folder: ${zipPath}${failed ? `\n${failed} files failed to download.` : ''}`);
    //   }
    //   await RNFS.unlink(tempDir);
    //   setDownloadProgress(null);
    //   setIsDownloading(false);
    // } catch (err) {
    //   setDownloadProgress(null);
    //   setIsDownloading(false);
      Alert.alert('Download failed', err.message);
    // }
  };

  // Date picker handlers
  const handleFromDateChange = (event, selectedDate) => {
    setShowFromDatePicker(Platform.OS === 'ios');
    if (selectedDate) setFromDate(selectedDate.toISOString().slice(0, 10));
  };
  const handleToDateChange = (event, selectedDate) => {
    setShowToDatePicker(Platform.OS === 'ios');
    if (selectedDate) setToDate(selectedDate.toISOString().slice(0, 10));
  };

  const MAJOR_HEADS = ['Personal', 'Professional'];
  const MINOR_HEADS = {
    Personal: ['John', 'Tom', 'Emily'],
    Professional: ['Accounts', 'HR', 'IT', 'Finance'],
  };

  // Render document item
  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <TouchableOpacity style={styles.moreBtn} onPress={() => handlePreview(item)}>
        <Image
            source={require('../../src/assets/icon/eyeon.png')}
            style={{ width: 16, height:16 }}
          />
      </TouchableOpacity>
      <Image source={item.file_url && item.file_url.match(/\.(jpg|jpeg|png|gif)$/i) ? { uri: item.file_url } : require('../../src/assets/image/document.png')} style={styles.cardImage} />
      <Text style={styles.cardText} numberOfLines={1} ellipsizeMode="tail">
        {item.major_head} - {item.minor_head}
      </Text>
      <TouchableOpacity style={styles.downloadBtn} onPress={() => handleDownload(item)}>
        <Image
            source={require('../../src/assets/icon/download.png')}
            style={{ width: 8, height: 8 }}
          />
        <Text style={styles.downloadBtnText}>Download</Text>
      </TouchableOpacity>
    </View>
  );

  // Render preview modal
  const renderPreview = () => {
    if (!previewDoc) return null;
    const isImage = previewDoc.file_url.match(/\.(jpg|jpeg|png|gif)$/i);
    const isPDF = previewDoc.file_url.match(/\.pdf$/i);
    return (
      <Modal visible={previewVisible} animationType="slide" onRequestClose={() => setPreviewVisible(false)}>
        <View style={{ flex: 1, backgroundColor: '#fff', justifyContent: 'center', alignItems: 'center' }}>
          <TouchableOpacity onPress={() => setPreviewVisible(false)} style={{ position: 'absolute', top: 40, right: 20, zIndex: 2 }}>
            <Image
            source={require('../../src/assets/icon/close.png')}
            style={{ width: 32, height: 32 }}
          />
          </TouchableOpacity>
          <Text style={{ fontWeight: 'bold', fontSize: 18, marginBottom: 12 }}>{previewDoc.major_head} - {previewDoc.minor_head}</Text>
          {isImage ? (
            <Image source={{ uri: previewDoc.file_url }} style={{ width: 300, height: 400, resizeMode: 'contain' }} />
          ) : isPDF ? (
            <Pdf source={{ uri: previewDoc.file_url }} style={{ width: 300, height: 400 }} />
          ) : (
            <Text>Preview not available for this file type.</Text>
          )}
        </View>
      </Modal>
    );
  };

  return (
    <SafeAreaView style={styles.safe}>
      {/* Download Progress Modal with Cancel */}
      <Modal visible={isDownloading} transparent animationType="fade">
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.3)', justifyContent: 'center', alignItems: 'center' }}>
          <View style={{ backgroundColor: '#fff', borderRadius: 12, padding: 24, width: 280, alignItems: 'center' }}>
            <Text style={{ fontWeight: 'bold', fontSize: 16, marginBottom: 16 }}>Downloading files...</Text>
            {Platform.OS === 'android' ? (
              <ProgressBarAndroid styleAttr="Horizontal" indeterminate={false} progress={downloadProgress || 0} style={{ width: 200 }} />
            ) : (
              <ProgressViewIOS progress={downloadProgress || 0} style={{ width: 200 }} />
            )}
            <Text style={{ marginTop: 12 }}>{Math.round((downloadProgress || 0) * 100)}%</Text>
            <TouchableOpacity onPress={handleCancelDownload} style={{ marginTop: 18, backgroundColor: '#e74c3c', borderRadius: 20, paddingVertical: 8, paddingHorizontal: 24 }}>
              <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 15 }}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Gallery</Text>
      </View>
      {/* Filter and Download All Buttons in a single attractive row */}
      <View style={styles.actionRow}>
        <TouchableOpacity onPress={() => setFilterVisible(true)} style={[styles.actionBtn, styles.filterButton]}>
          <Image
            source={require('../../src/assets/icon/filter.png')}
            style={{ width: 16, height: 16 ,marginRight:6}}
          />
          <Text style={styles.actionBtnText}>Filter</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleDownloadAll} style={[styles.actionBtn, styles.downloadAllBtn]}>
          <Image
            source={require('../../src/assets/icon/download.png')}
            style={{ width: 16, height: 16, marginRight: 6 }}
          />
          <Text style={styles.actionBtnText}>Download All</Text>
        </TouchableOpacity>
      </View>
      {/* Filter Modal */}
      <Modal visible={filterVisible} animationType="slide" transparent onRequestClose={() => setFilterVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Filter Documents</Text>
            <View style={styles.modalDivider} />
            {/* Major Head Dropdown */}
            <Picker
              selectedValue={majorHead}
              onValueChange={v => { setMajorHead(v); setMinorHead(''); }}
              style={[styles.input, styles.modalInput]}
            >
              <Picker.Item label="Select Major Head" value="" />
              {MAJOR_HEADS.map(c => <Picker.Item key={c} label={c} value={c} />)}
            </Picker>
            {/* Minor Head Dropdown */}
            <Picker
              enabled={!!majorHead}
              selectedValue={minorHead}
              onValueChange={setMinorHead}
              style={[styles.input, styles.modalInput]}
            >
              <Picker.Item label="Select Minor Head" value="" />
              {(MINOR_HEADS[majorHead] || []).map(o => <Picker.Item key={o} label={o} value={o} />)}
            </Picker>
            {/* Date Pickers */}
            <TouchableOpacity onPress={() => setShowFromDatePicker(true)} style={[styles.input, styles.modalInput, { justifyContent: 'center' }]}>
              <Text style={{ color: fromDate ? '#333' : '#aaa' }}>{fromDate ? fromDate : 'From Date'}</Text>
            </TouchableOpacity>
            {showFromDatePicker && (
              <DateTimePicker
                value={fromDate ? new Date(fromDate) : new Date()}
                mode="date"
                display="default"
                onChange={handleFromDateChange}
              />
            )}
            <TouchableOpacity onPress={() => setShowToDatePicker(true)} style={[styles.input, styles.modalInput, { justifyContent: 'center' }]}>
              <Text style={{ color: toDate ? '#333' : '#aaa' }}>{toDate ? toDate : 'To Date'}</Text>
            </TouchableOpacity>
            {showToDatePicker && (
              <DateTimePicker
                value={toDate ? new Date(toDate) : new Date()}
                mode="date"
                display="default"
                onChange={handleToDateChange}
              />
            )}
            {/* Tags Input */}
            <TextInput
              placeholder="Tags (comma separated)"
              value={tags}
              onChangeText={setTags}
              style={[styles.input, styles.modalInput]}
            />
            <View style={styles.modalButtonRow}>
              <TouchableOpacity onPress={() => {
                setMajorHead('');
                setMinorHead('');
                setFromDate('');
                setToDate('');
                setTags('');
                setUploadedBy('');
              }} style={[styles.modalButton, styles.modalButtonOutline]}>
                <Text style={[styles.modalButtonText, styles.modalButtonTextOutline]}>Clear Filters</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setFilterVisible(false)} style={[styles.modalButton, styles.modalButtonOutline]}>
                <Text style={[styles.modalButtonText, styles.modalButtonTextOutline]}>Close</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setFilterVisible(false)} style={styles.modalButton}>
                <Text style={styles.modalButtonText}>Apply</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      {/* Preview Modal */}
      {renderPreview()}
      {/* Document Grid */}
      {status === 'loading' ? (
        <ActivityIndicator size="large" color="#3FB1C6" style={{ marginTop: 40 }} />
      ) : (
        <FlatList
          data={filteredDocuments}
          keyExtractor={item => item.document_id?.toString() || Math.random().toString()}
          numColumns={2}
          contentContainerStyle={styles.list}
          renderItem={renderItem}
        />
      )}
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
    width: '80%',
    height: cardSize * 0.8,
    borderRadius: 8,
    marginBottom: 8
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
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    padding: 8,
    marginBottom: 8,
  },
  filterButton: {
    backgroundColor: '#3FB1C6',
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  filterButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 24,
    marginHorizontal: 16,
    width: '90%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#222',
    marginBottom: 8,
    textAlign: 'center',
  },
  modalDivider: {
    height: 1,
    backgroundColor: '#eee',
    marginVertical: 12,
  },
  modalInput: {
    marginBottom: 14,
  },
  modalButtonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
  },
  modalButton: {
    flex: 1,
    backgroundColor: '#3FB1C6',
    paddingVertical: 10,
    borderRadius: 24,
    alignItems: 'center',
    marginHorizontal: 4,
  },
  modalButtonOutline: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#3FB1C6',
  },
  modalButtonText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: 'bold',
  },
  modalButtonTextOutline: {
    color: '#3FB1C6',
  },
  downloadBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#3FB1C6',
    borderRadius: 8,
    paddingVertical: 6,
    paddingHorizontal: 12,
    marginTop: 8,
    alignSelf: 'center',
  },
  downloadBtnText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
    marginLeft: 6,
  },
  downloadAllBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2D99A6',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 16,
    justifyContent: 'center',
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginTop: 12,
    marginBottom: 8,
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#3FB1C6',
    borderRadius: 8,
    paddingVertical: 10,
    marginHorizontal: 4,
    elevation: 2,
  },
  actionBtnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  filterButton: {
    backgroundColor: '#3FB1C6',
  },
  downloadAllBtn: {
    backgroundColor: '#2D99A6',
  },
});
