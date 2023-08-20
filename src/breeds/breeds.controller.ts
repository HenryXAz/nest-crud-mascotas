import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { BreedsService } from './breeds.service';
import { CreateBreedDto } from './dto/create-breed.dto';
import { UpdateBreedDto } from './dto/update-breed.dto';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { Role } from 'src/common/enums/role.enum';
import { Breed } from './entities/breed.entity';
import { UpdateResult } from 'typeorm';

@Auth(Role.ADMIN)
@Controller('breeds')
export class BreedsController {
  constructor(private readonly breedsService: BreedsService) {}

  @Post()
  create(@Body() createBreedDto: CreateBreedDto): Promise<Breed> {
    return this.breedsService.create(createBreedDto);
  }

  @Get()
  findAall(): Promise<Breed[]> {
    return this.breedsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number): Promise<Breed> {
    return this.breedsService.findOne(id );
  }

  @Patch(':id')
  update(@Param('id') id: number, @Body() updateBreedDto: UpdateBreedDto): Promise<UpdateResult> {
    return this.breedsService.update(id, updateBreedDto);
  }

  @Delete(':id')
  remove(@Param('id') id: number): Promise<Breed> {
    return this.breedsService.remove(id);
  }
}
