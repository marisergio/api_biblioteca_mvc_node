import { LivroDao } from "../dao/livro.dao";
import { LivroDtoCreate, LivroListarDto } from "../dto/livro.dto";
import { Livro, LivroProps } from "../modelo/livro";
import { LivroInterfaceServico } from "./livro.interface.servico";

export class LivroServico implements LivroInterfaceServico {
    public constructor(readonly livroDao: LivroDao) { }

    public async salvar(livroDto: LivroDtoCreate): Promise<string> {
        const livro = Livro.build(livroDto.titulo, livroDto.autor)
        await this.livroDao.salvar(livro)
        return livro.props.id;
    }

    public async listar(): Promise<LivroListarDto[]> {
        const livros: Livro[] = await this.livroDao.listar()
        const livrosDto: LivroListarDto[] = livros.map((livro) => {
            const { id, titulo, autor } = livro.props
            return { id, titulo, autor };
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

    public async atualizar(livroDto: LivroProps): Promise<boolean> {
        const { id, titulo, autor, quantidade } = livroDto
        const livro = Livro.construir(id, titulo, autor, quantidade)
        try {
            return await this.livroDao.atualizar(livro)
        } catch (error) {
            throw error;
        }

    }

    /* public async emprestar(id: string): Promise<boolean> {
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
     }*/
}