// Esse código cria uma página que mostra as categorias de produtos. 
Quando abre, ele busca as categorias e mostra elas.







<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
    <div class="max-w-7xl mx-auto">
      <!-- Header com animação -->
      <div class="text-center mb-12">
        <h1 class="text-5xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-4 animate-fade-in">
          Categorias
        </h1>
        <div class="w-24 h-1 bg-gradient-to-r from-purple-400 to-pink-400 mx-auto rounded-full"></div>
      </div>

      <!-- Grid de categorias -->
      <div v-if="categorias.length > 0" class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        <router-link 
          v-for="(categoria, index) in categorias" 
          :key="categoria.slug" 
          :to="`/categoria/${categoria.slug}`" 
          class="group relative overflow-hidden bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-6 text-center transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/25 hover:border-purple-500/50 animate-slide-up"
          :style="{ animationDelay: `${index * 0.1}s` }"
        >
          <!-- Efeito de brilho no hover -->
          <div class="absolute inset-0 bg-gradient-to-r from-transparent via-purple-500/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
          
          <!-- Ícone decorativo -->
          <div class="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center shadow-lg group-hover:rotate-12 transition-transform duration-300">
            <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
            </svg>
          </div>
          
          <!-- Nome da categoria -->
          <h3 class="text-lg font-semibold text-white group-hover:text-purple-200 transition-colors duration-300">
            {{ formatarCategoria(categoria.name) }}
          </h3>
          
          <!-- Indicador de hover -->
          <div class="mt-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div class="w-8 h-0.5 bg-gradient-to-r from-purple-400 to-pink-400 mx-auto rounded-full"></div>
          </div>
        </router-link>
      </div>

      <!-- Estado de carregamento melhorado -->
      <div v-else class="text-center py-20">
        <div class="inline-flex items-center space-x-3">
          <!-- Spinner animado -->
          <div class="relative">
            <div class="w-8 h-8 border-4 border-purple-200 border-t-purple-500 rounded-full animate-spin"></div>
          </div>
          <p class="text-xl text-gray-300 font-medium">Carregando categorias...</p>
        </div>
        
        <!-- Skeleton loading cards -->
        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 mt-12">
          <div 
            v-for="i in 8" 
            :key="i" 
            class="bg-gray-800/50 rounded-2xl p-6 animate-pulse"
          >
            <div class="w-16 h-16 bg-gray-700 rounded-full mx-auto mb-4"></div>
            <div class="h-4 bg-gray-700 rounded mx-auto" :style="{ width: `${60 + Math.random() * 40}%` }"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import api from '../services/api';

const categorias = ref([]);

async function carregarCategorias() {
  try {
    const res = await api.get('/products/categories');
    categorias.value = res.data;
  } catch (error) {
    console.error('Erro ao carregar categorias:', error);
  }
}

function formatarCategoria(nome) {
  if (typeof nome !== 'string') return nome;
  return nome.charAt(0).toUpperCase() + nome.slice(1).replaceAll('-', ' ');
}

onMounted(() => {
  carregarCategorias();
});
</script>

<style scoped>
@keyframes fade-in {
  from { opacity: 0; transform: translateY(-20px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes slide-up {
  from { opacity: 0; transform: translateY(30px); }
  to { opacity: 1; transform: translateY(0); }
}

.animate-fade-in {
  animation: fade-in 0.8s ease-out;
}

.animate-slide-up {
  opacity: 0;
  animation: slide-up 0.6s ease-out forwards;
}
</style>