import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { initLanguage } from './src/i18n';
import { GamePickerScreen } from './src/screens/GamePickerScreen';
import { GameScreen } from './src/screens/GameScreen';
import { HomeScreen } from './src/screens/HomeScreen';
import { MazeGameScreen } from './src/screens/MazeGameScreen';
import { NonogramGameScreen } from './src/screens/NonogramGameScreen';
import { SettingsScreen } from './src/screens/SettingsScreen';
import { theme } from './src/theme';
import { RootStackParamList } from './src/types';

const Stack = createNativeStackNavigator<RootStackParamList>();

function App(): React.JSX.Element {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    initLanguage().finally(() => setReady(true));
  }, []);

  if (!ready) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color={theme.colors.accent} />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="GamePicker" component={GamePickerScreen} />
        <Stack.Screen name="Game" component={GameScreen} />
        <Stack.Screen name="MazeGame" component={MazeGameScreen} />
        <Stack.Screen name="NonogramGame" component={NonogramGameScreen} />
        <Stack.Screen name="Settings" component={SettingsScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.background,
  },
});

export default App;
