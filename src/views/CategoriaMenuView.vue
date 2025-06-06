// Este código mostra produtos de uma categoria 
EX: eletrônicos
Quando o usuário entra na página, ele busca os produtos da 
categoria na API e exibe em forma de grade.




<template>
  <div class="p-6 min-h-screen">
    <!-- Título -->
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-white mb-2">
        Produtos da categoria: {{ formatarCategoria(route.params.nome) }}
      </h1>
      <div v-if="!loading && produtos.length > 0" class="text-gray-400">
        {{ produtos.length }} produto{{ produtos.length > 1 ? 's' : '' }} encontrado{{ produtos.length > 1 ? 's' : '' }}
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="flex justify-center items-center py-12">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="bg-red-900/20 border border-red-500 rounded-lg p-4 mb-6">
      <p class="text-red-400">{{ error }}</p>
      <button 
        @click="carregarProdutos" 
        class="mt-2 px-4 py-2 bg-red-600 hover:bg-red-700 rounded text-white transition-colors"
      >
        Tentar novamente
      </button>
    </div>

    <!-- Produtos no Grid -->
    <div v-else-if="produtos.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      <div 
        v-for="produto in produtos" 
        :key="produto.id" 
        class="bg-gray-800 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
      >
        <!-- Imagem do produto -->
        <div class="relative">
          <img 
            :src="produto.thumbnail" 
            :alt="produto.title"
            class="w-full h-48 object-cover"
            @error="onImageError"
            loading="lazy"
          />
          <!-- Badge de desconto se houver -->
          <div 
            v-if="produto.discountPercentage > 0" 
            class="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-full text-sm font-bold"
          >
            -{{ Math.round(produto.discountPercentage) }}%
          </div>
        </div>

        <!-- Conteúdo do card -->
        <div class="p-4">
          <h2 class="text-xl font-semibold text-white mb-2 line-clamp-2">
            {{ produto.title }}
          </h2>
          
          <!-- Avaliação -->
          <div v-if="produto.rating" class="flex items-center mb-2">
            <div class="flex text-yellow-400">
              <span v-for="star in 5" :key="star" class="text-sm">
                {{ star <= Math.round(produto.rating) ? '★' : '☆' }}
              </span>
            </div>
            <span class="text-gray-400 text-sm ml-2">
              ({{ produto.rating }})
            </span>
          </div>

          <!-- Preço -->
          <div class="mb-3">
            <span class="text-green-400 text-lg font-bold">
              R$ {{ formatarPreco(produto.price) }}
            </span>
            <span v-if="produto.discountPercentage > 0" class="text-gray-500 text-sm line-through ml-2">
              R$ {{ formatarPreco(calcularPrecoOriginal(produto.price, produto.discountPercentage)) }}
            </span>
          </div>

          <!-- Descrição breve -->
          <p v-if="produto.description" class="text-gray-300 text-sm mb-3 line-clamp-2">
            {{ produto.description }}
          </p>

          <!-- Botão de ação -->
          <router-link 
            :to="`/produto/${produto.id}`" 
            class="inline-block w-full text-center px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded text-white font-medium transition-colors duration-200"
          >
            Ver detalhes
          </router-link>
        </div>
      </div>
    </div>

    <!-- Estado vazio -->
    <div v-else class="text-center py-12">
      <div class="text-gray-400 mb-4">
        <svg class="w-16 h-16 mx-auto mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path>
        </svg>
      </div>
      <p class="text-white text-lg mb-2">Nenhum produto encontrado</p>
      <p class="text-gray-400">
        Não há produtos disponíveis na categoria "{{ formatarCategoria(route.params.nome) }}"
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, computed } from "vue";
import { useRoute } from "vue-router";
import api from "../services/api";

const route = useRoute();
const produtos = ref([]);
const loading = ref(false);
const error = ref(null);

// Função para carregar produtos com melhor tratamento de erros
async function carregarProdutos() {
  try {
    loading.value = true;
    error.value = null;
    
    const categoria = String(route.params.nome);
    
    if (!categoria || categoria.trim() === '') {
      throw new Error('Categoria não especificada');
    }
    
    const res = await api.get(`/products/category/${categoria}`);
    
    if (res.data && res.data.products) {
      produtos.value = res.data.products;
    } else {
      produtos.value = [];
    }
  } catch (err) {
    console.error("Erro ao carregar produtos:", err);
    error.value = err.response?.data?.message || 'Erro ao carregar produtos. Tente novamente.';
    produtos.value = [];
  } finally {
    loading.value = false;
  }
}

// Função para formatar categoria com melhor tratamento
function formatarCategoria(nome) {
  if (!nome || typeof nome !== "string") return "Categoria";
  
  return nome
    .split('-')
    .map(palavra => palavra.charAt(0).toUpperCase() + palavra.slice(1))
    .join(' ');
}

// Função para formatar preço
function formatarPreco(preco) {
  if (typeof preco !== 'number') return '0,00';
  
  return preco.toLocaleString('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
}

// Função para calcular preço original baseado no desconto
function calcularPrecoOriginal(precoAtual, desconto) {
  if (desconto <= 0) return precoAtual;
  return precoAtual / (1 - desconto / 100);
}

// Função para tratar erro de imagem
function onImageError(event) {
  event.target.src = 'https://via.placeholder.com/300x200?text=Imagem+Indisponível';
}

// Computed para título da página
const tituloCategoria = computed(() => {
  return formatarCategoria(route.params.nome);
});

// Lifecycle hooks
onMounted(() => {
  carregarProdutos();
});

// Watcher para mudanças na rota
watch(
  () => route.params.nome,
  (novaCategoria, categoriaAnterior) => {
    if (novaCategoria !== categoriaAnterior) {
      carregarProdutos();
    }
  }
);
</script>

<style scoped>
/* Classe utilitária para limitar linhas de texto */
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Animação suave para hover */
.transform {
  transition: transform 0.2s ease-in-out;
}

/* Melhor responsividade para o grid */
@media (min-width: 1536px) {
  .grid-cols-1.md\:grid-cols-2.lg\:grid-cols-3.xl\:grid-cols-4 {
    grid-template-columns: repeat(5, minmax(0, 1fr));
  }
}
</style>