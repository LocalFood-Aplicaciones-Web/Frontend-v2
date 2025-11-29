<template>
  <div class="restaurant-selector">
    <!-- Sección Principal: Restaurante Seleccionado -->
    <div class="restaurant-main-section">
      <div class="restaurant-display">
        <div v-if="currentRestaurant" class="restaurant-card">
          <img :src="currentRestaurant.image" :alt="currentRestaurant.name" class="restaurant-image" />
          <div class="restaurant-info">
            <h3>{{ currentRestaurant.name }}</h3>
            <p>{{ currentRestaurant.address }}</p>
            <p class="distance">{{ currentRestaurant.distance }} km</p>
          </div>
        </div>
        <div v-else class="restaurant-placeholder">
          <p>{{ $t('calculate.selectRestaurant') || 'Selecciona un restaurante' }}</p>
        </div>
      </div>

      <button
        @click="handleCalculate"
        :disabled="!currentRestaurant || isLoading"
        class="btn-calculate"
      >
        <span v-if="!isLoading">{{ $t('calculate.calculate') || 'Calcular' }}</span>
        <span v-else>⏳ Calculando...</span>
      </button>
    </div>

    <!-- Top 3 Restaurantes -->
    <div class="top-restaurants">
      <h4 class="top-title">{{ $t('calculate.top3') || 'Top 3' }}</h4>
      <div class="restaurants-list">
        <div
          v-for="(restaurant, index) in topRestaurants"
          :key="restaurant.id"
          class="top-restaurant-item"
          :class="{ active: currentRestaurant?.id === restaurant.id }"
          @click="selectRestaurant(restaurant.id)"
        >
          <span class="rank">{{ index + 1 }}</span>
          <span class="name">{{ restaurant.name }}</span>
          <span class="distance-badge">{{ restaurant.distance }}km</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useCalculoStore } from '../../application/calculo.store.js';

const calculoStore = useCalculoStore();
const isLoading = ref(false);

const currentRestaurant = computed(() => calculoStore.currentRestaurant);
const topRestaurants = computed(() => calculoStore.topRestaurants);

const emit = defineEmits(['calculation-completed']);

const selectRestaurant = async (restaurantId) => {
  await calculoStore.selectRestaurant(restaurantId);
};

const handleCalculate = async () => {
  isLoading.value = true;
  try {
    await calculoStore.performCalculation();
    // Emitir evento al padre
    emit('calculation-completed');
  } catch (error) {
    console.error('Error en cálculo:', error);
  } finally {
    isLoading.value = false;
  }
};
</script>

<style scoped>
.restaurant-selector {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.restaurant-main-section {
  background: linear-gradient(135deg, #ff00ff 0%, #ff1493 100%);
  border-radius: 20px;
  padding: 20px;
  box-shadow: 0 8px 32px rgba(255, 0, 255, 0.3);
}

.restaurant-display {
  background: white;
  border-radius: 12px;
  padding: 15px;
  margin-bottom: 15px;
  min-height: 150px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.restaurant-card {
  width: 100%;
  display: flex;
  gap: 15px;
}

.restaurant-image {
  width: 120px;
  height: 120px;
  border-radius: 8px;
  object-fit: cover;
}

.restaurant-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.restaurant-info h3 {
  margin: 0;
  font-size: 1.2rem;
  color: #333;
  font-weight: bold;
}

.restaurant-info p {
  margin: 5px 0;
  color: #666;
  font-size: 0.9rem;
}

.distance {
  color: #ff00ff;
  font-weight: bold;
  font-size: 1rem;
}

.restaurant-placeholder {
  text-align: center;
  color: #999;
  font-style: italic;
}

.btn-calculate {
  background: linear-gradient(135deg, #1e90ff 0%, #0066ff 100%);
  color: #ffff00;
  border: none;
  border-radius: 8px;
  padding: 12px 24px;
  font-size: 1rem;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
  width: 100%;
}

.btn-calculate:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(30, 144, 255, 0.4);
}

.btn-calculate:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.top-restaurants {
  background: #ffcc00;
  border-radius: 20px;
  padding: 20px;
  border: 3px solid #ff6600;
}

.top-title {
  text-align: center;
  font-size: 1.5rem;
  color: #ff6600;
  margin: 0 0 15px 0;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1);
}

.restaurants-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.top-restaurant-item {
  background: white;
  border: 2px solid #ff6600;
  border-radius: 8px;
  padding: 12px;
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.top-restaurant-item:hover {
  background: #ffe680;
  transform: translateX(5px);
}

.top-restaurant-item.active {
  background: #ff6600;
  color: white;
}

.rank {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 30px;
  height: 30px;
  background: #ff6600;
  color: white;
  border-radius: 50%;
  font-weight: bold;
}

.top-restaurant-item.active .rank {
  background: white;
  color: #ff6600;
}

.name {
  flex: 1;
  font-weight: 600;
  color: #333;
}

.top-restaurant-item.active .name {
  color: white;
}

.distance-badge {
  background: #00ccff;
  color: white;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 0.8rem;
  font-weight: bold;
}

.top-restaurant-item.active .distance-badge {
  background: white;
  color: #ff6600;
}
</style>
