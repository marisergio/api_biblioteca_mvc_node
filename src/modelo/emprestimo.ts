import { EmprestimoDtoCreate } from "../dto/emprestimo.dto"
import { Livro } from "./livro"
import { Pessoa } from "./pessoa"

export type EmprestimoProps = {
    id: string,
    leitor?: Pessoa,
    livro?: Livro,
    leitor_id: string,
    livro_id: string,
    created_at?: Date,
    updated_at?: Date,
    status: string,
    data: Date,
    data_prevista?: Date,
    data_entrega?: Date
}

export class Emprestimo {

    private constructor(readonly props: EmprestimoProps) { }

    public static build({ leitor_id, livro_id, data }: EmprestimoDtoCreate) {
        return new Emprestimo({
            id: crypto.randomUUID().toString(),
            leitor_id,
            livro_id,
            data,
            status: '0',
        })

    }

    public static assemble({
        id,
        leitor,
        livro,
        leitor_id,
        livro_id,
        created_at,
        updated_at,
        status,
        data,
        data_prevista,
        data_entrega }: EmprestimoProps) {
        return new Emprestimo({
            id,
            leitor,
            livro,
            leitor_id,
            livro_id,
            created_at,
            updated_at,
            status,
            data,
            data_prevista,
            data_entrega,
        })

    }

    public get id() {
        return this.props.id
    }

    public get leitor_id() {
        return this.props.leitor_id
    }

    public get livro_id() {
        return this.props.livro_id
    }

    public get status() {
        return this.props.status
    }

    public get data() {
        return this.props.data
    }

    public get data_prevista() {
        return this.props.data_prevista
    }

    public get data_entrega() {
        return this.props.data_entrega
    }

    public get leitor() {
        return this.props.leitor
    }

    public get livro() {
        return this.props.livro
    }

}