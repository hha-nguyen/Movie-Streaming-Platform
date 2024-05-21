import firestore from '@react-native-firebase/firestore';
import { Movie } from '../../../types/movie';

export const getMovieList = async () => {
  return firestore()
    .collection<Movie>('movies')
    .get()
    .then(querySnapshot => {
      return querySnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
    })
    .catch(err => {
      console.log('Error getting movies', err);
      return [] as Movie[];
    });
};
