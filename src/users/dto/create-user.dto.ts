import { IsEmail, IsNotEmpty, MinLength, IsOptional, IsEnum } from "class-validator";
import { Role } from "@prisma/client";

export class CreateUserDto {
    @IsEmail({}, { message: "El email no es válido" })
    email: string;

    @IsNotEmpty({ message: "El nombre es requerido" })
    name: string;

    @IsNotEmpty({ message: "La contraseña es requerida" })
    @MinLength(6, { message: "La contraseña debe tener al menos 6 caracteres" })
    password: string;

    @IsOptional()
    @IsEnum(Role, { message: "El rol debe ser USER o ADMIN" })
    role?: Role; // Optional role field
}