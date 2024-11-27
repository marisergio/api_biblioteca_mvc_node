import { LivroDao } from "../dao/livro.dao";
import { Livro, LivroProps } from "../modelo/livro";

export class LivroServico {
    public constructor(readonly livroDao: LivroDao) { }

    public salvar(titulo: string, autor: string) {
        const livro = Livro.build(titulo, autor)
        this.livroDao.salvar(livro)
        return livro.props;
    }

    public async listar(): Promise<LivroProps[]> {
        const livros: Livro[] = await this.livroDao.listar()
        const livrosDto: LivroProps[] = livros.map((l) => {
            return l.props
        })
        return livrosDto
    }

    public async buscar(id: string): Promise<LivroProps | null> {
        const livro: Livro | null = await this.livroDao.buscar(id)
        return livro?.props ?? livro
    }

    public async deletar(id: string): Promise<number> {
        try {
            const qtdeLinhasDeletadas = await this.livroDao.deletar(id)
            return qtdeLinhasDeletadas
        } catch (error) {
            throw error;
        }

    }

    public async atualizar(id: string, titulo: string, autor: string, quantidade: number): Promise<boolean> {

        const livro = Livro.construir(id, titulo, autor, quantidade)
        try {
            return await this.livroDao.atualizar(livro)
        } catch (error) {
            throw error;
        }

    }

    public async emprestar(id: string): Promise<boolean> {
        try {
            let livro: Livro | null = await this.livroDao.buscar(id)
            if (livro) {
                const isEmprestado = livro.emprestar()
                if (isEmprestado) {
                    return await this.livroDao.atualizar(livro)
                }
                return false
            }
            return false;
        } catch (error) {
            throw error
        }
    }
}