import { EmprestimoDao } from "../dao/emprestimo.dao";
import { LivroDao } from "../dao/livro.dao";
import { EmprestimoDtoCreate } from "../dto/emprestimo.dto";
import { Emprestimo } from "../modelo/emprestimo";

export class EmprestimoServico {

    public constructor(readonly emprestimoDao: EmprestimoDao) { }

    public async emprestar(emprestimoDto: EmprestimoDtoCreate) {
        const qtdeEmprestimosAtivos = await this.emprestimoDao.buscarQtdePorLeitor(emprestimoDto.leitor_id);
        if (qtdeEmprestimosAtivos != null && qtdeEmprestimosAtivos < 2) {
            const livroDao = new LivroDao();
            const livro = await livroDao.buscar(emprestimoDto.livro_id)
            const qtdeEmprestimosPorLivro = await this.emprestimoDao.buscarQtdePorLivro(emprestimoDto.livro_id)
            if(qtdeEmprestimosPorLivro!=null && livro?.quantidade != undefined && livro?.quantidade >qtdeEmprestimosPorLivro){
               
                const emprestimo = Emprestimo.build(emprestimoDto)

                await this.emprestimoDao.salvar(emprestimo)
            }
        }
    }



}