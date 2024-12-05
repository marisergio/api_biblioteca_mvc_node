import 'reflect-metadata';
import { Api } from "./api/api";
import { PessoaControle } from "./controle/pessoa.controle";
import { LivroApi } from './api/LivroApi';
import { PessoaServico } from './servico/pessoa.servico';
import { PessoaDao } from './dao/pessoa.dao';

function main() {
    const api = Api.build()
    const pessoaControle = new PessoaControle(new PessoaServico(new PessoaDao()))

    api.addRota("/pessoas", "POST", pessoaControle.adicionar)
    api.addRota("/pessoas", "GET", pessoaControle.listar)
    api.addRota("/pessoas/:id", "GET", pessoaControle.buscar)

    LivroApi.build(api)
    api.start()
}

main()