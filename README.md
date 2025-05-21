# Real Life Quests

Real Life Quests is a React Native application built with Expo. It helps you turn everyday goals into quests so you can track and complete them in a fun way.

## Getting Started

### Install Dependencies

```bash
npm install
```

This installs the Expo CLI locally along with other packages.

### Run the App

Start the Expo development server. You can use the npm script or call Expo
directly:

```bash
npx expo start
```

Expo will launch a browser window where you can choose to run the app on iOS,
Android or the web. You can also scan the QR code with the Expo Go app on your
device. For a specific platform, you can run `npm run android`, `npm run ios`,
or `npm run web`.

## Deployment

### Building for Web

To build the web version of the app:

```bash
npm run build-web
```

This will export the web build to the `web-build` directory.

### Deploying to Firebase

To deploy the web build to Firebase Hosting:

```bash
npm run deploy-hosting
```

Or use the all-in-one script to build and deploy in one step:

```bash
./build-and-deploy.cmd
```

### Continuous Deployment

The app is set up with GitHub Actions to automatically deploy to Firebase Hosting when changes are pushed to the main branch.

### Run Tests

The project uses Jest for testing. Execute the test suite with:

```bash
npm test
```

