import { IsString, IsNotEmpty, IsDate, IsEnum } from 'class-validator';
import { Type } from 'class-transformer';

export type EmprestimoListarDto = {
    id: string,
    nome: string,
    cpf: string
}

export class EmprestimoDtoCreate {
    @IsNotEmpty()
    @IsString()
    leitor_id: string;

    @IsNotEmpty()
    @IsString()
    livro_id: string;

    @IsDate()
    @Type(() => Date)
    data: Date;
}