<template>
  <div class="p-6 bg-gray-800 min-h-screen text-white">
    <input v-model="query" @input="debouncedBuscarProdutos" placeholder="Buscar produtos..." class="border border-gray-600 rounded px-4 py-2 w-full max-w-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-700 placeholder-gray-400 text-white"/>
    <div v-if="query.length > 2" class="mt-6">
      <div v-if="resultados.length > 0" class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <ProductCardComponent v-for="produto in resultados" :key="produto.id" :produto="produto"/>
      </div>
      <p v-else class="text-center text-gray-400 text-xl mt-10"> Nenhum produto encontrado para "{{ query }}"</p>
    </div>
  </div>
</template>

<script>
import api from '../services/api';
import ProductCardComponent from '../components/ProductCardComponent.vue';

export default {
  components: { ProductCardComponent },
  data() {
    return { query: '', resultados: [], };
  },

  // Declaração dos métodos do componente
  methods: {
    
    async buscarProdutos() {
      if (this.query.length > 1) { // <-- Verifica se o usuário digitou mais de 2 caracteres antes de fazer a busca
        try {
          const res = await api.get(`/products/search?q=${this.query}`); // Faz a requisição GET para a api utilizando o termo de busca
          this.resultados = res.data.products; // Salva os produtos encontrados no array 'resultados'
        } 
        catch (error) {
          console.error('Erro na busca:', error);
          this.resultados = [];
        }
      } else {
        this.resultados = [];
      }
    },
  },
  created() {
    this.debouncedBuscarProdutos = debounce(this.buscarProdutos, 300);
  },
};
</script>
