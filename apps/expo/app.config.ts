import type { ConfigContext, ExpoConfig } from "expo/config"

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: "O mas la ?",
  slug: "omasla-app",
  owner: "marvinldotcom",
  scheme: "expo",
  version: "0.1.0",
  orientation: "portrait",
  icon: "./assets/icon.png",
  userInterfaceStyle: "automatic",
  splash: {
    image: "./assets/icon.png",
    resizeMode: "contain",
    backgroundColor: "#efe8dd",
  },
  updates: {
    fallbackToCacheTimeout: 0,
  },
  assetBundlePatterns: ["**/*"],
  ios: {
    bundleIdentifier: "com.marvinl.omasla",
    supportsTablet: true,
    infoPlist: {
      UIBackgroundModes: ["location", "fetch"],
      NSLocationAlwaysAndWhenInUseUsageDescription:
        "Allow $(PRODUCT_NAME) to use your location to track your position.",
      NSLocationAlwaysUsageDescription:
        "Allow $(PRODUCT_NAME) to use your location in the background.",
      NSLocationWhenInUseUsageDescription:
        "Allow $(PRODUCT_NAME) to use your location.",
    },
  },
  android: {
    package: "com.marvinl.omasla",
    googleServicesFile: "./google-services.json",
    adaptiveIcon: {
      foregroundImage: "./assets/icon.png",
      backgroundColor: "#efe8dd",
    },
    permissions: [
      "ACCESS_COARSE_LOCATION",
      "ACCESS_FINE_LOCATION",
      "ACCESS_BACKGROUND_LOCATION",
      "FOREGROUND_SERVICE",
      "WAKE_LOCK",
    ],
  },
  extra: {
    eas: {
      projectId: "1674bb77-7b4b-4066-a363-51d3329987c7",
    },
  },
  experiments: {
    tsconfigPaths: true,
    typedRoutes: true,
  },
  plugins: [
    "expo-router",
    [
      "expo-location",
      {
        isIosBackgroundLocationEnabled: true,
        isAndroidBackgroundLocationEnabled: true,
        locationAlwaysAndWhenInUsePermission:
          "Allow $(PRODUCT_NAME) to use your location to track your position.",
        locationAlwaysPermission:
          "Allow $(PRODUCT_NAME) to use your location in the background.",
        locationWhenInUsePermission:
          "Allow $(PRODUCT_NAME) to use your location.",
      },
    ],
  ],
})
