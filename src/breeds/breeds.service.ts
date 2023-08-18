import { Injectable } from '@nestjs/common';
import { CreateBreedDto } from './dto/create-breed.dto';
import { UpdateBreedDto } from './dto/update-breed.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Breed } from './entities/breed.entity';

@Injectable()
export class BreedsService {

  constructor(
    @InjectRepository(Breed)
    private readonly breedRespository: Repository<Breed>
  )
  {}


  async create(createBreedDto: CreateBreedDto) {
    const breed = this.breedRespository.create(createBreedDto)
    return await this.breedRespository.save(breed)
    // return 'This action adds a new breed';
  }

  async findAll() {
    return await this.breedRespository.find()
    // return `This action returns all breeds`;
  }

  findOne(id: number) {
    return `This action returns a #${id} breed`;
  }

  update(id: number, updateBreedDto: UpdateBreedDto) {
    return `This action updates a #${id} breed`;
  }

  remove(id: number) {
    return `This action removes a #${id} breed`;
  }
}
