import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../views/HomeView.vue';
import DetalheProdutoView from '../views/DetalheProdutoView.vue';
import CarrinhoView from '../views/CarrinhoView.vue';
import BuscaView from '../views/BuscaView.vue';
import CategoriaMenuView from '../views/CategoriaMenuView.vue';
import CategoriaView from '../views/CategoriaView.vue';

const routes = [
  { path: '/', name: 'Home', component: HomeView },
  { path: '/produto/:id', name: 'DetalheProduto', component: DetalheProdutoView },
  { path: '/carrinho', name: 'Carrinho', component: CarrinhoView },
  { path: '/busca', name: 'Busca', component: BuscaView },
  { path: '/categoria/:nome', name: 'Categoria', component: CategoriaMenuView },
  { path: '/categorias', name: 'Categorias', component: CategoriaView },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
