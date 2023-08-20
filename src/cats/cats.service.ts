import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CreateCatDto } from './dto/create-cat.dto';
import { UpdateCatDto } from './dto/update-cat.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Cat } from './entities/cat.entity';
import { Repository } from 'typeorm';
import { Breed } from 'src/breeds/entities/breed.entity';
import { UserActiveInterface } from 'src/common/interfaces/user-active.interface';
import { Role } from 'src/common/enums/role.enum';

@Injectable()
export class CatsService {

  constructor(
    @InjectRepository(Cat)
    private readonly catRepository: Repository<Cat>,

    @InjectRepository(Breed)
    private readonly breedRepository: Repository<Breed>,
  )
  {}

  async create(createCatDto: CreateCatDto, user: UserActiveInterface ) {
    const breed = await this.validateBreed(createCatDto.breed)
    
    return await this.catRepository.save({
      ...createCatDto,
      breed,
      userEmail: user.email,
    })
  }

  async findAll(user: UserActiveInterface) {
    if(user.role === Role.ADMIN) {
      return await this.catRepository.find()
    }

    return this.catRepository.find({
      where: { userEmail: user.email }
    });
  }

  async findOne(id: number, user: UserActiveInterface) {
    const cat = await this.catRepository.findOneBy({id})

    if(!cat) {
      throw new NotFoundException("cat doesn't exists")
    }

    this.validateOwnerShip(cat, user)

    return cat
  }

  async update(id: number, updateCatDto: UpdateCatDto, user: UserActiveInterface) {
    await this.findOne(id, user)
    
    return await this.catRepository.update(id, {
      ...updateCatDto,
      breed: updateCatDto.breed ? await this.validateBreed(updateCatDto.breed) : undefined,
      userEmail: user.email
    })
  }

  async remove(id: number, user: UserActiveInterface) {
    await this.findOne(id, user)
    return this.catRepository.softDelete({id})
  }

  private validateOwnerShip(cat: Cat, user: UserActiveInterface) {
    if(user.email !== cat.userEmail && user.role !== Role.ADMIN) {
      throw new UnauthorizedException()
    }
  }

  private async validateBreed (breed: string) {
    const breedEntity = await this.breedRepository.findOneBy({name: breed})

    if(!breedEntity) {
      throw new BadRequestException("breed not found")
    }
    return breedEntity
  }
}
