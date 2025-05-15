import { Alert } from 'react-native';
import * as FileSystem from 'expo-file-system';
import { supabase } from '../../supabaseConfig';
const uploadImage = async (uri) => {
    if (!uri) {
      Alert.alert("Erro", "Nenhuma imagem selecionada.");
      return;
    }
  
    try {
      // 1. Verificar usuário autenticado
      const { data: authData, error: authError } = await supabase.auth.getUser();
      const user = authData?.user;
  
      if (authError || !user) {
        Alert.alert("Erro", "Usuário não autenticado.");
        return;
      }
  
      // 2. Preparar dados da imagem
      const timestamp = new Date().getTime();
      let fileExt = uri.split(".").pop().toLowerCase();
      if (!fileExt || fileExt.length > 4) fileExt = "jpg";
  
      const validExtensions = ["jpg", "jpeg", "png", "gif", "webp"];
      if (!validExtensions.includes(fileExt)) fileExt = "jpg";
  
      const filename = `${user.id}+${timestamp}.${fileExt}`;
      const filePath = `galeria/${user.id}/${filename}`;
  
      // 3. Ler imagem como base64 e converter para buffer
      const base64 = await FileSystem.readAsStringAsync(uri, {
        encoding: FileSystem.EncodingType.Base64,
      });
  
      const fileBuffer = Uint8Array.from(atob(base64), (c) => c.charCodeAt(0));
  
      // 4. Fazer upload da imagem no Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from("imagens")
        .upload(filePath, fileBuffer, {
          contentType: `image/${fileExt}`,
          upsert: true,
        });
  
      if (uploadError) throw uploadError;
  
      // 5. Obter URL pública da imagem
      const { data: urlData } = supabase.storage
        .from("imagens")
        .getPublicUrl(filePath);
  
      const finalUrl = `${urlData.publicUrl}?t=${timestamp}`;
  
      // 6. Sucesso
      Alert.alert("Sucesso", "Imagem enviada com sucesso!");
      console.log("URL pública da imagem:", finalUrl);
      navigation.goBack();
  
    } catch (error) {
      // 7. Erro geral
      console.error("Erro ao fazer upload da imagem:", error);
      Alert.alert("Erro", error.message || "Falha ao enviar imagem.");
    }
  };