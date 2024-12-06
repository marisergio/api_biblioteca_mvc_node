import { Request, Response } from "express"
import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { EmprestimoServico } from "../servico/emprestimo.servico";
import { EmprestimoDtoCreate } from "../dto/emprestimo.dto";

export class EmprestimoControle {

    public constructor(readonly emprestimoService: EmprestimoServico) { }

    public async emprestar(req: Request, res: Response) {

        const emprestimoDto = plainToInstance(EmprestimoDtoCreate, req.body);

        const erros = await validate(emprestimoDto);

        if (erros.length > 0) {
            return res.status(400).json({ errors: erros.map(err => err.constraints) });
        }

        try {
            const emprestimo = await this.emprestimoService.emprestar(emprestimoDto)
            res.status(201).json(emprestimo).send()
        } catch (error) {
            return res.status(500).json({ mensagem: error });
        }
    }
}