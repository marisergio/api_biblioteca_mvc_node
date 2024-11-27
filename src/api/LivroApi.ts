import { LivroControle } from "../controle/livro.controle";
import { LivroDao } from "../dao/livro.dao";
import { LivroServico } from "../servico/livro.servico";
import { Api } from "./api";

export class LivroApi {
    readonly livroControle: LivroControle;

    private constructor(readonly api: Api) {
        this.livroControle = new LivroControle(new LivroServico(new LivroDao()));
    }

    public static build(api: Api) {
        const apiLivro = new LivroApi(api)
        apiLivro.addRotas()
    }

    public addRotas() {
        this.api.addRota("/livros", "POST", this.livroControle.atualizar.bind(this.livroControle))
        this.api.addRota("/livros", "GET", this.livroControle.listar.bind(this.livroControle))
        this.api.addRota("/livros/:id", "GET", this.livroControle.buscar.bind(this.livroControle))
        this.api.addRota("/livros/:id", "DELETE", this.livroControle.deletar.bind(this.livroControle))
        this.api.addRota("/livros/:id", "PUT", this.livroControle.atualizar.bind(this.livroControle))
        this.api.addRota("/livros/emprestar/:id", "PATCH", this.livroControle.emprestar.bind(this.livroControle))
    }
}