import { EmprestimoControle } from "../controle/emprestimo.controle";
import { EmprestimoDao } from "../dao/emprestimo.dao";
import { LivroDao } from "../dao/livro.dao";
import { EmprestimoServico } from "../servico/emprestimo.servico";
import { Api } from "./api";

export class EmprestimoApi {
    readonly emprestimoControle: EmprestimoControle;

    private constructor(readonly api: Api) {
        this.emprestimoControle = new EmprestimoControle(new EmprestimoServico(new EmprestimoDao(), new LivroDao()));
    }

    public static build(api: Api) {
        const apiLivro = new EmprestimoApi(api)
        apiLivro.addRotas()
    }

    public addRotas() {
        this.api.addRota("/emprestimo", "POST", this.emprestimoControle.emprestar.bind(this.emprestimoControle))
        //ADD AS DEMAIS ROTAS AQUI
    }
}