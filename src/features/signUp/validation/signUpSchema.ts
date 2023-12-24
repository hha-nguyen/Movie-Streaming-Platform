import * as yup from 'yup';

export const signUpSchema = () =>
  yup.object().shape({
    email: yup.string().email('Invalid email').required('Email is required'),
    password: yup.string().required('Password is required'),
    repassword: yup.string().required('Re-enter Password is required'),
    displayName: yup.string().required('Display Name is required'),
  });
