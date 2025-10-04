import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import api from '../services/api.js';

export function useAccountLogic() {
  const user = ref({
    firstName: '',
    lastName: '',
    email: '',
    username: '',
    contact: '',
    gender: '',
    address: '',
    birthDate: '',
    avatar: 'https://placehold.co/200x200?text=User'
  });
  const router = useRouter();

  const isAuthenticated = ref(false);

  const loadUser = async () => {
    try {
      const response = await api.get('/user');
      user.value = {
        ...response.data,
        avatar: response.data.avatar.startsWith('http') ? response.data.avatar : `http://localhost:3000${response.data.avatar}`
      };
      isAuthenticated.value = true;
    } catch (error) {
      console.error('Failed to load user:', error);
      user.value.avatar = 'https://placehold.co/200x200?text=User';
      isAuthenticated.value = false;
    }
  };

  const updateUser = async () => {
    try {
      const response = await api.put('/user', user.value);
      user.value = {
        ...response.data,
        avatar: response.data.avatar.startsWith('http') ? response.data.avatar : `http://localhost:3000${response.data.avatar}`
      };
      alert('Profile updated successfully!');
    } catch (error) {
      console.error('Failed to update user:', error);
      alert('Failed to update profile.');
    }
  };

  const uploadAvatar = async (file) => {
    const formData = new FormData();
    formData.append('avatar', file);
    try {
      const response = await api.post('/user/avatar', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      user.value.avatar = response.data.avatar.startsWith('http') ? response.data.avatar : `http://localhost:3000${response.data.avatar}`;
      alert('Avatar updated successfully!');
    } catch (error) {
      console.error('Failed to upload avatar:', error);
      alert('Failed to upload avatar.');
    }
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    isAuthenticated.value = false;
    router.push('/login');
  };

  onMounted(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      loadUser();
    }
  });

  return {
    user,
    isAuthenticated,
    loadUser,
    updateUser,
    uploadAvatar,
    logout
  };
}
