import { LivroDao } from "../dao/livro.dao";
import { LivroDtoCreate, LivroListarDto } from "../dto/livro.dto";
import { Livro, LivroProps } from "../modelo/livro";
import { LivroInterfaceServico } from "./livro.interface.servico";

export class LivroServico implements LivroInterfaceServico {
    public constructor(readonly livroDao: LivroDao) { }

    public async salvar(livroDto: LivroDtoCreate): Promise<string> {
        try {
            const livro = Livro.build(livroDto.titulo, livroDto.autor, livroDto.editora, livroDto.anoLancamento)
            await this.livroDao.salvar(livro)
            return livro.props.id;
        } catch (error) {
            throw error
        }
    }

    public async listar(): Promise<LivroListarDto[]> {
        try {
            const livrosDto: LivroListarDto[] = await this.livroDao.listar()
            return livrosDto
        } catch (error) {
            throw error
        }
    }

    public async buscar(id: string): Promise<LivroProps | null> {
        try {
            const livro: Livro | null = await this.livroDao.buscar(id)
            return livro?.props ?? livro
        } catch (error) {
            throw error
        }
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
        const { id, titulo, autor, editora, anoLancamento, quantidade } = livroDto
        const livro = Livro.construir(id, titulo, autor, editora, anoLancamento, quantidade)
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