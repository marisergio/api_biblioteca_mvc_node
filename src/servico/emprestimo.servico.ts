import { EmprestimoDao } from "../dao/emprestimo.dao";
import { LivroDao } from "../dao/livro.dao";
import { EmprestimoDtoCreate } from "../dto/emprestimo.dto";
import { Emprestimo } from "../modelo/emprestimo";

export class EmprestimoServico {

    public constructor(readonly emprestimoDao: EmprestimoDao, readonly livroDao: LivroDao) { }

    public async emprestar(emprestimoDto: EmprestimoDtoCreate) {
        const qtdeEmprestimosAtivos = await this.emprestimoDao.buscarQtdePorLeitor(emprestimoDto.leitor_id);
        if (qtdeEmprestimosAtivos > 2) {
            throw new Error("Erro: leitor já possui 2 empréstimos.")
        }

        const livro = await this.livroDao.buscar(emprestimoDto.livro_id)
        const qtdeEmprestimosPorLivro = await this.emprestimoDao.buscarQtdePorLivro(emprestimoDto.livro_id)

        if (livro && livro.quantidade <= qtdeEmprestimosPorLivro) {
            throw new Error("Erro: este livro não está disponível.")
        }

        try {
            const emprestimo = Emprestimo.build(emprestimoDto)
            await this.emprestimoDao.salvar(emprestimo)
        } catch (error) {
            throw error;
        }

    }

}