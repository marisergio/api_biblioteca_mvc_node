import { PessoaDao } from "../dao/pessoa.dao";
import { PessoaDtoCreate, PessoaListarDto } from "../dto/pessoa.dto";
import { Pessoa, PessoaProps } from "../modelo/pessoa";

export class PessoaServico {
    private constructor(readonly pessoaDao: PessoaDao) { }

    public static build() {
        return new PessoaServico(new PessoaDao())
    }

    public async salvar(pessoaDto: PessoaDtoCreate) {
        const pessoa = Pessoa.build(pessoaDto)
        await this.pessoaDao.salvar(pessoa)
        return pessoa.props;
    }

    public async listar(): Promise<PessoaListarDto[] | null> {
        const pessoasDto: PessoaListarDto[] | null = await this.pessoaDao.listar()
        if (pessoasDto) {
            return pessoasDto
        }
        return null
    }

    public async buscar(id: string): Promise<PessoaProps | null> {
        const pessoa: Pessoa | null = await this.pessoaDao.buscar(id)
        return pessoa?.props ?? pessoa
    }

    /*public async deletar(id: string): Promise<number> {
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
    }*/
}