import React, { useCallback } from 'react';
import { StyleSheet, Text as RNText, TextProps } from 'react-native';
import { FONT_SIZES, FONTS_FAMILY } from './consts';

interface CustomTextProps extends TextProps {
  h1?: boolean;
  h2?: boolean;
  h3?: boolean;
  h4?: boolean;
  h5?: boolean;
  h6?: boolean;
  size?: number;
  bold?: boolean;
  italic?: boolean;
  boldItalic?: boolean;
  white?: boolean;
  primary?: boolean;
  secondary?: boolean;
  third?: boolean;
  color?: string;
}

export const Text: React.FC<CustomTextProps> = props => {
  const {
    children,
    h1,
    h2,
    h3,
    h4,
    h5,
    h6,
    size,
    bold,
    italic,
    boldItalic,
    white,
    color,
    style,
    ...rest
  } = props;

  return (
    <RNText
      {...rest}
      style={[
        styles.base,
        bold && styles.bold,
        italic && styles.italic,
        boldItalic && styles.boldItalic,
        white && styles.white,
        color ? { color } : undefined,
        h1 && FONT_SIZES.h1,
        h2 && FONT_SIZES.h2,
        h3 && FONT_SIZES.h3,
        h4 && FONT_SIZES.h4,
        h5 && FONT_SIZES.h5,
        h6 && FONT_SIZES.h6,
        size
          ? {
              fontSize: size,
              lineHeight: size * 1.25,
            }
          : undefined,
        style,
      ]}>
      {children}
    </RNText>
  );
};

const styles = StyleSheet.create({
  base: {
    color: '#FFFFFF',
    fontFamily: FONTS_FAMILY.regular,
  },
  bold: {
    fontWeight: 'bold',
    fontFamily: FONTS_FAMILY.bold,
  },
  boldItalic: {
    fontWeight: 'bold',
    fontStyle: 'italic',
    fontFamily: FONTS_FAMILY.boldItalic,
  },
  italic: {
    fontStyle: 'italic',
    fontFamily: FONTS_FAMILY.italic,
  },
  white: {
    color: '#FFFFFF',
  },
});

export default React.memo(Text);
