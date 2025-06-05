<template>
  <div class="border rounded p-4 shadow hover:shadow-lg">
    <img :src="produto.thumbnail" alt="imagem" class="w-full h-48 object-cover mb-4">
    <h2 class="font-bold mb-2">{{ produto.title }}</h2>
    <p class="mb-2">Preço: ${{ produto.price }}</p>
    <router-link :to="`/produto/${produto.id}`" class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">Ver Detalhes</router-link>
  </div>
</template>

<script>
export default {
  props: {
    produto: Object,
  },
};
</script>
