import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
    imports: [MongooseModule.forRoot('mongodb+srv://italoramalho:VEZ95Lxnx25AoULX@saude-campina-db.wzaljqi.mongodb.net/?retryWrites=true&w=majority&appName=saude-campina-db')],
})

export class DatabaseModule{}