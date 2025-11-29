import {CalculoEntity} from "../domain/models/calculo.entity.js";

/**
 * @class CalculoAssembler
 * @summary Assembler for converting calculation DTOs to entities and vice versa.
 */
export class CalculoAssembler {
    /**
     * Convert a DTO (Data Transfer Object) to a CalculoEntity.
     * @param {Object} dto - The DTO object.
     * @returns {CalculoEntity} The calculation entity.
     */
    static dtoToEntity(dto) {
        // TODO: Implement DTO to entity conversion
        return new CalculoEntity({
            id: dto.id,
            name: dto.name,
            value: dto.value
        });
    }

    /**
     * Convert a CalculoEntity to a DTO.
     * @param {CalculoEntity} entity - The calculation entity.
     * @returns {Object} The DTO object.
     */
    static entityToDto(entity) {
        // TODO: Implement entity to DTO conversion
        return {
            id: entity.id,
            name: entity.name,
            value: entity.value
        };
    }

    /**
     * Convert multiple DTOs to entities.
     * @param {Array<Object>} dtos - Array of DTO objects.
     * @returns {Array<CalculoEntity>} Array of calculation entities.
     */
    static dtosToEntities(dtos) {
        // TODO: Implement bulk DTO to entity conversion
        return dtos.map(dto => this.dtoToEntity(dto));
    }
}

