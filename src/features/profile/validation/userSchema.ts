import * as yup from 'yup';

export const userSchema = () =>
  yup.object().shape({
    displayName: yup.string().required('Display name is required'),
    photoURL: yup.string(),
  });
