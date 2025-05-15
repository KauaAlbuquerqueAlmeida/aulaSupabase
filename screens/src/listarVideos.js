import React, { useState, useEffect } from 'react';
import { View, Text, ActivityIndicator, ScrollView, StyleSheet } from 'react-native';
import { Video } from 'expo-av';
import { supabase } from '../../supabaseConfig';
import { Picker } from '@react-native-picker/picker';

const bucketName = 'videos';

export default function ListarVideos({ navigation }) {
  const [category, setCategory] = useState('');
  const [categories, setCategories] = useState([]);
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingCategories, setLoadingCategories] = useState(true);

  // Buscar categorias (pastas)
  const fetchCategories = async () => {
    setLoadingCategories(true);
    try {
      const { data, error } = await supabase.storage
        .from(bucketName)
        .list('', {
          limit: 100,
          offset: 0,
          sortBy: { column: 'name', order: 'asc' },
        });

      if (error) throw error;

      const categoriesList = data.map((file) => file.name);
      setCategories(categoriesList);

      if (categoriesList.length > 0) {
        setCategory(categoriesList[0]);
      }
    } catch (error) {
      console.error('Erro ao carregar categorias:', error);
    } finally {
      setLoadingCategories(false);
    }
  };

  // Buscar vídeos de uma categoria
  const fetchVideos = async () => {
    if (!category) return;
    setLoading(true);
    const prefix = `${category}/`;

    try {
      const { data, error } = await supabase.storage
        .from(bucketName)
        .list(prefix, {
          limit: 100,
          offset: 0,
          sortBy: { column: 'name', order: 'asc' },
        });

      if (error) throw error;

      const videoFiles = data?.filter((file) => file.name.endsWith('.mp4'));

      if (videoFiles.length > 0) {
        const videoUrls = await Promise.all(
          videoFiles.map(async (file) => {
            const fullPath = `${prefix}${file.name}`;
            const { data } = await supabase.storage
              .from(bucketName)
              .getPublicUrl(fullPath);
            return {
              key: file.name,
              name: file.name,
              url: data?.publicUrl || '',
            };
          })
        );

        setVideos(videoUrls);
      } else {
        setVideos([]);
      }
    } catch (error) {
      console.error('Erro ao carregar vídeos:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    if (category) {
      fetchVideos();
    }
  }, [category]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Escolha uma categoria:</Text>

      {loadingCategories ? (
        <ActivityIndicator size="large" color="#000" />
      ) : (
        <Picker
          selectedValue={category}
          onValueChange={(itemValue) => setCategory(itemValue)}
          style={styles.picker}
        >
          {categories.map((cat) => (
            <Picker.Item label={cat} value={cat} key={cat} />
          ))}
        </Picker>
      )}

      {loading ? (
        <ActivityIndicator size="large" color="#000" style={{ marginTop: 20 }} />
      ) : videos.length > 0 ? (
        <ScrollView style={styles.scroll}>
          {videos.map((video) => (
            <View key={video.key} style={styles.videoContainer}>
              <Text>{video.name}</Text>
              <Video
                source={{ uri: video.url }}
                rate={1.0}
                volume={1.0}
                isMuted={false}
                resizeMode="contain"
                useNativeControls
                style={{ width: '100%', height: 200 }}
              />
            </View>
          ))}
        </ScrollView>
      ) : (
        <Text style={{ marginTop: 20 }}>Nenhum vídeo encontrado.</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 18,
    marginBottom: 10,
  },
  picker: {
    height: 50,
    marginBottom: 10,
  },
  scroll: {
    marginTop: 10,
  },
  videoContainer: {
    marginBottom: 20,
  },
});
