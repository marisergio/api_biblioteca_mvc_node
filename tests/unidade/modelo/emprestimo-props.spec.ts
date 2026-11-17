import { describe, test, expect } from "vitest";
import { Emprestimo } from "../../../src/modelo/emprestimo";
import { Livro } from "../../../src/modelo/livro";
import { Pessoa } from "../../../src/modelo/pessoa";
import { EmprestimoDtoCreate } from "../../../src/dto/emprestimo.dto";

describe("Emprestimo (modelo de domínio) - Props e relacionamentos avançados", () => {

  test("props deve conter todos os dados do emprestimo", () => {
    const emprestimoDtoCreate: EmprestimoDtoCreate = {
      leitor_id: "leitor-props",
      livro_id: "livro-props",
      data: new Date("2024-01-01")
    };

    const emprestimo = Emprestimo.build(emprestimoDtoCreate);
    const props = emprestimo.props;

    expect(props.id).toBe(emprestimo.id);
    expect(props.leitor_id).toBe("leitor-props");
    expect(props.livro_id).toBe("livro-props");
    expect(props.status).toBe("0");
    expect(props.data).toEqual(new Date("2024-01-01"));
  });

  test("build deve gerar UUID para emprestimo", () => {
    const emprestimoDto: EmprestimoDtoCreate = {
      leitor_id: "leitor-uuid",
      livro_id: "livro-uuid",
      data: new Date()
    };

    const emprestimo = Emprestimo.build(emprestimoDto);
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

    expect(emprestimo.id).toMatch(uuidRegex);
  });

  test("dois builds devem gerar IDs diferentes", () => {
    const emp1 = Emprestimo.build({
      leitor_id: "leitor-1",
      livro_id: "livro-1",
      data: new Date()
    });

    const emp2 = Emprestimo.build({
      leitor_id: "leitor-2",
      livro_id: "livro-2",
      data: new Date()
    });

    expect(emp1.id).not.toBe(emp2.id);
  });

  test("assemble com todos os campos deve manter a ordem", () => {
    const id = "emp-123";
    const leitor_id = "leitor-123";
    const livro_id = "livro-123";
    const status = "1";
    const data = new Date("2024-01-01");
    const data_prevista = new Date("2024-01-15");
    const data_entrega = new Date("2024-01-14");

    const emprestimo = Emprestimo.assemble({
      id,
      leitor_id,
      livro_id,
      status,
      data,
      data_prevista,
      data_entrega
    });

    expect(emprestimo.id).toBe(id);
    expect(emprestimo.leitor_id).toBe(leitor_id);
    expect(emprestimo.livro_id).toBe(livro_id);
    expect(emprestimo.status).toBe(status);
    expect(emprestimo.data).toEqual(data);
    expect(emprestimo.data_prevista).toEqual(data_prevista);
    expect(emprestimo.data_entrega).toEqual(data_entrega);
  });

  test("emprestimo com livro carregado deve manter referência", () => {
    const livro = Livro.construir("livro-ref", "Livro Ref", "Autor", "Editora", 2024, 5);

    const emprestimo = Emprestimo.assemble({
      id: "emp-livro",
      leitor_id: "leitor",
      livro_id: "livro-ref",
      status: "1",
      data: new Date(),
      livro: livro
    });

    expect(emprestimo.livro).toBe(livro);
    expect(emprestimo.livro?.titulo).toBe("Livro Ref");
  });

  test("emprestimo com pessoa carregada deve manter referência", () => {
    const pessoa = Pessoa.assemble("pessoa-ref", "Pessoa Ref");

    const emprestimo = Emprestimo.assemble({
      id: "emp-pessoa",
      leitor_id: "pessoa-ref",
      livro_id: "livro",
      status: "0",
      data: new Date(),
      leitor: pessoa
    });

    expect(emprestimo.leitor).toBe(pessoa);
    expect(emprestimo.leitor?.nome).toBe("Pessoa Ref");
  });

  test("emprestimo com livro e pessoa devem manter ambas referências", () => {
    const livro = Livro.construir("livro-both", "Livro Both", "Autor", "Editora", 2024, 3);
    const pessoa = Pessoa.assemble("pessoa-both", "Pessoa Both");

    const emprestimo = Emprestimo.assemble({
      id: "emp-both",
      leitor_id: "pessoa-both",
      livro_id: "livro-both",
      status: "1",
      data: new Date("2024-02-01"),
      livro: livro,
      leitor: pessoa
    });

    expect(emprestimo.livro).toBe(livro);
    expect(emprestimo.leitor).toBe(pessoa);
    expect(emprestimo.livro?.titulo).toBe("Livro Both");
    expect(emprestimo.leitor?.nome).toBe("Pessoa Both");
  });

  test("status padrão em build deve ser '0'", () => {
    const emprestimo = Emprestimo.build({
      leitor_id: "l",
      livro_id: "v",
      data: new Date()
    });

    expect(emprestimo.status).toBe("0");
  });

  test("status pode ser alterado em assemble", () => {
    const emp0 = Emprestimo.assemble({
      id: "s0",
      leitor_id: "l",
      livro_id: "v",
      status: "0",
      data: new Date()
    });

    const emp1 = Emprestimo.assemble({
      id: "s1",
      leitor_id: "l",
      livro_id: "v",
      status: "1",
      data: new Date()
    });

    expect(emp0.status).toBe("0");
    expect(emp1.status).toBe("1");
  });

  test("datas podem ser undefined em assemble", () => {
    const emprestimo = Emprestimo.assemble({
      id: "datas-undef",
      leitor_id: "l",
      livro_id: "v",
      status: "0",
      data: new Date("2024-01-01"),
      data_prevista: undefined,
      data_entrega: undefined
    });

    expect(emprestimo.data).toBeDefined();
    expect(emprestimo.data_prevista).toBeUndefined();
    expect(emprestimo.data_entrega).toBeUndefined();
  });

  test("emprestimo com created_at e updated_at", () => {
    const created = new Date("2024-01-01");
    const updated = new Date("2024-01-15");

    const emprestimo = Emprestimo.assemble({
      id: "emp-timestamp",
      leitor_id: "l",
      livro_id: "v",
      status: "1",
      data: new Date(),
      created_at: created,
      updated_at: updated
    });

    expect(emprestimo.props.created_at).toEqual(created);
    expect(emprestimo.props.updated_at).toEqual(updated);
  });

  test("múltiplos emprestimos de mesmo livro devem ter IDs diferentes", () => {
    const livro = Livro.construir("livro-popular", "Popular", "Autor", "Editora", 2024, 10);

    const emp1 = Emprestimo.assemble({
      id: "emp1",
      leitor_id: "pessoa1",
      livro_id: "livro-popular",
      status: "0",
      data: new Date("2024-01-01"),
      livro: livro
    });

    const emp2 = Emprestimo.assemble({
      id: "emp2",
      leitor_id: "pessoa2",
      livro_id: "livro-popular",
      status: "0",
      data: new Date("2024-02-01"),
      livro: livro
    });

    expect(emp1.livro).toBe(emp2.livro);
    expect(emp1.id).not.toBe(emp2.id);
    expect(emp1.leitor_id).not.toBe(emp2.leitor_id);
  });

  test("props deve retornar tipo correto para todos os campos", () => {
    const emprestimo = Emprestimo.build({
      leitor_id: "l",
      livro_id: "v",
      data: new Date()
    });

    const props = emprestimo.props;

    expect(typeof props.id).toBe("string");
    expect(typeof props.leitor_id).toBe("string");
    expect(typeof props.livro_id).toBe("string");
    expect(typeof props.status).toBe("string");
    expect(props.data instanceof Date).toBe(true);
  });
});
