<template>
  <div class="p-6 bg-gray-900 min-h-screen text-white">
    <div class="max-w-5xl mx-auto bg-gray-800 rounded-xl shadow-md p-6">
      <h1 class="text-3xl font-bold mb-6"> Meu Carrinho</h1>

      <div v-if="carrinho.length > 0" class="space-y-6">
        <div v-for="item in carrinho" :key="item.id" class="flex flex-col md:flex-row items-center gap-6 bg-gray-700 rounded-lg p-4">
          <!-- Imagem -->
          <img :src="item.thumbnail" :alt="item.title" class="w-full md:w-40 rounded-lg object-cover" />

          <!-- Informações do produto, descrição, valor, quantidade -->
          <div class="flex-1">
            <h2 class="text-xl font-semibold mb-2">{{ item.title }}</h2>
            <p class="font-bold"> <span class="text-green-400">${{ item.price }}</span> cada </p>
            <p class="font-bold"> Quantidade: <span class="font-bold">{{ item.quantidade }}</span></p>
            <p class="font-bold"> Subtotal: <span class="text-green-400 font-semibold">${{ item.price * item.quantidade }}</span></p>
          </div>
          
          <!-- adicionar, remover, e remoção total -->
          <div class="flex flex-col gap-2">
            <button @click="adicionar(item)" class="bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg">➕</button>
            <button @click="remover(item)" class="bg-yellow-600 hover:bg-yellow-700 px-4 py-2 rounded-lg">➖</button>
            <button @click="removerItem(item)" class="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg">🗑️</button>
          </div>
        </div>

        <!-- Total -->
        <div class="text-right mt-8">
          <p class="text-2xl font-bold"> Total: <span class="text-green-400">${{ calcularTotal() }}</span></p>
          <button @click="finalizarCompra" class="mt-4 bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg"> Finalizar Compra</button>
        </div>
      </div>
      <!-- Carrinho vazio -->
      <div v-else class="text-center text-xl mt-20">Seu carrinho está vazio.</div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return { carrinho: [], };
  },
  methods: {
    carregarCarrinho() {
      const carrinhoLocal = localStorage.getItem('carrinho'); // Busca o carrinho no localStorage
      this.carrinho = carrinhoLocal ? JSON.parse(carrinhoLocal) : []; // Se existir, transforma em objeto, senão define como array vazio
    },
    salvarCarrinho() {
      localStorage.setItem('carrinho', JSON.stringify(this.carrinho)); // Converte o carrinho em string JSON e salva
    },
    adicionar(item) {
      const index = this.carrinho.findIndex(prod => prod.id === item.id); // Verifica se o item já está no carrinho
      if (index !== -1) {
        this.carrinho[index].quantidade += 1; 
        this.salvarCarrinho();
      }
    },
    remover(item) {
      const index = this.carrinho.findIndex(prod => prod.id === item.id); // Localiza o item no carrinho
      if (index !== -1) {
        if (this.carrinho[index].quantidade > 1) {
          this.carrinho[index].quantidade -= 1;
        } 
        else {
           this.carrinho.splice(index, 1); // Se quantidade é 1, remove o item do carrinho
        }
        this.salvarCarrinho();
      }
    },
    removerItem(item) {
      this.carrinho = this.carrinho.filter(prod => prod.id !== item.id); // Filtra e mantém apenas itens com ID diferente
      this.salvarCarrinho(); 
    },

    calcularTotal() {
      return this.carrinho
        .reduce((total, item) => total + item.price * item.quantidade, 0) // Soma os subtotais
        .toFixed(2); // Retorna com 2 casas decimais
    },
    finalizarCompra() {
      alert('Compra finalizada com sucesso. Volte sempre!!!'); 
      this.carrinho = []; 
      localStorage.removeItem('carrinho'); 
      this.$router.push('/'); // Redireciona para a página inicial
    },
  },
  mounted() {
    this.carregarCarrinho(); // Carrega os itens do carrinho assim que a página é carregada
  },
};
</script>

