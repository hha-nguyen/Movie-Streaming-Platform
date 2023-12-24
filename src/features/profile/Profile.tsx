import React, { useEffect } from 'react';
import { Box } from '../../components/Layout/Box';
import { Text } from '../../components/Text/Text';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useForm } from 'react-hook-form';
import Input from '../../components/TextField/Input';
import TextField from '../../components/TextField/TextField';
import { Image } from 'react-native';
import { images } from '../../assets/images';
import { useUserStore } from '../../stores/userStore';
import { useValidationYupResolver } from '../../hooks/useValidationYupResolver';
import { userSchema } from './validation/userSchema';
import auth from '@react-native-firebase/auth';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { RootStackParams } from '../../types/navigation';
import * as ImagePicker from 'expo-image-picker';
import storage from '@react-native-firebase/storage';

const Profile = () => {
  const { top: topInsets } = useSafeAreaInsets();

  const { user, logOut: logOutUser, setUser } = useUserStore();
  const { reset, dispatch, navigate } =
    useNavigation<NavigationProp<RootStackParams>>();

  const {
    control,
    formState: { errors },
    handleSubmit,
    watch,
    setValue,
  } = useForm({
    mode: 'onSubmit',
    defaultValues: {
      displayName: user && user.displayName ? user.displayName : '',
      photoURL: user && user.photoURL ? user.photoURL : '',
    },
    resolver: useValidationYupResolver(userSchema()),
  });

  const onSubmit = () => {
    handleSubmit(async data => {
      if (data.photoURL && data.photoURL !== '') {
        const result = await storage()
          .ref('users/' + auth().currentUser?.uid + '/avatar')
          .putFile(data.photoURL);
        if (result.state === 'success') {
          await auth()
            .currentUser?.updateProfile({
              displayName: data.displayName,
              photoURL: result.metadata.fullPath,
            })
            .then(async () => {
              if (user) {
                const photoURL = await storage()
                  .ref(result.metadata.fullPath)
                  .getDownloadURL();
                setUser({
                  ...user,
                  displayName: data.displayName,
                  photoURL,
                });
              }
            });
        }
      } else {
        await auth()
          .currentUser?.updateProfile({
            displayName: data.displayName,
          })
          .then(() => {
            if (user) {
              setUser({ ...user, displayName: data.displayName });
            }
          });
      }
    })();
  };

  const logOut = async () => {
    await auth().signOut();
    logOutUser();
    reset({
      index: 0,
      routes: [{ name: 'Intro' }],
    });
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    console.log(result);

    if (!result.canceled) {
      setValue('photoURL', result.assets[0].uri);
    }
  };

  return (
    <Box flex={1} pt={topInsets} bgColor={'#000000'} p={16}>
      <Text h1 bold>
        Your profile
      </Text>
      <Box mt={16} flexDirection={'row'} alignItems={'center'}>
        <Image
          source={
            watch('photoURL') !== ''
              ? { uri: watch('photoURL') }
              : images.accountDefault
          }
          style={{ width: 100, height: 100, borderRadius: 50 }}
        />
        <Box
          ml={16}
          p={16}
          borderRadius={8}
          borderWidth={1}
          borderColor={'#D22F26'}
          alignItems={'center'}
          onPress={pickImage}>
          <Text bold>Change Avatar</Text>
        </Box>
      </Box>
      <Input
        as={TextField}
        control={control}
        name={'displayName'}
        label={'Display Name'}
        error={errors.displayName?.message}
        style={{ marginVertical: 16 }}
      />
      <Box
        mt={16}
        p={16}
        borderRadius={8}
        bgColor={'#D22F26'}
        alignItems={'center'}
        onPress={onSubmit}>
        <Text bold>Save changes</Text>
      </Box>
      <Box
        mt={16}
        p={16}
        borderRadius={8}
        borderWidth={1}
        borderColor={'#D22F26'}
        alignItems={'center'}
        onPress={logOut}>
        <Text bold>Log out</Text>
      </Box>
    </Box>
  );
};

export default Profile;
