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
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  // const {isUpdateDownloaded} = useCodePush();

  useEffect(() => {
    CodePush.sync(
      {
        installMode: CodePush.InstallMode.ON_NEXT_RESTART,
      },
      (syncStatus) => {
        // Güncelleme yüklendiyse snackbar'ı göster
        if (syncStatus === CodePush.SyncStatus.UPDATE_INSTALLED) {
          setSnackbarVisible(true);
        }
      }
    );
  }, []);

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
      <Text>{`RN Version 0.67.0 eski RN arch için test.\n${currentVersion}\n`}</Text>

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
