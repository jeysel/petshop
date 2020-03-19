import { Controller, Get, Post, Put, Delete, Param, Body, UseInterceptors, HttpException, HttpStatus } from '@nestjs/common';
import { Result } from '../models/result.model';
import { ValidatorInterceptor } from 'src/interceptors/validator.interceptor';
import { CreateCustomerContract } from '../contracts/customer/create-customer.contract';
import { CreateCustomerDto } from '../dtos/create-customer-dto';
import { AccontService } from '../services/account.service';
import { User } from '../models/user.model';
import { CustomerService } from '../services/customer.service';
import { Customer } from '../models/customer.model';
import { Address } from '../models/address.model';
import { CreateAddressContract } from '../contracts/customer/create-address.contract';

// localhost:3000/v1/customers
@Controller('v1/customers')
export class CustomerController {
    constructor(
        private readonly accountService: AccontService,
        private readonly customerService: CustomerService) {
     }

    @Get()
    get() {
        return new Result(null, true, [], null);
    }

    @Get(':document')
    getById(@Param('document') document :string) {
        return new Result(null, true, {}, null);
    }

    @Post()
    @UseInterceptors(new ValidatorInterceptor(new CreateCustomerContract()))
    async post(@Body() model: CreateCustomerDto) {
        try {
            const user = await this.accountService.create(
                new User(model.document, model.password, true),
            );
            const customer = new Customer(model.name, model.document, model.email, null, null, null, null, user);
            //const res = await this.customerService.create(customer);
    
            return new Result('Cliente cadastrado com sucesso', true, [{name:customer.name, document:customer.document, email:customer.email}], null);

        } catch(error) {
            // rollback manual
            throw new HttpException(new Result('Não foi possivel realizar o cadastro', false, null, error), HttpStatus.BAD_REQUEST);
        }
       
    }

    @Post(':document/addresses/billing')
    @UseInterceptors(new ValidatorInterceptor(new CreateAddressContract()))
    async addBillingAddress(@Param('document') document, @Body() model: Address) {
        try {
            await this.customerService.addBillingAddress(document, model);
            return new Result(null, true, model, null);

        } catch(error) {
            throw new HttpException(new Result('Não foi possivel adicionar seu endereço', false, null, error), HttpStatus.BAD_REQUEST);
        }
    }

    @Post(':document/addresses/shipping')
    @UseInterceptors(new ValidatorInterceptor(new CreateAddressContract()))
    async addShippingAddress(@Param('document') document, @Body() model: Address) {
        try {
            const res = await this.customerService.addShippingAddress(document, model);
            return new Result(null, true, model, null);

        } catch(error) {
            throw new HttpException(new Result('Não foi possivel adicionar seu endereço', false, null, error), HttpStatus.BAD_REQUEST);
        }
    }

    @Post(':document/pets')

    

    @Put(':document')
    put(@Param('document') document, @Body() body) {
        return new Result('Cliente atualizado com sucesso', true, body, null);
    }

    @Delete(':document')
    detete(@Param('document') document) {
        return new Result('Cliente removido com sucesso', true, null, null);
    }

}