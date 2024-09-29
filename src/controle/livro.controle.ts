import { Request, Response } from "express"
import { LivroServico } from "../servico/livro.servico"

export class LivroControle {


    public adicionar(req: Request, res: Response) {
        const { titulo, autor } = req.body
        const livro = LivroServico.build().salvar(titulo, autor)
        res.status(201).json(livro).send()
    }

    public async listar(req: Request, res: Response) {
        const livros = await LivroServico.build().listar()
        res.status(200).json(livros).send()
    }

    public async buscar(req: Request, res: Response) {
        const { id } = req.params
        const livro = await LivroServico.build().buscar(id)
        res.status(200).json(livro).send()
    }

    public async deletar(req: Request, res: Response) {
        const { id } = req.params
        try {

            const linhasAfetadas = await LivroServico.build().deletar(id);
            console.log("id: " + id)
            if (linhasAfetadas === 0) {
                return res.status(404).json({ mensagem: "Livro não encontrado" });
            }

            return res.status(200).json({ mensagem: "Livro deletado com sucesso" });
        } catch (error: Error) {
            // console.error(error); // Logar o erro para fins de depuração
            return res.status(500).json({ mensagem: error.message });
        }
    }
}