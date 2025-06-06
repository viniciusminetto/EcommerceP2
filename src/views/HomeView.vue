// Mostra uma lista de produtos em páginas. 
Ele pega os produtos de uma API, mostra quantos produtos e
 páginas existem,
 e exibe os produtos em cards




<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
    <!-- Header Section -->
    <div class="relative overflow-hidden bg-gradient-to-r from-blue-600 to-purple-700 shadow-2xl">
      <div class="absolute inset-0 bg-black opacity-20"></div>
      <div class="relative px-6 py-12">
        <div class="max-w-7xl mx-auto">
          <h1 class="text-5xl font-bold text-white mb-4 animate-fade-in">
            Produtos
            <span class="block text-lg font-normal text-blue-100 mt-2">
              Descubra nossa seleção exclusiva
            </span>
          </h1>
          
          <!-- Stats Cards -->
          <div class="flex flex-wrap gap-4 mt-8">
            <div class="bg-white/10 backdrop-blur-sm rounded-lg px-6 py-3 border border-white/20">
              <div class="text-2xl font-bold text-white">{{ totalProdutos }}</div>
              <div class="text-blue-100 text-sm">Total de Produtos</div>
            </div>
            <div class="bg-white/10 backdrop-blur-sm rounded-lg px-6 py-3 border border-white/20">
              <div class="text-2xl font-bold text-white">{{ totalPaginas }}</div>
              <div class="text-blue-100 text-sm">Páginas</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="max-w-7xl mx-auto px-6 py-12">
      <!-- Loading State -->
      <div v-if="carregando" class="flex justify-center items-center h-64">
        <div class="relative">
          <div class="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
          <div class="mt-4 text-white text-center">Carregando produtos...</div>
        </div>
      </div>

      <!-- Products Grid -->
      <div v-else-if="produtos.length > 0" 
           class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        <div v-for="produto in produtos" 
             :key="produto.id" 
             class="transform transition-all duration-300 hover:scale-105 animate-fade-in-up">
          <ProductCardComponent :produto="produto" />
        </div>
      </div>

      <!-- Empty State -->
      <div v-else class="text-center py-20">
        <div class="w-24 h-24 mx-auto mb-6 bg-gray-700 rounded-full flex items-center justify-center">
          <svg class="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                  d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2 2v-5m16 0h-3m-13 0h3m-3 0v-3m3 3v-3"></path>
          </svg>
        </div>
        <h3 class="text-2xl font-semibold text-white mb-2">Nenhum produto encontrado</h3>
        <p class="text-gray-400">Não há produtos disponíveis no momento.</p>
      </div>
    </div>

    <!-- Enhanced Pagination -->
    <div class="sticky bottom-0 bg-gray-800/95 backdrop-blur-sm border-t border-gray-700 p-6">
      <div class="max-w-7xl mx-auto">
        <div class="flex flex-col sm:flex-row justify-between items-center gap-4">
          <!-- Page Info -->
          <div class="text-gray-300 text-sm">
            Mostrando {{ (paginaAtual - 1) * limitePorPagina + 1 }} - 
            {{ Math.min(paginaAtual * limitePorPagina, totalProdutos) }} 
            de {{ totalProdutos }} produtos
          </div>

          <!-- Pagination Controls -->
          <div class="flex items-center gap-2">
            <button 
              @click="paginaAnterior" 
              :disabled="paginaAtual === 1"
              class="group flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 
                     disabled:bg-gray-800 disabled:text-gray-500 disabled:cursor-not-allowed
                     text-white rounded-lg transition-all duration-200 transform hover:scale-105">
              <svg class="w-4 h-4 transition-transform group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
              </svg>
              Anterior
            </button>

            <!-- Page Numbers -->
            <div class="hidden sm:flex items-center gap-1 mx-4">
              <template v-for="pagina in paginasVisiveis" :key="pagina">
                <button 
                  v-if="pagina !== '...'"
                  @click="irParaPagina(pagina)"
                  :class="[
                    'w-10 h-10 rounded-lg transition-all duration-200',
                    pagina === paginaAtual 
                      ? 'bg-blue-600 text-white shadow-lg scale-110' 
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600 hover:scale-105'
                  ]">
                  {{ pagina }}
                </button>
                <span v-else class="text-gray-400 px-2">...</span>
              </template>
            </div>

            <!-- Current page indicator for mobile -->
            <div class="sm:hidden bg-gray-700 px-4 py-2 rounded-lg">
              <span class="text-white font-medium">{{ paginaAtual }}</span>
              <span class="text-gray-400 mx-1">/</span>
              <span class="text-gray-300">{{ totalPaginas }}</span>
            </div>

            <button 
              @click="proximaPagina" 
              :disabled="paginaAtual === totalPaginas"
              class="group flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600
                     disabled:bg-gray-800 disabled:text-gray-500 disabled:cursor-not-allowed
                     text-white rounded-lg transition-all duration-200 transform hover:scale-105">
              Próximo
              <svg class="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import api from "../services/api";
import ProductCardComponent from "../components/ProductCardComponent.vue";

export default {
  components: {
    ProductCardComponent,
  },
  
  data() {
    return {
      produtos: [],
      limitePorPagina: 12,
      paginaAtual: 1,
      totalPaginas: 1,
      totalProdutos: 0,
      carregando: false,
    };
  },

  computed: {
    // Gera array de páginas visíveis para paginação
    paginasVisiveis() {
      const paginas = [];
      const maxPaginas = 7; // Máximo de páginas mostradas
      const metade = Math.floor(maxPaginas / 2);
      
      let inicio = Math.max(1, this.paginaAtual - metade);
      let fim = Math.min(this.totalPaginas, inicio + maxPaginas - 1);
      
      // Ajusta o início se necessário
      if (fim - inicio < maxPaginas - 1) {
        inicio = Math.max(1, fim - maxPaginas + 1);
      }
      
      // Adiciona primeira página e ... se necessário
      if (inicio > 1) {
        paginas.push(1);
        if (inicio > 2) paginas.push('...');
      }
      
      // Adiciona páginas do meio
      for (let i = inicio; i <= fim; i++) {
        paginas.push(i);
      }
      
      // Adiciona ... e última página se necessário
      if (fim < this.totalPaginas) {
        if (fim < this.totalPaginas - 1) paginas.push('...');
        paginas.push(this.totalPaginas);
      }
      
      return paginas;
    }
  },

  methods: {
    async carregarProdutos() {
      this.carregando = true;
      const skip = (this.paginaAtual - 1) * this.limitePorPagina;
      
      try {
        const res = await api.get(`/products?limit=${this.limitePorPagina}&skip=${skip}`);
        this.produtos = res.data.products;
        this.totalProdutos = res.data.total;
        this.totalPaginas = Math.ceil(this.totalProdutos / this.limitePorPagina);
      } catch (error) {
        console.error("Erro ao carregar produtos:", error);
        // Você pode adicionar aqui uma notificação de erro para o usuário
      } finally {
        this.carregando = false;
      }
    },

    proximaPagina() {
      if (this.paginaAtual < this.totalPaginas) {
        this.paginaAtual++;
        this.carregarProdutos();
        this.scrollToTop();
      }
    },

    paginaAnterior() {
      if (this.paginaAtual > 1) {
        this.paginaAtual--;
        this.carregarProdutos();
        this.scrollToTop();
      }
    },

    irParaPagina(pagina) {
      if (pagina !== this.paginaAtual && pagina >= 1 && pagina <= this.totalPaginas) {
        this.paginaAtual = pagina;
        this.carregarProdutos();
        this.scrollToTop();
      }
    },

    scrollToTop() {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  },

  created() {
    this.carregarProdutos();
  },
};
</script>

<style scoped>
@keyframes fade-in {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes fade-in-up {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in {
  animation: fade-in 0.6s ease-out;
}

.animate-fade-in-up {
  animation: fade-in-up 0.6s ease-out forwards;
}

/* Adiciona delay sequencial para cards */
.animate-fade-in-up:nth-child(1) { animation-delay: 0.1s; }
.animate-fade-in-up:nth-child(2) { animation-delay: 0.2s; }
.animate-fade-in-up:nth-child(3) { animation-delay: 0.3s; }
.animate-fade-in-up:nth-child(4) { animation-delay: 0.4s; }
</style>