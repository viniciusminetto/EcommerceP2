<template>
  <div class="p-6 bg-gray-900 min-h-screen text-white">
    <h1 class="text-3xl font-bold mb-6">Produtos</h1>

    <div v-if="produtos.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <ProductCardComponent v-for="produto in produtos" :key="produto.id" :produto="produto"/>
    </div>
    <div v-else class="text-center text-xl mt-20">Nenhum produto encontrado.</div>

    <!-- Paginação -->
    <div class="flex justify-center items-center gap-4 mt-10">
      <button @click="paginaAnterior" :disabled="paginaAtual === 1"  class="px-4 py-2  bg-gray-700 hover:bg-gray-600 "> Anterior</button>
      <span class="text-lg">Página {{ paginaAtual }}</span>
      <button @click="proximaPagina" :disabled="paginaAtual === totalPaginas" class="px-4 py-2 bg-gray-700 hover:bg-gray-600">Próximo </button>
    </div>
  </div>
</template>

<script>
import api from "../services/api";
import ProductCardComponent from "../components/ProductCardComponent.vue";

export default { components: { ProductCardComponent,},
  data() {
    return {
      produtos: [],
      limitePorPagina: 12,
      paginaAtual: 1,
      totalPaginas: 1,
      totalProdutos: 0,
    };
  },
  methods: {
    async carregarProdutos() {
      const skip = (this.paginaAtual - 1) * this.limitePorPagina;
      try {
        const res = await api.get(`/products?limit=${this.limitePorPagina}&skip=${skip}` );
        this.produtos = res.data.products;
        this.totalProdutos = res.data.total;
        this.totalPaginas = Math.ceil(this.totalProdutos / this.limitePorPagina);
      } 
      catch (error) {
        console.error("Erro ao carregar produtos:", error);
      }
    },

    proximaPagina() {
      if (this.paginaAtual < this.totalPaginas) {this.paginaAtual++; this.carregarProdutos(); }
    },

    paginaAnterior() {
      if (this.paginaAtual > 1) { this.paginaAtual--; this.carregarProdutos();  }
    },
  },

  created() {
    this.carregarProdutos();
  },
};
</script>
