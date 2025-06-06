// O buscar serve para criar a barra de pesquisas, e fazer com que as pesquisas
sejam realizadas de maneira correta com o que foi pedido 






<template>
  <div class="p-6 bg-gray-800 min-h-screen text-white">
    <!-- Campo de busca com indicador de loading -->
    <div class="relative max-w-md">
      <input 
        v-model="query" 
        @input="handleInputChange"
        placeholder="Buscar produtos..." 
        class="border border-gray-600 rounded px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-700 placeholder-gray-400 text-white transition-all duration-200"
        :disabled="isLoading"
      />
      
      <!-- Indicador de loading -->
      <div v-if="isLoading" class="absolute right-3 top-1/2 transform -translate-y-1/2">
        <div class="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500"></div>
      </div>
    </div>

    <!-- Resultados da busca -->
    <div v-if="shouldShowResults" class="mt-6">
      <!-- Grid de produtos -->
      <div v-if="resultados.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <ProductCardComponent 
          v-for="produto in resultados" 
          :key="produto.id" 
          :produto="produto"
        />
      </div>
      
      <!-- Mensagem quando não há resultados -->
      <div v-else-if="!isLoading && query.length >= minQueryLength" class="text-center mt-10">
        <div class="text-gray-400 text-lg">
          <svg class="mx-auto h-12 w-12 text-gray-500 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <p>Nenhum produto encontrado para <strong>"{{ query }}"</strong></p>
          <p class="text-sm text-gray-500 mt-2">Tente usar termos diferentes ou verifique a ortografia</p>
        </div>
      </div>
    </div>

    <!-- Mensagem de instrução inicial -->
    <div v-if="!query" class="text-center mt-20 text-gray-400">
      <svg class="mx-auto h-16 w-16 text-gray-600 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
      <p class="text-xl">Digite pelo menos {{ minQueryLength }} caracteres para buscar produtos</p>
    </div>

    <!-- Tratamento de erro -->
    <div v-if="erro" class="mt-6 bg-red-900/50 border border-red-700 rounded-lg p-4">
      <div class="flex items-center">
        <svg class="h-5 w-5 text-red-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <p class="text-red-300">{{ erro }}</p>
      </div>
      <button 
        @click="retry" 
        class="mt-2 bg-red-700 hover:bg-red-600 px-4 py-2 rounded text-sm transition-colors duration-200"
      >
        Tentar novamente
      </button>
    </div>
  </div>
</template>

<script>
import api from '../services/api';
import ProductCardComponent from '../components/ProductCardComponent.vue';

export default {
  name: 'ProductSearch',
  
  components: { 
    ProductCardComponent 
  },
  
  data() {
    return {
      query: '',
      resultados: [],
      isLoading: false,
      erro: null,
      minQueryLength: 3,
      debounceTimeout: null,
      debounceDelay: 300
    };
  },

  computed: {
    shouldShowResults() {
      return this.query.length >= this.minQueryLength;
    }
  },

  methods: {
    /**
     * Manipula mudanças no input com debounce
     */
    handleInputChange() {
      // Limpa timeout anterior
      if (this.debounceTimeout) {
        clearTimeout(this.debounceTimeout);
      }

      // Limpa erro anterior
      this.erro = null;

      // Se query é muito pequena, limpa resultados
      if (this.query.length < this.minQueryLength) {
        this.resultados = [];
        this.isLoading = false;
        return;
      }

      // Aplica debounce
      this.debounceTimeout = setTimeout(() => {
        this.buscarProdutos();
      }, this.debounceDelay);
    },

    /**
     * Realiza a busca de produtos
     */
    async buscarProdutos() {
      if (this.query.length < this.minQueryLength) {
        this.resultados = [];
        return;
      }

      this.isLoading = true;
      this.erro = null;

      try {
        const response = await api.get(`/products/search`, {
          params: { q: this.query.trim() },
          timeout: 10000 // 10 segundos de timeout
        });

        // Verifica se a resposta tem a estrutura esperada
        if (response.data && Array.isArray(response.data.products)) {
          this.resultados = response.data.products;
        } else if (Array.isArray(response.data)) {
          this.resultados = response.data;
        } else {
          throw new Error('Formato de resposta inválido');
        }

      } catch (error) {
        console.error('Erro na busca:', error);
        this.resultados = [];
        
        // Tratamento específico de erros
        if (error.code === 'ECONNABORTED') {
          this.erro = 'A busca demorou muito para responder. Tente novamente.';
        } else if (error.response?.status === 404) {
          this.erro = 'Serviço de busca não encontrado.';
        } else if (error.response?.status >= 500) {
          this.erro = 'Erro no servidor. Tente novamente em alguns instantes.';
        } else if (!navigator.onLine) {
          this.erro = 'Sem conexão com a internet. Verifique sua conexão.';
        } else {
          this.erro = 'Erro ao buscar produtos. Tente novamente.';
        }
      } finally {
        this.isLoading = false;
      }
    },

    /**
     * Tenta buscar novamente após erro
     */
    retry() {
      this.erro = null;
      this.buscarProdutos();
    }
  },

  beforeUnmount() {
    // Limpa timeout ao destruir componente
    if (this.debounceTimeout) {
      clearTimeout(this.debounceTimeout);
    }
  }
};
</script>

<style scoped>
/* Animação personalizada para o loading spinner */
@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.animate-spin {
  animation: spin 1s linear infinite;
}

/* Melhora a transição do input quando desabilitado */
input:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

/* Responsividade adicional para telas pequenas */
@media (max-width: 640px) {
  .grid {
    grid-template-columns: 1fr;
  }
}
</style>