import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CatsModule } from './cats/cats.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BreedsModule } from './breeds/breeds.module';

@Module({
  imports: [
    CatsModule,
    TypeOrmModule.forRoot({
      type: "mysql",
      host: "localhost",
      port: 3306,
      username: "root",
      password: "",
      database: "crud_cats_nest",
      autoLoadEntities: true,
      synchronize: true,
    }),
    BreedsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
