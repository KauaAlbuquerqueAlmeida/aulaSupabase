import React, { useState } from "react";
import { View, Button, Alert, ActivityIndicator } from "react-native";
import * as DocumentPicker from "expo-document-picker";
import { Picker } from "@react-native-picker/picker";
import * as FileSystem from "expo-file-system";
import { supabase } from "../../supabaseConfig";

export default function UploadVideo({ navigation }) {
  const [video, setVideo] = useState(null);
  const [category, setCategory] = useState("matematica");
  const [uploading, setUploading] = useState(false);

  const pickVideo = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: "video/*",
        copyToCacheDirectory: true,
      });

      const asset =
        result.assets && result.assets.length > 0 ? result.assets[0] : result;

      if (asset && asset.uri) {
        const selectedVideo = {
          uri: asset.uri,
          name: asset.name || "video.mp4",
          type: asset.mimeType || "video/mp4",
        };
        setVideo(selectedVideo);
      } else {
        Alert.alert("Erro", "Nenhum vídeo selecionado.");
      }
    } catch (error) {
      console.error("Erro ao selecionar vídeo: ", error);
      Alert.alert("Erro", "Não foi possível selecionar o vídeo.");
    }
  };

  const uploadVideo = async () => {
    if (!video || !category) {
      Alert.alert("Erro", "Por favor, selecione um vídeo e uma categoria.");
      return;
    }

    try {
      setUploading(true);

      const timestamp = new Date().getTime();
      const filePath = `${category}/${timestamp}_${video.name}`;
      const uploadUrl = `https://pkyrdnthieixrfdbsbln.supabase.co/storage/v1/object/videos/${filePath}`;

      const { data: sessionData, error: sessionError } =
        await supabase.auth.getSession();
      if (sessionError) throw sessionError;

      const token = sessionData.session?.access_token;
      if (!token) throw new Error("Token de acesso não encontrado");

      const result = await FileSystem.uploadAsync(uploadUrl, video.uri, {
        httpMethod: "PUT",
        headers: {
          "Content-Type": video.type || "video/mp4",
          Authorization: `Bearer ${token}`,
        },
        uploadType: FileSystem.FileSystemUploadType.BINARY_CONTENT,
      });

      if (result.status !== 200) {
        console.error("Erro de status no upload:", result);
        Alert.alert("Erro", "Falha ao enviar o vídeo.");
      } else {
        Alert.alert("Sucesso", "Vídeo enviado com sucesso!");
        setVideo(null);
        navigation.goBack();
      }
    } catch (error) {
      console.error("Erro inesperado no upload:", error);
      Alert.alert("Erro", "Erro inesperado durante o upload.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Picker
        selectedValue={category}
        onValueChange={(itemValue) => setCategory(itemValue)}
        style={{ marginBottom: 20 }}
      >
        <Picker.Item label="Matemática" value="matematica" />
        <Picker.Item label="História" value="historia" />
        <Picker.Item label="Ciências" value="ciencias" />
        {/* Adicione mais categorias conforme necessário */}
      </Picker>

      <Button title="Selecionar Vídeo" onPress={pickVideo} />
      {video && <View style={{ marginVertical: 10 }}><Button title="Enviar Vídeo" onPress={uploadVideo} /></View>}
      {uploading && <ActivityIndicator size="large" color="#0000ff" />}
    </View>
  );
}
