import React, {useEffect, useState} from 'react';
import {View, Text, Alert, BackHandler} from 'react-native';
// import CodePush from '@chlee1001/react-native-code-push';
import {version as currentVersion} from './package.json';
import CodePush from '@chlee1001/react-native-code-push';
import Snackbar from './src/components/common/snackbar';
// import Snackbar from './src/components/common/snackbar.tsx';
// import CodePush from '@chlee1001/react-native-code-push';
// import { useCodePush } from './src/hooks/useCodePush.ts';

const App: React.FC = () => {
  const [snackbarVisible, setSnackbarVisible] = useState(true);
  // const {isUpdateDownloaded} = useCodePush();

  // useEffect(() => {
  //   if (isUpdateDownloaded) {
  //     setSnackbarVisible(true);
  //   }
  // }, [isUpdateDownloaded]);

  // Press the back button to exit the app
  useEffect(() => {
    const backAction = () => {
      Alert.alert('알림', '앱 종료', [
        {
          text: '취소',
          onPress: () => null,
          style: 'cancel',
        },
        {text: '확인', onPress: () => BackHandler.exitApp()},
      ]);
      return true;
    };
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );
    return () => backHandler.remove();
  }, []);

  return (
    <View
      style={{
        height: '100%',
        display: 'flex',
        alignContent: 'center',
        justifyContent: 'center',
      }}>
      <Text>{`Helllo! Cenk this is code push example app.\n${currentVersion}\n`}</Text>

      <Snackbar
          visible={snackbarVisible}
          message="The app has been updated. Please restart to apply changes."
          onDismiss={() => setSnackbarVisible(false)}
          actionLabel="Restart"
          onActionPress={() => CodePush.restartApp()}
          autoHide={false}
          swipeToDismiss
      />
    </View>
  );
};

export default CodePush({checkFrequency: CodePush.CheckFrequency.MANUAL})(App);
// export default App;
