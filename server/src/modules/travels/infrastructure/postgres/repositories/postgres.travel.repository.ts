import { InjectRepository } from "@nestjs/typeorm";
import { TravelRepository } from "src/modules/travels/domain/repositories/travel.repository";
import { Travel } from "src/modules/travels/domain/schemas/Travel";
import { TravelResponse } from "src/modules/travels/domain/types/TravelsResponse";
import { TravelEntity } from "../entities/travel.entities";
import { Repository } from "typeorm";

export class PostgresTravelRepository implements TravelRepository {
    
    constructor(@InjectRepository(TravelEntity)private travelEntityRepository: Repository<TravelEntity>) {}
    private toDomain(data:TravelEntity[]){

          const formatTravels = data.map((travel:TravelEntity)=>{
                //constante para no utilizar id:travel.id
                const{id,origin,
                    destination,
                    departureDate,
                    arrivalDate,
                    passengerCount,
                    vehicleId,
                    status,
                    createdAt,
                    updatedAt,
                    notes    
                }=travel
                return Travel.create({
                    //solo se simplifica cuando
                    // tienen el mismo nombre id:id,
                    id,
                    origin,
                    destination,
                    departureDate,
                    arrivalDate,
                    passengerCount,
                    vehicleId,
                    status,
                    createdAt,
                    updatedAt,
                    notes
                })
            })
            return formatTravels
    }
    async create(travel: Partial<Travel>): Promise<TravelResponse | Error> {
        const newTravel = Travel.create({...travel,id:crypto.randomUUID()}); 
        await this.travelEntityRepository.save(newTravel)
        if (!newTravel) {
            throw new Error('Ocurrio un error inesperado.');
        }
        return {
            message: 'viaje creado exitosamente',
            succes: true,
            travel: newTravel,
        }
    }
    async findAll(): Promise<Travel[]> {
        const  format = await this.travelEntityRepository.find()

        return this.toDomain(format)
    }
    async update(id: string, travel: Partial<Travel>): Promise<TravelResponse | Error> {
        await this.travelEntityRepository.update(id,travel);
        const update = await this.travelEntityRepository.findOne({where:{id}});
        if(!update){
            throw new Error ("Viaje no encontrado")
        }
        return {
            message: 'Viaje actualizado exitosamente',
            succes: true,
            travel: update.toDomain(),
        }
    }
    async delete(id:string): Promise<void | Error>{
        const exist = await this.travelEntityRepository.findOne({where:{id}});
        if(!exist){
            throw new Error ('Viaje no encontrado.')
        }
        await this.travelEntityRepository.delete(id);
    }
}