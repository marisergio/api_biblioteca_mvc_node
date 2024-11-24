import { Request, Response } from "express"
import { PessoaServico } from "../servico/pessoa.servico"
import { PessoaDtoCreate } from "../dto/pessoa.dto"

export class PessoaControle {


    public adicionar(req: Request, res: Response) {
        const pessoaDto: PessoaDtoCreate = req.body
        const pessoa = PessoaServico.build().salvar(pessoaDto)
        res.status(201).json(pessoa).send()
    }

    public async listar(req: Request, res: Response) {
        const pessoasDto = await PessoaServico.build().listar()
        res.status(200).json(pessoasDto).send()
    }

    public async buscar(req: Request, res: Response) {
        const { id } = req.params
        const pessoa = await PessoaServico.build().buscar(id)
        res.status(200).json(pessoa).send()
    }

    /* public async deletar(req: Request, res: Response) {
         const { id } = req.params
         try {
             const linhasAfetadas = await LivroServico.build().deletar(id);
             if (linhasAfetadas === 0) {
                 return res.status(404).json({ mensagem: "Livro não encontrado" });
             }
 
             return res.status(200).json({ mensagem: "Livro deletado com sucesso" });
         } catch (error: Error) {
             // console.error(error); // Logar o erro para fins de depuração
             return res.status(500).json({ mensagem: error.message });
         }
     }
 
     public async atualizar(req: Request, res: Response) {
         try {
             const { id } = req.params
             const { titulo, autor, quantidade } = req.body
 
 
             const isAtualizado = await LivroServico.build().atualizar(id, titulo, autor, quantidade)
             if (!isAtualizado) {
                 return res.status(404).json({ mensagem: "Livro não encontrado" });
             }
 
             return res.status(200).json({ mensagem: "Livro atualizado com sucesso" });
         } catch (error: Error) {
             // console.error(error); // Logar o erro para fins de depuração
             return res.status(500).json({ mensagem: error.message });
         }
     }
 
     public async emprestar(req: Request, res: Response) {
         try {
             const { id } = req.params
 
             const isEmprestado = await LivroServico.build().emprestar(id)
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