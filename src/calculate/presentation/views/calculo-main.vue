<template>
  <div class="calculo-main">
    <!-- Header -->
    <div class="header">
      <h1>{{ $t('calculate.title') || 'Cálculos' }}</h1>
      <p class="subtitle">{{ $t('calculate.description') || 'Calcula la distancia estimada a tu restaurante' }}</p>
    </div>

    <!-- Loading State -->
    <div v-if="!dataLoaded" class="loading-container">
      <div class="spinner"></div>
      <p>{{ $t('calculate.loading') || 'Cargando datos...' }}</p>
    </div>

    <!-- Main Content -->
    <div v-else class="main-content">
      <!-- Error Messages -->
      <div v-if="errors.length > 0" class="error-messages">
        <div v-for="(error, index) in errors" :key="index" class="error-item">
          ⚠️ {{ error.message || error }}
          <button @click="calculoStore.clearErrors()" class="btn-clear-error">✕</button>
        </div>
      </div>

      <!-- Layout Principal: 2 columnas en desktop, 1 en mobile -->
      <div class="layout-container">
        <!-- Columna Izquierda: Selector de Restaurante + Top 3 -->
        <div class="left-column">
          <RestaurantSelector @calculation-completed="onCalculationCompleted" />
        </div>

        <!-- Columna Derecha: Grupo + Acciones -->
        <div class="right-column">
          <GroupManager @calculation-completed="onCalculationCompleted" />
        </div>
      </div>

      <!-- Mapa Completo -->
      <div class="full-width-section">
        <MapViewer />
      </div>

      <!-- Historial de Cálculos Recientes -->
      <div v-if="calculations.length > 0" class="calculations-history">
        <h3>{{ $t('calculate.recentCalculations') || 'Cálculos Recientes' }}</h3>
        <div class="history-list">
          <div
            v-for="calculation in calculations.slice(-5)"
            :key="calculation.id"
            class="history-item"
          >
            <div class="history-info">
              <p class="history-date">{{ formatDate(calculation.createdAt) }}</p>
              <p class="history-distance">{{ calculation.estimatedDistance }} km</p>
            </div>
            <div class="history-members">
              <span class="members-count">{{ calculation.members.length }} personas</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Success Message -->
      <div v-if="showSuccessMessage" class="success-message">
        <p>✅ {{ $t('calculate.calculationCompleted') || '¡Cálculo completado!' }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useCalculoStore } from '../../application/calculo.store.js';
import RestaurantSelector from '../components/restaurant-selector.vue';
import GroupManager from '../components/group-manager.vue';
import MapViewer from '../components/map-viewer.vue';

const calculoStore = useCalculoStore();
const showSuccessMessage = ref(false);

const dataLoaded = computed(() => calculoStore.dataLoaded);
const errors = computed(() => calculoStore.errors);
const calculations = computed(() => calculoStore.calculations);

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

const onCalculationCompleted = () => {
  showSuccessMessage.value = true;
  setTimeout(() => {
    showSuccessMessage.value = false;
  }, 3000);
};

onMounted(async () => {
  // Cargar todos los datos cuando se monta el componente
  await calculoStore.fetchAllData();

  // Seleccionar el primer grupo por defecto
  if (calculoStore.groups.length > 0) {
    calculoStore.currentGroup = calculoStore.groups[0];
  }

  // Seleccionar el primer restaurante por defecto
  if (calculoStore.restaurants.length > 0) {
    calculoStore.currentRestaurant = calculoStore.restaurants[0];
  }
});
</script>

<style scoped>
.calculo-main {
  width: 100%;
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
}

.header {
  text-align: center;
  color: white;
  margin-bottom: 30px;
  animation: slideDown 0.5s ease-out;
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.header h1 {
  font-size: 2.5rem;
  margin: 0;
  text-shadow: 2px 2px 8px rgba(0, 0, 0, 0.3);
  font-weight: bold;
}

.subtitle {
  font-size: 1.1rem;
  margin: 10px 0 0 0;
  opacity: 0.9;
  font-style: italic;
}

.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 400px;
  color: white;
}

.spinner {
  width: 50px;
  height: 50px;
  border: 4px solid rgba(255, 255, 255, 0.3);
  border-top: 4px solid white;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 20px;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.main-content {
  max-width: 1400px;
  margin: 0 auto;
}

.error-messages {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 20px;
}

.error-item {
  background: #ff4444;
  color: white;
  padding: 15px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-shadow: 0 4px 12px rgba(255, 68, 68, 0.3);
}

.btn-clear-error {
  background: rgba(255, 255, 255, 0.3);
  color: white;
  border: none;
  border-radius: 4px;
  padding: 4px 8px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-clear-error:hover {
  background: rgba(255, 255, 255, 0.5);
}

.layout-container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  margin-bottom: 30px;
}

.left-column,
.right-column {
  animation: fadeIn 0.6s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.full-width-section {
  margin-bottom: 30px;
  animation: fadeIn 0.7s ease-out;
}

.calculations-history {
  background: white;
  border-radius: 20px;
  padding: 25px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
  animation: fadeIn 0.8s ease-out;
}

.calculations-history h3 {
  margin: 0 0 20px 0;
  color: #333;
  font-size: 1.3rem;
  border-bottom: 3px solid #667eea;
  padding-bottom: 10px;
}

.history-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 15px;
}

.history-item {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 15px;
  border-radius: 12px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: all 0.3s ease;
  cursor: pointer;
}

.history-item:hover {
  transform: translateY(-4px);
  box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
}

.history-info {
  flex: 1;
}

.history-date {
  margin: 0;
  font-size: 0.85rem;
  opacity: 0.9;
}

.history-distance {
  margin: 5px 0 0 0;
  font-size: 1.3rem;
  font-weight: bold;
}

.history-members {
  text-align: right;
}

.members-count {
  background: rgba(255, 255, 255, 0.2);
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: bold;
}

.success-message {
  position: fixed;
  top: 20px;
  right: 20px;
  background: #00cc00;
  color: white;
  padding: 15px 20px;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 204, 0, 0.4);
  animation: slideInRight 0.3s ease-out, slideOutRight 0.3s ease-out 2.7s forwards;
  z-index: 2000;
}

@keyframes slideInRight {
  from {
    opacity: 0;
    transform: translateX(400px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes slideOutRight {
  to {
    opacity: 0;
    transform: translateX(400px);
  }
}

.success-message p {
  margin: 0;
  font-weight: bold;
}

/* Responsive Design */
@media (max-width: 1024px) {
  .layout-container {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .calculo-main {
    padding: 15px;
  }

  .header h1 {
    font-size: 1.8rem;
  }

  .subtitle {
    font-size: 0.95rem;
  }

  .history-list {
    grid-template-columns: 1fr;
  }
}
</style>
/**
 * @class CalculoEntity
 * @summary Represents a calculation entity.
 */
export class CalculoEntity {
    /**
     * @param {Object} params - The calculation parameters.
     * @param {string|number} params.id - The calculation ID.
     * @param {string} params.name - The calculation name.
     * @param {number} params.value - The calculation value.
     */
    constructor({id, name, value}) {
        this.id = id;
        this.name = name;
        this.value = value;
    }
}
