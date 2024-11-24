export interface GenericDao<T> {
    salvar(intem: T): Promise<T | boolean>;
    buscar(id: string): Promise<T | null>;
    atualizar(id: string, item: Partial<T>): Promise<T | null>;
    delete(id: string): Promise<boolean>;
    listar(): Promise<any>;
}