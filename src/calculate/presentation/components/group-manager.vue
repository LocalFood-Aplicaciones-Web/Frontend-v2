<style scoped>
    .group-section {
      display: flex;
      flex-direction: column;
      gap: 15px;
    }

    .btn-action {
      background: linear-gradient(135deg, #ff1493 0%, #ff0066 100%);
      color: white;
      border: none;
      border-radius: 8px;
      padding: 12px;
      font-weight: bold;
      cursor: pointer;
      transition: all 0.3s ease;
      font-size: 0.9rem;
    }

    .btn-action:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(255, 20, 147, 0.4);
    }

    .btn-action:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .btn-add {
      background: linear-gradient(135deg, #00cc00 0%, #009900 100%);
    }

    .btn-edit {
      background: linear-gradient(135deg, #ff9900 0%, #ff6600 100%);
    }

    .btn-calc-without {
      background: linear-gradient(135deg, #6600ff 0%, #3300cc 100%);
    }

    /* Estilos Modales */
    .modal-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.6);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
    }

    .modal-content {
      background: white;
      border-radius: 12px;
      padding: 20px;
      max-width: 500px;
      max-height: 80vh;
      overflow-y: auto;
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
    }

    .modal-content h4 {
      margin-top: 0;
      color: #333;
      text-align: center;
      font-size: 1.2rem;
    }

    .available-colleagues,
    .restaurants-options {
      display: grid;
      grid-template-columns: 1fr;
      gap: 10px;
      margin: 15px 0;
    }

    .colleague-option,
    .restaurant-option {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 12px;
      border: 2px solid #ddd;
      border-radius: 8px;
      background: white;
      cursor: pointer;
      transition: all 0.3s ease;
    }

    .colleague-option:hover,
    .restaurant-option:hover {
      border-color: #00ccff;
      background: #f0f8ff;
    }

    .colleague-option.active,
    .restaurant-option.active {
      border-color: #00ccff;
      background: #e0f7ff;
    }

    .colleague-avatar,
    .restaurant-thumb {
      width: 50px;
      height: 50px;
      border-radius: 50%;
      object-fit: cover;
    }

    .restaurant-thumb {
      border-radius: 4px;
    }

    .restaurant-name {
      margin: 0;
      font-weight: bold;
      color: #333;
    }

    .restaurant-distance {
      margin: 3px 0 0 0;
      font-size: 0.8rem;
      color: #666;
    }

    .btn-close {
      width: 100%;
      background: #ff3333;
      color: white;
      border: none;
      border-radius: 8px;
      padding: 10px;
      font-weight: bold;
      cursor: pointer;
      transition: all 0.3s ease;
    }

    .btn-close:hover {
      background: #cc0000;
    }
</style>

<template>
  <div class="group-section">
    <!-- Contenedor Principal del Grupo -->
    <div class="group-container">
      <div class="group-display">
        <h3 class="group-title">{{ $t('calculate.group') || 'Grupo' }}</h3>

        <div class="member-count-badge">
          <span class="count-label">{{ $t('calculate.members') || 'Personas' }}: </span>
          <span class="count-value">{{ currentGroup?.members?.length || 0 }}</span>
        </div>

        <!-- Lista de Miembros -->
        <div class="members-list">
          <div
            v-for="memberId in currentGroup?.members"
            :key="memberId"
            class="member-card"
          >
            <img
              :src="getColleague(memberId)?.image"
              :alt="getColleague(memberId)?.name"
              class="member-avatar"
            />
            <div class="member-info">
              <p class="member-name">{{ getColleague(memberId)?.name }}</p>
              <p class="member-email">{{ getColleague(memberId)?.email }}</p>
            </div>
            <div class="member-actions">
              <span v-if="isLeader && memberId === currentUserId" class="badge-leader">
                👑 {{ $t('calculate.leader') || 'Líder' }}
              </span>
              <button
                v-if="isLeader && memberId !== currentUserId"
                @click="removeMember(memberId)"
                class="btn-remove"
                :title="$t('calculate.removeMember') || 'Eliminar'"
              >
                🗑️
              </button>
            </div>
          </div>
        </div>

        <!-- Mensaje cuando no hay miembros -->
        <div v-if="!currentGroup?.members || currentGroup.members.length === 0" class="no-members">
          <p>{{ $t('calculate.noMembers') || 'No hay miembros en el grupo' }}</p>
        </div>
      </div>

      <!-- Botones de Acciones -->
      <div class="group-actions">
        <button
          @click="showAddMemberModal = true"
          class="btn-action btn-add"
          :disabled="!isLeader || (currentGroup?.members?.length || 0) >= 8"
        >
          ➕ {{ $t('calculate.addMember') || 'Agregar Persona' }}
        </button>

        <button
          @click="showEditRestaurantModal = true"
          class="btn-action btn-edit"
          :disabled="!isLeader"
        >
          ✏️ {{ $t('calculate.editRestaurant') || 'Editar Restaurante' }}
        </button>

        <button
          @click="handleCalculateWithoutTop3"
          class="btn-action btn-calc-without"
          :disabled="!currentGroup?.members || currentGroup.members.length === 0"
        >
          🧮 {{ $t('calculate.calculateWithoutTop3') || 'Calcular sin Top 3' }}
        </button>
      </div>
    </div>

    <!-- Modal para Agregar Miembro -->
    <div v-if="showAddMemberModal" class="modal-overlay" @click="showAddMemberModal = false">
      <div class="modal-content" @click.stop>
        <h4>{{ $t('calculate.addNewMember') || 'Agregar Nuevo Miembro' }}</h4>
        <div class="available-colleagues">
          <button
            v-for="colleague in availableColleagues"
            :key="colleague.id"
            @click="addMember(colleague.id)"
            class="colleague-option"
          >
            <img :src="colleague.image" :alt="colleague.name" class="colleague-avatar" />
            <span>{{ colleague.name }}</span>
          </button>
        </div>
        <button @click="showAddMemberModal = false" class="btn-close">
          {{ $t('calculate.cancel') || 'Cancelar' }}
        </button>
      </div>
    </div>

    <!-- Modal para Editar Restaurante -->
    <div v-if="showEditRestaurantModal" class="modal-overlay" @click="showEditRestaurantModal = false">
      <div class="modal-content" @click.stop>
        <h4>{{ $t('calculate.selectRestaurantForGroup') || 'Selecciona un Restaurante' }}</h4>
        <div class="restaurants-options">
          <button
            v-for="restaurant in restaurants"
            :key="restaurant.id"
            @click="updateGroupRestaurant(restaurant.id)"
            class="restaurant-option"
            :class="{ active: currentGroup?.selectedRestaurant === restaurant.id }"
          >
            <img :src="restaurant.image" :alt="restaurant.name" class="restaurant-thumb" />
            <div>
              <p class="restaurant-name">{{ restaurant.name }}</p>
              <p class="restaurant-distance">{{ restaurant.distance }} km</p>
            </div>
          </button>
        </div>
        <button @click="showEditRestaurantModal = false" class="btn-close">
          {{ $t('calculate.cancel') || 'Cancelar' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useCalculoStore } from '../../application/calculo.store.js';

const calculoStore = useCalculoStore();
const showAddMemberModal = ref(false);
const showEditRestaurantModal = ref(false);

const currentGroup = computed(() => calculoStore.currentGroup);
const restaurants = computed(() => calculoStore.restaurants);
const currentUserId = computed(() => calculoStore.currentUserId);

const isLeader = computed(() => {
  return currentGroup.value?.leaderId === currentUserId.value;
});

const availableColleagues = computed(() => {
  const currentMembers = currentGroup.value?.members || [];
  return calculoStore.colleagues.filter(c => !currentMembers.includes(c.id));
});

const getColleague = (colleagueId) => {
  return calculoStore.getColleagueById(colleagueId);
};

const addMember = async (memberId) => {
  if (currentGroup.value) {
    await calculoStore.addMemberToGroup(currentGroup.value.id, memberId);
    showAddMemberModal.value = false;
  }
};

const removeMember = async (memberId) => {
  if (currentGroup.value) {
    await calculoStore.removeMemberFromGroup(currentGroup.value.id, memberId);
  }
};

const updateGroupRestaurant = async (restaurantId) => {
  await calculoStore.selectRestaurant(restaurantId);
  showEditRestaurantModal.value = false;
};

const handleCalculateWithoutTop3 = async () => {
  if (currentGroup.value) {
    try {
      await calculoStore.performCalculation();
      emit('calculation-completed');
    } catch (error) {
      console.error('Error en cálculo:', error);
    }
  }
};

const emit = defineEmits(['calculation-completed']);
</script>

<style scoped>
  .group-section {
    display: flex;
    flex-direction: column;
    gap: 15px;
  }

  .group-container {
    background: linear-gradient(135deg, #00ccff 0%, #00aacc 100%);
    border-radius: 20px;
    padding: 20px;
    border: 3px solid #0099cc;
  }

  .group-display {
    background: white;
    border-radius: 12px;
    padding: 20px;
    margin-bottom: 15px;
  }

  .group-title {
    text-align: center;
    font-size: 1.3rem;
    color: #0099cc;
    margin: 0 0 15px 0;
    font-weight: bold;
    text-decoration: underline;
  }

  .member-count-badge {
    background: #ffff00;
    border: 2px solid #ff9900;
    border-radius: 8px;
    padding: 12px;
    text-align: center;
    margin-bottom: 15px;
    font-weight: bold;
  }

  .count-label {
    color: #333;
    font-size: 1rem;
  }

  .count-value {
    background: #ff6600;
    color: white;
    padding: 2px 8px;
    border-radius: 4px;
    font-size: 1.1rem;
  }

  .members-list {
    display: flex;
    flex-direction: column;
    gap: 10px;
    max-height: 400px;
    overflow-y: auto;
  }

  .member-card {
    display: flex;
    align-items: center;
    gap: 12px;
    background: #f0f0f0;
    padding: 12px;
    border-radius: 8px;
    border-left: 4px solid #00ccff;
  }

  .member-avatar {
    width: 50px;
    height: 50px;
    border-radius: 50%;
    object-fit: cover;
  }

  .member-info {
    flex: 1;
  }

  .member-name {
    margin: 0;
    font-weight: bold;
    color: #333;
    font-size: 0.95rem;
  }

  .member-email {
    margin: 3px 0 0 0;
    font-size: 0.8rem;
    color: #666;
  }

  .member-actions {
    display: flex;
    gap: 8px;
    align-items: center;
  }

  .badge-leader {
    background: #ff6600;
    color: white;
    padding: 4px 8px;
    border-radius: 4px;
    font-size: 0.8rem;
    font-weight: bold;
  }

  .btn-remove {
    background: #ff3333;
    border: none;
    border-radius: 4px;
    padding: 6px 10px;
    cursor: pointer;
    font-size: 0.9rem;
    transition: all 0.3s ease;
  }

  .btn-remove:hover {
    background: #cc0000;
    transform: scale(1.1);
  }

  .no-members {
    text-align: center;
    color: #999;
    padding: 20px;
    font-style: italic;
  }

  .group-actions {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    gap: 15px;
  }

</style>