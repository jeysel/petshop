import { Injectable } from '@nestjs/common';
import { Flunt } from 'src/utils/flunt';
import { Contract } from '../contract';
import { CreateCustomerDto } from '../../dtos/create-customer.dto';

@Injectable()
export class CreateCustomerContract implements Contract {
    errors: any[];
    
    validate(model: CreateCustomerDto): boolean {
        const flunt = new Flunt();

        flunt.hasMinLen(model.name, 5, 'O nome de conter ao menos 5(Cinco) caracteres');
        flunt.isEmail(model.email, 'E-mail inválido');
        flunt.isFixedLen(model.document, 11, 'O CPF de conter 11(Onze) digitos');
        flunt.hasMinLen(model.password, 6, 'A senha deve conter ao menos 6(Seis) caracteres');
        

        /* exemplo de implementação de novos erros */
        if (model.name === 'Jeysel') {
            this.errors.push({ message: 'Jeysel não pode ser cadastrado'});
        }
        /* fim exemplo */

        this.errors = flunt.errors;
        return flunt.isValid();
    }
    

}