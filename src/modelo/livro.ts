export type LivroProps = {
    id: string
    titulo: string
    autor: string
    quantidade: number
}

export class Livro {

    private constructor(readonly props: LivroProps) { }

    public static build(titulo: string, autor: string) {

        if (!titulo.trim()) throw new Error("Título não pode ser vazio");


        const props: LivroProps = {
            id: crypto.randomUUID().toString(),
            titulo,
            autor,
            quantidade: 0
        }

        return new Livro(props)
    }

    public static construir(id: string, titulo: string, autor: string, quantidade: number) {
        const props: LivroProps = {
            id,
            titulo,
            autor,
            quantidade
        }

        return new Livro(props)
    }

    public emprestar(): boolean {
        if (this.props.quantidade !== undefined && this.props.quantidade > 0) {
            this.props.quantidade--
            return true
        }
        return false
    }

    public get id() {
        return this.props.id
    }

    public get titulo() {
        return this.props.titulo
    }

    public get autor() {
        return this.props.autor
    }

    public get quantidade() {
        return this.props.quantidade
    }
}