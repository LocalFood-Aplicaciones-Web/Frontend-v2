import CalculoMain from "./views/calculo-main.vue";

/**
 * Calculation module routes configuration.
 */
const calculoRoutes = [
    {
        path: '',
        name: 'calculo-main',
        component: CalculoMain,
        meta: {
            title: 'Calculadora'
        }
    }
];

export default calculoRoutes;
