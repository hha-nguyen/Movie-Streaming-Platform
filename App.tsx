import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
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
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { SearchScreen } from './src/screens/search/SearchScreen';
import { CategoryScreen } from './src/screens/categories/CategoryScreen';
import { Box } from './src/components/Layout/Box';
import { Ionicons, Octicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from './src/api/queryClient';

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
    <QueryClientProvider client={queryClient}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <NavigationContainer>
          <Stack.Navigator initialRouteName="Intro">
            <Stack.Screen
              name="Intro"
              component={Intro}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="MainTab"
              component={MainTabNavigator}
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
    </QueryClientProvider>
  );
}

const Tab = createBottomTabNavigator();

const MainTabNavigator = () => {
  return (
    <Tab.Navigator
      tabBar={({ state, descriptors, navigation, insets }) => {
        return (
          <BlurView
            intensity={20}
            tint={'dark'}
            style={{
              position: 'absolute',
              bottom: 0,
              flexDirection: 'row',
              paddingBottom: insets.bottom,
              paddingTop: 16,
            }}>
            {state.routes.map((route, index) => {
              const { options } = descriptors[route.key];
              const label =
                options.tabBarLabel !== undefined
                  ? options.tabBarLabel
                  : options.title !== undefined
                  ? options.title
                  : route.name;

              const isFocused = state.index === index;

              const onPress = () => {
                const event = navigation.emit({
                  type: 'tabPress',
                  target: route.key,
                  canPreventDefault: true,
                });

                if (!isFocused && !event.defaultPrevented) {
                  navigation.navigate(route.name, route.params);
                }
              };

              const onLongPress = () => {
                navigation.emit({
                  type: 'tabLongPress',
                  target: route.key,
                });
              };

              const iconName =
                route.name === 'Home'
                  ? 'home'
                  : route.name === 'Search'
                  ? 'search'
                  : route.name === 'Category'
                  ? 'list-unordered'
                  : 'person';

              return (
                <TouchableOpacity
                  accessibilityRole="button"
                  accessibilityState={isFocused ? { selected: true } : {}}
                  accessibilityLabel={options.tabBarAccessibilityLabel}
                  testID={options.tabBarTestID}
                  onPress={onPress}
                  onLongPress={onLongPress}
                  style={{ flex: 1, alignItems: 'center' }}>
                  <Octicons
                    name={iconName}
                    size={28}
                    color={isFocused ? '#FFFFFF' : '#888888'}
                  />
                </TouchableOpacity>
              );
            })}
          </BlurView>
        );
      }}>
      <Tab.Screen
        name="Home"
        component={Home}
        options={{
          headerShown: false,
        }}
      />
      <Tab.Screen
        name="Search"
        component={SearchScreen}
        options={{
          headerShown: false,
        }}
      />
      <Tab.Screen
        name="Category"
        component={CategoryScreen}
        options={{
          headerShown: false,
        }}
      />
      <Tab.Screen
        name="Profile"
        component={Profile}
        options={{
          headerShown: false,
        }}
      />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
