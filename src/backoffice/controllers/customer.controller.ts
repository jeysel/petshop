import { Controller, Get, Post, Put, Delete, Param, Body, UseInterceptors, HttpException, HttpStatus, Catch } from '@nestjs/common';
import { Result } from '../models/result.model';
import { ValidatorInterceptor } from 'src/interceptors/validator.interceptor';
import { CreateCustomerContract } from '../contracts/customer/create-customer.contract';
import { CreateCustomerDto } from '../dtos/create-customer.dto';
import { AccontService } from '../services/account.service';
import { User } from '../models/user.model';
import { CustomerService } from '../services/customer.service';
import { Customer } from '../models/customer.model';
import { Address } from '../models/address.model';
import { CreateAddressContract } from '../contracts/customer/create-address.contract';
import { CreatePetContract } from '../contracts/customer/create-pet.contract';
import { Pet } from '../models/pet.model';
import { identity } from 'rxjs';
import { QueryDto } from '../dtos/query.dto';

// localhost:3000/v1/customers
@Controller('v1/customers')
export class CustomerController {
    constructor(
        private readonly accountService: AccontService,
        private readonly customerService: CustomerService) {
     }

    @Post()
    @UseInterceptors(new ValidatorInterceptor(new CreateCustomerContract()))
    async post(@Body() model: CreateCustomerDto) {
        try {
            const user = await this.accountService.create(
                new User(model.document, model.password, true),
            );
            const customer = new Customer(model.name, model.document, model.email, [], null, null, null, user);
            const res = await this.customerService.create(customer);
    
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

        } catch (error) {
            throw new HttpException(new Result('Não foi possivel adicionar seu endereço', false, null, error), HttpStatus.BAD_REQUEST);
        }
    }

    @Post(':document/pets')
    @UseInterceptors(new ValidatorInterceptor(new CreatePetContract()))
    async createPet(@Param('document') document, @Body() model: Pet) {
        try {
            const res = await this.customerService.createPet(document, model);
            return new Result(null, true, model, null);

        } catch (error) {
            throw new HttpException(new Result('Não foi possivel cadastrar seu Pet', false, null, error), HttpStatus.BAD_REQUEST);
        }
    }

    @Put(':document/pets/:id')
    @UseInterceptors(new ValidatorInterceptor(new CreatePetContract()))
    async updatePet(@Param('document') document, @Param('id') id, @Body() model: Pet) {
        try {
            await this.customerService.updatePet(document, id, model);
            return new Result(null, true, model, null);
        } catch (error) {
            throw new HttpException(new Result('Não foi possivel atualizar seu pet', false, null, error), HttpStatus.BAD_REQUEST);
        }

    }

    @Get()
    async getAll() {
        const customers = await this.customerService.findAll();
        return new Result(null, true, customers, null);
    }

    @Get(':document')
    async get(@Param('document') document) {
        const customer = await this.customerService.find(document);
        return new Result(null, true, customer, null);
    }

    @Post('query')
    @UseInterceptors(new ValidatorInterceptor(new QueryContract()))
    async query(@Body() model: QueryDto) {
        const customers = await this.customerService.query(model);
        return new ResultDto(null, true, customers, null);
    }

}