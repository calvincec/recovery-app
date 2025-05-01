import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import 'react-native-reanimated';


import { useColorScheme } from '@/hooks/useColorScheme';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
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
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack initialRouteName="index">
	  	<Stack.Screen name="index" options={{ headerShown: false }} />
		  <Stack.Screen name="auths/LoginScreen" options={{ headerShown: false }} />
		  <Stack.Screen name="auths/FacilityAuthScreen" options={{ headerShown: false }} />
		  <Stack.Screen name="auths/UserAuthScreen" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
		<Stack.Screen name="(tabs)/chat" options={{ headerShown: false }} />
		<Stack.Screen name="(tabs)/EnterFacilityDetails" options={{ headerShown: false }} />
		<Stack.Screen name="(tabs)/FacilitiesScreen" options={{ headerShown: false }} />
		<Stack.Screen name="(tabs)/FacilityAuthScreen" options={{ headerShown: false }} />
		<Stack.Screen name="(tabs)/FacilityDetail" options={{ headerShown: false }} />
		<Stack.Screen name="(tabs)/HomeScreen" options={{ headerShown: false }} />
		<Stack.Screen name="(tabs)/LoginScreen" options={{ headerShown: false }} />
		<Stack.Screen name="(tabs)/map" options={{ headerShown: false }} />
		<Stack.Screen name="(tabs)/ProfileScreen" options={{ headerShown: false }} />
		<Stack.Screen name="(tabs)/StreaksScreen" options={{ headerShown: false }} />
		<Stack.Screen name="(tabs)/UserAuthScreen" options={{ headerShown: false }} />
		<Stack.Screen name="(tabs)/AdminAppointmentRequestsScreen" options={{ headerShown: false }} />
		<Stack.Screen name="(tabs)/AppointmentConfirmationScreen" options={{ headerShown: false }} />
		
        <Stack.Screen name="+not-found" />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
