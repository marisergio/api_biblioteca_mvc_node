import 'reflect-metadata';
import { Api } from "./api/api";
import { LivroApi } from './api/livro.api';
import { EmprestimoApi } from './api/emprestimo.api';
import { PessoaApi } from './api/pessoa.api';

function main() {
    const api = Api.build()

    PessoaApi.build(api)
    LivroApi.build(api)
    EmprestimoApi.build(api)

    api.start()
}

main()