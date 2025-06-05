<template>
  <div class="bg-gray-800 p-4 rounded-xl shadow-md">
    <h2 class="text-xl font-bold mb-4 text-white">Categorias</h2>
    <ul class="space-y-3">
      <li v-for="categoria in categorias" :key="categoria">
        <router-link :to="`/categoria/${categoria}`" class="block px-4 py-2 hover:bg-gray-700 rounded capitalize text-blue-400 hover:underline">
        {{ formatarCategoria(categoria) }}
        </router-link>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import api from '../services/api';

const categorias = ref([]);

function formatarCategoria(categoria) { 
  return typeof categoria === 'string' ? categoria.charAt(0).toUpperCase() + categoria.slice(1).replaceAll('-', ' ') : '';
}

async function carregarCategorias() {
  try {
    const res = await api.get('/products/categories');
    console.log('Categorias carregadas:', res.data);    
    categorias.value = res.data; 
  } 
  catch (error) {
    console.error('Erro ao carregar categorias:', error); 
  }
}
onMounted(() => {
  carregarCategorias();
});
</script>
