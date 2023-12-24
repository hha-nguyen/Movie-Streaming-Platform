import { TextInputProps, ViewStyle } from 'react-native';

export type MaskParams = {
	pattern?: string | string[];
	type?: 'custom' | 'currency';
	options?: any;
};

export interface TextFieldProps
	extends Omit<TextInputProps, 'onChange' | 'value'> {
	label?: string;
	isError?: boolean;
	error?: string;
	hint?: string;
	left?: React.ReactElement<unknown> | React.ComponentType<unknown>;
	right?: React.ReactElement<unknown> | React.ComponentType<unknown>;
	inputContainerStyle?: ViewStyle;
	inputStyle?: ViewStyle;
	disabled?: boolean;
	value?: string | number;
	mask?: MaskParams;
	onChange?: (value: string, unMaskedValue?: string) => void;
	autoExpand?: boolean;
	onChangeEvent?: TextInputProps['onChange'];
	onFocus?: () => void;
	onBlur?: () => void;
}
