import { RowDataPacket } from "mysql2";
import { Pessoa, PessoaProps } from "../modelo/pessoa";
import conexao from "../util/conexao";
import { GenericDao } from "./generic.dao";
import { PessoaListarDto } from "../dto/pessoa.dto";
import { Cidade } from "../modelo/cidade";
import { Estado } from "../modelo/estado";

export class PessoaDao implements GenericDao<Pessoa>{
    public async salvar(pessoa: Pessoa): Promise<boolean> {
        try {
            const { id, nome, nascimento, sexo, cpf, celular, email, logradouro, numero, bairro, cep, cidade_id } = pessoa
            await conexao.query('INSERT INTO pessoa(id, nome, nascimento, sexo, cpf, celular, email, logradouro, numero, bairro, cep, cidade_id) VALUES(?, ?, ?, ?,?, ?, ?, ?,?, ?, ?, ?)', [id, nome, nascimento, sexo, cpf, celular, email, logradouro, numero, bairro, cep, cidade_id])
        } catch (error) {
            throw error
        }
        return true;
    }

    public async buscar(id: string): Promise<Pessoa | null> {
        try {
            const [[result]] = await conexao.query<RowDataPacket[]>(
                'SELECT ' +
                'p.*, c.nome as nomeCidade, c.estado_id, e.nome as nomeEstado ' +
                'FROM ' +
                'pessoa p ' +
                'INNER JOIN ' +
                'cidade c ON(c.id=p.cidade_id) ' +
                'INNER JOIN ' +
                'estado e ON(e.id=c.estado_id) ' +
                'WHERE ' +
                'p.id = ?',
                [id])
            if (!result) {
                return null
            }

            const { nome, nomeCidade, nomeEstado, estado_id, nascimento, sexo, cpf, celular, email, logradouro, numero, bairro, cep, cidade_id } = result

            const cidade = new Cidade(cidade_id, nomeCidade, new Estado(estado_id, nomeEstado));
            const pessoa = Pessoa.assemble(id, nome, nascimento, sexo, cpf, celular, email, logradouro, numero, bairro, cep, cidade)
            return pessoa
        } catch (error) {
            throw error
        }
    }

    public async atualizar(id: string, item: Partial<Pessoa>): Promise<Pessoa | null> {
        return null;
    }

    public async delete(id: string): Promise<boolean> {
        return true;
    }

    public async listar(): Promise<PessoaListarDto[] | null> {
        try {
            const [pessoasDto] = await conexao.query<PessoaListarDto[]>(
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