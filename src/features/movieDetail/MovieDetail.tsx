import React, { useEffect, useState } from 'react';
import { Box } from '../../components/Layout/Box';
import { Text } from '../../components/Text/Text';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { RootStackParams } from '../../types/navigation';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  ActivityIndicator,
  Dimensions,
  Image,
  ScrollView,
  StatusBar,
  TextInput,
} from 'react-native';
import { images } from '../../assets/images';
import VideoPlayer from './components/VideoPlayer';
import { Comment } from '../../types/comment';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
import { useUserStore } from '../../stores/userStore';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import auth from '@react-native-firebase/auth';
import { AntDesign, Feather, FontAwesome5, Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Modal from 'react-native-modal';

const MovieDetail = () => {
  const { goBack } = useNavigation();
  const route = useRoute<RouteProp<RootStackParams, 'MovieDetail'>>();
  const { movie } = route.params;
  const { top: topInsets } = useSafeAreaInsets();
  const { width, height } = Dimensions.get('window');
  const { user } = useUserStore();
  const [showPlayer, setShowPlayer] = useState(false);
  const [landscape, setLandscape] = useState(false);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [isCreatingRoom, setIsCreatingRoom] = useState(false);
  const [roomCode, setRoomCode] = useState('');
  const [participants, setParticipants] = useState<string[]>([]);
  const [ratingVisible, setRatingVisible] = useState(false);
  const [rating, setRating] = useState(0);

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

  const onCreateRoom = () => {
    setIsCreatingRoom(true);
    setTimeout(() => {
      setIsCreatingRoom(false);
      setRoomCode('MVZ-3RZ2');
    }, 2000);
  };

  return (
    <KeyboardAwareScrollView
      style={{ flex: 1, backgroundColor: '#000000' }}
      showsVerticalScrollIndicator={false}>
      <StatusBar barStyle={'light-content'} />
      <Box>
        {!landscape && !showPlayer && (
          <Box w={width} height={width}>
            <Image
              source={{ uri: movie.poster }}
              style={{ width, height: width }}
            />
            <LinearGradient
              colors={['rgba(0,0,0,0.8)', 'rgba(0,0,0,0)']}
              style={{ position: 'absolute', width, height: width / 3 }}
            />
            <Box
              position={'absolute'}
              top={topInsets}
              left={16}
              onPress={goBack}
              p={8}
              borderRadius={32}
              bgColor={'rgba(0,0,0,0.5)'}>
              <Feather name={'chevron-left'} size={24} color={'#FFFFFF'} />
            </Box>
            <Box
              position={'absolute'}
              top={topInsets}
              right={16}
              p={8}
              borderRadius={32}
              bgColor={'rgba(0,0,0,0.5)'}>
              <Feather name={'bookmark'} size={24} color={'#FFFFFF'} />
            </Box>
            <LinearGradient
              colors={['rgba(0,0,0,0)', 'rgba(0,0,0,0.8)']}
              style={{
                position: 'absolute',
                bottom: 0,
                width,
                height: width / 3,
              }}
            />
            <Box
              position={'absolute'}
              bottom={0}
              h={width / 4}
              w={width}
              p={16}
              flexDirection={'row'}
              alignItems={'center'}
              justifyContent={'space-between'}>
              <Box rowGap={4}>
                <Text h2 bold>
                  {movie.title}
                </Text>
                <Text color={'#d5d3d3'}>2023 · {movie.type} · 2h30m</Text>
                <Box flexDirection={'row'} columnGap={4}>
                  <AntDesign name={'star'} size={16} color={'#F4B22E'} />
                  <Text>{movie.vote_average}</Text>
                  <Text color={'#d5d3d3'}>({movie.vote_count})</Text>
                </Box>
              </Box>
              <Box
                w={48}
                h={48}
                alignItems={'center'}
                justifyContent={'center'}
                borderRadius={32}
                bgColor={'#F0233C'}
                onPress={() => setShowPlayer(true)}>
                <FontAwesome5
                  name={'play'}
                  size={20}
                  color={'#FFFFFF'}
                  style={{ marginLeft: 4 }}
                />
              </Box>
            </Box>
          </Box>
        )}
        {showPlayer && (
          <Box mt={topInsets}>
            <VideoPlayer
              uri={movie.video}
              landscape={landscape}
              onOrientationChange={setLandscape}
            />
          </Box>
        )}
      </Box>
      {!landscape && (
        <Box p={16}>
          {roomCode === '' ? (
            <Box
              flexDirection={'row'}
              p={16}
              mt={16}
              borderRadius={8}
              bgColor={'#FFFFFF'}
              alignItems={'center'}
              justifyContent={'center'}
              onPress={onCreateRoom}>
              {isCreatingRoom ? (
                <ActivityIndicator size={24} color={'#888888'} />
              ) : (
                <>
                  <FontAwesome5
                    name={'users'}
                    size={24}
                    color={'#000000'}
                    style={{ marginRight: 8 }}
                  />
                  <Text h4 bold color={'#000000'}>
                    Create Room to Watch Together
                  </Text>
                </>
              )}
            </Box>
          ) : (
            <Box
              p={16}
              borderRadius={8}
              border={1}
              borderColor={'#888888'}
              rowGap={8}>
              <Box
                flexDirection={'row'}
                alignItems={'center'}
                justifyContent={'space-between'}>
                <Text h2 bold>
                  Your Room: {roomCode}
                </Text>
                <Box>
                  <Ionicons name={'copy-outline'} size={24} color={'#FFFFFF'} />
                </Box>
              </Box>
              <Text>
                Share this code with your friends to watch together. You can
                invite up to 4 friends.
              </Text>
              <Box
                onPress={() => {
                  const randomUser =
                    users[Math.floor(Math.random() * users.length)];
                  if (
                    !participants.includes(randomUser) &&
                    participants.length < 4
                  ) {
                    setParticipants([...participants, randomUser]);
                  }
                }}>
                <Text h3 bold>
                  Joined with you ({participants.length}/4):
                </Text>
              </Box>
              {participants.map((participant, index) => (
                <Box
                  key={index}
                  flexDirection={'row'}
                  alignItems={'center'}
                  columnGap={8}>
                  <Image
                    source={images.accountDefault}
                    style={{ width: 30, height: 30, borderRadius: 15 }}
                  />
                  <Text h4 bold>
                    {participant}
                  </Text>
                </Box>
              ))}
            </Box>
          )}
          {!landscape && !ratingVisible && rating > 0 ? (
            <>
              <Box
                flexDirection={'row'}
                columnGap={16}
                mt={16}
                alignSelf={'center'}>
                {[1, 2, 3, 4, 5].map((star, index) => (
                  <AntDesign
                    key={index}
                    name={'star'}
                    size={24}
                    color={index < rating ? '#F4B22E' : '#888888'}
                  />
                ))}
              </Box>
              <Box mt={16} alignSelf={'center'}>
                <Text bold>
                  {rating === 1
                    ? 'Terrible'
                    : rating === 2
                    ? 'Bad'
                    : rating === 3
                    ? 'Average'
                    : rating === 4
                    ? 'Good'
                    : 'Excellent'}
                </Text>
              </Box>
            </>
          ) : (
            <Box>
              <Box
                flexDirection={'row'}
                p={16}
                mt={16}
                borderRadius={8}
                bgColor={'#FFFFFF'}
                alignItems={'center'}
                justifyContent={'center'}
                onPress={() => setRatingVisible(true)}>
                <AntDesign
                  name={'star'}
                  size={24}
                  color={'#000000'}
                  style={{ marginRight: 8 }}
                />
                <Text h4 bold color={'#000000'}>
                  Rate this film
                </Text>
              </Box>
            </Box>
          )}
          <Box mt={16} rowGap={16}>
            <Text bold h2>
              Story
            </Text>
            <Text h4 numberOfLines={4}>
              {movie.overview}
            </Text>
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
      <Modal
        isVisible={ratingVisible}
        onBackdropPress={() => setRatingVisible(false)}
        animationIn={'zoomIn'}
        animationOut={'zoomOut'}>
        <Box bgColor={'#000000'} p={16} borderRadius={8} alignItems={'center'}>
          <Text h3 bold>
            Rate this film
          </Text>
          <Box flexDirection={'row'} columnGap={16} mt={16}>
            {[1, 2, 3, 4, 5].map((star, index) => (
              <AntDesign
                key={index}
                name={'star'}
                size={32}
                color={index < rating ? '#F4B22E' : '#888888'}
                onPress={() => setRating(index + 1)}
              />
            ))}
          </Box>
          <Box mt={16}>
            <Text bold>
              {rating === 1
                ? 'Terrible'
                : rating === 2
                ? 'Bad'
                : rating === 3
                ? 'Average'
                : rating === 4
                ? 'Good'
                : rating === 5
                ? 'Excellent'
                : ''}
            </Text>
          </Box>
          <Box
            flexDirection={'row'}
            p={16}
            mt={16}
            borderRadius={8}
            bgColor={'#FFFFFF'}
            alignItems={'center'}
            justifyContent={'center'}
            onPress={() => setRatingVisible(false)}>
            <Text h4 bold color={'#000000'}>
              Submit
            </Text>
          </Box>
        </Box>
      </Modal>
    </KeyboardAwareScrollView>
  );
};

export default MovieDetail;
