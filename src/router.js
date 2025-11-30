import {createRouter, createWebHistory, RouterView} from "vue-router";
import { h } from 'vue'; // Importamos 'h' para la función de renderizado
import Home from "./shared/presentation/views/home.vue";
import subscriptionsRoutes from "./subscriptions/presentation/subscriptions-routes.js";
import iamRoutes from "./iam/presentation/iam-routes.js";

// TODO: Define lazy-loaded components for routes
const pageNotFound = () => import('./shared/presentation/views/page-not-found.vue');

/**
 * Layout simple para rutas anidadas.
 * Renderiza el <router-view> para que los hijos puedan mostrarse.
 * * CORRECCIÓN: Usamos la función render() y h() con el componente RouterView importado
 * para asegurar que se renderice correctamente en entornos sin compilador de plantillas.
 */
const AppLayout = {
    render() {
        return h(RouterView);
    }
};

const routes = [
    { path: '/home', name: 'home', component: Home, meta: { title: 'Home' } },

    // Rutas con el layout corregido
    {
        path: '/subscriptions',
        component: AppLayout,
        children: subscriptionsRoutes
    },

    {
        path: '/iam',
        component: AppLayout,
        children: iamRoutes
    },

    { path: '/', redirect: '/home' },
    { path: '/:pathMatch(.*)*', name: 'not-found', component: pageNotFound, meta: { title: 'Page Not Found' } }
];

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: routes,
});

router.beforeEach((to, from, next) => {
    console.log(`Navigating from ${from.name} to ${to.name}`);
    let baseTitle = 'ACME Learning Center';
    if (to.meta['title']) {
        document.title = `${baseTitle} - ${to.meta['title']}`;
    }
    next();
});

export default router;