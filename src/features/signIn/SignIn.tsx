import React, { useEffect } from 'react';
import { Box } from '../../components/Layout/Box';
import { Text } from '../../components/Text/Text';
import { Dimensions, Image } from 'react-native';
import { images } from '../../assets/images';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { useForm } from 'react-hook-form';
import { useValidationYupResolver } from '../../hooks/useValidationYupResolver';
import { signInSchema } from './validation/signInSchema';
import Input from '../../components/TextField/Input';
import TextField from '../../components/TextField/TextField';
import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';
import { useUserStore } from '../../stores/userStore';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { RootStackParams } from '../../types/navigation';
import storage from '@react-native-firebase/storage';

const SignIn = () => {
  const { width } = Dimensions.get('window');
  const heightValue = useSharedValue(0);
  const { setUser } = useUserStore();
  const { navigate } = useNavigation<NavigationProp<RootStackParams>>();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    mode: 'onSubmit',
    defaultValues: {
      email: '',
      password: '',
    },
    resolver: useValidationYupResolver(signInSchema()),
  });

  const animatedStyles = useAnimatedStyle(() => {
    return {
      width: '100%',
      height: heightValue.value,
      overflow: 'hidden',
    };
  });

  const onSubmit = () => {
    handleSubmit(async data => {
      let photoURL = null;
      const user = await auth().signInWithEmailAndPassword(
        data.email,
        data.password,
      );
      if (user.user.photoURL) {
        photoURL = await storage().ref(user.user.photoURL).getDownloadURL();
      }
      if (user) {
        setUser({ ...user.user, photoURL });
        navigate('Home');
      }
    })();
  };

  useEffect(() => {
    setTimeout(() => {
      heightValue.value = withTiming(400, { duration: 1000 });
    }, 400);
  }, [heightValue]);

  return (
    <Box
      flex={1}
      px={16}
      bgColor={'#000000'}
      justifyContent={'center'}
      alignItems={'center'}>
      <Box>
        <Image
          source={images.logoFull}
          style={{ width: width - 28, height: width / 2 }}
          resizeMode={'contain'}
        />
      </Box>
      <Animated.View style={animatedStyles}>
        <Box>
          <Input
            as={TextField}
            control={control}
            name={'email'}
            placeholder={'Email'}
            error={errors.email?.message}
          />
          <Input
            as={TextField}
            control={control}
            name={'password'}
            placeholder={'Password'}
            error={errors.password?.message}
            secureTextEntry
          />
          <Box
            bgColor={'#D22F26'}
            mt={16}
            p={16}
            borderRadius={8}
            alignItems={'center'}
            onPress={onSubmit}>
            <Text bold>Sign In</Text>
          </Box>
          <Box
            borderColor={'#D22F26'}
            border={1}
            mt={16}
            p={16}
            borderRadius={8}
            alignItems={'center'}
            onPress={() => {
              navigate('SignUp');
            }}>
            <Text bold>Sign Up</Text>
          </Box>
        </Box>
      </Animated.View>
    </Box>
  );
};

export default SignIn;
