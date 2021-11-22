package com.mobile;

import android.app.Application;

import com.facebook.react.ReactApplication;
import com.oney.WebRTCModule.WebRTCModulePackage;
import com.zxcpoiu.incallmanager.InCallManagerPackage;
import com.reactnative.ivpusic.imagepicker.PickerPackage;
import com.RNFetchBlob.RNFetchBlobPackage;
import com.rnfs.RNFSPackage;
import com.imagepicker.ImagePickerPackage;
import io.realm.react.RealmReactPackage;
import com.tradle.react.UdpSocketsModule;
import com.peel.react.TcpSocketsModule;
import com.dieam.reactnativepushnotification.ReactNativePushNotificationPackage;
import com.peel.react.rnos.RNOSModule;
import com.airbnb.android.react.maps.MapsPackage;
import com.oblador.vectoricons.VectorIconsPackage;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;
import com.transistorsoft.rnbackgroundfetch.RNBackgroundFetchPackage;

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
            new WebRTCModulePackage(),
            new InCallManagerPackage(),
            new PickerPackage(),
            new RNFetchBlobPackage(),
            new RNFSPackage(),
            new ImagePickerPackage(),
            new RealmReactPackage(),
            new UdpSocketsModule(),
            new TcpSocketsModule(),
            new ReactNativePushNotificationPackage(),
            new RNOSModule(),
            new MapsPackage(),
            new RNBackgroundFetchPackage(),
            new VectorIconsPackage()
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
