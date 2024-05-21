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
import Carousel, { ICarouselInstance } from 'react-native-reanimated-carousel';
import { useSharedValue } from 'react-native-reanimated';

const Home = () => {
  const { navigate } = useNavigation<NavigationProp<RootStackParams>>();
  const { top } = useSafeAreaInsets();
  const { width, height } = Dimensions.get('window');
  const [movies, setMovies] = useState<Movie[]>([]);
  const { user } = useUserStore();
  const ref = React.useRef<ICarouselInstance>(null);
  const progress = useSharedValue<number>(0);

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
          <Box py={80}>
            <Carousel
              ref={ref}
              width={width}
              height={(width * 4) / 3}
              data={movies}
              mode={'parallax'}
              renderItem={({ index }) => (
                <Box
                  flex={1}
                  onPress={() =>
                    navigate('MovieDetail', { movie: movies[index] })
                  }>
                  <Image
                    source={{ uri: movies[index].poster }}
                    style={{ width, height: (width * 3) / 2 }}
                  />
                </Box>
              )}
              autoPlay
              loop
              autoPlayInterval={3000}
            />
            <Box p={16}>
              <Text bold h2>
                Recommended for you
              </Text>
              <ScrollView horizontal={true} style={{ marginTop: 16 }}>
                {movies.map((movie, index) => (
                  <Box
                    key={index}
                    onPress={() => {
                      navigate('MovieDetail', { movie });
                    }}
                    width={100}
                    mr={16}
                    overflow={'hidden'}
                    borderRadius={8}>
                    <Image
                      source={{ uri: movie.poster }}
                      style={{ width: 100, height: 150 }}
                    />
                    <Box mt={8}>
                      <Text bold h4 numberOfLines={2}>
                        {movie.title}
                      </Text>
                      <Text color={'red'}>{movie.type.split(',')[0]}</Text>
                    </Box>
                  </Box>
                ))}
              </ScrollView>
            </Box>
          </Box>
        )}
      </ScrollView>
      <BlurView
        intensity={50}
        tint={'dark'}
        style={{
          flexDirection: 'row',
          paddingBottom: 16,
          paddingTop: top + 16,
          position: 'absolute',
          top: 0,
          width: '100%',
        }}>
        <Image
          source={images.logo}
          style={{ width: 40, height: 40, marginHorizontal: 16 }}
        />
        <ScrollView
          horizontal
          contentContainerStyle={{ alignItems: 'center' }}
          showsHorizontalScrollIndicator={false}>
          {['TV Shows', 'Movies', 'Categories', 'My List'].map(
            (item, index) => (
              <Box
                key={index}
                ml={16}
                px={16}
                py={8}
                borderColor={'#494949'}
                border={1}
                borderRadius={32}>
                <Text bold>{item}</Text>
              </Box>
            ),
          )}
        </ScrollView>
      </BlurView>
    </Box>
  );
};

export default Home;
