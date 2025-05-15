import { Alert } from 'react-native';
import * as FileSystem from 'expo-file-system';
import { supabase } from '../../supabaseConfig';


const atobPolyfill = (base64) => {
  const binary = global.Buffer.from(base64, 'base64');
  return Uint8Array.from(binary);
};

const uploadImage = async (uri, navigation) => {
  if (!uri || typeof uri !== 'string') {
    Alert.alert("Erro", "Imagem inválida ou não selecionada.");
    return;
  }

  try {
    // 1. Gerar nome de arquivo único
    const timestamp = Date.now();
    let fileExt = uri.split(".").pop()?.toLowerCase();
    const validExtensions = ["jpg", "jpeg", "png", "gif", "webp"];

    if (!fileExt || !validExtensions.includes(fileExt)) {
      fileExt = "jpg";
    }

    const filename = `imagem_${timestamp}.${fileExt}`;
    const filePath = `galeria/publicas/${filename}`; // pasta pública

    // 2. Ler a imagem como base64
    const base64 = await FileSystem.readAsStringAsync(uri, {
      encoding: FileSystem.EncodingType.Base64,
    });

    // 3. Converter base64 para buffer
    const fileBuffer = atobPolyfill(base64);

    // 4. Upload para Supabase Storage
    const { error: uploadError } = await supabase.storage
      .from("imagens")
      .upload(filePath, fileBuffer, {
        contentType: `image/${fileExt}`,
        upsert: true,
      });

    if (uploadError) {
      console.error("Erro no upload:", uploadError);
      throw uploadError;
    }

    // 5. Obter URL pública da imagem
    const { data: urlData, error: urlError } = supabase.storage
      .from("imagens")
      .getPublicUrl(filePath);

    if (urlError) {
      throw urlError;
    }

    const finalUrl = `${urlData.publicUrl}?t=${timestamp}`;
    console.log("Upload concluído. URL pública:", finalUrl);

    // 6. Sucesso
    Alert.alert("Sucesso", "Imagem enviada com sucesso!");

    if (navigation && typeof navigation.goBack === 'function') {
      navigation.goBack();
    }

  } catch (error) {
    console.error("Erro ao fazer upload da imagem:", error);
    Alert.alert("Erro", error.message || "Falha ao enviar imagem.");
  }
};

export default uploadImage;

