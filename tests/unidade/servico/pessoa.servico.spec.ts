import { describe, test, expect, beforeEach, vi } from "vitest";
import { PessoaServico } from "../../../src/servico/pessoa.servico";
import { PessoaDao } from "../../../src/dao/pessoa.dao";
import { Pessoa } from "../../../src/modelo/pessoa";
import { PessoaDtoCreate } from "../../../src/dto/pessoa.dto";

vi.mock("../../../src/dao/pessoa.dao");

describe("PessoaServico", () => {
  let pessoaDaoMock: ReturnType<typeof vi.mocked<typeof PessoaDao>>;
  let service: PessoaServico;

  beforeEach(() => {
    pessoaDaoMock = new PessoaDao() as any;
    service = new PessoaServico(pessoaDaoMock);
  });

  test("deve salvar uma pessoa corretamente", async () => {
    pessoaDaoMock.salvar.mockResolvedValueOnce(undefined as any);

    const dto: PessoaDtoCreate = {
      nome: "João Silva",
      nascimento: new Date("1990-01-15"),
      sexo: "M",
      cpf: "12345678901",
      celular: "11999999999",
      email: "joao@example.com",
      logradouro: "Rua A",
      numero: "123",
      bairro: "Centro",
      cep: "12345678",
      cidade_id: 1
    };

    const resultado = await service.salvar(dto);

    expect(pessoaDaoMock.salvar).toHaveBeenCalledTimes(1);
    expect(pessoaDaoMock.salvar).toHaveBeenCalledWith(expect.any(Pessoa));
    expect(resultado).toBeDefined();
    expect(resultado.nome).toBe("João Silva");
  });

  test("deve listar pessoas corretamente", async () => {
    const pessoas = [
      { id: "1", nome: "Maria", cpf: "11122233344" },
      { id: "2", nome: "Pedro", cpf: "55566677788" }
    ];

    pessoaDaoMock.listar.mockResolvedValueOnce(pessoas);

    const resultado = await service.listar();

    expect(resultado).toEqual(pessoas);
    expect(pessoaDaoMock.listar).toHaveBeenCalledTimes(1);
  });

  test("deve retornar null se não houver pessoas", async () => {
    pessoaDaoMock.listar.mockResolvedValueOnce(null);

    const resultado = await service.listar();

    expect(resultado).toBeNull();
  });

  test("deve buscar uma pessoa por id", async () => {
    const pessoa = Pessoa.assemble(
      "123",
      "Ana Costa",
      new Date("1995-05-20"),
      "F",
      "98765432101",
      "11988888888",
      "ana@example.com"
    );

    pessoaDaoMock.buscar.mockResolvedValueOnce(pessoa);

    const resultado = await service.buscar("123");

    expect(resultado).toEqual(pessoa.props);
    expect(pessoaDaoMock.buscar).toHaveBeenCalledWith("123");
  });

  test("deve retornar null se pessoa não encontrada", async () => {
    pessoaDaoMock.buscar.mockResolvedValueOnce(null);

    const resultado = await service.buscar("id-inexistente");

    expect(resultado).toBeNull();
  });

  test("deve lançar erro se salvar falhar", async () => {
    pessoaDaoMock.salvar.mockRejectedValueOnce(new Error("Erro ao salvar"));

    const dto: PessoaDtoCreate = {
      nome: "Carlos",
      nascimento: new Date("1980-01-01"),
      sexo: "M",
      cpf: "12345678901",
      celular: "11999999999",
      email: "carlos@example.com",
      logradouro: "Rua",
      numero: "1",
      bairro: "Bairro",
      cep: "12345678"
    };

    await expect(service.salvar(dto)).rejects.toThrow("Erro ao salvar");
  });

  test("deve retornar props da pessoa encontrada", async () => {
    const pessoa = Pessoa.assemble(
      "abc",
      "Test Person",
      new Date("2000-01-01"),
      "M",
      "11111111111",
      "11912345678",
      "test@example.com",
      "Rua Test",
      "10",
      "Bairro Test",
      "12345678"
    );

    pessoaDaoMock.buscar.mockResolvedValueOnce(pessoa);

    const resultado = await service.buscar("abc");

    expect(resultado).toBeDefined();
    expect(resultado?.id).toBe("abc");
    expect(resultado?.nome).toBe("Test Person");
    expect(resultado?.email).toBe("test@example.com");
  });

  test("deve chamar dao.listar quando listar", async () => {
    const pessoas = [
      { id: "1", nome: "Person 1", cpf: "11111111111" }
    ];

    pessoaDaoMock.listar.mockResolvedValueOnce(pessoas);

    await service.listar();

    expect(pessoaDaoMock.listar).toHaveBeenCalledTimes(1);
  });
});
