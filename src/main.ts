import 'reflect-metadata';
import { Api } from "./api/api";
import { LivroControle } from "./controle/livro.controle";
import { PessoaControle } from "./controle/pessoa.controle";
import { LivroApi } from './api/LivroApi';

function main() {
    const api = Api.build()
    const pessoaControle = new PessoaControle()

    api.addRota("/pessoas", "POST", pessoaControle.adicionar)
    api.addRota("/pessoas", "GET", pessoaControle.listar)
    api.addRota("/pessoas/:id", "GET", pessoaControle.buscar)

    LivroApi.build(api)
    api.start()
}

main()