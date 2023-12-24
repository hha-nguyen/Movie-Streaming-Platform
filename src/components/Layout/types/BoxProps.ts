import {
  MatrixTransform,
  PerpectiveTransform,
  RotateTransform,
  RotateXTransform,
  RotateYTransform,
  RotateZTransform,
  ScaleTransform,
  ScaleXTransform,
  ScaleYTransform,
  SkewXTransform,
  SkewYTransform,
  TranslateXTransform,
  TranslateYTransform,
} from 'react-native';
import { BackgroundProps } from './BackgroundProps';
import { BorderProps } from './BorderProps';
import { FlexboxProps } from './FlexProps';
import { LayoutProps } from './LayoutProps';
import { PositionProps } from './PosisionProps';
import { SpaceProps } from './SpaceProps';

interface TransformProps {
  transform?: (
    | PerpectiveTransform
    | RotateTransform
    | RotateXTransform
    | RotateYTransform
    | RotateZTransform
    | ScaleTransform
    | ScaleXTransform
    | ScaleYTransform
    | TranslateXTransform
    | TranslateYTransform
    | SkewXTransform
    | SkewYTransform
    | MatrixTransform
  )[];
}

export interface BoxProps
  extends LayoutProps,
    FlexboxProps,
    SpaceProps,
    TransformProps,
    BackgroundProps,
    PositionProps,
    BorderProps {}
