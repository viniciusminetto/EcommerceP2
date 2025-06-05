<template>
  <nav class="bg-gray-800 text-white px-6 py-4 flex items-center justify-between">
    <router-link to="/" class="text-2xl font-bold hover:text-blue-400">Ecommerce </router-link>
  
    <div class="relative w-1/3">
      <input v-model="termoBusca" @input="buscarProdutos" type="text" placeholder=" Buscar...." class="w-full px-4 py-2 rounded-lg bg-gray-700 focus:outline-none focus:ring focus:ring-blue-500"/> 
      <div v-if="resultados.length > 0" class="absolute bg-gray-700 w-full mt-1 rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto">
        <router-link v-for="produto in resultados" :key="produto.id" :to="`/produto/${produto.id}`" class="block px-4 py-2 hover:bg-gray-600" @click="limparBusca">
          {{ produto.title }}
        </router-link>
      </div>
    </div>
    <!-- Menu lateral direito -->
    <div class="flex items-center gap-6">
      <router-link to="/categorias" class="flex items-center gap-2 hover:text-blue-400 text-lg">Categorias</router-link>
     
      <router-link to="/carrinho" class="flex items-center gap-2 hover:text-blue-400 text-lg"> Carrinho
        <span v-if="quantidadeCarrinho > 0" class="bg-red-500 text-white rounded-full px-2 text-sm">
          {{ quantidadeCarrinho }}
        </span>
      </router-link>
    </div>
  </nav>
</template>

<script>
import api from "../services/api";

export default {
data() {
  return {termoBusca: "", resultados: [], quantidadeCarrinho: 0 };
},
//busca de produtos
methods: {
  async buscarProdutos() {
    if (this.termoBusca.length < 1) { // Se o buscar estiver vazio, limpa os resultados e retorna
      this.resultados = [];
      return;
    }
    try {
      const res = await api.get(`/products/search?q=${this.termoBusca}`); 
      this.resultados = res.data.products; // Atualiza a lista de resultados com os produtos retornados pela API
    } 
    catch (error) {
      console.error("Erro ao buscar produtos:", error); 
    }
  },

  carregarCarrinho() {
    const carrinho = localStorage.getItem("carrinho"); 
    const itens = carrinho ? JSON.parse(carrinho) : [];
    this.quantidadeCarrinho = itens.reduce((total, item) => total + item.quantidade, 0);// Soma a quantidade de cada item e atualiza 'quantidadeCarrinho'
  },
  limparBusca() {
    this.termoBusca = "";  
    this.resultados = [];   
  },
},

mounted() {
  this.carregarCarrinho(); //carrega quantidade do carrinho
  window.addEventListener("storage", this.carregarCarrinho); 
},
}; 
</script>
