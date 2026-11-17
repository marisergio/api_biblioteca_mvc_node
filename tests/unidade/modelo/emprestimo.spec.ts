import { describe, test, expect } from "vitest";
import { Emprestimo } from "../../../src/modelo/emprestimo";
import { EmprestimoDtoCreate } from "../../../src/dto/emprestimo.dto";

describe("Emprestimo (modelo de domínio)", () => {

  test("deve construir um emprestimo corretamente com build()", () => {
    const emprestimoDto: EmprestimoDtoCreate = {
      leitor_id: "leitor-123",
      livro_id: "livro-456",
      data: new Date("2024-01-15")
    };

    const emprestimo = Emprestimo.build(emprestimoDto);

    expect(typeof emprestimo.id).toBe("string");
    expect(emprestimo.leitor_id).toBe("leitor-123");
    expect(emprestimo.livro_id).toBe("livro-456");
    expect(emprestimo.status).toBe("0");
    expect(emprestimo.data).toEqual(new Date("2024-01-15"));
  });

  test("deve construir um emprestimo com assemble()", () => {
    const emprestimo = Emprestimo.assemble({
      id: "emp-123",
      leitor_id: "leitor-789",
      livro_id: "livro-999",
      status: "1",
      data: new Date("2024-02-01"),
      data_prevista: new Date("2024-02-15"),
      data_entrega: new Date("2024-02-14")
    });

    expect(emprestimo.id).toBe("emp-123");
    expect(emprestimo.leitor_id).toBe("leitor-789");
    expect(emprestimo.livro_id).toBe("livro-999");
    expect(emprestimo.status).toBe("1");
  });

  test("getters devem retornar todos os valores corretamente", () => {
    const emprestimo = Emprestimo.assemble({
      id: "emp-456",
      leitor_id: "leitor-111",
      livro_id: "livro-222",
      status: "1",
      data: new Date("2024-03-01"),
      data_prevista: new Date("2024-03-15"),
      data_entrega: new Date("2024-03-14"),
      created_at: new Date("2024-03-01"),
      updated_at: new Date("2024-03-14")
    });

    expect(emprestimo.id).toBe("emp-456");
    expect(emprestimo.leitor_id).toBe("leitor-111");
    expect(emprestimo.livro_id).toBe("livro-222");
    expect(emprestimo.status).toBe("1");
    expect(emprestimo.data).toEqual(new Date("2024-03-01"));
    expect(emprestimo.data_prevista).toEqual(new Date("2024-03-15"));
    expect(emprestimo.data_entrega).toEqual(new Date("2024-03-14"));
  });

  test("status padrão deve ser '0' (emprestimo ativo)", () => {
    const emprestimoDto: EmprestimoDtoCreate = {
      leitor_id: "leitor-aaa",
      livro_id: "livro-bbb",
      data: new Date()
    };

    const emprestimo = Emprestimo.build(emprestimoDto);
    expect(emprestimo.status).toBe("0");
  });

  test("ID gerado deve ser diferente para emprestimos diferentes", () => {
    const dto1: EmprestimoDtoCreate = {
      leitor_id: "leitor-1",
      livro_id: "livro-1",
      data: new Date()
    };

    const dto2: EmprestimoDtoCreate = {
      leitor_id: "leitor-2",
      livro_id: "livro-2",
      data: new Date()
    };

    const emp1 = Emprestimo.build(dto1);
    const emp2 = Emprestimo.build(dto2);

    expect(emp1.id).not.toBe(emp2.id);
  });

  test("deve permitir assemble com dados de leitor e livro", () => {
    const emprestimo = Emprestimo.assemble({
      id: "emp-999",
      leitor_id: "leitor-xyz",
      livro_id: "livro-xyz",
      status: "1",
      data: new Date("2024-04-01"),
      leitor: undefined,
      livro: undefined,
      data_prevista: new Date("2024-04-15")
    });

    expect(emprestimo.leitor).toBeUndefined();
    expect(emprestimo.livro).toBeUndefined();
    expect(emprestimo.data_prevista).toEqual(new Date("2024-04-15"));
  });

  test("deve retornar props corretamente", () => {
    const emprestimoDto: EmprestimoDtoCreate = {
      leitor_id: "leitor-prop",
      livro_id: "livro-prop",
      data: new Date("2024-05-01")
    };

    const emprestimo = Emprestimo.build(emprestimoDto);
    const props = emprestimo.props;

    expect(props.id).toBe(emprestimo.id);
    expect(props.leitor_id).toBe("leitor-prop");
    expect(props.livro_id).toBe("livro-prop");
    expect(props.status).toBe("0");
  });

  test("deve permitir datas nulas para campos opcionais", () => {
    const emprestimo = Emprestimo.assemble({
      id: "emp-null",
      leitor_id: "leitor-null",
      livro_id: "livro-null",
      status: "0",
      data: new Date("2024-06-01"),
      data_prevista: undefined,
      data_entrega: undefined
    });

    expect(emprestimo.data_prevista).toBeUndefined();
    expect(emprestimo.data_entrega).toBeUndefined();
  });
});
