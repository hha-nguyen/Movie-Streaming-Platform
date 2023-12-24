import React, {
  Dispatch,
  MutableRefObject,
  RefObject,
  SetStateAction,
  useImperativeHandle,
} from 'react';
import { StyleSheet, useWindowDimensions, View, ViewProps } from 'react-native';
import Animated, {
  Easing,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { AVPlaybackStatus } from 'expo-av';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';

const PADDING_HORIZONTAL_SWIPE = 18;

export interface ProgressBarProps {
  progressBarWidth: number;
  paddingWidth: number;
  secondDurationShouldShow?: number;
  onSeek?: (data: number) => void;
}

interface Props extends Pick<ProgressBarProps, 'onSeek'>, ViewProps {
  setActive: (value: boolean) => void;
  playbackStatus: AVPlaybackStatus;
}

const PortraitProgressBar = ({
  onSeek,
  playbackStatus,
  setActive,
  ...props
}: Props) => {
  const { width: windowWidth } = useWindowDimensions();
  const MAX_X = windowWidth - PADDING_HORIZONTAL_SWIPE;
  const startPosition = useSharedValue(0);
  const ratioCurrentPositionVideo = useSharedValue<number>(0);
  const isPressed = useSharedValue(false);

  const onSeekVideo = (seekSecond: number) => {
    if (onSeek) {
      console.log('seek', seekSecond);
      onSeek(seekSecond);
    }
  };

  const panGesture = Gesture.Pan()
    .onBegin(() => {
      isPressed.value = true;
      runOnJS(setActive)(true);
    })
    .onUpdate(e => {
      const newX =
        e.translationX +
        startPosition.value * (MAX_X - PADDING_HORIZONTAL_SWIPE) +
        PADDING_HORIZONTAL_SWIPE;
      const ratio =
        (e.translationX +
          startPosition.value * (MAX_X - PADDING_HORIZONTAL_SWIPE)) /
        (MAX_X - PADDING_HORIZONTAL_SWIPE);
      if (newX < PADDING_HORIZONTAL_SWIPE) {
        return;
      }
      if (newX > MAX_X) {
        return;
      }
      ratioCurrentPositionVideo.value = ratio;
    })
    .onEnd(() => {
      if (playbackStatus.isLoaded && playbackStatus.durationMillis) {
        startPosition.value = ratioCurrentPositionVideo.value;

        const videoSeekSecond =
          ratioCurrentPositionVideo.value * playbackStatus.durationMillis;
        runOnJS(onSeekVideo)(videoSeekSecond);
      }
    })
    .onFinalize(() => {
      isPressed.value = false;
      runOnJS(setActive)(false);
    });

  const onProgress = (data: AVPlaybackStatus) => {
    if (
      !isPressed.value &&
      data.isLoaded &&
      data.durationMillis &&
      data.positionMillis
    ) {
      ratioCurrentPositionVideo.value = withTiming(
        data.positionMillis / data.durationMillis,
        {
          duration: 200,
          easing: Easing.linear,
        },
      );
    }
  };

  onProgress(playbackStatus);
  const progressBarStyle = useAnimatedStyle(() => {
    return {
      width: `${Number((ratioCurrentPositionVideo.value * 100).toFixed(2))}%`,
    };
  });

  const swipeAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: isPressed.value ? 2.5 : 1 }],
    };
  });

  return (
    <GestureDetector gesture={panGesture}>
      <View
        style={[
          styles.progressBarContainer,
          { width: windowWidth - 4 * PADDING_HORIZONTAL_SWIPE },
        ]}
        {...props}>
        <View style={styles.underLine} />
        <Animated.View style={[styles.progressLine, progressBarStyle]} />
        <Animated.View
          hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}
          style={[styles.circle, swipeAnimatedStyle]}
        />
      </View>
    </GestureDetector>
  );
};

const styles = StyleSheet.create({
  progressBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: PADDING_HORIZONTAL_SWIPE,
    height: 20,
  },
  progressLine: {
    height: 5,
    backgroundColor: '#D22F26',
  },
  circle: {
    width: 10,
    height: 10,
    borderRadius: 16,
    backgroundColor: '#D22F26',
  },
  underLine: {
    height: 2,
    width: '100%',
    backgroundColor: '#FFFFFF3D',
    position: 'absolute',
  },
});

export default React.memo(PortraitProgressBar);
