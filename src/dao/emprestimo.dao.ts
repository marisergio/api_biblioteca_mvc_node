import { RowDataPacket } from "mysql2";
import conexao from "../util/conexao";
import { GenericDao } from "./generic.dao";
import { Emprestimo } from "../modelo/emprestimo";
import { Pessoa } from "../modelo/pessoa";
import { Livro } from "../modelo/livro";

export class EmprestimoDao implements GenericDao<Emprestimo>{

    public async salvar(emprestimo: Emprestimo): Promise<boolean> {
        try {
            const { id, leitor_id, livro_id, data, status } = emprestimo
            await conexao.query('INSERT INTO emprestimo(id, leitor_id, livro_id, data, status) VALUES(?, ?, ?, ?,?)', [id, leitor_id, livro_id, data, status])
        } catch (error) {
            throw error
        }
        return true;
    }

    public async buscar(id: string): Promise<Emprestimo | null> {
        try {
            const [[result]] = await conexao.query<RowDataPacket[]>(
                'SELECT e.*, p.nome, l.titulo FROM emprestimo e INNER JOIN pessoa p ON(e.leitor_id=p.id) INNER JOIN livro l ON(l.id=e.livro_id) WHERE e.id=?',
                [id])
            if (!result) {
                return null
            }

            const { nome, titulo, leitor_id, livro_id, created_at, updated_at, status, data, data_prevista, data_entrega } = result


            const leitor = Pessoa.assemble(leitor_id, nome)
            const livro = Livro.construir(livro_id, titulo)
            const emprestimo = Emprestimo.assemble({ id, leitor, livro, leitor_id, livro_id, created_at, updated_at, status, data, data_prevista, data_entrega })
            return emprestimo

        } catch (error) {
            throw error
        }
    }

    public async buscarQtdePorLeitor(leitor_id: string): Promise<number | null> {
        try {
            const [[result]] = await conexao.query<RowDataPacket[]>(
                'SELECT count(*) qtde FROM emprestimo WHERE leitor_id=? and status=0',
                [leitor_id])
            if (!result) {
                return null
            }
            const { qtde } = result
            return qtde

        } catch (error) {
            throw error
        }
    }

    public async buscarQtdePorLivro(livro_id: string): Promise<number | null> {
        try {
            const [[result]] = await conexao.query<RowDataPacket[]>(
                'SELECT count(*) qtde FROM emprestimo WHERE livro_id=? and status=0',
                [livro_id])
            if (!result) {
                return null
            }
            const { qtde } = result
            return qtde

        } catch (error) {
            throw error
        }
    }

    public async atualizar(id: string, item: Partial<Emprestimo>): Promise<Emprestimo | null> {
        return null;
    }

    public async delete(id: string): Promise<boolean> {
        return true;
    }

    public async listar(): Promise<Emprestimo[] | null> {
        try {
            const [pessoasDto] = await conexao.query<Emprestimo[] & RowDataPacket[]>(
                'SELECT id, nome, cpf FROM pessoa'
            );
            if (pessoasDto.length === 0) {
                return null;
            }

            return pessoasDto;
        } catch (error) {
            console.error('Erro ao listar pessoas:', error);
            throw error;
        }
    }

}