<template>
  <div class="p-6">
    <!-- Título  -->
    <h1 class="text-3xl font-bold mb-6 text-white">
      Produtos da categoria: {{ formatarCategoria(route.params.nome) }}
    </h1>
    <!-- Produtos no Grid -->
    <div v-if="produtos.length > 0" class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div v-for="produto in produtos" :key="produto.id" class="bg-gray-800 rounded-lg p-4 shadow hover:shadow-lg">
        <img :src="produto.thumbnail" alt="Imagem" class="w-full h-48 object-cover rounded"/>
        <h2 class="text-xl font-semibold mt-2 text-white"> {{ produto.title }}</h2>
        <p class="text-green-400 text-lg font-bold">R$ {{ produto.price }}</p>
        <router-link :to="`/produto/${produto.id}`" class="inline-block mt-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded text-white"> Ver detalhes</router-link>
      </div>
    </div>
    <!-- Caso não tenha produtos na categoria -->
    <p v-else class="text-white">Nenhum produto encontrado nessa categoria.</p>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from "vue"; 
import { useRoute } from "vue-router"; //  acessa a rota
import api from "../services/api"; 

const route = useRoute(); 
const produtos = ref([]); 

async function carregarProdutos() {
  try {
    const categoria = String(route.params.nome); 
    const res = await api.get(`/products/category/${categoria}`);
    produtos.value = res.data.products; // Atualiza a lista de produtos reativa
  } 
  catch (error) {
    console.error("Erro ao carregar produtos:", error); 
  }
}
function formatarCategoria(nome) {
  if (typeof nome !== "string") return nome; 
  return nome.charAt(0).toUpperCase() + nome.slice(1).replaceAll("-", " "); 
}

onMounted(() => {
  carregarProdutos();
});
watch(
  () => route.params.nome,
  () => {
    carregarProdutos();
  }
);
</script>
