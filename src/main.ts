import { Api } from "./api/api";
import { LivroControle } from "./controle/livro.controle";

function main() {
    const api = Api.build()
    const livroControle = new LivroControle()
    api.addRota("/livros", "POST", livroControle.adicionar)
    api.addRota("/livros", "GET", livroControle.listar)
    api.addRota("/livros/:id", "GET", livroControle.buscar)
    api.addRota("/livros/:id", "DELETE", livroControle.deletar)
    api.start()
}

main()