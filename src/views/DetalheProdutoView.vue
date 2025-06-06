// Ao acessar a página, o produto é carregado pela URL e 
cexibido com imagem, nome, descrição, preço e estoque. 
Se disponível, pode ser adicionado ao carrinho.







<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white">
    <!-- Header com blur backdrop -->
    <div class="sticky top-0 z-10 backdrop-blur-md bg-gray-900/70 border-b border-gray-700/50">
      <div class="max-w-6xl mx-auto px-6 py-4">
        <div class="flex items-center justify-between">
          <h1 class="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Loja Virtual
          </h1>
          <div class="flex items-center space-x-4">
            <span class="text-sm text-gray-400">Produto {{ produtoId }} de {{ totalProdutos }}</span>
          </div>
        </div>
      </div>
    </div>

    <div class="max-w-6xl mx-auto px-6 py-12">
      <div v-if="produto" class="bg-gradient-to-br from-gray-800 to-gray-900 rounded-3xl shadow-2xl overflow-hidden border border-gray-700/30">
        <!-- Conteúdo Principal -->
        <div class="flex flex-col lg:flex-row">
          <!-- Seção da Imagem -->
          <div class="lg:w-1/2 relative group">
            <div class="aspect-square overflow-hidden bg-gradient-to-br from-gray-700 to-gray-800">
              <img 
                :src="produto.thumbnail" 
                :alt="produto.title" 
                class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <!-- Overlay sutil -->
              <div class="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>
            <!-- Badge de categoria -->
            <div class="absolute top-6 left-6">
              <span class="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-blue-500/20 text-blue-300 border border-blue-500/30 backdrop-blur-sm">
                {{ produto.category }}
              </span>
            </div>
          </div>

          <!-- Seção de Informações -->
          <div class="lg:w-1/2 p-8 lg:p-12 flex flex-col justify-between">
            <div>
              <!-- Título -->
              <h1 class="text-4xl lg:text-5xl font-bold mb-6 leading-tight bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                {{ produto.title }}
              </h1>

              <!-- Descrição -->
              <p class="text-gray-300 text-lg leading-relaxed mb-8 line-clamp-4">
                {{ produto.description }}
              </p>

              <!-- Informações do Produto -->
              <div class="space-y-4 mb-8">
                <!-- Preço -->
                <div class="flex items-center justify-between p-4 bg-gradient-to-r from-green-500/10 to-emerald-500/10 rounded-2xl border border-green-500/20">
                  <span class="text-lg font-medium text-gray-300">Preço</span>
                  <span class="text-3xl font-bold text-green-400">${{ produto.price }}</span>
                </div>

                <!-- Estoque -->
                <div class="flex items-center justify-between p-4 rounded-2xl border" 
                     :class="produto.stock > 0 ? 'bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border-blue-500/20' : 'bg-gradient-to-r from-red-500/10 to-pink-500/10 border-red-500/20'">
                  <span class="text-lg font-medium text-gray-300">Estoque</span>
                  <div class="flex items-center space-x-2">
                    <div class="w-3 h-3 rounded-full" :class="produto.stock > 0 ? 'bg-green-400' : 'bg-red-400'"></div>
                    <span class="text-lg font-semibold" :class="produto.stock > 0 ? 'text-green-400' : 'text-red-400'">
                      {{ produto.stock > 0 ? produto.stock + ' unidades' : 'Indisponível' }}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Botão Adicionar ao Carrinho -->
            <button 
              @click="adicionarAoCarrinho" 
              :disabled="produto.stock <= 0"
              class="w-full py-4 px-8 rounded-2xl font-bold text-lg transition-all duration-300 transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              :class="produto.stock > 0 ? 'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-400 hover:to-emerald-500 shadow-lg hover:shadow-green-500/25' : 'bg-gray-600'"
            >
              <span v-if="produto.stock > 0" class="flex items-center justify-center space-x-2">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.8 9M7 13l-1.8-9m0 0h-.4M16 8v8a2 2 0 11-4 0V8m4 0V6a2 2 0 10-4 0v2m4 0H12"></path>
                </svg>
                <span>Adicionar ao Carrinho</span>
              </span>
              <span v-else class="flex items-center justify-center space-x-2">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
                <span>Produto Indisponível</span>
              </span>
            </button>
          </div>
        </div>

        <!-- Navegação -->
        <div class="border-t border-gray-700/50 bg-gradient-to-r from-gray-800/50 to-gray-900/50 p-6">
          <div class="flex justify-between items-center">
            <button 
              @click="produtoAnterior" 
              :disabled="produtoId <= 1" 
              class="flex items-center space-x-2 px-6 py-3 rounded-xl font-semibold transition-all duration-300 hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              :class="produtoId <= 1 ? 'bg-gray-700 text-gray-500' : 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-400 hover:to-blue-500 text-white shadow-lg hover:shadow-blue-500/25'"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
              </svg>
              <span>Anterior</span>
            </button>

            <!-- Indicador de progresso -->
            <div class="flex items-center space-x-2">
              <div class="flex space-x-1">
                <div 
                  v-for="i in Math.min(totalProdutos, 5)" 
                  :key="i" 
                  class="w-2 h-2 rounded-full transition-all duration-300"
                  :class="i === produtoId ? 'bg-blue-400 w-8' : 'bg-gray-600'"
                ></div>
              </div>
            </div>

            <button 
              @click="proximoProduto" 
              :disabled="produtoId >= totalProdutos" 
              class="flex items-center space-x-2 px-6 py-3 rounded-xl font-semibold transition-all duration-300 hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              :class="produtoId >= totalProdutos ? 'bg-gray-700 text-gray-500' : 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-400 hover:to-blue-500 text-white shadow-lg hover:shadow-blue-500/25'"
            >
              <span>Próximo</span>
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
              </svg>
            </button>
          </div>
        </div>
      </div>

      <!-- Estado de Carregamento -->
      <div v-else class="flex flex-col items-center justify-center py-20">
        <div class="animate-spin rounded-full h-16 w-16 border-4 border-blue-500 border-t-transparent mb-4"></div>
        <p class="text-xl text-gray-400">Carregando produto...</p>
      </div>
    </div>

    <!-- Toast de confirmação (simulado) -->
    <transition name="toast">
      <div v-if="showToast" class="fixed bottom-6 right-6 bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-4 rounded-2xl shadow-2xl z-50">
        <div class="flex items-center space-x-2">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
          </svg>
          <span class="font-semibold">Produto adicionado ao carrinho!</span>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import api from '../services/api';

export default {
  data() {
    return { 
      produto: null, 
      totalProdutos: 0,
      showToast: false
    };
  },

  computed: {
    produtoId() { 
      return parseInt(this.$route.params.id); 
    },
  },

  methods: {
    async carregarProduto() {
      try {
        const res = await api.get(`/products/${this.produtoId}`);
        this.produto = res.data;
      } 
      catch (error) {
        console.error('Erro ao carregar produto:', error); 
      }
    },

    async buscarTotalProdutos() {
      try {
        const res = await api.get('/products'); 
        this.totalProdutos = res.data.total; 
      } 
      catch (error) {
        console.error('Erro ao buscar total de produtos:', error);
      }
    },

    proximoProduto() {
      if (this.produtoId < this.totalProdutos) { 
        this.$router.push(`/produto/${this.produtoId + 1}`); 
      }
    },

    produtoAnterior() {
      if (this.produtoId > 1) {
        this.$router.push(`/produto/${this.produtoId - 1}`);
      }
    },

    adicionarAoCarrinho() {
      if (this.produto.stock <= 0) return;

      const carrinho = JSON.parse(localStorage.getItem('carrinho')) || []; 
      const itemExistente = carrinho.find(item => item.id === this.produto.id);

      if (itemExistente) { 
        itemExistente.quantidade += 1;  
      } 
      else {
        carrinho.push({ 
          id: this.produto.id, 
          title: this.produto.title, 
          price: this.produto.price, 
          thumbnail: this.produto.thumbnail, 
          quantidade: 1 
        });
      }
      
      localStorage.setItem('carrinho', JSON.stringify(carrinho));

      // Mostrar toast de confirmação
      this.showToast = true;
      setTimeout(() => {
        this.showToast = false;
        this.$router.push('/carrinho');
      }, 1500);
    },
  },

  watch: {
    '$route.params.id': {
      immediate: true,
      handler() {
        this.carregarProduto();
      },
    },
  },

  created() {
    this.buscarTotalProdutos(); 
    this.carregarProduto();    
  },
};
</script>

<style scoped>
.line-clamp-4 {
  display: -webkit-box;
  -webkit-line-clamp: 4;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.toast-enter-active, .toast-leave-active {
  transition: all 0.3s ease;
}

.toast-enter-from {
  opacity: 0;
  transform: translateX(100%) scale(0.8);
}

.toast-leave-to {
  opacity: 0;
  transform: translateX(100%) scale(0.8);
}
</style>