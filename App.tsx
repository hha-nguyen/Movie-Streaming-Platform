import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import Intro from './src/features/intro/Intro';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Home from './src/features/home/Home';
import { useFonts } from 'expo-font';
import { RootStackParams } from './src/types/navigation';
import MovieDetail from './src/features/movieDetail/MovieDetail';
import SignIn from './src/features/signIn/SignIn';
import { useUserStore } from './src/stores/userStore';
import Profile from './src/features/profile/Profile';
import 'react-native-gesture-handler';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useEffect } from 'react';
import storage from '@react-native-firebase/storage';
import auth from '@react-native-firebase/auth';
import SignUp from './src/features/signUp/SignUp';

export default function App() {
  const [fontLoaded] = useFonts({
    'SVN-ProductSans-Bold': require('./src/assets/fonts/SVN-Product-Sans-Bold.ttf'),
    'SVN-ProductSans-BoldItalic': require('./src/assets/fonts/SVN-Product-Sans-Bold-Italic.ttf'),
    'SVN-ProductSans-Italic': require('./src/assets/fonts/SVN-Product-Sans-Italic.ttf'),
    'SVN-ProductSans-Regular': require('./src/assets/fonts/SVN-Product-Sans-Regular.ttf'),
  });
  const { setUser } = useUserStore();

  useEffect(() => {
    (async () => {
      const userFB = JSON.parse(JSON.stringify(auth().currentUser));
      if (userFB && userFB.photoURL) {
        const photoURL = await storage().ref(userFB.photoURL).getDownloadURL();
        setUser({
          ...userFB,
          photoURL,
        });
      }
    })();
  }, []);

  if (!fontLoaded) return null;

  const Stack = createNativeStackNavigator<RootStackParams>();

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Intro">
          <Stack.Screen
            name="Intro"
            component={Intro}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Home"
            component={Home}
            options={{ headerShown: false, animation: 'fade' }}
          />
          <Stack.Screen
            name="MovieDetail"
            component={MovieDetail}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="SignIn"
            component={SignIn}
            options={{ headerShown: false, animation: 'fade' }}
          />
          <Stack.Screen
            name="SignUp"
            component={SignUp}
            options={{ headerShown: false, animation: 'fade' }}
          />
          <Stack.Screen
            name="Profile"
            component={Profile}
            options={{ headerShown: false }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
