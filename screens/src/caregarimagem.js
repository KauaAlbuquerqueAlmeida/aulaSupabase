import React, { useState } from 'react';
import { View, Button, Image, ActivityIndicator, Alert, StyleSheet } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import uploadImage from './UploadImagens'; // importe sua função uploadImage

export default function UploadImagensScreen({ navigation }) {
  const [imageUri, setImageUri] = useState(null);
  const [loading, setLoading] = useState(false);

  // Selecionar imagem da galeria
  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 0.7,
      });

      if (!result.cancelled) {
        setImageUri(result.uri);
      }
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível abrir a galeria.');
    }
  };

  // Fazer upload da imagem selecionada
  const handleUpload = async () => {
    if (!imageUri) {
      Alert.alert('Atenção', 'Selecione uma imagem antes.');
      return;
    }

    setLoading(true);
    try {
      await uploadImage(imageUri, navigation);
    } catch (e) {
      // Erro já tratado dentro da função uploadImage
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Button title="Selecionar Imagem" onPress={pickImage} />

      {imageUri && (
        <Image
          source={{ uri: imageUri }}
          style={{ width: 300, height: 300, marginVertical: 20, borderRadius: 10 }}
          resizeMode="contain"
        />
      )}

      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <Button title="Enviar Imagem" onPress={handleUpload} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
});