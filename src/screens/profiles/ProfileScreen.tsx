import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  Image,
  TouchableOpacity,
  Alert,
  StyleSheet,
} from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import { ButtonComponent, ContainerComponent } from '../../components';
import { appColors } from '../../constants/appColors';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

const ProfileScreen: React.FC = () => {
  const [profile, setProfile] = useState<{ email?: string; name?: string; photoUrl?: string } | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [image, setImage] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const navigation = useNavigation();

  useEffect(() => {
    const getStoredUserId = async () => {
      try {
        const storedData = await AsyncStorage.getItem('auth');
        if (storedData) {
          const parsedData = JSON.parse(storedData);
          setUserId(parsedData?.id || null);
        }
      } catch (error) {
        console.error('❌ Lỗi khi lấy dữ liệu từ AsyncStorage:', error);
      }
    };
    getStoredUserId();
  }, []);

  useEffect(() => {
    if (!userId) return;

    const fetchProfile = async () => {
      try {
        const authData = await AsyncStorage.getItem('auth');
        const token = authData ? JSON.parse(authData).accesstoken : null;
        if (!token) {
          Alert.alert('Lỗi', 'Không tìm thấy token, vui lòng đăng nhập lại');
          return;
        }

        const response = await axios.get(`http://10.0.2.2:3001/users/get-profile?uid=${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setProfile(response.data.data);
        setEmail(response.data.data.email);
        setName(response.data.data.name);
      } catch (error) {
        console.error('❌ Lỗi khi lấy thông tin người dùng:', error);
        Alert.alert('Lỗi', 'Không thể lấy thông tin người dùng!');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [userId]);

  const pickImage = () => {
    launchImageLibrary({ mediaType: 'photo' }, async (response) => {
      if (response.didCancel || !response.assets || response.assets.length === 0) {
        return;
      }

      const uri = response.assets[0].uri;
      setImage(uri);

      const formData = new FormData();
      formData.append('image', {
        uri,
        name: 'profile.jpg',
        type: 'image/jpeg',
      });
      formData.append('userId', userId);

      try {
        const uploadResponse = await axios.post('http://10.0.2.2:3001/users/upload-photo', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });

        setImage(uploadResponse.data.data.photoUrl);
        Alert.alert('Thành công', 'Ảnh đã được tải lên Cloudinary!');
      } catch (error) {
        console.error('❌ Lỗi khi upload ảnh:', error);
        Alert.alert('Lỗi', 'Không thể tải ảnh lên');
      }
    });
  };


  const sendOTPAndNavigate = async () => {
    try {
      const authData = await AsyncStorage.getItem('auth');
      const token = authData ? JSON.parse(authData).accesstoken : null;
      if (!token) {
        Alert.alert('Lỗi', 'Không tìm thấy token, vui lòng đăng nhập lại');
        return;
      }

      const response = await axios.post('http://10.0.2.2:3001/auth/verification', { email });

      if (response.status === 200) {
        Alert.alert('Thông báo', 'Mã OTP đã được gửi đến email của bạn!');
        navigation.navigate('OTPVerification', {
          code: response.data.data.code.toString(),
          email,
          userId: userId ?? null,
          name,
          image: image ?? profile?.photoUrl ?? null,
          token: token.toString(),
        });
      } else {
        Alert.alert('Lỗi', 'Không thể gửi mã OTP!');
      }
    } catch (error: any) {
      console.error('❌ Lỗi khi gửi OTP:', error);
      Alert.alert('Lỗi', error.response?.data?.message || 'Không thể gửi mã OTP!');
    }
  };

  return (
    <ContainerComponent back>
      <Text style={styles.title}>Chỉnh sửa hồ sơ</Text>

      <TouchableOpacity onPress={pickImage} style={styles.imageContainer}>
       <Image
         source={{ uri: image ?? profile?.photoUrl ?? 'https://via.placeholder.com/100' }}
         style={styles.image}
       />

        <Text style={styles.pickImageText}>Chọn ảnh</Text>
      </TouchableOpacity>

      <Text>Email</Text>
      <TextInput
        style={styles.input}
        value={email}
        onChangeText={setEmail}
        placeholder="Nhập email mới"
        keyboardType="email-address"
      />

      <Text>Tên người dùng</Text>
      <TextInput
        style={styles.input}
        value={name}
        onChangeText={setName}
        placeholder="Nhập tên mới"
      />

      <ButtonComponent type="primary" onPress={sendOTPAndNavigate} text="Lưu thay đổi" />
    </ContainerComponent>
  );
};

const styles = StyleSheet.create({
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 20 },
  imageContainer: { alignItems: 'center', marginBottom: 150 },
  image: { width: 100, height: 100, borderRadius: 50, backgroundColor: '#ddd' },
  pickImageText: { color: appColors.primary, marginTop: 5 },
  input: {
    borderWidth: 1,
    borderColor: appColors.gray,
    borderRadius: 10,
    paddingHorizontal: 10,
    height: 40,
    marginBottom: 10,
  },
});

export default ProfileScreen;
