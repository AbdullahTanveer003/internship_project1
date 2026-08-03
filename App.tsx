import React from 'react';
import { StatusBar, StyleSheet } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { AppProvider, useApp } from './src/context/AppContext';
import { AppNavigator } from './src/navigation/AppNavigator';
import { lightColors, darkColors } from './src/constants/colors';

const MainAppContainer: React.FC = () => {
  const { isDarkMode } = useApp();
  const colors = isDarkMode ? darkColors : lightColors;

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={colors.background}
      />
      <AppNavigator />
    </SafeAreaView>
  );
};

function App(): React.JSX.Element {
  return (
    <SafeAreaProvider>
      <AppProvider>
        <MainAppContainer />
      </AppProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
});

export default App;
