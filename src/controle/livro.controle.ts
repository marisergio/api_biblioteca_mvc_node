import { Request, Response } from "express"
import { LivroServico } from "../servico/livro.servico"
import { LivroInterfaceServico } from "../servico/livro.interface.servico"
import { LivroDtoCreate } from "../dto/livro.dto"
import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';

export class LivroControle {

    public constructor(readonly livroService: LivroInterfaceServico) { }

    public async adicionar(req: Request, res: Response) {

        const livroDto = plainToInstance(LivroDtoCreate, req.body);

        const erros = await validate(livroDto);

        if (erros.length > 0) {
            return res.status(400).json({ errors: erros.map(err => err.constraints) });
        }

        try {
            const livro = await this.livroService.salvar(livroDto)
            res.status(201).json(livro).send()
        } catch (error) {
            return res.status(500).json({ mensagem: error });
        }
    }

    public async listar(req: Request, res: Response) {
        try {
            const livros = await this.livroService.listar()
            res.status(200).json(livros).send()
        } catch (error) {
            return res.status(500).json({ mensagem: error });
        }
    }

    public async buscar(req: Request, res: Response) {
        try {
            const { id } = req.params
            const livro = await this.livroService.buscar(id)
            res.status(200).json(livro).send()
        } catch (error) {
            return res.status(500).json({ mensagem: error });
        }
    }

    public async deletar(req: Request, res: Response) {
        const { id } = req.params
        try {
            const linhasAfetadas = await this.livroService.deletar(id);
            if (linhasAfetadas === 0) {
                return res.status(404).json({ mensagem: "Livro não encontrado" });
            }

            return res.status(200).json({ mensagem: "Livro deletado com sucesso" });
        } catch (error) {
            // console.error(error); // Logar o erro para fins de depuração
            return res.status(500).json({ mensagem: error });
        }
    }

    public async atualizar(req: Request, res: Response) {
        try {
            const { id } = req.params
            const { titulo, autor, quantidade } = req.body


            const isAtualizado = await this.livroService.atualizar({ id, titulo, autor, quantidade })
            if (!isAtualizado) {
                return res.status(404).json({ mensagem: "Livro não encontrado" });
            }

            return res.status(200).json({ mensagem: "Livro atualizado com sucesso" });
        } catch (error) {
            // console.error(error); // Logar o erro para fins de depuração
            return res.status(500).json({ mensagem: error });
        }
    }

    /*public async emprestar(req: Request, res: Response) {
        try {
            const { id } = req.params

            const isEmprestado = await this.livroService.emprestar(id)
            if (!isEmprestado) {
                return res.status(404).json({ mensagem: "Operação falhou" });
            }

            return res.status(200).json({ mensagem: "Livro emprestado com sucesso" });
        } catch (error: Error) {
            // console.error(error); // Logar o erro para fins de depuração
            return res.status(500).json({ mensagem: error.message });
        }
    }*/
}