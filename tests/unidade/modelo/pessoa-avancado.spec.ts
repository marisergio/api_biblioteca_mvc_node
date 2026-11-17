import { describe, test, expect } from "vitest";
import { Pessoa } from "../../../src/modelo/pessoa";
import { Cidade } from "../../../src/modelo/cidade";
import { Estado } from "../../../src/modelo/estado";

describe("Pessoa (modelo de domínio) - Validações avançadas", () => {

  test("deve permitir construir pessoa com relacionamento de Cidade", () => {
    const estado = new Estado(1, "São Paulo");
    const cidade = new Cidade(1, "São Paulo", estado);

    const pessoa = Pessoa.assemble(
      "123",
      "João Silva",
      new Date("1990-01-15"),
      "M",
      "12345678901",
      "11999999999",
      "joao@example.com",
      "Rua A",
      "123",
      "Centro",
      "12345678",
      cidade
    );

    expect(pessoa.cidade).toBe(cidade);
    expect(pessoa.cidade?.nome).toBe("São Paulo");
    expect(pessoa.cidade?.estado.nome).toBe("São Paulo");
  });

  test("deve permitir construir pessoa sem Cidade", () => {
    const pessoa = Pessoa.assemble(
      "456",
      "Maria Santos",
      new Date("1995-05-20"),
      "F",
      "98765432101",
      "11988888888",
      "maria@example.com",
      "Rua B",
      "456",
      "Bairro X",
      "87654321"
    );

    expect(pessoa.cidade).toBeUndefined();
  });

  test("sexo deve aceitar apenas M, F ou O", () => {
    const pessoa1 = Pessoa.assemble("1", "P1", undefined, "M");
    const pessoa2 = Pessoa.assemble("2", "P2", undefined, "F");
    const pessoa3 = Pessoa.assemble("3", "P3", undefined, "O");

    expect(pessoa1.sexo).toBe("M");
    expect(pessoa2.sexo).toBe("F");
    expect(pessoa3.sexo).toBe("O");
  });

  test("deve permitir build com dados parciais", () => {
    const pessoa = Pessoa.build({
      nome: "Ana"
    });

    expect(pessoa.nome).toBe("Ana");
    expect(pessoa.sexo).toBeUndefined();
    expect(pessoa.cpf).toBeUndefined();
    expect(pessoa.email).toBeUndefined();
  });

  test("deve retornar undefined para campos opcionais não preenchidos", () => {
    const pessoa = Pessoa.assemble("xyz", "Carlos");

    expect(pessoa.nascimento).toBeUndefined();
    expect(pessoa.sexo).toBeUndefined();
    expect(pessoa.cpf).toBeUndefined();
    expect(pessoa.celular).toBeUndefined();
    expect(pessoa.email).toBeUndefined();
    expect(pessoa.logradouro).toBeUndefined();
    expect(pessoa.numero).toBeUndefined();
    expect(pessoa.bairro).toBeUndefined();
    expect(pessoa.cep).toBeUndefined();
    expect(pessoa.cidade).toBeUndefined();
  });

  test("ID gerado deve estar no formato UUID", () => {
    const pessoa = Pessoa.build({ nome: "Teste UUID" });
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

    expect(pessoa.id).toMatch(uuidRegex);
  });

  test("deve retornar props completas com todos os campos", () => {
    const estado = new Estado(2, "Rio de Janeiro");
    const cidade = new Cidade(2, "Rio de Janeiro", estado);
    
    const pessoa = Pessoa.assemble(
      "prop-test",
      "Teste Props",
      new Date("1985-06-10"),
      "M",
      "44455566677",
      "21987654321",
      "teste@example.com",
      "Avenida Principal",
      "999",
      "Copacabana",
      "20000000",
      cidade
    );

    expect(pessoa.props.id).toBe("prop-test");
    expect(pessoa.props.nome).toBe("Teste Props");
    expect(pessoa.props.sexo).toBe("M");
    expect(pessoa.props.cpf).toBe("44455566677");
    expect(pessoa.props.celular).toBe("21987654321");
    expect(pessoa.props.email).toBe("teste@example.com");
    expect(pessoa.props.logradouro).toBe("Avenida Principal");
    expect(pessoa.props.numero).toBe("999");
    expect(pessoa.props.bairro).toBe("Copacabana");
    expect(pessoa.props.cep).toBe("20000000");
    expect(pessoa.props.cidade).toBe(cidade);
  });

  test("deve diferenciar entre cidade_id e cidade object", () => {
    const estado = new Estado(1, "São Paulo");
    const cidade = new Cidade(1, "São Paulo", estado);

    const pessoaComId = Pessoa.build({
      nome: "Teste",
      cidade_id: 1
    });

    const pessoaComObjeto = Pessoa.assemble("123", "Teste", undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, cidade);

    expect(pessoaComId.cidade_id).toBe(1);
    expect(pessoaComId.cidade).toBeUndefined();

    expect(pessoaComObjeto.cidade).toBe(cidade);
    expect(pessoaComObjeto.cidade_id).toBeUndefined();
  });

  test("múltiplas pessoas podem estar associadas à mesma cidade", () => {
    const estado = new Estado(1, "São Paulo");
    const cidade = new Cidade(1, "São Paulo", estado);

    const pessoa1 = Pessoa.assemble("p1", "João", undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, cidade);
    const pessoa2 = Pessoa.assemble("p2", "Maria", undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, cidade);

    expect(pessoa1.cidade).toBe(pessoa2.cidade);
    expect(pessoa1.id).not.toBe(pessoa2.id);
  });
});
