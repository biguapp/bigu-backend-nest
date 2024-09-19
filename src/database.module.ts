import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
    imports: [MongooseModule.forRootAsync({
        useFactory: () => ({
            uri: process.env.MONGODB_URI
        })
    })],
})

export class DatabaseModule{}