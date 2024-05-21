import { Box } from '../../components/Layout/Box';
import { Text } from '../../components/Text/Text';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ActivityIndicator, Image } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import { getMovieList } from '../../features/home/api/getMovieList';
import storage from '@react-native-firebase/storage';
import { Movie } from '../../types/movie';

export const CategoryScreen = () => {
  const { top } = useSafeAreaInsets();

  const [movies, setMovies] = useState<Movie[]>([]);

  const users = [
    'John Doe',
    'Marry Jane',
    'Peter Parker',
    'Tony Stark',
    'Bruce Wayne',
    'Clark Kent',
    'Diana Prince',
    'Barry Allen',
    'Arthur Curry',
    'Victor Stone',
  ];

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
        Let's Watch Together!
      </Text>
      <Box
        flexDirection={'row'}
        p={16}
        mt={16}
        borderRadius={8}
        bgColor={'#FFFFFF'}
        alignItems={'center'}
        justifyContent={'center'}>
        <FontAwesome5
          name={'users'}
          size={24}
          color={'#000000'}
          style={{ marginRight: 8 }}
        />
        <Text h4 bold color={'#000000'}>
          Join via Watch Party Code
        </Text>
      </Box>
      <Box mt={16}>
        <Text h2 bold>
          Available Rooms
        </Text>
      </Box>
      {movies.length === 0 ? (
        <ActivityIndicator color={'#FFFFFF'} size={24} />
      ) : (
        movies.map((movie, index) => {
          if (index % 2 === 0) return null;
          return (
            <Box
              key={index}
              mt={16}
              flexDirection={'row'}
              overflow={'hidden'}
              border={1}
              borderColor={'#888888'}
              borderRadius={8}>
              <Image
                source={{ uri: movie.poster }}
                style={{ width: 120, height: 80 }}
              />
              <Box ml={8} p={8}>
                <Text h3 bold>
                  Room: MVZ-{index}Z{index * 6}
                </Text>
                <Text>Hosted by: {users[index]}</Text>
                <Text>Joined: {Math.floor(Math.random() * 4)}/4</Text>
              </Box>
            </Box>
          );
        })
      )}
    </Box>
  );
};
