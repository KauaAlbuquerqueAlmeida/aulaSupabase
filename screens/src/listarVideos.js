import { Video } from "expo-av";
import { supabase } from "../supabaseConfig";
import { Picker } from "@react-native-picker/picker";

const bucketName = "videos";

export default function ListarVideos({ navigation }) {
  const [category, setCategory] = useState("");
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
        .list("", {
          limit: 100,
          offset: 0,
          sortBy: { column: "name", order: "asc" },
        });

      if (error) {
        console.error("Erro ao carregar categorias: ", error);
        throw error;
      }

      // Log para verificar os dados retornados
      console.log("Dados das categorias:", data);

      // Extrair as categorias diretamente do campo 'name'
      const categoriesList = data.map((file) => file.name); // Aqui pegamos diretamente o 'name' do arquivo
      setCategories(categoriesList);
      console.log("Categorias extraídas:", categoriesList);

      if (categoriesList.length > 0) {
        setCategory(categoriesList[0]);
      }
    } catch (error) {
      console.error("Erro ao carregar categorias: ", error);
    } finally {
      setLoadingCategories(false);
    }
  };
}

// Buscar vídeos de uma categoria
const fetchVideos = async () => {
  if (!category) return; // Se não houver categoria, não faz a requisição

  setLoading(true);
  const prefix = `${category}/`;

  try {
    const { data, error } = await supabase.storage
      .from(bucketName)
      .list(prefix, {
        limit: 100,
        offset: 0,
        sortBy: { column: "name", order: "asc" },
      });

    if (error) {
      console.error("Erro ao buscar vídeos: ", error);
      throw error;
    }

    // Log para verificar os dados retornados
    console.log("Dados dos vídeos:", data);

    const videoFiles = data?.filter((file) =>
      file.name.endsWith(".mp4")
    ); // Filtra arquivos de vídeo

    // Verifica se os vídeos estão sendo encontrados corretamente
    if (videoFiles.length > 0) {
      const videoUrls = await Promise.all(
        videoFiles.map(async (file) => {
          const fullPath = `${prefix}${file.name}`;
          const { data } = await supabase.storage
            .from(bucketName)
            .getPublicUrl(fullPath);
          const publicUrl = data?.publicUrl || "";
          console.log("URL pública gerada:", publicUrl);
          return {
            key: file.name,
            name: file.name,
            url: publicUrl,
          };
        })
      );

      setVideos(videoUrls);
    } else {
      setVideos([]); // Caso não haja vídeos
    }
  } catch (error) {
    console.error("Erro ao carregar vídeos: ", error);
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

