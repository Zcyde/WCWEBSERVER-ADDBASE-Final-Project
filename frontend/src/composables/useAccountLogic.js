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

  const deleteAccount = async () => {
    console.log('Delete account initiated');
    const isConfirmed = window.confirm(
      "Are you sure you want to permanently delete your account? This action cannot be undone."
    );

    if (!isConfirmed) {
      console.log('Delete account cancelled by user');
      return;
    }

    try {
      console.log('Sending delete account request to backend');
      await api.delete('/user');
      console.log('Account deleted successfully from backend');

      alert('Your account has been successfully deleted. Thank you for using DoMore.');

      logout();

    } catch (error) {
      console.error('Failed to delete account:', error);
      const errorMessage = error.response?.data?.message || 'Failed to delete account. Please try again.';
      alert(errorMessage);
    }
  };

  /**
 * Sends a request to the server to change the user's password.
 * @param {string} currentPassword 
 * @param {string} newPassword */

  const changePassword = async (currentPassword, newPassword) => {
  try {
    if (!currentPassword || !newPassword) {
      alert("Please enter both your current and new passwords.");
      return;
    }

    const payload = {
      currentPassword: currentPassword,
      newPassword: newPassword,
    };
    
    await api.put('/user/password', payload);

    alert('Password updated successfully! You may need to log in again with your new password.');
    logout();

  } catch (error) {
    console.error('Failed to change password:', error);
    const errorMessage = error.response?.data?.message || 'Failed to change password. Please check your current password.';
    alert(errorMessage);
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
    deleteAccount,
    changePassword,
    logout
  };
}
