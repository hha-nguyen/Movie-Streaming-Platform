import React, { useImperativeHandle, useRef, useState } from 'react';
import debounce from 'lodash/debounce';
import { PanResponder } from 'react-native';
import {
  Easing,
  runOnJS,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { AVPlaybackStatus } from 'expo-av';
import { Gesture } from 'react-native-gesture-handler';

export interface ProgressBarMethod {
  onPlaybackStatusUpdate: (data: AVPlaybackStatus) => void;
}

export interface VideoRefMethod {
  seek: (value: number) => void;
  setIsSeeking: (value: boolean) => void;
}
