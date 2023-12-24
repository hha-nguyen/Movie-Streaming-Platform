import { Movie } from './movie';
import { ParamListBase } from '@react-navigation/native';

export interface RootStackParams extends ParamListBase {
  Home: undefined;
  MovieDetail: { movie: Movie };
  Intro: undefined;
  SignIn: undefined;
  SignUp: undefined;
  Profile: undefined;
}
