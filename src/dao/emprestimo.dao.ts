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
            await conexao.query('INSERT INTO emprestimos(id, leitor_id, livro_id, data, status) VALUES(?, ?, ?, ?,?)', [id, leitor_id, livro_id, data, status])
        } catch (error: unknown) {
            if (error instanceof Error) {
                throw new Error(`Erro ao salvar o empréstimo: ${error.message}`);
            } else {
                throw new Error('Erro desconhecido ao salvar o empréstimo');
            }
        }
        return true;
    }

    public async buscar(id: string): Promise<Emprestimo | null> {
        try {
            const [[result]] = await conexao.query<RowDataPacket[]>(
                'SELECT e.*, p.nome, l.titulo, l.autor, l.quantidade, l.editora, l.ano_lancamento FROM emprestimos e INNER JOIN pessoa p ON(e.leitor_id=p.id) INNER JOIN livro l ON(l.id=e.livro_id) WHERE e.id=?',
                [id])
            if (!result) {
                return null
            }

            const { editora, ano_lancamento, quantidade, autor, nome, titulo, leitor_id, livro_id, created_at, updated_at, status, data, data_prevista, data_entrega } = result


            const leitor = Pessoa.assemble(leitor_id, nome)
            const livro = Livro.construir(livro_id, titulo, autor, editora, ano_lancamento, quantidade)
            const emprestimo = Emprestimo.assemble({ id, leitor, livro, leitor_id, livro_id, created_at, updated_at, status, data, data_prevista, data_entrega })
            return emprestimo

        } catch (error) {
            throw error
        }
    }

    public async buscarQtdePorLeitor(leitor_id: string): Promise<number> {
        try {
            const [[result]] = await conexao.query<RowDataPacket[]>(
                'SELECT count(*) qtde FROM emprestimos WHERE leitor_id=? and status=0',
                [leitor_id])

            return result?.qtde ?? 0

        } catch (error) {
            throw error
        }
    }

    public async buscarQtdePorLivro(livro_id: string): Promise<number> {
        try {
            const [[result]] = await conexao.query<RowDataPacket[]>(
                'SELECT count(*) qtde FROM emprestimos WHERE livro_id=? and status=0',
                [livro_id]
            );

            return result?.qtde ?? 0;
        } catch (error) {
            throw error;
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