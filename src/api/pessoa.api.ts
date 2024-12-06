import { PessoaControle } from "../controle/pessoa.controle";
import { PessoaDao } from "../dao/pessoa.dao";
import { PessoaServico } from "../servico/pessoa.servico";
import { Api } from "./api";

export class PessoaApi {
    readonly pessoaControle: PessoaControle;

    private constructor(readonly api: Api) {
        this.pessoaControle = new PessoaControle(new PessoaServico(new PessoaDao()));
    }

    public static build(api: Api) {
        const apiPessoa = new PessoaApi(api)
        apiPessoa.addRotas()
    }

    public addRotas() {
        this.api.addRota("/pessoas", "POST", this.pessoaControle.adicionar.bind(this.pessoaControle))
        this.api.addRota("/pessoas", "GET", this.pessoaControle.listar.bind(this.pessoaControle))
        this.api.addRota("/pessoas/:id", "GET", this.pessoaControle.buscar.bind(this.pessoaControle))
    }
}