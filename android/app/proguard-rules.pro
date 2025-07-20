# Add project specific ProGuard rules here.
# By default, the flags in this file are appended to flags specified
# in /usr/local/Cellar/android-sdk/24.3.3/tools/proguard/proguard-android.txt
# You can edit the include path and order by changing the proguardFiles
# directive in build.gradle.
#
# For more details, see
#   http://developer.android.com/guide/developing/tools/proguard.html

# Add any project specific keep options here:

# React Native ProGuard rules
-keep class com.facebook.react.** { *; }
-keep class com.facebook.hermes.reactexecutor.** { *; }
-keep class com.facebook.jni.** { *; }

# React Native Reanimated
-keep class com.swmansion.reanimated.** { *; }
-keep class com.facebook.react.turbomodule.** { *; }

# React Native Community DateTime Picker
-keep class com.reactcommunity.rndatetimepicker.** { *; }

# React Native Picker
-keep class com.reactnativecommunity.picker.** { *; }

# React Native FS
-keep class com.rnfs.** { *; }

# React Native Zip Archive
-keep class com.reactnativecommunity.netinfo.** { *; }

# React Native PDF Viewer
-keep class com.github.barteksc.pdfviewer.** { *; }
-keep class org.apache.pdfbox.** { *; }
-keep class com.artifex.mupdf.fitz.** { *; }

# React Native Blob Util (RNFetchBlob)
-keep class com.RNFetchBlob.** { *; }
-keep class com.reactnativecommunity.netinfo.** { *; }

# Redux and related
-keep class org.reduxjs.** { *; }
-keep class com.redux.** { *; }

# OkHttp (used by networking libraries)
-dontwarn okhttp3.**
-dontwarn okio.**
-keep class okhttp3.** { *; }
-keep class okio.** { *; }

# JSC (JavaScript Core)
-keep class com.facebook.jsc.** { *; }

# Hermes
-keep class com.facebook.hermes.unicode.** { *; }
-keep class com.facebook.jni.** { *; }

# General Android rules for React Native
-keepattributes *Annotation*
-keepclassmembers class * {
    @android.webkit.JavascriptInterface <methods>;
}

# Keep native methods
-keepclassmembers class * {
    native <methods>;
}

# Keep React Native bridge methods
-keepclassmembers class * implements com.facebook.react.bridge.ReactMethod {
    <methods>;
}

# Keep AsyncStorage
-keep class com.reactnativeasyncstorage.asyncstorage.** { *; }

# Keep SafeAreaView
-keep class com.th3rdwave.safeareacontext.** { *; }

# Image loading libraries
-keep class com.bumptech.glide.** { *; }
-keep class androidx.** { *; }

# Network security
-keep class androidx.security.crypto.** { *; }

# Keep BuildConfig
-keep class **.BuildConfig { *; }

# Remove logging in release builds
-assumenosideeffects class android.util.Log {
    public static *** d(...);
    public static *** v(...);
    public static *** i(...);
}

# Keep line numbers for crash reports
-keepattributes SourceFile,LineNumberTable
-renamesourcefileattribute SourceFile

# Ignore warnings about missing classes (common in React Native)
-dontwarn com.google.android.gms.**
-dontwarn java.nio.file.Files
-dontwarn java.nio.file.Path
-dontwarn java.nio.file.OpenOption
-dontwarn org.codehaus.mojo.animal_sniffer.IgnoreJRERequirement