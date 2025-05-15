import React, { useEffect, useState } from "react";
import { View, Text, Image, ActivityIndicator, ScrollView, StyleSheet } from "react-native";
import { supabase } from "../../supabaseConfig";

export default function GaleriaUsuario() {
  const [imagens, setImagens] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchImagens = async () => {
    setLoading(true);

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      console.error("Erro ao obter usuário:", userError?.message);
      setLoading(false);
      return;
    }

    const userId = user.id;

    try {
      const { data, error } = await supabase.storage
        .from("imagens")
        .list(`galeria/${userId}`, {
          limit: 100,
        });

      if (error) {
        console.error("Erro ao listar imagens:", error.message);
        setLoading(false);
        return;
      }

      const urls = await Promise.all(
        data
          .filter((item) => item.name)
          .map(async (item) => {
            const { data: urlData, error: urlError } = await supabase.storage
              .from("imagens")
              .getPublicUrl(`galeria/${userId}/${item.name}`);

            if (urlError) {
              console.error("Erro ao obter URL:", urlError.message);
              return null;
            }

            return {
              name: item.name,
              url: urlData.publicUrl,
            };
          })
      );

      setImagens(urls.filter((img) => img !== null));
    } catch (err) {
      console.error("Erro inesperado:", err);
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchImagens();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Minhas Imagens</Text>

      {loading ? (
        <ActivityIndicator size="large" color="#000" />
      ) : imagens.length === 0 ? (
        <Text>Nenhuma imagem encontrada.</Text>
      ) : (
        <ScrollView>
          {imagens.map((img) => (
            <View key={img.name} style={styles.imageContainer}>
              <Image source={{ uri: img.url }} style={styles.image} />
              <Text style={styles.imageName}>{img.name}</Text>
            </View>
          ))}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 20,
    marginBottom: 16,
    fontWeight: "bold",
  },
  imageContainer: {
    marginBottom: 20,
    alignItems: "center",
  },
  image: {
    width: 300,
    height: 200,
    borderRadius: 8,
  },
  imageName: {
    marginTop: 8,
    fontSize: 14,
    color: "#333",
  },
});
