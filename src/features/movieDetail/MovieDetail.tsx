import React, { useEffect, useState } from 'react';
import { Box } from '../../components/Layout/Box';
import { Text } from '../../components/Text/Text';
import { RouteProp, useRoute } from '@react-navigation/native';
import { RootStackParams } from '../../types/navigation';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Dimensions, Image, ScrollView, TextInput } from 'react-native';
import { images } from '../../assets/images';
import VideoPlayer from './components/VideoPlayer';
import { Comment } from '../../types/comment';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
import { useUserStore } from '../../stores/userStore';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import auth from '@react-native-firebase/auth';

const MovieDetail = () => {
  const route = useRoute<RouteProp<RootStackParams, 'MovieDetail'>>();
  const { movie } = route.params;
  const { top: topInsets } = useSafeAreaInsets();
  const { width, height } = Dimensions.get('window');
  const { user } = useUserStore();
  const [landscape, setLandscape] = useState(false);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');

  useEffect(() => {
    (async () => {
      if (comments.length === 0) {
        firestore()
          .collection<Comment>(`movies/${movie.id}/comments`)
          .get()
          .then(async querySnapshot => {
            const comments: Comment[] = [];
            const data = querySnapshot.docs.map(doc => doc.data());
            for (const comment of data) {
              if (comment.user.photoURL) {
                comment.user.photoURL = await storage()
                  .ref(comment.user.photoURL)
                  .getDownloadURL();
              }
              comments.push(comment);
            }
            setComments(comments);
          });
      }
    })();
  }, [comments]);

  const onSendComment = async () => {
    if (newComment !== '') {
      await firestore()
        .collection(`movies/${movie.id}/comments`)
        .add({
          user: {
            displayName: auth().currentUser?.displayName,
            photoURL: auth().currentUser?.photoURL,
          },
          content: newComment,
          createdAt: new Date().toISOString(),
        })
        .then(async () => {
          if (user) {
            setComments([
              ...comments,
              {
                content: newComment,
                user: {
                  displayName: user.displayName || '',
                  photoURL: user.photoURL,
                },
                createdAt: new Date().toISOString(),
              },
            ]);
            setNewComment('');
          }
        });
    }
  };

  return (
    <KeyboardAwareScrollView style={{ flex: 1, backgroundColor: '#000000' }}>
      <Box mt={topInsets}>
        {!landscape && (
          <Image
            source={{ uri: movie.poster }}
            style={{ width, height: (width / 16) * 9 }}
          />
        )}
        <VideoPlayer
          uri={movie.video}
          landscape={landscape}
          onOrientationChange={setLandscape}
        />
      </Box>
      {!landscape && (
        <Box p={16}>
          <Text h2>{movie.title}</Text>
          <Box flexDirection={'row'}>
            <Text>2023</Text>
            <Image
              source={images.iconDolbyBadge}
              style={{ height: '100%', width: 70 }}
              resizeMode={'contain'}
            />
            <Image
              source={images.iconHDBadge}
              style={{ height: '100%', width: 30 }}
              resizeMode={'contain'}
            />
            <Image
              source={images.iconAdBadge}
              style={{ height: '100%', width: 40 }}
              resizeMode={'contain'}
            />
          </Box>
          <Box
            flexDirection={'row'}
            p={16}
            mt={16}
            borderRadius={8}
            bgColor={'#FFFFFF'}
            justifyContent={'center'}>
            <Image
              source={images.iconPlayBlack}
              style={{ height: '100%', width: 30 }}
              resizeMode={'contain'}
            />
            <Text h4 bold color={'#000000'}>
              Play Trailer
            </Text>
          </Box>
          <Box mt={16}>
            <Text bold h4>
              Overview
            </Text>
            <Text>{movie.overview}</Text>
          </Box>
          <Box mt={16}>
            <Text bold h2>
              Comments
            </Text>
            {comments.map((comment, index) => (
              <Box key={index} mt={16}>
                <Box flexDirection={'row'} alignItems={'center'}>
                  <Image
                    source={
                      comment.user.photoURL
                        ? { uri: comment.user.photoURL }
                        : images.accountDefault
                    }
                    style={{ width: 30, height: 30, borderRadius: 15 }}
                  />
                  <Box ml={8}>
                    <Text>
                      <Text h4 bold>
                        {comment.user.displayName}
                      </Text>
                      <Text h6 color={'#BDBDBD'}>
                        {'   '}
                        {new Date(comment.createdAt).toDateString()}
                      </Text>
                    </Text>
                  </Box>
                </Box>
                <Box p={8} ml={36} borderRadius={8} bgColor={'#595959'}>
                  <Text>{comment.content}</Text>
                </Box>
              </Box>
            ))}
            <Box mt={16} flexDirection={'row'} alignItems={'center'}>
              <Image
                source={
                  user && user.photoURL
                    ? { uri: user.photoURL }
                    : images.accountDefault
                }
                style={{ width: 30, height: 30, borderRadius: 15 }}
              />
              <TextInput
                placeholder={'Write a comment...'}
                placeholderTextColor={'#BDBDBD'}
                value={newComment}
                onChangeText={setNewComment}
                multiline
                style={{
                  color: '#FFFFFF',
                  marginLeft: 8,
                  flex: 1,
                  padding: 8,
                  borderWidth: 1,
                  borderColor: '#BDBDBD',
                  borderRadius: 8,
                }}
              />
              <Box p={8} ml={8} onPress={onSendComment}>
                <Text bold>Send</Text>
              </Box>
            </Box>
          </Box>
        </Box>
      )}
    </KeyboardAwareScrollView>
  );
};

export default MovieDetail;
