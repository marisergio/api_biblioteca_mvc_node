import { LivroDao } from "../dao/livro.dao";
import { Livro, LivroProps } from "../modelo/livro";

export class LivroServico {
    private constructor(readonly livroDao: LivroDao) { }

    public static build() {
        return new LivroServico(new LivroDao())
    }

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
}