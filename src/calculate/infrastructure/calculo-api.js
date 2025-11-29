import {BaseApi} from "../../shared/infrastructure/base-api.js";

const colleaguesPath = import.meta.env.VITE_COLLEAGUES_ENDPOINT_PATH || "/colleagues";
const restaurantsPath = import.meta.env.VITE_RESTAURANTS_ENDPOINT_PATH || "/restaurants";
const groupsPath = import.meta.env.VITE_GROUPS_ENDPOINT_PATH || "/groups";
const calculationsPath = import.meta.env.VITE_CALCULATIONS_ENDPOINT_PATH || "/calculations";
const mapsPath = import.meta.env.VITE_MAPS_ENDPOINT_PATH || "/maps";

/**
 * @class CalculoApi
 * @summary API client for calculation operations.
 */
export class CalculoApi extends BaseApi {
    /**
     * Constructor for CalculoApi.
     */
    constructor() {
        super();
        this.useMockData = false;
    }

    /**
     * Fetch all groups.
     * @returns {Promise<Array>} Array of groups.
     */
    async getGroups() {
        try {
            const response = await this.http.get(groupsPath);
            this.useMockData = false;
            return response.data;
        } catch (error) {
            // Use mock data silently if API fails
            if (!this.useMockData) {
                console.warn('Using mock data for groups (API unavailable)');
                this.useMockData = true;
            }
            return this.getMockGroups();
        }
    }

    /**
     * Fetch all restaurants.
     * @returns {Promise<Array>} Array of restaurants.
     */
    async getRestaurants() {
        try {
            const response = await this.http.get(restaurantsPath);
            this.useMockData = false;
            return response.data;
        } catch (error) {
            // Use mock data silently if API fails
            if (!this.useMockData) {
                console.warn('Using mock data for restaurants (API unavailable)');
                this.useMockData = true;
            }
            return this.getMockRestaurants();
        }
    }

    /**
     * Fetch all colleagues.
     * @returns {Promise<Array>} Array of colleagues.
     */
    async getColleagues() {
        try {
            const response = await this.http.get(colleaguesPath);
            this.useMockData = false;
            return response.data;
        } catch (error) {
            // Use mock data silently if API fails
            if (!this.useMockData) {
                console.warn('Using mock data for colleagues (API unavailable)');
                this.useMockData = true;
            }
            return this.getMockColleagues();
        }
    }

    /**
     * Fetch all calculations.
     * @returns {Promise<Array>} Array of calculations.
     */
    async getCalculations() {
        try {
            const response = await this.http.get(calculationsPath);
            this.useMockData = false;
            return response.data;
        } catch (error) {
            // Use mock data silently if API fails
            if (!this.useMockData) {
                console.warn('Using mock data for calculations (API unavailable)');
                this.useMockData = true;
            }
            return this.getMockCalculations();
        }
    }

    /**
     * Create a new group.
     * @param {Object} groupData - The group data.
     * @returns {Promise<Object>} The created group object.
     */
    async createGroup(groupData) {
        try {
            const response = await this.http.post(groupsPath, groupData);
            return response.data;
        } catch (error) {
            console.warn('Group creation using mock data');
            return groupData;
        }
    }

    /**
     * Update an existing group.
     * @param {string} groupId - The group ID.
     * @param {Object} groupData - The updated group data.
     * @returns {Promise<Object>} The updated group object.
     */
    async updateGroup(groupId, groupData) {
        try {
            const response = await this.http.put(`${groupsPath}/${groupId}`, groupData);
            return response.data;
        } catch (error) {
            console.warn('Group update using mock data');
            return groupData;
        }
    }

    /**
     * Get a group by ID.
     * @param {string} groupId - The group ID.
     * @returns {Promise<Object>} The group object.
     */
    async getGroupById(groupId) {
        try {
            const response = await this.http.get(`${groupsPath}/${groupId}`);
            return response.data;
        } catch (error) {
            console.warn(`Group ${groupId} retrieved from mock data`);
            const groups = this.getMockGroups();
            return groups.find(g => g.id === groupId) || groups[0];
        }
    }

    /**
     * Add a member to a group.
     * @param {string} groupId - The group ID.
     * @param {number} memberId - The member ID to add.
     * @returns {Promise<Object>} The updated group object.
     */
    async addMemberToGroup(groupId, memberId) {
        try {
            const group = await this.getGroupById(groupId);
            if (!group.members.includes(memberId)) {
                group.members.push(memberId);
            }
            return await this.updateGroup(groupId, group);
        } catch (error) {
            console.error('Error adding member to group:', error);
            throw error;
        }
    }

    /**
     * Remove a member from a group.
     * @param {string} groupId - The group ID.
     * @param {number} memberId - The member ID to remove.
     * @returns {Promise<Object>} The updated group object.
     */
    async removeMemberFromGroup(groupId, memberId) {
        try {
            const group = await this.getGroupById(groupId);
            group.members = group.members.filter(id => id !== memberId);
            return await this.updateGroup(groupId, group);
        } catch (error) {
            console.error('Error removing member from group:', error);
            throw error;
        }
    }

    /**
     * Calculate distance between two coordinates using backend.
     * @param {number} originLat - Origin latitude
     * @param {number} originLng - Origin longitude
     * @param {number} destLat - Destination latitude
     * @param {number} destLng - Destination longitude
     * @returns {Promise<Object>} Distance and duration information
     */
    async calculateDistance(originLat, originLng, destLat, destLng) {
        try {
            const response = await this.http.post(`${mapsPath}/distance`, {
                origin: { lat: originLat, lng: originLng },
                destination: { lat: destLat, lng: destLng }
            });
            return response.data;
        } catch (error) {
            console.warn('Distance calculation using mock data');
            return this.getMockDistance();
        }
    }

    /**
     * Get directions between two points using backend.
     * @param {number} originLat - Origin latitude
     * @param {number} originLng - Origin longitude
     * @param {number} destLat - Destination latitude
     * @param {number} destLng - Destination longitude
     * @returns {Promise<Object>} Directions and route information
     */
    async getDirections(originLat, originLng, destLat, destLng) {
        try {
            const response = await this.http.post(`${mapsPath}/directions`, {
                origin: { lat: originLat, lng: originLng },
                destination: { lat: destLat, lng: destLng }
            });
            return response.data;
        } catch (error) {
            console.warn('Directions using mock data');
            return this.getMockDirections();
        }
    }

    /**
     * Geocode an address to coordinates using backend.
     * @param {string} address - The address to geocode
     * @returns {Promise<Object>} Coordinates and address information
     */
    async geocodeAddress(address) {
        try {
            const response = await this.http.post(`${mapsPath}/geocode`, { address });
            return response.data;
        } catch (error) {
            console.warn('Geocoding using mock data');
            return this.getMockGeocoding();
        }
    }

    /**
     * Get nearby restaurants using backend.
     * @param {number} latitude - User latitude
     * @param {number} longitude - User longitude
     * @param {number} radiusKm - Search radius in kilometers
     * @returns {Promise<Array>} Nearby restaurants
     */
    async getNearbyRestaurants(latitude, longitude, radiusKm = 10) {
        try {
            const response = await this.http.post(`${mapsPath}/nearby`, {
                latitude,
                longitude,
                radiusKm
            });
            return response.data;
        } catch (error) {
            console.warn('Nearby restaurants using mock data');
            return this.getMockRestaurants();
        }
    }

    // Mock data methods for development/fallback
    getMockGroups() {
        return [
            {
                id: "group-1",
                name: "Grupo Amigos",
                leaderId: 1,
                members: [1, 2, 3],
                createdAt: "2025-01-10T08:00:00Z",
                selectedRestaurant: 1
            },
            {
                id: "group-2",
                name: "Grupo Oficina",
                leaderId: 4,
                members: [1, 4, 5, 6],
                createdAt: "2025-01-12T09:00:00Z",
                selectedRestaurant: 2
            }
        ];
    }

    getMockRestaurants() {
        return [
            { id: 1, name: "KFC Megaplaza", image: "https://via.placeholder.com/300x200?text=KFC+Megaplaza", latitude: -12.0497, longitude: -77.0497, address: "Centro Comercial Megaplaza, Lima", distance: 2.5 },
            { id: 2, name: "KFC Cinepolis", image: "https://via.placeholder.com/300x200?text=KFC+Cinepolis", latitude: -12.0522, longitude: -77.0522, address: "Centro Comercial Cinepolis, Lima", distance: 3.2 },
            { id: 3, name: "KFC Gamarra", image: "https://via.placeholder.com/300x200?text=KFC+Gamarra", latitude: -12.0455, longitude: -77.0455, address: "Gamarra, Lima", distance: 4.1 },
            { id: 4, name: "KFC Plaza Norte", image: "https://via.placeholder.com/300x200?text=KFC+Plaza+Norte", latitude: -12.0300, longitude: -77.0300, address: "Centro Comercial Plaza Norte, Lima", distance: 5.8 },
            { id: 5, name: "KFC Jockey Plaza", image: "https://via.placeholder.com/300x200?text=KFC+Jockey+Plaza", latitude: -12.0650, longitude: -77.0650, address: "Centro Comercial Jockey Plaza, Lima", distance: 6.2 }
        ];
    }

    getMockColleagues() {
        return [
            { id: 1, name: "Verto Figueras", image: "https://via.placeholder.com/100x100?text=VF", email: "verto.figueras@email.com" },
            { id: 2, name: "Yolimililit", image: "https://via.placeholder.com/100x100?text=YL", email: "yolimililit@email.com" },
            { id: 3, name: "Carla Vives", image: "https://via.placeholder.com/100x100?text=CV", email: "carla.vives@email.com" },
            { id: 4, name: "Juan Pérez", image: "https://via.placeholder.com/100x100?text=JP", email: "juan.perez@email.com" },
            { id: 5, name: "María García", image: "https://via.placeholder.com/100x100?text=MG", email: "maria.garcia@email.com" },
            { id: 6, name: "Luis Rodríguez", image: "https://via.placeholder.com/100x100?text=LR", email: "luis.rodriguez@email.com" },
            { id: 7, name: "Ana Martínez", image: "https://via.placeholder.com/100x100?text=AM", email: "ana.martinez@email.com" },
            { id: 8, name: "Carlos López", image: "https://via.placeholder.com/100x100?text=CL", email: "carlos.lopez@email.com" }
        ];
    }

    getMockCalculations() {
        return [
            { id: 1, groupId: "group-1", restaurantId: 1, members: [1, 2, 3], createdAt: "2025-01-15T10:30:00Z", estimatedDistance: 2.5, status: "completed" },
            { id: 2, groupId: "group-2", restaurantId: 2, members: [1, 4, 5], createdAt: "2025-01-14T15:45:00Z", estimatedDistance: 3.2, status: "completed" }
        ];
    }

    getMockDistance() {
        return {
            distance: {
                text: "2.5 km",
                value: 2500
            },
            duration: {
                text: "8 mins",
                value: 480
            }
        };
    }

    getMockDirections() {
        return {
            routes: [{
                legs: [{
                    distance: { text: "2.5 km", value: 2500 },
                    duration: { text: "8 mins", value: 480 },
                    steps: []
                }],
                polyline: {
                    points: "encoded polyline points"
                }
            }]
        };
    }

    getMockGeocoding() {
        return {
            results: [{
                formatted_address: "Centro Comercial Megaplaza, Lima, Peru",
                geometry: {
                    location: { lat: -12.0497, lng: -77.0497 }
                }
            }]
        };
    }
}
