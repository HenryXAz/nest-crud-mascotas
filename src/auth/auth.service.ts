import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { RegisterDto } from './dto/register.dto';

import * as bcryptjs from "bcryptjs"
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';



@Injectable()
export class AuthService {

  constructor(
    private readonly userService: UsersService,
    private readonly jwtService: JwtService,
  )
  {}

  async login({email, password}: LoginDto) {
    const user = await this.userService.findOneByEmailWithPassword(email)

    if(!user) {
      throw new NotFoundException("user doesn't exists")
    }

    const isPasswordValid = await bcryptjs.compare(password, user.password)

    if(!isPasswordValid) {
      throw new UnauthorizedException("user doesn't exists or credentials are invalid")
    }

    const payload = { 
      email: user.email,
      role: user.role,
    }


    const token = await this.jwtService.signAsync(payload)

    return { 
      token,
      email,
    }
  }

  async register({name, email, password}: RegisterDto) {
    const user = await this.userService.findOneByEmail(email)

    if(user) {
      throw new BadRequestException("user alredy exists")
    }

    return await this.userService.create({
      name, 
      email, 
      password: await bcryptjs.hash(password, 10)
    })
  }

  async profile({email, role}: {email:string, role:string}) {
    return await this.userService.findOneByEmail(email) 
  }
}
