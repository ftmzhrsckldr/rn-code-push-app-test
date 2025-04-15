import React, { useEffect, useState } from 'react';
import { SafeAreaView, StatusBar, View, StyleSheet, LogBox } from 'react-native';
import CodePush from '@chlee1001/react-native-code-push';
import Navigation from './src/navigation';
import { colors } from './src/theme/colors';
import Snackbar from './src/components/common/snackbar';
import { analyticsService } from './src/utils/analytics';
import { featureFlagsService } from './src/utils/featureFlags';

// Ignore specific LogBox warnings
LogBox.ignoreLogs([
  'VirtualizedLists should never be nested',
  'Warning: componentWillReceiveProps has been renamed',
]);

const App: React.FC = () => {
  const [snackbarVisible, setSnackbarVisible] = useState<boolean>(false);
  const [updateMessage, setUpdateMessage] = useState<string>(
    'The app has been updated. Please restart to apply changes.'
  );

  useEffect(() => {
    // Initialize analytics
    analyticsService.startNewSession();
    analyticsService.setEnabled(featureFlagsService.isEnabled('enableAnalytics'));
    analyticsService.trackEvent('app_launched');

    // Check for CodePush updates
    CodePush.sync(
      {
        installMode: CodePush.InstallMode.ON_NEXT_RESTART,
      },
      (syncStatus) => {
        if (syncStatus === CodePush.SyncStatus.UPDATE_INSTALLED) {
          setUpdateMessage('The app has been updated. Please restart to apply changes.');
          setSnackbarVisible(true);
        }
      }
    );

    // Check update status
    const checkUpdateStatus = async () => {
      try {
        const update = await CodePush.getUpdateMetadata();
        if (update) {
          analyticsService.trackEvent('codepush_update_status', {
            label: update.label,
            description: update.description,
            isFirstRun: update.isFirstRun,
          });
        }
      } catch (error) {
        console.error('Error checking update status:', error);
      }
    };

    checkUpdateStatus();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor={colors.background}
      />
      <Navigation />
      
      <Snackbar
        visible={snackbarVisible}
        message={updateMessage}
        onDismiss={() => setSnackbarVisible(false)}
        actionLabel="Restart"
        onActionPress={() => CodePush.restartApp()}
        autoHide={false}
        swipeToDismiss
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
});

export default CodePush({
  checkFrequency: CodePush.CheckFrequency.ON_APP_START,
  installMode: CodePush.InstallMode.ON_NEXT_RESTART,
})(App);
