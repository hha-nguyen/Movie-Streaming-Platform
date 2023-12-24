import React, { forwardRef, useEffect, useRef, useState } from 'react';
import {
  TextInputProps,
  ViewStyle,
  TextInput,
  StyleSheet,
  LayoutChangeEvent,
  TextStyle,
  ColorValue,
  TouchableOpacity,
} from 'react-native';
import _ from 'lodash';
import { Box } from '../Layout/Box';
import { Text } from '../Text/Text';
import { FONTS_FAMILY } from '../Text/consts';

export type TextFieldRef = TextInput;

interface TextFieldProps extends Omit<TextInputProps, 'onChange'> {
  label?: string;
  isError?: boolean;
  isOptional?: boolean;
  error?: string;
  hint?: string;
  left?: React.ReactElement<unknown> | React.ComponentType<unknown>;
  right?: React.ReactElement<unknown> | React.ComponentType<unknown>;
  inputContainerStyle?: ViewStyle;
  innerInputWrapper?: ViewStyle;
  inputStyle?: TextStyle;
  inputErrorStyle?: TextStyle;
  disabled?: boolean;
  value?: string;
  autoExpand?: boolean;
  onChange?: (value: string) => void;
  onChangeEvent?: TextInputProps['onChange'];
  onFocus?: () => void;
  onBlur?: () => void;
  onPressIconRight?: () => void;
  onPressIconLeft?: () => void;
  redText?: boolean;
  labelColor?: ColorValue;
  containerStyle?: ViewStyle;
}

const TextField = forwardRef<TextFieldRef, TextFieldProps>(
  (
    {
      label,
      error,
      hint,
      left,
      right,
      onChange,
      style,
      inputContainerStyle,
      inputStyle,
      editable = true,
      disabled = false,
      onFocus: onFocusProp,
      onBlur: onBlurProp,
      onLayout: onLayoutProp,
      isOptional,
      redText,
      onPressIconRight,
      onPressIconLeft,
      innerInputWrapper,
      inputErrorStyle,
      containerStyle,
      value,
      ...props
    },
    ref,
  ) => {
    const [isFocused, setIsFocused] = useState<boolean>(false);
    const [placeholder, setPlaceholder] = useState<string>('');

    const handleOnChangeText = (text: string) => {
      if (typeof onChange === 'function') {
        onChange(text);
      }
      if (typeof props.onChangeText === 'function') {
        props.onChangeText(text);
      }
    };

    const onFocus = () => {
      onFocusProp?.();
      setIsFocused(true);
    };

    const onBlur = () => {
      onBlurProp?.();
      setIsFocused(false);
    };

    const onLayout = (e: LayoutChangeEvent) => {
      onLayoutProp?.(e);
    };
    const placeholderTimer = useRef<number>();

    useEffect(() => {
      if (!isFocused) {
        const placeholderProp = props.placeholder;
        if (placeholderProp) {
          placeholderTimer.current = setTimeout(
            () => setPlaceholder(placeholderProp),
            50,
          ) as unknown as number;
        }
      } else {
        setPlaceholder('');
      }

      return () => {
        if (placeholderTimer.current) {
          clearTimeout(placeholderTimer.current);
        }
      };
    }, [isFocused, label, props.placeholder]);

    return (
      <Box style={style}>
        <Box
          mb={14}
          style={[
            inputContainerStyle,
            { opacity: disabled ? 0.7 : 1 },
            containerStyle,
          ]}>
          <Box mb={4}>
            <Text color={disabled ? '#888888' : '#b9babb'}>
              {label}
              {isOptional && (
                <Text color={disabled ? '#888888' : '#333D47'}>Optional</Text>
              )}
            </Text>
          </Box>
          <Box
            flexDirection={'row'}
            alignItems={'center'}
            justifyContent={'space-between'}
            w={'100%'}
            mb={10}
            style={[
              styles.containerInput,
              innerInputWrapper,
              { borderColor: isFocused ? '#D22F26' : '#b9babb' },
              !!error && styles.errorValue,
            ]}>
            {left && (
              <TouchableOpacity onPress={onPressIconLeft}>
                {React.isValidElement(left) ? left : React.createElement(left)}
              </TouchableOpacity>
            )}
            <TextInput
              {...props}
              ref={ref}
              autoCorrect={false}
              cursorColor={'#D22F26'}
              selectionColor={'#D22F26'}
              placeholderTextColor={'#b9babb'}
              value={value}
              placeholder={placeholder}
              onLayout={onLayout}
              onChangeText={handleOnChangeText}
              onChange={props.onChangeEvent}
              onFocus={onFocus}
              onBlur={onBlur}
              style={[
                styles.inputText,
                { color: disabled ? '#888888' : '#FFFFFF' },
                inputStyle,
                !!redText && styles.inputStyleError,
                inputErrorStyle,
              ]}
              editable={!disabled && editable}
            />
            {right && (
              <TouchableOpacity onPress={onPressIconRight}>
                {React.isValidElement(right)
                  ? right
                  : React.createElement(right)}
              </TouchableOpacity>
            )}
          </Box>
          {(!_.isEmpty(hint) || !_.isEmpty(error)) && (
            <Text color={'#D22F26'} h6>
              {error || hint}
            </Text>
          )}
        </Box>
      </Box>
    );
  },
);

TextField.displayName = 'TextField';

export default TextField;

const styles = StyleSheet.create({
  inputText: {
    fontSize: 16,
    lineHeight: 24,
    color: '#D22F26',
    fontFamily: FONTS_FAMILY.bold,
    paddingHorizontal: 0, // fix padding in android input
    minHeight: 36,
    width: '85%',
    marginVertical: 8,
    textAlignVertical: 'center',
  },
  errorValue: {
    borderColor: '#D22F26',
  },
  inputStyleError: {
    fontSize: 16,
    lineHeight: 24,
    color: '#D22F26',
  },
  containerInput: {
    borderRadius: 8,
    borderColor: '#b9babb',
    borderWidth: 2,
    paddingLeft: 8,
  },
  mgBottom: {
    marginBottom: 14,
  },
});
