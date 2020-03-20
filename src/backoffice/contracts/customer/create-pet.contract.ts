import { Injectable } from '@nestjs/common';
import { Flunt } from 'src/utils/flunt';
import { Pet } from '../../models/pet.model';
import { Contract } from '../contract';

@Injectable()
export class CreatePetContract implements Contract {
    errors: any[];

    validate(model: Pet): boolean {
        const flunt = new Flunt();

        flunt.hasMinLen(model.name, 2, 'Nome inválido');
        flunt.hasMinLen(model.gender, 3, 'Gênero inválido');
        flunt.hasMinLen(model.kind, 3, 'Tipo inválido');
        flunt.hasMinLen(model.brand, 3, 'Raça inválida');

        this.errors = flunt.errors;
        return flunt.isValid();
    }
}