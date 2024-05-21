import { useMutation } from '@tanstack/react-query';
import Toast from 'react-native-toast-message';
import { APIService } from '../../../api/queryClient';

export const AuthKey = {
  Login: 'LOGIN',
};

const login = (data: { username: string; password: string }) => {
  return APIService.post('token', data)
    .then(res => res.data)
    .catch();
};

interface LoginResponse {
  accessToken: string;
  userId: number;
  tokenType: string;
}

export const useLoginQuery = () => {
  return useMutation({
    mutationKey: [AuthKey.Login],
    mutationFn: async (data: { email: string; password: string }) => {
      try {
        const res = await APIService.post<LoginResponse>('auth/login', {
          email: data.email,
          password: data.password,
        });
        return res.data;
      } catch (err) {
        console.log(err);
        Toast.show({
          type: 'error',
          text1: 'Đăng nhập thất bại',
          text2: 'Vui lòng kiểm tra lại thông tin đăng nhập',
          autoHide: true,
          position: 'bottom',
        });
      }
    },
  });
};
