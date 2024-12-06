import { IsString, IsNotEmpty } from 'class-validator';

export type LivroListarDto = {
    id: string,
    titulo: string,
    autor: string
}

export class LivroDtoCreate {
    @IsNotEmpty()
    @IsString()
    titulo: string;

    @IsNotEmpty()
    @IsString()
    autor: string;
}