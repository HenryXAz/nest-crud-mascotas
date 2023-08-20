import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateBreedDto } from './dto/create-breed.dto';
import { UpdateBreedDto } from './dto/update-breed.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, UpdateResult } from 'typeorm';
import { Breed } from './entities/breed.entity';

@Injectable()
export class BreedsService {

  constructor(
    @InjectRepository(Breed)
    private readonly breedRespository: Repository<Breed>
  )
  {}

  async create(createBreedDto: CreateBreedDto): Promise<Breed> {
    const breed = this.breedRespository.create(createBreedDto)
    return await this.breedRespository.save(breed)
  }

  async findAll(): Promise<Breed[]> {
    return await this.breedRespository.find()
  }

  async findOne(id: number): Promise<Breed> {
    return await this.breedRespository.findOneBy({id})
  }

  async update(id: number, updateBreedDto: UpdateBreedDto): Promise<UpdateResult> {
    const breed = await this.breedRespository.findOneBy({id})

    if (!breed) {
      throw new NotFoundException()
    }

    const breedUpdated = await this.breedRespository.update(id, {
      ...updateBreedDto
    })

    return breedUpdated
  }

  async remove(id: number): Promise<Breed> {
    const breed = await this.breedRespository.findOneBy({id})

    if(!breed) {
      throw new NotFoundException()
    }

    return breed
  }
}
