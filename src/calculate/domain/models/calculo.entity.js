/**
 * @class CalculoEntity
 * @summary Entity representing a calculation with its properties.
 */
export class CalculoEntity {
    /**
     * Constructor for CalculoEntity.
     * @param {Object} data - The calculation data.
     * @param {string|number} data.id - The unique identifier.
     * @param {string} data.name - The name of the calculation.
     * @param {number} data.value - The calculated value.
     */
    constructor(data) {
        this.id = data.id;
        this.name = data.name;
        this.value = data.value;
    }

    /**
     * Get the ID of the calculation.
     * @returns {string|number} The calculation ID.
     */
    getId() {
        return this.id;
    }

    /**
     * Get the name of the calculation.
     * @returns {string} The calculation name.
     */
    getName() {
        return this.name;
    }

    /**
     * Get the value of the calculation.
     * @returns {number} The calculated value.
     */
    getValue() {
        return this.value;
    }

    /**
     * Set the value of the calculation.
     * @param {number} value - The new value.
     */
    setValue(value) {
        this.value = value;
    }
}

