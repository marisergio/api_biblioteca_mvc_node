import { Livro, LivroProps } from "../modelo/livro";
import conexao from "../util/conexao";
import { ResultSetHeader, RowDataPacket } from "mysql2";

export class LivroDao {
    public async salvar(livro: Livro) {
        try {
            const { id, titulo, autor, quantidade } = livro
            await conexao.query('INSERT INTO livro(id, titulo, autor, quantidade) VALUES(?, ?, ?, ?)', [id, titulo, autor, quantidade])
        } catch (error) {
            throw error
        }

    }

    public async listar(): Promise<Livro[]> {
        try {
            const [result] = await conexao.query<LivroProps[] & RowDataPacket[]>('SELECT * FROM livro')

            const livros: Livro[] = result.map((l) => {
                const { id, titulo, autor, quantidade } = l
                return Livro.construir(id, titulo, autor, quantidade)
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
            const { titulo, autor, quantidade } = result
            const livro = Livro.construir(id, titulo, autor, quantidade)
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

    public async atualizar(livro: Livro): Promise<boolean>  {
        try {
            const { id, titulo, autor, quantidade } = livro
            await conexao.query('UPDATE livro SET titulo=?, autor=?, quantidade=? WHERE id=?', [titulo, autor, quantidade, id])
            return true
        } catch (error) {
            console.log(error)
            throw new Error("Erro ao atualizar o livro.")
        }

    }
}