module.exports = {  expo: {
    name: 'Real Life Quests',
    slug: 'real-life-quests',
    version: '1.0.0',
    orientation: 'portrait',
    icon: './assets/icon.png',
    userInterfaceStyle: 'light',
    newArchEnabled: true,
    scheme: 'reallifequests',
    splash: {
      image: './assets/splash.png',
      resizeMode: 'contain',
      backgroundColor: '#ffffff'
    },
    assetBundlePatterns: [
      '**/*'
    ],
    ios: {
      supportsTablet: true
    },
    android: {
      adaptiveIcon: {
        foregroundImage: './assets/adaptive-icon.png',
        backgroundColor: '#ffffff'
      }
    },
    web: {
      favicon: './assets/favicon.png',
      bundler: 'metro',
      output: 'static',
      config: {
        firebase: {
          authDomain: "real-life-quests-27f84.firebaseapp.com"
        }
      }
    }
  }
};
