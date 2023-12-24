import React, { useEffect } from 'react';
import { Box } from '../../components/Layout/Box';
import LottieView from 'lottie-react-native';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { RootStackParams } from '../../types/navigation';
import { useUserStore } from '../../stores/userStore';

const Intro = () => {
  const { navigate } = useNavigation<NavigationProp<RootStackParams>>();
  const { user } = useUserStore();

  useEffect(() => {
    setTimeout(() => {
      if (user) {
        navigate('Home');
      } else {
        navigate('SignIn');
      }
    }, 3000);
  });

  return (
    <Box bgColor={'#000000'}>
      <LottieView
        source={require('../../assets/animation/intro-animation.json')}
        autoPlay
        loop={false}
        style={{ width: '100%', height: '100%' }}
      />
    </Box>
  );
};

export default Intro;
