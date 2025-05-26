import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import Icon from '@/components/ui/Icon';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { persistor, store } from '@/src/store';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { router, Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { TouchableOpacity } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import 'react-native-reanimated';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    AGaramondProItalic: require('../assets/fonts/AGaramondPro-BoldItalic.otf'),
    AvenirMedium: require('../assets/fonts/avenir-light.ttf'),
    AvenirBold: require('../assets/fonts/Avenir_85_Heavy.ttf'),
    AGaramondProBold: require('../assets/fonts/AGaramondPro-Bold.otf'),
    AGaramondProItalicLight: require('../assets/fonts/AGaramondPro-SemiboldItalic.otf')
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <GestureHandlerRootView style={{flex:1}}>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <PersistGate loading={null} persistor={persistor}>
        <Provider store={store}>
          <Main />
        </Provider>
        <StatusBar style='light' backgroundColor={Colors.light.background} />
      </PersistGate>
    </ThemeProvider>
    </GestureHandlerRootView>
  );
}

const Main = () => {
  return (
    <ThemedView style={{flex:1}}>
      <Stack
        screenOptions={{
          headerStyle: {backgroundColor: Colors.light.background},
          headerTintColor: Colors.dark.primary,
          headerTitleStyle: {fontSize:14},
          headerShadowVisible:false,
          headerLeft: () => <TouchableOpacity onPress={() => router.back()}><Icon type='Ionicons' name='chevron-back' size={18} color={Colors.dark.primary} /></TouchableOpacity>,
          headerRight: () => (
            <ThemedView style={{flexDirection:'row',gap:10}}>
              <ThemedView style={{justifyContent:'center'}}><ThemedText>Filter</ThemedText></ThemedView>
              <TouchableOpacity style={{justifyContent:'center'}}><Icon type='MaterialIcons' name='tune' size={24} color={Colors.dark.gray} /></TouchableOpacity>
            </ThemedView>
          )
          //headerTitle: () => <Image source={require('@/assets/images/smarttext.png')} style={{height:60,width:160,marginLeft:10}} resizeMode='contain' />,
        }}
      >
        <Stack.Screen name="index" options={{ headerShown: true, }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: true, headerTitle:'back' }} />
      </Stack>
    </ThemedView>
  );
}
