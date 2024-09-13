import { UserResponseDto } from "@src/user/dto/response-user.dto";
import { User } from "@src/user/interfaces/user.interface";

export const mapUserToUserResponse = (user: User): UserResponseDto => {
    return {
        name: user.name,
        matricula: user.matricula,
        sex: user.sex,
        email: user.email,
        phoneNumber: user.phoneNumber,
        userId: user._id.toString(),
    }
}
