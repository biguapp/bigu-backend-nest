import { AddressResponseDto } from "@src/address/dto/response-address.dto";
import { Address } from "@src/address/interfaces/address.interface";
import { CarResponseDto } from "@src/car/dto/response-car.dto";
import { Car } from "@src/car/interfaces/car.interface";
import { UserResponseDto } from "@src/user/dto/response-user.dto";
import { User } from "@src/user/interfaces/user.interface";

export const mapUserToUserResponse = (user: User): UserResponseDto => {
    return {
        userId: user.id,
        name: user.name,
        email: user.email,
        sex: user.sex,
        phoneNumber: user.phoneNumber,
        matricula: user.matricula,
        feedbacks: user.feedbacks,
        avgScore: user.avgScore
      };
}

export const mapCarToCarResponse = (car: Car): CarResponseDto => {
    return {
        brand: car.brand,
        carModel: car.carModel,
        modelYear: car.modelYear,
        color: car.color,
        plate: car.plate,
        carId: car._id.toString()
    }
}

export const mapAddressToAddressResponse = (address: Address): AddressResponseDto => {
    return {
        rua: address.rua,
        numero: address.numero,
        complemento: address.complemento,
        bairro: address.bairro,
        cidade: address.cidade,
        estado: address.estado,
        addressId: address._id.toString()
    }
}
