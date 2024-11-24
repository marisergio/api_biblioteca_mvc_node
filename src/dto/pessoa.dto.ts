export type PessoaListarDto = {
    id: string,
    nome: string,
    cpf: string
}

export type PessoaDtoCreate = {
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
    cidade_id?: number
}