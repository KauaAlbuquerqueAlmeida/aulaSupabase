import React, { useState } from 'react';
import { Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import * as Notifications from 'expo-notifications';
import { supabase } from '../../supabaseConfig';

// Função para solicitar permissão de notificação (caso ainda não exista)
const requestLocalNotificationPermission = async () => {
  const { status } = await Notifications.getPermissionsAsync();
  if (status !== 'granted') {
    const { status: newStatus } = await Notifications.requestPermissionsAsync();
    return newStatus === 'granted';
  }
  return true;
};

// Função para registrar o usuário
const registerUser = async (email, password, nome, imageUri) => {
  try {
    // Criação do usuário com email e senha
    const { data: signupData, error: signupError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (signupError) throw signupError;

    const userId = signupData.user.id;

    // Convertendo imagem para base64
    const fileName = imageUri.substring(imageUri.lastIndexOf('/') + 1);
    const fileType = 'image/jpg';

    const base64 = await FileSystem.readAsStringAsync(imageUri, {
      encoding: FileSystem.EncodingType.Base64,
    });

    // Upload da imagem no bucket
    const { error: uploadError } = await supabase.storage
      .from('profile-photos')
      .upload(`${userId}/${fileName}`, 
        {
          uri: imageUri,
          type: fileType,
          name: fileName,
        }, 
        {
          contentType: fileType,
          upsert: true,
        }
      );

    if (uploadError) throw uploadError;

    // Pegando a URL pública da imagem
    const { data: publicUrlData, error: publicUrlError } = supabase
      .storage
      .from('profile-photos')
      .getPublicUrl(`${userId}/${fileName}`);

    if (publicUrlError) throw publicUrlError;

    const photoURL = publicUrlData.publicUrl;

    // Inserindo dados do usuário na tabela "users"
    const { error: dbError } = await supabase
      .from('users')
      .insert([{ id: userId, email, nome, photo_url: photoURL }]);

    if (dbError) throw dbError;

    console.log('Usuário cadastrado com sucesso!');
    return signupData.user;

  } catch (error) {
    console.error('Erro ao registrar usuário:', error);
    Alert.alert('Erro', error.message || 'Erro inesperado.');
  }
};

// Componente de cadastro
const CadastroUsuario = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [nome, setNome] = useState('');
  const [imageUri, setImageUri] = useState(null);

  // Escolher imagem de perfil
  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });

    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
    }
  };

  // Lidar com o cadastro
  const handleRegister = async () => {
    if (email && password && nome && imageUri) {
      const user = await registerUser(email, password, nome, imageUri);
      if (user) {
        Alert.alert('Sucesso', 'Usuário registrado com sucesso!');
        navigation.goBack();

        // Notificação local
        const permission = await requestLocalNotificationPermission();
        if (permission) {
          await Notifications.scheduleNotificationAsync({
            content: {
              title: 'Novo usuário cadastrado!',
              body: `${nome} foi incluído no banco.`,
              sound: true,
            },
            trigger: null,
          });
        }
      }
    } else {
      Alert.alert('Erro', 'Por favor, preencha todos os campos.');
    }
  };

  return null; // Substitua por JSX do seu formulário se necessário
};

export default CadastroUsuario;
