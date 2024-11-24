import { Estado } from "./estado";

export class Cidade {
    public id: number;
    public nome: string;
    public estado: Estado;

    public constructor(id: number, nome: string, estado: Estado) {
        this.id = id;
        this.nome = nome;
        this.estado = estado;
    }
}