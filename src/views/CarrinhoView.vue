// esta funçao cria o carrinho de compras, e faz com que ele ligue os 
produtos para o carrinho de maneira correta em que eles foram selecionados, podendo adicionar ao carrinho ou retirar,
caso o cliente nao queira mais o produto selecionado.




<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white p-4">
    <div class="max-w-6xl mx-auto">
      <!-- Header -->
      <header class="text-center mb-8">
        <h1 class="text-4xl font-bold bg-gradient-to-r from-blue-400 to-green-400 bg-clip-text text-transparent mb-2">
          🛒 Meu Carrinho
        </h1>
        <p class="text-gray-400">{{ carrinho.length }} {{ carrinho.length === 1 ? 'item' : 'itens' }} no carrinho</p>
      </header>

      <!-- Carrinho com itens -->
      <div v-if="carrinho.length > 0" class="space-y-6">
        <!-- Lista de produtos -->
        <div class="space-y-4">
          <div 
            v-for="item in carrinho" 
            :key="item.id" 
            class="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700 p-6 hover:border-gray-600 transition-all duration-300 shadow-lg"
          >
            <div class="flex flex-col lg:flex-row items-start lg:items-center gap-6">
              <!-- Imagem do produto -->
              <div class="flex-shrink-0">
                <img 
                  :src="item.thumbnail" 
                  :alt="item.title" 
                  class="w-full lg:w-32 h-32 rounded-lg object-cover border border-gray-600"
                  @error="handleImageError"
                />
              </div>

              <!-- Informações do produto -->
              <div class="flex-1 min-w-0">
                <h2 class="text-xl font-semibold mb-3 text-white truncate">{{ item.title }}</h2>
                <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
                  <div class="flex items-center gap-2">
                    <span class="text-gray-400">Preço unitário:</span>
                    <span class="text-green-400 font-bold">${{ formatarPreco(item.price) }}</span>
                  </div>
                  <div class="flex items-center gap-2">
                    <span class="text-gray-400">Quantidade:</span>
                    <span class="text-white font-bold">{{ item.quantidade }}</span>
                  </div>
                  <div class="flex items-center gap-2">
                    <span class="text-gray-400">Subtotal:</span>
                    <span class="text-green-400 font-bold">${{ formatarPreco(item.price * item.quantidade) }}</span>
                  </div>
                </div>
              </div>
              
              <!-- Controles de quantidade -->
              <div class="flex flex-row lg:flex-col gap-2 w-full lg:w-auto">
                <button 
                  @click="adicionar(item)" 
                  class="flex-1 lg:flex-none bg-green-600 hover:bg-green-700 active:bg-green-800 px-4 py-2 rounded-lg transition-all duration-200 font-medium hover:scale-105 active:scale-95"
                  title="Adicionar mais um"
                >
                  ➕ Adicionar
                </button>
                <button 
                  @click="remover(item)" 
                  class="flex-1 lg:flex-none bg-yellow-600 hover:bg-yellow-700 active:bg-yellow-800 px-4 py-2 rounded-lg transition-all duration-200 font-medium hover:scale-105 active:scale-95"
                  title="Remover um"
                >
                  ➖ Remover
                </button>
                <button 
                  @click="confirmarRemocao(item)" 
                  class="flex-1 lg:flex-none bg-red-600 hover:bg-red-700 active:bg-red-800 px-4 py-2 rounded-lg transition-all duration-200 font-medium hover:scale-105 active:scale-95"
                  title="Remover item completamente"
                >
                  🗑️ Excluir
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Resumo do pedido -->
        <div class="bg-gray-800/70 backdrop-blur-sm rounded-xl border border-gray-700 p-6 sticky bottom-4">
          <div class="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div class="text-center sm:text-left">
              <p class="text-gray-400 mb-1">Total do pedido</p>
              <p class="text-3xl font-bold text-green-400">${{ formatarPreco(calcularTotal()) }}</p>
            </div>
            
            <div class="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
              <button 
                @click="limparCarrinho" 
                class="bg-gray-600 hover:bg-gray-700 active:bg-gray-800 px-6 py-3 rounded-lg font-medium transition-all duration-200 hover:scale-105 active:scale-95"
              >
                🗑️ Limpar Carrinho
              </button>
              <button 
                @click="finalizarCompra" 
                class="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 active:from-blue-800 active:to-blue-900 px-8 py-3 rounded-lg font-medium transition-all duration-200 hover:scale-105 active:scale-95 shadow-lg"
              >
                🎉 Finalizar Compra
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Carrinho vazio -->
      <div v-else class="text-center py-20">
        <div class="text-8xl mb-6">🛒</div>
        <h2 class="text-2xl font-semibold mb-4 text-gray-300">Seu carrinho está vazio</h2>
        <p class="text-gray-500 mb-8">Que tal adicionar alguns produtos incríveis?</p>
        <button 
          @click="voltarParaLoja" 
          class="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 px-8 py-3 rounded-lg font-medium transition-all duration-200 hover:scale-105 active:scale-95"
        >
          🛍️ Continuar Comprando
        </button>
      </div>
    </div>

    <!-- Modal de confirmação -->
    <div v-if="showModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div class="bg-gray-800 rounded-xl p-6 max-w-md w-full border border-gray-700">
        <h3 class="text-xl font-semibold mb-4">Confirmar remoção</h3>
        <p class="text-gray-300 mb-6">Tem certeza que deseja remover "{{ itemParaRemover?.title }}" do carrinho?</p>
        <div class="flex gap-3 justify-end">
          <button 
            @click="cancelarRemocao" 
            class="bg-gray-600 hover:bg-gray-700 px-4 py-2 rounded-lg transition-colors"
          >
            Cancelar
          </button>
          <button 
            @click="confirmarRemocaoItem" 
            class="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg transition-colors"
          >
            Remover
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CarrinhoCompras',
  data() {
    return { 
      carrinho: [],
      showModal: false,
      itemParaRemover: null,
    };
  },
  methods: {
    carregarCarrinho() {
      try {
        const carrinhoLocal = localStorage.getItem('carrinho');
        this.carrinho = carrinhoLocal ? JSON.parse(carrinhoLocal) : [];
        
        // Garantir que todos os itens tenham quantidade
        this.carrinho = this.carrinho.map(item => ({
          ...item,
          quantidade: item.quantidade || 1
        }));
      } catch (error) {
        console.error('Erro ao carregar carrinho:', error);
        this.carrinho = [];
      }
    },

    salvarCarrinho() {
      try {
        localStorage.setItem('carrinho', JSON.stringify(this.carrinho));
      } catch (error) {
        console.error('Erro ao salvar carrinho:', error);
      }
    },

    adicionar(item) {
      const index = this.carrinho.findIndex(prod => prod.id === item.id);
      if (index !== -1) {
        this.carrinho[index].quantidade += 1;
        this.salvarCarrinho();
      }
    },

    remover(item) {
      const index = this.carrinho.findIndex(prod => prod.id === item.id);
      if (index !== -1) {
        if (this.carrinho[index].quantidade > 1) {
          this.carrinho[index].quantidade -= 1;
        } else {
          this.carrinho.splice(index, 1);
        }
        this.salvarCarrinho();
      }
    },

    confirmarRemocao(item) {
      this.itemParaRemover = item;
      this.showModal = true;
    },

    cancelarRemocao() {
      this.showModal = false;
      this.itemParaRemover = null;
    },

    confirmarRemocaoItem() {
      if (this.itemParaRemover) {
        this.removerItem(this.itemParaRemover);
        this.cancelarRemocao();
      }
    },

    removerItem(item) {
      this.carrinho = this.carrinho.filter(prod => prod.id !== item.id);
      this.salvarCarrinho();
    },

    limparCarrinho() {
      if (confirm('Tem certeza que deseja limpar todo o carrinho?')) {
        this.carrinho = [];
        localStorage.removeItem('carrinho');
      }
    },

    calcularTotal() {
      return this.carrinho.reduce((total, item) => {
        return total + (item.price * item.quantidade);
      }, 0);
    },

    formatarPreco(valor) {
      return Number(valor).toFixed(2);
    },

    finalizarCompra() {
      if (this.carrinho.length === 0) {
        alert('Seu carrinho está vazio!');
        return;
      }

      const total = this.formatarPreco(this.calcularTotal());
      const itens = this.carrinho.length;
      
      if (confirm(`Finalizar compra de ${itens} ${itens === 1 ? 'item' : 'itens'} no valor de $${total}?`)) {
        alert('🎉 Compra finalizada com sucesso! Obrigado pela preferência!');
        this.carrinho = [];
        localStorage.removeItem('carrinho');
        this.voltarParaLoja();
      }
    },

    voltarParaLoja() {
      // Se estiver usando Vue Router
      if (this.$router) {
        this.$router.push('/');
      } else {
        // Alternativa se não tiver router configurado
        window.history.back();
      }
    },

    handleImageError(event) {
      // Placeholder para imagens que falharam ao carregar
      event.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiBmaWxsPSIjMzc0MTUxIi8+Cjx0ZXh0IHg9IjUwIiB5PSI1NSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0iIzlDQTNBRiIgZm9udC1zaXplPSIxMiI+SW1hZ2VtPC90ZXh0Pgo8L3N2Zz4K';
    }
  },

  mounted() {
    this.carregarCarrinho();
  },

  // Salvar carrinho quando o componente for desmontado
  beforeUnmount() {
    this.salvarCarrinho();
  }
};
</script>

<style scoped>
/* Animações personalizadas */
@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.space-y-4 > * {
  animation: slideIn 0.3s ease-out;
}

/* Scroll suave */
html {
  scroll-behavior: smooth;
}

/* Melhor aparência do scrollbar */
::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: #1f2937;
}

::-webkit-scrollbar-thumb {
  background: #4b5563;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: #6b7280;
}
</style>