package com.dmsapp

import com.facebook.react.ReactActivity
import com.facebook.react.ReactActivityDelegate
import com.facebook.react.ReactRootView
import com.facebook.react.defaults.DefaultNewArchitectureEntryPoint.fabricEnabled
import com.facebook.react.defaults.DefaultReactActivityDelegate
import com.swmansion.gesturehandler.react.RNGestureHandlerEnabledRootView

class MainActivity : ReactActivity() {

  override fun getMainComponentName(): String = "DMSApp"

  override fun createReactActivityDelegate(): ReactActivityDelegate {
    return object : DefaultReactActivityDelegate(
      this,
      mainComponentName,
      fabricEnabled
    ) {
      override fun createRootView(): ReactRootView {
        // Wrap the root in RNGestureHandlerEnabledRootView
        return RNGestureHandlerEnabledRootView(this@MainActivity)
      }
    }
  }
}
