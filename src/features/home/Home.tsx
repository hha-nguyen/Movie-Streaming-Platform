import React, { useEffect, useState } from 'react';
import { Box } from '../../components/Layout/Box';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Dimensions, Image, ScrollView } from 'react-native';
import { images } from '../../assets/images';
import { getMovieList } from './api/getMovieList';
import { Movie } from '../../types/movie';
import storage from '@react-native-firebase/storage';
import { Text } from '../../components/Text/Text';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { RootStackParams } from '../../types/navigation';
import { BlurView } from 'expo-blur';
import { useUserStore } from '../../stores/userStore';

const Home = () => {
  const { navigate } = useNavigation<NavigationProp<RootStackParams>>();
  const { top } = useSafeAreaInsets();
  const { width, height } = Dimensions.get('window');
  const [movies, setMovies] = useState<Movie[]>([]);
  const { user } = useUserStore();
  useEffect(() => {
    (async () => {
      if (movies.length === 0) {
        const movieList = await getMovieList();
        for (const movie of movieList) {
          movie.poster = await storage().ref(movie.poster).getDownloadURL();
          movie.video = await storage().ref(movie.video).getDownloadURL();
        }
        setMovies(movieList);
      }
    })();
  }, [movies]);

  return (
    <Box flex={1} bgColor={'#000000'}>
      <ScrollView>
        {movies.length > 0 && (
          <Box>
            <Image
              source={{ uri: movies[0].poster }}
              style={{ width, height: (width * 3) / 2 }}
            />
            <Box position={'absolute'} w={'100%'}>
              <BlurView intensity={20} tint={'dark'}>
                <Box
                  flexDirection={'row'}
                  justifyContent={'space-between'}
                  mt={top + 16}
                  mx={16}
                  mb={16}>
                  <Image
                    source={images.logo}
                    style={{ width: 50, height: 50 }}
                  />
                  <Box
                    onPress={() => {
                      navigate('Profile');
                    }}>
                    <Image
                      source={
                        user && user.photoURL
                          ? { uri: user.photoURL }
                          : images.accountDefault
                      }
                      style={{ width: 50, height: 50, borderRadius: 25 }}
                    />
                  </Box>
                </Box>
              </BlurView>
            </Box>
            <Box p={16}>
              <Text bold h2>
                Top pick for {user?.displayName}
              </Text>
              <ScrollView horizontal={true} style={{ marginTop: 16 }}>
                {movies.map((movie, index) => (
                  <Box
                    key={index}
                    onPress={() => {
                      navigate('MovieDetail', { movie });
                    }}>
                    <Image
                      source={{ uri: movie.poster }}
                      style={{ width: 100, height: 150, marginRight: 8 }}
                    />
                  </Box>
                ))}
              </ScrollView>
            </Box>
          </Box>
        )}
      </ScrollView>
    </Box>
  );
};

export default Home;
