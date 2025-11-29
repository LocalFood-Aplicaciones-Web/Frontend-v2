<template>
  <div class="map-section">
    <h3 class="map-title">{{ $t('calculate.restaurants') || 'Restaurantes' }}</h3>
    <div class="map-container">
      <div id="google-map" class="google-map"></div>

      <!-- Lista de Restaurantes Cercanos -->
      <div class="restaurants-nearby">
        <h4>{{ $t('calculate.nearbyRestaurants') || 'Restaurantes Cercanos' }}</h4>
        <div class="restaurants-scroll">
          <div
            v-for="restaurant in restaurants"
            :key="restaurant.id"
            class="restaurant-item-map"
            :class="{ active: currentRestaurant?.id === restaurant.id }"
            @click="selectRestaurant(restaurant.id)"
          >
            <div class="restaurant-marker">📍</div>
            <div class="restaurant-details">
              <p class="restaurant-name">{{ restaurant.name }}</p>
              <p class="restaurant-address">{{ restaurant.address }}</p>
              <p class="restaurant-distance">{{ restaurant.distance }} km</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useCalculoStore } from '../../application/calculo.store.js';

const calculoStore = useCalculoStore();
const mapInstance = ref(null);
const markers = ref([]);

const restaurants = computed(() => calculoStore.restaurants);
const currentRestaurant = computed(() => calculoStore.currentRestaurant);

onMounted(() => {
  // Inicializar Google Maps cuando esté disponible
  // Por ahora se muestra un placeholder
  initializeMap();
});

const initializeMap = () => {
  // TODO: Implementar inicialización de Google Maps cuando la API esté disponible
  const mapElement = document.getElementById('google-map');
  if (mapElement) {
    // Placeholder: Se mostrará un fondo con instrucciones
    mapElement.innerHTML = `
      <div style="
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        font-size: 1.2rem;
        border-radius: 8px;
      ">
        <div style="text-align: center;">
          <p>🗺️ Google Maps API</p>
          <p style="font-size: 0.9rem; opacity: 0.8;">Configura tu API Key para ver el mapa</p>
        </div>
      </div>
    `;
  }
};

const selectRestaurant = async (restaurantId) => {
  await calculoStore.selectRestaurant(restaurantId);
  // TODO: Animar marcador en el mapa
};
</script>

<style scoped>
.map-section {
  background: linear-gradient(135deg, #00ccff 0%, #00aacc 100%);
  border-radius: 20px;
  padding: 20px;
  border: 3px solid #0099cc;
}

.map-title {
  text-align: center;
  font-size: 1.3rem;
  color: white;
  margin: 0 0 15px 0;
  font-weight: bold;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.2);
}

.map-container {
  display: grid;
  grid-template-columns: 1fr 300px;
  gap: 15px;
  height: 400px;
}

.google-map {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

.restaurants-nearby {
  background: white;
  border-radius: 12px;
  padding: 15px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

.restaurants-nearby h4 {
  margin: 0 0 10px 0;
  color: #0099cc;
  font-size: 1rem;
}

.restaurants-scroll {
  flex: 1;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.restaurant-item-map {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px;
  border: 2px solid #ddd;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s ease;
  background: #f9f9f9;
}

.restaurant-item-map:hover {
  border-color: #00ccff;
  background: #f0f8ff;
  transform: translateX(5px);
}

.restaurant-item-map.active {
  background: #e0f7ff;
  border-color: #00ccff;
  font-weight: bold;
}

.restaurant-marker {
  font-size: 1.5rem;
  min-width: 25px;
}

.restaurant-details {
  flex: 1;
  min-width: 0;
}

.restaurant-name {
  margin: 0;
  font-weight: bold;
  color: #333;
  font-size: 0.9rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.restaurant-address {
  margin: 2px 0 0 0;
  font-size: 0.75rem;
  color: #666;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.restaurant-distance {
  margin: 2px 0 0 0;
  font-size: 0.8rem;
  color: #00ccff;
  font-weight: bold;
}

/* Scrollbar personalizado */
.restaurants-scroll::-webkit-scrollbar {
  width: 6px;
}

.restaurants-scroll::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 10px;
}

.restaurants-scroll::-webkit-scrollbar-thumb {
  background: #00ccff;
  border-radius: 10px;
}

.restaurants-scroll::-webkit-scrollbar-thumb:hover {
  background: #0099cc;
}

@media (max-width: 768px) {
  .map-container {
    grid-template-columns: 1fr;
    height: auto;
  }

  .restaurants-nearby {
    max-height: 250px;
  }
}
</style>

