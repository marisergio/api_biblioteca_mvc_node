import { describe, test, expect } from "vitest";
import { Pessoa } from "../../../src/modelo/pessoa";

describe("Pessoa (modelo de domínio)", () => {

  test("deve construir uma pessoa corretamente com build()", () => {
    const pessoa = Pessoa.build({
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
    });

    expect(typeof pessoa.id).toBe("string");
    expect(pessoa.nome).toBe("João Silva");
    expect(pessoa.sexo).toBe("M");
    expect(pessoa.cpf).toBe("12345678901");
    expect(pessoa.email).toBe("joao@example.com");
    expect(pessoa.cidade_id).toBe(1);
  });

  test("deve construir uma pessoa com assemble()", () => {
    const pessoa = Pessoa.assemble(
      "123",
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

    expect(pessoa.id).toBe("123");
    expect(pessoa.nome).toBe("Maria Santos");
    expect(pessoa.sexo).toBe("F");
    expect(pessoa.cpf).toBe("98765432101");
    expect(pessoa.celular).toBe("11988888888");
  });

  test("getters devem retornar todos os valores corretamente", () => {
    const pessoa = Pessoa.assemble(
      "abc123",
      "Pedro Oliveira",
      new Date("1988-03-10"),
      "M",
      "11122233344",
      "11987654321",
      "pedro@example.com",
      "Avenida C",
      "789",
      "Vila Y",
      "11111111"
    );

    expect(pessoa.id).toBe("abc123");
    expect(pessoa.nome).toBe("Pedro Oliveira");
    expect(pessoa.nascimento).toEqual(new Date("1988-03-10"));
    expect(pessoa.sexo).toBe("M");
    expect(pessoa.cpf).toBe("11122233344");
    expect(pessoa.celular).toBe("11987654321");
    expect(pessoa.email).toBe("pedro@example.com");
    expect(pessoa.logradouro).toBe("Avenida C");
    expect(pessoa.numero).toBe("789");
    expect(pessoa.bairro).toBe("Vila Y");
    expect(pessoa.cep).toBe("11111111");
  });

  test("deve permitir build de pessoa sem campo cidade_id", () => {
    const pessoa = Pessoa.build({
      nome: "Ana Costa",
      nascimento: new Date("1992-07-25"),
      sexo: "F",
      cpf: "55544433322",
      celular: "11912345678",
      email: "ana@example.com",
      logradouro: "Rua D",
      numero: "101",
      bairro: "Centro",
      cep: "22222222"
    });

    expect(pessoa.nome).toBe("Ana Costa");
    expect(pessoa.cidade_id).toBeUndefined();
  });

  test("deve permitir build com todos os campos opcionais", () => {
    const pessoa = Pessoa.build({
      nome: "Carlos",
      nascimento: new Date("1980-12-01"),
      sexo: "M",
      cpf: "99988877766",
      celular: "11998765432",
      email: "carlos@example.com",
      logradouro: "Rua E",
      numero: "202",
      bairro: "Pinheiros",
      cep: "33333333",
      cidade_id: 5
    });

    expect(pessoa.props).toBeDefined();
    expect(pessoa.email).toBe("carlos@example.com");
    expect(pessoa.cidade_id).toBe(5);
  });

  test("ID gerado deve ser diferente para pessoas diferentes", () => {
    const pessoa1 = Pessoa.build({
      nome: "Pessoa 1",
      sexo: "M",
      cpf: "11111111111",
      email: "p1@example.com",
      logradouro: "Rua",
      numero: "1",
      bairro: "Bairro",
      cep: "12345678"
    });

    const pessoa2 = Pessoa.build({
      nome: "Pessoa 2",
      sexo: "F",
      cpf: "22222222222",
      email: "p2@example.com",
      logradouro: "Rua",
      numero: "2",
      bairro: "Bairro",
      cep: "12345678"
    });

    expect(pessoa1.id).not.toBe(pessoa2.id);
  });

  test("deve retornar props corretamente", () => {
    const pessoa = Pessoa.build({
      nome: "Teste Props",
      nascimento: new Date("2000-01-01"),
      sexo: "M",
      cpf: "12312312312",
      celular: "11912312312",
      email: "teste@example.com",
      logradouro: "Rua",
      numero: "1",
      bairro: "Bairro",
      cep: "12345678",
      cidade_id: 1
    });

    const props = pessoa.props;
    expect(props.id).toBe(pessoa.id);
    expect(props.nome).toBe("Teste Props");
    expect(props.cidade_id).toBe(1);
  });
});
