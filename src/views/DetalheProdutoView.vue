<template>
  <div class="p-6 bg-gray-900 min-h-screen text-white">
    <div v-if="produto" class="max-w-5xl mx-auto bg-gray-800 rounded-xl shadow-md p-6">
      <h1 class="text-3xl font-bold mb-4">{{ produto.title }}</h1>
      <div class="flex flex-col md:flex-row gap-6">
        <!-- Imagem do Produto -->
        <img :src="produto.thumbnail" :alt="produto.title" class="w-full md:w-1/2 rounded-lg object-cover"/>
        <div class="flex-1">
          <p class="text-gray-300 mb-4">{{ produto.description }}</p>
          <div class="space-y-2">
            <p class="text-xl font-semibold">  Preço: <span class="text-green-400">${{ produto.price }}</span> </p>
            <p class="text-xl font-semibold"> Categoria: <span class="text-blue-400 capitalize">{{ produto.category }}</span></p>
            <p class="text-xl font-semibold"> Estoque disponível: <span :class="produto.stock > 0 ? 'text-green-400' : 'text-red-500'">{{ produto.stock > 0 ? produto.stock + ' unidades' : 'Indisponível' }}</span></p>
          </div>
          <!-- Botão Adicionar ao Carrinho -->
          <button @click="adicionarAoCarrinho" class="mt-6 w-full bg-green-600 hover:bg-green-700 px-6 py-3 rounded-lg text-white font-semibold">Adicionar ao Carrinho</button>
        </div>
      </div>
      <!-- Botões de Navegação -->
      <div class="flex justify-between mt-8">
        <button @click="produtoAnterior" :disabled="produtoId <= 1" class="bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded-lg disabled:opacity-50"> Anterior </button>
        <button @click="proximoProduto" :disabled="produtoId >= totalProdutos" class="bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded-lg disabled:opacity-50">Próximo →</button>
      </div>
    </div>

    <!-- Carregando -->
    <div v-else class="text-center text-xl mt-20">
       Carregando produto...
    </div>
  </div>
</template>

<script>
import api from '../services/api';

export default {
  data() {
    return { produto: null, totalProdutos: 0, };
  },

  //converte o ID do produto da URL para número inteiro
  computed: {
    produtoId() { return parseInt(this.$route.params.id); },
  },

  methods: {
    // Carrega os dados de um produto específico usando o ID da rota
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
      if (this.produtoId < this.totalProdutos) { this.$router.push(`/produto/${this.produtoId + 1}`); }
    },

    produtoAnterior() {
      if (this.produtoId > 1) {this.$router.push(`/produto/${this.produtoId - 1}`);}
    },

    adicionarAoCarrinho() {
      const carrinho = JSON.parse(localStorage.getItem('carrinho')) || []; 
      const itemExistente = carrinho.find(item => item.id === this.produto.id); // Ve se o item já ta no carrinho

      if (itemExistente) { 
        itemExistente.quantidade += 1;  
      } 
      else {
        carrinho.push({ id: this.produto.id, title: this.produto.title, price: this.produto.price, thumbnail: this.produto.thumbnail, quantidade: 1, }); // Se não existe, adiciona um novo item com quantidade 1
      }
      localStorage.setItem('carrinho', JSON.stringify(carrinho)); // Salva o carrinho atualizado no localStorage

      this.$router.push('/carrinho'); // Redireciona para a página do carrinho após adicionar
    },
  },

  //mudanças no ID da rota
  watch: {
    '$route.params.id': {
      immediate: true, // Executa na primeira renderização
      handler() {this.carregarProduto();},
    },
  },

  created() {
    this.buscarTotalProdutos(); 
    this.carregarProduto();    
  },
};
</script>

