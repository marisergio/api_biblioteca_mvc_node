import { PessoaDtoCreate } from "../dto/pessoa.dto"
import { Cidade } from "./cidade"

export type PessoaProps = {
    id: string,
    nome: string,
    nascimento: Date,
    sexo: 'M' | 'F',
    cpf: string,
    celular: string,
    email: string,
    logradouro: string,
    numero: string,
    bairro: string,
    cep: string,
    cidade?: Cidade,
    cidade_id?: number
}

export class Pessoa {

    private constructor(readonly props: PessoaProps) { }

    public static build({
        nome,
        nascimento,
        sexo,
        cpf,
        celular,
        email,
        logradouro,
        numero,
        bairro,
        cep,
        cidade_id }: PessoaDtoCreate) {

        const props: PessoaProps = {
            id: crypto.randomUUID().toString(),
            nome,
            nascimento,
            sexo,
            cpf,
            celular,
            email,
            logradouro,
            numero,
            bairro,
            cep,
            cidade_id
        }
        return new Pessoa(props)
    }

    public static assemble(
        id: string,
        nome: string,
        nascimento: Date,
        sexo: 'M' | 'F',
        cpf: string,
        celular: string,
        email: string,
        logradouro: string,
        numero: string,
        bairro: string,
        cep: string,
        cidade: Cidade) {

        const props: PessoaProps = {
            id,
            nome,
            nascimento,
            sexo,
            cpf,
            celular,
            email,
            logradouro,
            numero,
            bairro,
            cep,
            cidade
        }
        return new Pessoa(props)
    }

    public get id() {
        return this.props.id;
    }

    public get nome() {
        return this.props.nome;
    }

    public get nascimento() {
        return this.props.nascimento;
    }

    public get sexo() {
        return this.props.sexo;
    }

    public get cpf() {
        return this.props.cpf;
    }

    public get celular() {
        return this.props.celular;
    }

    public get email() {
        return this.props.email;
    }

    public get logradouro() {
        return this.props.logradouro;
    }

    public get numero() {
        return this.props.numero;
    }

    public get bairro() {
        return this.props.bairro;
    }

    public get cep() {
        return this.props.cep;
    }

    public get cidade() {
        return this.props.cidade
    }

    public get cidade_id() {
        return this.props.cidade_id
    }

}