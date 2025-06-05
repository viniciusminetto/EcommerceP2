<template>
  <div class="p-6">
    <h1 class="text-3xl font-bold mb-6 text-white">Categorias</h1>

    <div v-if="categorias.length > 0" class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
    <router-link v-for="categoria in categorias" :key="categoria.slug" :to="`/categoria/${categoria.slug}`" class="bg-gray-800 hover:bg-gray-700 rounded-lg p-6 flex items-center justify-center text-white text-xl font-semibold shadow-lg transition transform hover:-translate-y-1 hover:scale-105">
  {{ formatarCategoria(categoria.name) }} </router-link>
    </div>
    <p v-else class="text-white">Carregando categorias...</p>
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
    } 
    catch (error) {
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
