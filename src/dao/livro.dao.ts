import { LivroListarDto } from "../dto/livro.dto";
import { Livro, LivroProps } from "../modelo/livro";
import conexao from "../util/conexao";
import { ResultSetHeader, RowDataPacket } from "mysql2";

export class LivroDao {
    public async salvar(livro: Livro): Promise<void> {
        try {
            const { id, titulo, autor, editora, anoLancamento, quantidade } = livro
            await conexao.query('INSERT INTO livro(id, titulo, autor, editora, ano_lancamento, quantidade) VALUES(?, ?, ?, ?, ?, ?)', [id, titulo, autor, editora, anoLancamento, quantidade])
        } catch (error) {
            throw error
        }
    }

    public async listar(): Promise<LivroListarDto[]> {
        try {
            const [result] = await conexao.query<LivroProps[] & RowDataPacket[]>('SELECT * FROM livro')

            const livros: LivroListarDto[] = result.map((l) => {
                const { id, titulo, autor } = l
                return {id, titulo, autor}
            })
            return livros
        } catch (error) {
            throw error
        }
    }

    public async buscar(id: string): Promise<Livro | null> {
        try {
            const [[result]] = await conexao.query<LivroProps & RowDataPacket[]>("SELECT * FROM livro WHERE id=?", [id])
            if (!result) {
                return null
            }
            const { titulo, autor, editora, ano_lancamento, quantidade } = result
            const livro = Livro.construir(id, titulo, autor, editora, ano_lancamento, quantidade)
            return livro
        } catch (error) {
            throw error
        }
    }

    public async deletar(id: string): Promise<number> {
        try {
            const [result]: [ResultSetHeader, any] = await conexao.execute("DELETE FROM livro WHERE id=?", [id])
            return result.affectedRows
        } catch (error) {
            console.log(error)
            throw new Error("Erro ao deletar o livro.")
        }
    }

    public async atualizar(livro: Livro): Promise<boolean> {
        try {
            const { id, titulo, autor, editora, anoLancamento } = livro
            await conexao.query('UPDATE livro SET titulo=?, autor=?, editora=?, ano_lancamento=? WHERE id=?', [titulo, autor, editora, anoLancamento, id])
            return true
        } catch (error) {
            console.log(error)
            throw new Error("Erro ao atualizar o livro.")
        }

    }
}