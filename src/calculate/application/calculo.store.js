import {defineStore} from "pinia";
import {computed, ref} from "vue";
import {CalculoApi} from "../infrastructure/calculo-api.js";
import {CalculoAssembler} from "../infrastructure/calculo.assembler.js";

const calculoApi = new CalculoApi();

/**
 * Pinia store for managing calculation state.
 * @returns {Object} The store object with state and actions.
 */
const useCalculoStore = defineStore('calculo', () => {
    /** @type {import('vue').Ref<Array>} Array of groups. */
    const groups = ref([]);

    /** @type {import('vue').Ref<Array>} Array of restaurants. */
    const restaurants = ref([]);

    /** @type {import('vue').Ref<Array>} Array of colleagues. */
    const colleagues = ref([]);

    /** @type {import('vue').Ref<Array>} Array of calculations. */
    const calculations = ref([]);

    /** @type {import('vue').Ref<Array<Error>>} Array of error messages. */
    const errors = ref([]);

    /** @type {import('vue').Ref<boolean>} Flag indicating if data has been loaded. */
    const dataLoaded = ref(false);

    /** @type {import('vue').Ref<Object|null>} The currently selected group. */
    const currentGroup = ref(null);

    /** @type {import('vue').Ref<Object|null>} The currently selected restaurant. */
    const currentRestaurant = ref(null);

    /** @type {import('vue').Ref<number|null>} Current user ID. */
    const currentUserId = ref(1);

    /**
     * Fetch all data (groups, restaurants, colleagues, calculations).
     * @returns {Promise<void>}
     */
    async function fetchAllData() {
        try {
            await Promise.all([
                fetchGroups(),
                fetchRestaurants(),
                fetchColleagues(),
                fetchCalculations()
            ]);
            dataLoaded.value = true;
        } catch (error) {
            errors.value.push(error);
        }
    }

    /**
     * Fetch all groups.
     * @returns {Promise<void>}
     */
    async function fetchGroups() {
        try {
            const response = await calculoApi.getGroups();
            groups.value = response;
        } catch (error) {
            errors.value.push(error);
        }
    }

    /**
     * Fetch all restaurants.
     * @returns {Promise<void>}
     */
    async function fetchRestaurants() {
        try {
            const response = await calculoApi.getRestaurants();
            restaurants.value = response.sort((a, b) => a.distance - b.distance);
        } catch (error) {
            errors.value.push(error);
        }
    }

    /**
     * Fetch all colleagues.
     * @returns {Promise<void>}
     */
    async function fetchColleagues() {
        try {
            const response = await calculoApi.getColleagues();
            colleagues.value = response;
        } catch (error) {
            errors.value.push(error);
        }
    }

    /**
     * Fetch all calculations.
     * @returns {Promise<void>}
     */
    async function fetchCalculations() {
        try {
            const response = await calculoApi.getCalculations();
            calculations.value = response;
        } catch (error) {
            errors.value.push(error);
        }
    }

    /**
     * Create a new group.
     * @param {Object} groupData - The group data.
     * @returns {Promise<void>}
     */
    async function createGroup(groupData) {
        try {
            const response = await calculoApi.createGroup(groupData);
            groups.value.push(response);
            currentGroup.value = response;
        } catch (error) {
            errors.value.push(error);
        }
    }

    /**
     * Add a member to a group.
     * @param {string} groupId - The group ID.
     * @param {number} memberId - The member ID.
     * @returns {Promise<void>}
     */
    async function addMemberToGroup(groupId, memberId) {
        try {
            const response = await calculoApi.addMemberToGroup(groupId, memberId);
            const groupIndex = groups.value.findIndex(g => g.id === groupId);
            if (groupIndex !== -1) {
                groups.value[groupIndex] = response;
                if (currentGroup.value?.id === groupId) {
                    currentGroup.value = response;
                }
            }
        } catch (error) {
            errors.value.push(error);
        }
    }

    /**
     * Remove a member from a group.
     * @param {string} groupId - The group ID.
     * @param {number} memberId - The member ID.
     * @returns {Promise<void>}
     */
    async function removeMemberFromGroup(groupId, memberId) {
        try {
            const response = await calculoApi.removeMemberFromGroup(groupId, memberId);
            const groupIndex = groups.value.findIndex(g => g.id === groupId);
            if (groupIndex !== -1) {
                groups.value[groupIndex] = response;
                if (currentGroup.value?.id === groupId) {
                    currentGroup.value = response;
                }
            }
        } catch (error) {
            errors.value.push(error);
        }
    }

    /**
     * Select a restaurant for the current group.
     * @param {number} restaurantId - The restaurant ID.
     * @returns {Promise<void>}
     */
    async function selectRestaurant(restaurantId) {
        try {
            const restaurant = restaurants.value.find(r => r.id === restaurantId);
            currentRestaurant.value = restaurant;

            if (currentGroup.value) {
                const updatedGroup = {...currentGroup.value, selectedRestaurant: restaurantId};
                const response = await calculoApi.updateGroup(currentGroup.value.id, updatedGroup);
                const groupIndex = groups.value.findIndex(g => g.id === currentGroup.value.id);
                if (groupIndex !== -1) {
                    groups.value[groupIndex] = response;
                    currentGroup.value = response;
                }
            }
        } catch (error) {
            errors.value.push(error);
        }
    }

    /**
     * Perform calculation based on current group and restaurant.
     * @returns {Promise<Object>} The calculation result.
     */
    async function performCalculation() {
        try {
            if (!currentGroup.value || !currentRestaurant.value) {
                throw new Error('Group or restaurant not selected');
            }

            const calculationData = {
                groupId: currentGroup.value.id,
                restaurantId: currentRestaurant.value.id,
                members: currentGroup.value.members,
                createdAt: new Date().toISOString(),
                estimatedDistance: currentRestaurant.value.distance,
                status: 'completed'
            };

            const response = await calculoApi.createCalculation(calculationData);
            calculations.value.push(response);
            return response;
        } catch (error) {
            errors.value.push(error);
            throw error;
        }
    }

    /**
     * Get top 3 nearest restaurants.
     * @returns {Array} Array of top 3 restaurants.
     */
    const topRestaurants = computed(() => {
        return restaurants.value.slice(0, 3);
    });

    /**
     * Get colleague details by ID.
     * @param {number} colleagueId - The colleague ID.
     * @returns {Object|undefined} The colleague object.
     */
    function getColleagueById(colleagueId) {
        return colleagues.value.find(c => c.id === colleagueId);
    }

    /**
     * Get restaurant details by ID.
     * @param {number} restaurantId - The restaurant ID.
     * @returns {Object|undefined} The restaurant object.
     */
    function getRestaurantById(restaurantId) {
        return restaurants.value.find(r => r.id === restaurantId);
    }

    /**
     * Check if current user is group leader.
     * @returns {boolean} True if current user is the leader.
     */
    const isGroupLeader = computed(() => {
        return currentGroup.value?.leaderId === currentUserId.value;
    });

    /**
     * Clear all errors.
     */
    function clearErrors() {
        errors.value = [];
    }

    return {
        groups,
        restaurants,
        colleagues,
        calculations,
        errors,
        dataLoaded,
        currentGroup,
        currentRestaurant,
        currentUserId,
        topRestaurants,
        isGroupLeader,
        fetchAllData,
        fetchGroups,
        fetchRestaurants,
        fetchColleagues,
        fetchCalculations,
        createGroup,
        addMemberToGroup,
        removeMemberFromGroup,
        selectRestaurant,
        performCalculation,
        getColleagueById,
        getRestaurantById,
        clearErrors
    };
});

export { useCalculoStore };
