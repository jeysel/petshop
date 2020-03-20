import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Customer } from '../models/customer.model';
import { Address } from '../models/address.model';
import { Pet } from '../models/pet.model';
import { QueryDto } from '../dtos/query.dto';

@Injectable()
export class CustomerService {
    constructor(@InjectModel('Customer') private readonly model: Model<Customer>) { }

    // cria um novo cliente
    async create(data: Customer): Promise<Customer> {
        const customer = new this.model(data);
        return await customer.save();
    }

    async addBillingAddress(document: string, data: Address): Promise<Customer> {
        const options = { upsert: true };
        return await this.model.findOneAndUpdate({ document }, {
            $set: {
                billingAddress: data,
            },
        }, options);

    }

    async addShippingAddress(document: string, data: Address): Promise<Customer> {
        const options = { upsert: true };
        return await this.model.findOneAndUpdate({ document }, {
            $set: {
                shippingAddress: data,
            },
        }, options);
    }

    async createPet(document: string, data: Pet): Promise<Customer> {
        const options = { upsert: true, new: true };
        return await this.model.findOneAndUpdate({ document }, {
            $push: {
                pets: data,
            },
        }, options);
    }

    async updatePet(document: string, id: string, data: Pet): Promise<Customer> {
        return await this.model.findOneAndUpdate({ document, 'pets._id': id }, {
            $set: {
                'pets.$': data,
            },

            });

    }

    async findAll(): Promise<Customer[]> {
        return await this.model
            .find({}, 'firstName lastName name email document') // todos os campos exceto um exemplo: '-nome do campo'
            .sort('firstName') // para decrescente usar o sinal de menos (-)
            .exec();
    }

    async find(document): Promise<Customer> {
        return await this.model
            .findOne({ document })
            .populate('user', 'username')
            .exec();
    }

    async query(model: QueryDto): Promise<Customer[]> {
        return await this
            .model.find(model.query, 
                model.fields, 
                { 
                    skip: model.skip, 
                    limit: model.take 
                })
                .sort(model.sort)
                .exec();
    }
}