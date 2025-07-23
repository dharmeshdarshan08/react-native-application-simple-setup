# DMSApp – Document Management System (React Native) 📱📂

DMSApp is a mobile document management system built with React Native.  
The app allows users to securely log in via OTP, upload documents with detailed metadata, search/filter files, and preview/download documents.

## ✨ Features

- **🔐 OTP-Based Login**: Users log in using their mobile number and a secure OTP.
- **📤 File Upload**: Upload documents with date, category, dynamic subcategory, tags, remarks, and image/PDF file (camera/gallery).
- **🏷️ Dynamic Tag Input**: Tag autocomplete and creation, synced with backend.
- **🔎 File Search**: Powerful filtering by category, tags, and date range.
- **👁️ File Preview**: Inline preview for images & PDFs.
- **⬇️ Download Options**: Download individual files or all results as a ZIP archive.
- **📁 Organized Structure**: Uses React Navigation and modular directories (`components/`, `screens/`, `services/`).

## 🗂️ Project Structure

- `components/` – Reusable UI components
- `screens/` – App screens (Login, File Upload, etc.)
- `services/` – API and utility logic

## ⚡ Setup Instructions

1. **Clone the repository**
    ```http
    git clone https://github.com/your-github-repo-url-here.git](https://github.com/dharmeshdarshan08/react-native-docmanager.git
    cd react-native-docmanager
    ```

2. **Clean old dependencies/builds**
    ```sh
    rm -rf node_modules package-lock.json android/app/build android/.gradle
    ```

3. **Install dependencies**
    ```sh
    npm install
    ```

4.Check for connected devices 
   adb devbices
   
5. **Start the app on Android**
    ```sh
    npm run android
    ```

## ℹ️ Notes

- 📱 Use a real device or emulator for best results.
- 📄 1st PDF is Demo data with file URLs to Visualize for preview/download functionality.
- 🛡️ S3 access for download requires proper credentials; for testing, mock URLs are provided.

---

## 📬 Contact

For questions or support, contact:  
Dharmesh Darshan  
darshan.dharmesh@domain.com

---
**Automate to Elevate! 🚀**
