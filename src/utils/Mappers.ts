import { AddressResponseDto } from "@src/address/dto/response-address.dto";
import { Address } from "@src/address/interfaces/address.interface";
import { CarResponseDto } from "@src/car/dto/response-car.dto";
import { Car } from "@src/car/interfaces/car.interface";
import { UserResponseDto } from "@src/user/dto/response-user.dto";
import { User } from "@src/user/interfaces/user.interface";

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
