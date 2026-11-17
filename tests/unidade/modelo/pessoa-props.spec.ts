import { describe, test, expect } from "vitest";
import { Pessoa } from "../../../src/modelo/pessoa";
import { Cidade } from "../../../src/modelo/cidade";
import { Estado } from "../../../src/modelo/estado";

describe("Pessoa (modelo de domínio) - Props e relacionamentos", () => {

  test("props deve conter todos os dados da pessoa", () => {
    const pessoa = Pessoa.assemble(
      "props-123",
      "Teste Props",
      new Date("1990-01-01"),
      "M",
      "12345678901",
      "11999999999",
      "teste@example.com",
      "Rua Props",
      "123",
      "Centro",
      "12345678"
    );

    expect(pessoa.props.id).toBe("props-123");
    expect(pessoa.props.nome).toBe("Teste Props");
    expect(pessoa.props.sexo).toBe("M");
    expect(pessoa.props.cpf).toBe("12345678901");
    expect(pessoa.props.celular).toBe("11999999999");
    expect(pessoa.props.email).toBe("teste@example.com");
    expect(pessoa.props.logradouro).toBe("Rua Props");
    expect(pessoa.props.numero).toBe("123");
    expect(pessoa.props.bairro).toBe("Centro");
    expect(pessoa.props.cep).toBe("12345678");
  });

  test("build deve gerar UUID para pessoa", () => {
    const pessoa = Pessoa.build({ nome: "UUID Test" });
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

    expect(pessoa.id).toMatch(uuidRegex);
  });

  test("dois builds devem gerar IDs diferentes", () => {
    const pessoa1 = Pessoa.build({ nome: "Pessoa 1" });
    const pessoa2 = Pessoa.build({ nome: "Pessoa 2" });

    expect(pessoa1.id).not.toBe(pessoa2.id);
  });

  test("assemble com todos os campos deve manter a ordem de parâmetros", () => {
    const id = "test-123";
    const nome = "Teste";
    const nascimento = new Date("2000-01-01");
    const sexo = "F";
    const cpf = "12345678901";
    const celular = "11999999999";
    const email = "teste@test.com";
    const logradouro = "Rua";
    const numero = "100";
    const bairro = "Bairro";
    const cep = "12345678";

    const pessoa = Pessoa.assemble(
      id,
      nome,
      nascimento,
      sexo,
      cpf,
      celular,
      email,
      logradouro,
      numero,
      bairro,
      cep
    );

    expect(pessoa.id).toBe(id);
    expect(pessoa.nome).toBe(nome);
    expect(pessoa.nascimento).toEqual(nascimento);
    expect(pessoa.sexo).toBe(sexo);
    expect(pessoa.cpf).toBe(cpf);
    expect(pessoa.celular).toBe(celular);
    expect(pessoa.email).toBe(email);
    expect(pessoa.logradouro).toBe(logradouro);
    expect(pessoa.numero).toBe(numero);
    expect(pessoa.bairro).toBe(bairro);
    expect(pessoa.cep).toBe(cep);
  });

  test("pessoa com cidade deve manter referência correta", () => {
    const estado = new Estado(1, "São Paulo");
    const cidade = new Cidade(1, "São Paulo", estado);

    const pessoa = Pessoa.assemble(
      "cidade-test",
      "Teste Cidade",
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      cidade
    );

    expect(pessoa.cidade).toBe(cidade);
    expect(pessoa.cidade?.nome).toBe("São Paulo");
    expect(pessoa.cidade?.estado.nome).toBe("São Paulo");
  });

  test("pessoa pode ter cidade_id sem objeto cidade", () => {
    const pessoa = Pessoa.build({
      nome: "Teste ID",
      cidade_id: 5
    });

    expect(pessoa.cidade_id).toBe(5);
    expect(pessoa.cidade).toBeUndefined();
  });

  test("pessoa pode ter cidade sem cidade_id", () => {
    const estado = new Estado(2, "Rio de Janeiro");
    const cidade = new Cidade(2, "Rio de Janeiro", estado);

    const pessoa = Pessoa.assemble(
      "sem-id",
      "Teste",
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      cidade
    );

    expect(pessoa.cidade).toBe(cidade);
    expect(pessoa.cidade_id).toBeUndefined();
  });

  test("sexo com valores válidos", () => {
    const pessoaM = Pessoa.assemble("1", "P1", undefined, "M");
    const pessoaF = Pessoa.assemble("2", "P2", undefined, "F");
    const pessoaO = Pessoa.assemble("3", "P3", undefined, "O");

    expect(pessoaM.sexo).toBe("M");
    expect(pessoaF.sexo).toBe("F");
    expect(pessoaO.sexo).toBe("O");
  });

  test("múltiplas pessoas podem ter mesma cidade", () => {
    const estado = new Estado(1, "São Paulo");
    const cidade = new Cidade(1, "São Paulo", estado);

    const pessoa1 = Pessoa.assemble("p1", "João", undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, cidade);
    const pessoa2 = Pessoa.assemble("p2", "Maria", undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, cidade);
    const pessoa3 = Pessoa.assemble("p3", "Pedro", undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, cidade);

    expect(pessoa1.cidade).toBe(pessoa2.cidade);
    expect(pessoa2.cidade).toBe(pessoa3.cidade);
    expect(pessoa1.id).not.toBe(pessoa2.id);
    expect(pessoa2.id).not.toBe(pessoa3.id);
  });

  test("build com nome apenas deve ter outros campos undefined", () => {
    const pessoa = Pessoa.build({ nome: "Apenas Nome" });

    expect(pessoa.nome).toBe("Apenas Nome");
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
    expect(pessoa.cidade_id).toBeUndefined();
  });

  test("assemble com apenas ID e nome deve funcionar", () => {
    const pessoa = Pessoa.assemble("minimal", "Minimal");

    expect(pessoa.id).toBe("minimal");
    expect(pessoa.nome).toBe("Minimal");
  });

  test("props deve retornar tipo correto", () => {
    const pessoa = Pessoa.build({ nome: "Type Test" });

    expect(typeof pessoa.props.id).toBe("string");
    expect(typeof pessoa.props.nome).toBe("string");
  });

  test("pessoa com todos os dados deve ter props completo", () => {
    const estado = new Estado(5, "Minas Gerais");
    const cidade = new Cidade(5, "Belo Horizonte", estado);

    const pessoa = Pessoa.assemble(
      "completo",
      "Completo Test",
      new Date("1995-06-15"),
      "M",
      "99988877766",
      "31999999999",
      "completo@test.com",
      "Rua Completa",
      "999",
      "Centro",
      "30000000",
      cidade
    );

    const props = pessoa.props;
    expect(props.id).toBe("completo");
    expect(props.nome).toBe("Completo Test");
    expect(props.nascimento).toEqual(new Date("1995-06-15"));
    expect(props.sexo).toBe("M");
    expect(props.cpf).toBe("99988877766");
    expect(props.celular).toBe("31999999999");
    expect(props.email).toBe("completo@test.com");
    expect(props.logradouro).toBe("Rua Completa");
    expect(props.numero).toBe("999");
    expect(props.bairro).toBe("Centro");
    expect(props.cep).toBe("30000000");
    expect(props.cidade).toBe(cidade);
  });
});
