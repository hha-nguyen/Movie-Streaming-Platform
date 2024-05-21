import { Box } from '../../components/Layout/Box';
import { Text } from '../../components/Text/Text';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ActivityIndicator, Image, ScrollView } from 'react-native';
import { AntDesign, FontAwesome5 } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import { getMovieList } from '../../features/home/api/getMovieList';
import storage from '@react-native-firebase/storage';
import { Movie } from '../../types/movie';
import TextField from '../../components/TextField/TextField';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { RootStackParams } from '../../types/navigation';

export const SearchScreen = () => {
  const { top } = useSafeAreaInsets();
  const { navigate } = useNavigation<NavigationProp<RootStackParams>>();

  const [movies, setMovies] = useState<Movie[]>([]);
  const [search, setSearch] = useState('');
  const [recentMovies, setRecentMovies] = useState<Movie[]>([]);

  function formatNumber(num: number): string {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'm';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'k';
    } else {
      return num.toString();
    }
  }

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
    <Box flex={1} bgColor={'#000000'} pt={top} px={16}>
      <Text h1 bold>
        Search
      </Text>
      <Box flexDirection={'row'} alignItems={'center'}>
        <TextField
          placeholder={'Search your film...'}
          value={search}
          onChangeText={setSearch}
          style={{ flex: 1 }}
        />
        {/*<Box*/}
        {/*  p={16}*/}
        {/*  alignItems={'center'}*/}
        {/*  bgColor={'red'}*/}
        {/*  borderRadius={8}*/}
        {/*  ml={16}*/}
        {/*  mt={20}>*/}
        {/*  <Text bold>Search</Text>*/}
        {/*</Box>*/}
      </Box>
      <Box mt={16}>
        <Text h2 bold>
          {search === '' ? 'Recent Search' : 'Available Films for you'}
        </Text>
      </Box>
      <ScrollView style={{ flex: 1 }}>
        {movies.length === 0 ? (
          <ActivityIndicator color={'#FFFFFF'} size={24} />
        ) : search === '' ? (
          recentMovies.map((movie, index) => {
            return (
              <Box
                key={index}
                mt={16}
                flexDirection={'row'}
                overflow={'hidden'}
                border={1}
                borderColor={'#888888'}
                borderRadius={8}
                onPress={() => {
                  setRecentMovies([movie, ...recentMovies]);
                  navigate('MovieDetail', { movie });
                }}>
                <Image
                  source={{ uri: movie.poster }}
                  style={{ width: 120, height: '100%' }}
                />
                <Box ml={8} p={8} flex={1}>
                  <Text h3 bold>
                    {movie.title}
                  </Text>
                  <Text numberOfLines={1}>Genres: {movie.type}</Text>
                  <Box flexDirection={'row'} columnGap={4}>
                    <AntDesign name={'star'} size={16} color={'#F4B22E'} />
                    <Text>{movie.vote_average}</Text>
                    <Text color={'#d5d3d3'}>
                      ({formatNumber(movie.vote_count)})
                    </Text>
                  </Box>
                </Box>
              </Box>
            );
          })
        ) : (
          movies
            .filter(item =>
              item.title.toLowerCase().includes(search.toLowerCase()),
            )
            .map((movie, index) => {
              return (
                <Box
                  key={index}
                  mt={16}
                  flexDirection={'row'}
                  overflow={'hidden'}
                  border={1}
                  borderColor={'#888888'}
                  borderRadius={8}
                  onPress={() => {
                    setRecentMovies([movie, ...recentMovies]);
                    navigate('MovieDetail', { movie });
                  }}>
                  <Image
                    source={{ uri: movie.poster }}
                    style={{ width: 120, height: '100%' }}
                  />
                  <Box ml={8} p={8} flex={1}>
                    <Text h3 bold numberOfLines={2}>
                      {movie.title}
                    </Text>
                    <Text numberOfLines={1}>Genres: {movie.type}</Text>
                    <Box flexDirection={'row'} columnGap={4}>
                      <AntDesign name={'star'} size={16} color={'#F4B22E'} />
                      <Text>{movie.vote_average}</Text>
                      <Text color={'#d5d3d3'}>
                        ({formatNumber(movie.vote_count)})
                      </Text>
                    </Box>
                  </Box>
                </Box>
              );
            })
        )}
        <Box h={100} />
      </ScrollView>
    </Box>
  );
};
