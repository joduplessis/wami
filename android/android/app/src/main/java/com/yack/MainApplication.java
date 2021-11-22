package com.wami;

import android.app.Application;

import com.facebook.react.ReactApplication;
import com.swmansion.gesturehandler.react.RNGestureHandlerPackage;
import com.tradle.react.UdpSocketsModule;
import com.peel.react.TcpSocketsModule;
import com.rnfs.RNFSPackage;
import io.realm.react.RealmReactPackage;
import com.geektime.rnonesignalandroid.ReactNativeOneSignalPackage;
import com.RNFetchBlob.RNFetchBlobPackage;
import com.transistorsoft.rnbackgroundfetch.RNBackgroundFetchPackage;
import com.oblador.vectoricons.VectorIconsPackage;
import com.reactnative.ivpusic.imagepicker.PickerPackage;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;
import com.airbnb.android.react.maps.MapsPackage;
import com.oney.WebRTCModule.WebRTCModulePackage;

import java.util.Arrays;
import java.util.List;

public class MainApplication extends Application implements ReactApplication {

  private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {
    @Override
    public boolean getUseDeveloperSupport() {
      return BuildConfig.DEBUG;
    }

    @Override
    protected List<ReactPackage> getPackages() {
      return Arrays.<ReactPackage>asList(
          new MainReactPackage(),
            new RNGestureHandlerPackage(),
          new UdpSocketsModule(),
          new TcpSocketsModule(),
          new RNFSPackage(),
          new RealmReactPackage(),
          new ReactNativeOneSignalPackage(),
          new RNFetchBlobPackage(),
          new RNBackgroundFetchPackage(),
          new VectorIconsPackage(),
          new PickerPackage(),
          new WebRTCModulePackage(),
          new MapsPackage()
      );
    }

    @Override
    protected String getJSMainModuleName() {
      return "index";
    }
  };

  @Override
  public ReactNativeHost getReactNativeHost() {
    return mReactNativeHost;
  }

  @Override
  public void onCreate() {
    super.onCreate();
    SoLoader.init(this, /* native exopackage */ false);
  }
}
