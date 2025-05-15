import { useEffect, useState } from "react";
import { supabase } from "../../supabaseConfig"; 

const [imagens, setImagens] = useState([]);
const [loading, setLoading] = useState(false);

const fetchImagens = async () => {
  setLoading(true);

  // Obter usuário atual
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
    // Listar arquivos da pasta 'galeria/userId'
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

    // Obter URLs públicas
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

// Chamar ao montar o componente
useEffect(() => {
  fetchImagens();
}, []);