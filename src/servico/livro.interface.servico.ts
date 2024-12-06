import { LivroDtoCreate, LivroListarDto } from "../dto/livro.dto";
import { LivroProps } from "../modelo/livro";

export interface LivroInterfaceServico {
    salvar(livroDto: LivroDtoCreate): Promise<String>
    listar(): Promise<LivroListarDto[]>
    buscar(id: string): Promise<LivroProps | null>
    deletar(id: string): Promise<number>
    atualizar(livroDto: LivroProps): Promise<boolean>
}