import { IsString, IsEmail, IsNotEmpty, IsDate, IsEnum, IsNumber, Matches } from 'class-validator';
import { Type } from 'class-transformer';

export type PessoaListarDto = {
    id: string,
    nome: string,
    cpf: string
}

export class PessoaDtoCreate {
    @IsNotEmpty()
    @IsString()
    nome: string;

    @IsDate()
    @Type(() => Date)
    nascimento: Date;

    @IsEnum(['M', 'F'], { message: 'Sexo deve ser "M" ou "F"' })
    sexo: 'M' | 'F';

    @Matches(/^\d{11}$/, { message: 'CPF deve conter 11 dígitos numéricos' })
    cpf: string;

    @IsString()
    celular: string;

    @IsEmail()
    email: string;

    @IsString()
    logradouro: string;

    @IsString()
    numero: string;

    @IsString()
    bairro: string;

    @Matches(/^\d{8}$/, { message: 'CEP deve conter 8 dígitos numéricos' })
    cep: string;

    @IsNumber()
    cidade_id?: number;
}