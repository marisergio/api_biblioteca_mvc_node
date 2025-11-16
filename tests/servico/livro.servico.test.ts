import { LivroDao } from "../../src/dao/livro.dao";
import { LivroDtoCreate, LivroListarDto } from "../../src/dto/livro.dto";
import { Livro } from "../../src/modelo/livro";
import { LivroServico } from "../../src/servico/livro.servico";

//cria um mock do livroDao - substitui os metodos reais por funcoes simuladas - execução
jest.mock('../../src/dao/livro.dao');

describe('LivroServico', () => {
    //definir o tipo typescript do mock - compilação
    let livroDaoMock: jest.Mocked<LivroDao>;
    let livroServico: LivroServico;
    beforeEach(() => {
        // Configuração antes de cada teste, se necessário

        //cria uma nova instância do mock antes de cada teste
        livroDaoMock = new LivroDao() as jest.Mocked<LivroDao>;
        livroServico = new LivroServico(livroDaoMock);
    });

    it('deve salvar um livro corretamente', async () => {
        // Teste de exemplo para o método salvar

        // Simula o comportamento do método salvar do DAO resolve sem erro
        livroDaoMock.salvar.mockResolvedValueOnce(undefined as any);

        const livroDto: LivroDtoCreate =
        {
            titulo: 'Título Exemplo',
            autor: 'Autor Exemplo',
            editora: 'Editora Exemplo',
            anoLancamento: 2023
        };

        const id = await livroServico.salvar(livroDto);

        //espera que o método salvar do mock tenha sido chamado uma vez 
        // com um objeto do tipo Livro
        expect(livroDaoMock.salvar).toHaveBeenCalledTimes(1);
        expect(livroDaoMock.salvar).toHaveBeenCalledWith(expect.any(Livro));

        //verifica se o id retornado é uma string
        expect(typeof id).toBe('string');
    });

    it('deve listar os livros corretamente', async () => {
        const livros = [
            Livro.build('Livro 1', 'Autor 1', 'Editora 1', 2020),
            Livro.build('Livro 2', 'Autor 2', 'Editora 2', 2021),
        ]

        livroDaoMock.listar.mockResolvedValueOnce(livros.map((livro) => {
            const { id, titulo, autor } = livro
            return { id, titulo, autor }
        }));

        const livrosListarDto: LivroListarDto[] = livros.map((livro) => {
            const { id, titulo, autor } = livro
            return { id, titulo, autor }
        })


        const resultado = await livroServico.listar();

        //Verifica quantas vezes o mock foi chamado
        expect(livroDaoMock.listar).toHaveBeenCalledTimes(1)

        //verifica se retorna uma lista de livroListarDto
        expect(resultado).toEqual(livrosListarDto)


    });

    it('deve buscar um livro por id corretamente', async () => {
        const livro = Livro.build('Livro 1', 'Autor 1', 'Editora 1', 2020);
        livroDaoMock.buscar.mockResolvedValueOnce(livro);

        const resultado = await livroServico.buscar(livro.id);

        expect(resultado).toEqual(livro.props);
        expect(livroDaoMock.buscar).toHaveBeenCalledTimes(1);
        expect(livroDaoMock.buscar).toHaveBeenCalledWith(livro.id);
    });

    it('deve deletar um livro por id corretamente', async () => {

        livroDaoMock.deletar.mockResolvedValueOnce(1);

        const result = livroServico.deletar("4ddf56");

        expect(result).resolves.toBe(1);
        expect(livroDaoMock.deletar).toHaveBeenCalledTimes(1);
        expect(livroDaoMock.deletar).toHaveBeenCalledWith("4ddf56");
    });

    it('deve atualizar um livro corretamente', async () => {
        const livro = Livro.build('Livro 1', 'Autor 1', 'Editora 1', 2020);
        livroDaoMock.atualizar.mockResolvedValueOnce(true);

        const result = await livroServico.atualizar(livro.props);

        expect(result).toBe(true);
        expect(livroDaoMock.atualizar).toHaveBeenCalledTimes(1);
        expect(livroDaoMock.atualizar).toHaveBeenCalledWith(livro);
    });
});