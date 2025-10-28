import { LivroServico } from "../../src/servico/livro.servico";
import { LivroDao } from "../../src/dao/livro.dao";
import { Livro } from "../../src/modelo/livro";

// Jest: cria um mock do LivroDao — substitui os métodos reais por funções simuladas
jest.mock("../../src/dao/livro.dao");

describe("LivroServico", () => {
    let livroDaoMock: jest.Mocked<LivroDao>;
    let service: LivroServico;

    beforeEach(() => {
        jest.clearAllMocks();
        // Jest: cria uma nova instância do mock antes de cada teste
        livroDaoMock = new LivroDao() as jest.Mocked<LivroDao>;
        service = new LivroServico(livroDaoMock);
    });

    test("deve salvar um livro corretamente", async () => {
        // Configura o comportamento do mock: simula que o método 'salvar' resolve sem erro
        livroDaoMock.salvar.mockResolvedValueOnce(undefined as any);

        const dto = { titulo: "O Hobbit", autor: "Tolkien", editora: "HarperCollins", anoLancamento: 1937 };
        const id = await service.salvar(dto);

        // Espera que o método salvar do DAO tenha sido chamado uma vez com um objeto Livro real
        expect(livroDaoMock.salvar).toHaveBeenCalledTimes(1);
        expect(livroDaoMock.salvar).toHaveBeenCalledWith(expect.any(Livro));

        // Verifica se o ID retornado é uma string UUID gerada de verdade
        expect(typeof id).toBe("string");
    });

    test("deve listar livros corretamente", async () => {
        // Cria instâncias reais de Livro
        const livros = [
            Livro.build("1984", "George Orwell", "Secker & Warburg", 1949),
            Livro.build("Dom Casmurro", "Machado de Assis", "Companhia das Letras", 1899),
        ];

        // Mocka o método listar do DAO para retornar esses livros
        livroDaoMock.listar.mockResolvedValueOnce(
            livros.map(l => {
                const { id, titulo, autor } = l.props;
                return { id, titulo, autor };
            })
        );

        const resultado = await service.listar();

        // Verifica se o resultado foi transformado corretamente em DTO
        expect(resultado).toEqual(
            livros.map(l => {
                const { id, titulo, autor } = l
                return { id, titulo, autor }
            }
            ));

        // Garante que o mock foi chamado
        expect(livroDaoMock.listar).toHaveBeenCalledTimes(1);
    });

    test("deve buscar um livro existente", async () => {
        const livro = Livro.build("Clean Code", "Robert C. Martin", "Prentice Hall", 2008);

        // Mocka o método buscar
        livroDaoMock.buscar.mockResolvedValueOnce(livro);

        const resultado = await service.buscar(livro.id);

        expect(resultado).toEqual(livro.props);
        expect(livroDaoMock.buscar).toHaveBeenCalledWith(livro.id);
    });

    test("deve retornar null se livro não encontrado", async () => {
        livroDaoMock.buscar.mockResolvedValueOnce(null);

        const resultado = await service.buscar("id-inexistente");
        expect(resultado).toBeNull();
    });

    test("deve atualizar um livro", async () => {
        const props = Livro.build("Antigo Título", "Autor X", "Editora Y", 2020).props;
        livroDaoMock.atualizar.mockResolvedValueOnce(true);

        const resultado = await service.atualizar(props);

        expect(resultado).toBe(true);
        expect(livroDaoMock.atualizar).toHaveBeenCalledTimes(1);
        expect(livroDaoMock.atualizar).toHaveBeenCalledWith(expect.any(Livro));
    });

    test("deve deletar um livro", async () => {
        livroDaoMock.deletar.mockResolvedValueOnce(1);

        const resultado = await service.deletar("123");
        expect(resultado).toBe(1);
        expect(livroDaoMock.deletar).toHaveBeenCalledWith("123");
    });
});
