import React, { useEffect, useRef, useState } from 'react';
import { Box } from '../../../components/Layout/Box';
import { AVPlaybackStatus, Video } from 'expo-av';
import { Dimensions, Image, Pressable } from 'react-native';
import { images } from '../../../assets/images';
import PortraitProgressBar from './PortraitProgressBar';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import * as ScreenOrientation from 'expo-screen-orientation';

interface Props {
  uri: string;
  landscape: boolean;
  onOrientationChange: (landscape: boolean) => void;
}

const VideoPlayer = ({ uri, landscape, onOrientationChange }: Props) => {
  const { width, height } = Dimensions.get('window');
  const videoRef = useRef<Video>(null);
  const timeout = useRef<NodeJS.Timeout>();
  const [playing, setPlaying] = useState(false);
  const [controlVisible, setControlVisible] = useState(true);
  const [progressBarActive, setProgressBarActive] = useState(false);
  const [playbackStatus, setPlaybackStatus] = useState<AVPlaybackStatus>({
    isLoaded: false,
  });
  const opacityValue = useSharedValue(1);
  const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

  const playerControlStyle = useAnimatedStyle(() => ({
    position: 'absolute',
    width,
    height: landscape ? height : (width / 16) * 9,
    opacity: opacityValue.value,
  }));

  const layerStyle = useAnimatedStyle(() => ({
    opacity: 1 - opacityValue.value,
    position: 'absolute',
    width: '100%',
    height: '100%',
  }));

  useEffect(() => {
    clearTimeout(timeout.current);
    timeout.current = setTimeout(() => {
      if (playing && controlVisible && !progressBarActive) {
        opacityValue.value = withTiming(0, {
          duration: 500,
        });
        setControlVisible(false);
      }
    }, 2000);
  }, [playing, controlVisible, progressBarActive]);

  return (
    <Box>
      <Video
        ref={videoRef}
        source={{ uri }}
        style={{ width, height: landscape ? height : (width / 16) * 9 }}
        onPlaybackStatusUpdate={status => {
          if (status.isLoaded) {
            setPlaybackStatus(status);
          }
        }}
      />
      <Animated.View style={playerControlStyle}>
        <Box
          flex={1}
          flexDirection={'row'}
          alignItems={'center'}
          justifyContent={'space-around'}>
          <Box
            onPress={() => {
              if (playbackStatus.isLoaded) {
                videoRef.current?.setPositionAsync(
                  playbackStatus.positionMillis - 10000,
                );
              }
            }}>
            <Image
              source={images.iconSkipBackward}
              style={{ width: 30, height: 30 }}
            />
          </Box>
          <Box
            onPress={() => {
              if (playing) {
                videoRef.current?.pauseAsync();
              } else {
                videoRef.current?.playAsync();
              }
              setPlaying(!playing);
            }}>
            {playing ? (
              <Image
                source={images.iconPause}
                style={{ width: 40, height: 40 }}
              />
            ) : (
              <Image
                source={images.iconPlay}
                style={{ width: 40, height: 40 }}
              />
            )}
          </Box>
          <Box
            onPress={() => {
              if (playbackStatus.isLoaded) {
                videoRef.current?.setPositionAsync(
                  playbackStatus.positionMillis + 10000,
                );
              }
            }}>
            <Image
              source={images.iconSkipForward}
              style={{ width: 30, height: 30 }}
            />
          </Box>
        </Box>
        <Box
          mb={landscape ? 16 : 0}
          flexDirection={'row'}
          alignItems={'center'}>
          <PortraitProgressBar
            onSeek={value => videoRef.current?.setPositionAsync(value)}
            playbackStatus={playbackStatus}
            setActive={setProgressBarActive}
          />
          <Box
            flex={1}
            alignItems={'center'}
            onPress={async () => {
              if (landscape) {
                await ScreenOrientation.lockAsync(
                  ScreenOrientation.OrientationLock.PORTRAIT_UP,
                );
                onOrientationChange(false);
              } else {
                await ScreenOrientation.lockAsync(
                  ScreenOrientation.OrientationLock.LANDSCAPE_RIGHT,
                );
                onOrientationChange(true);
              }
            }}>
            <Image
              source={images.iconFullscreen}
              style={{ width: 20, height: 20 }}
            />
          </Box>
        </Box>
        {!controlVisible && (
          <AnimatedPressable
            style={layerStyle}
            onPress={() => {
              opacityValue.value = withTiming(1, {
                duration: 500,
              });
              setControlVisible(true);
            }}
          />
        )}
      </Animated.View>
    </Box>
  );
};

export default VideoPlayer;
