import { describe, test, expect } from "vitest";
import { Emprestimo } from "../../../src/modelo/emprestimo";
import { Livro } from "../../../src/modelo/livro";
import { Pessoa } from "../../../src/modelo/pessoa";
import { EmprestimoDtoCreate } from "../../../src/dto/emprestimo.dto";

describe("Emprestimo (modelo de domínio) - Validações avançadas", () => {

  test("deve construir emprestimo com relacionamento de Livro", () => {
    const livro = Livro.construir("livro-123", "Clean Code", "Robert Martin", "Editora", 2008, 5);
    
    const emprestimo = Emprestimo.assemble({
      id: "emp-001",
      leitor_id: "leitor-001",
      livro_id: "livro-123",
      status: "1",
      data: new Date("2024-01-01"),
      livro: livro
    });

    expect(emprestimo.livro).toBe(livro);
    expect(emprestimo.livro?.titulo).toBe("Clean Code");
    expect(emprestimo.livro?.id).toBe("livro-123");
  });

  test("deve construir emprestimo com relacionamento de Pessoa", () => {
    const pessoa = Pessoa.assemble("pessoa-123", "João Silva");
    
    const emprestimo = Emprestimo.assemble({
      id: "emp-002",
      leitor_id: "pessoa-123",
      livro_id: "livro-456",
      status: "0",
      data: new Date("2024-01-15"),
      leitor: pessoa
    });

    expect(emprestimo.leitor).toBe(pessoa);
    expect(emprestimo.leitor?.nome).toBe("João Silva");
    expect(emprestimo.leitor?.id).toBe("pessoa-123");
  });

  test("deve construir emprestimo com ambos relacionamentos", () => {
    const livro = Livro.construir("livro-999", "Design Patterns", "GoF", "Editora", 1994, 3);
    const pessoa = Pessoa.assemble("pessoa-999", "Maria Santos");
    
    const emprestimo = Emprestimo.assemble({
      id: "emp-003",
      leitor_id: "pessoa-999",
      livro_id: "livro-999",
      status: "1",
      data: new Date("2024-02-01"),
      data_prevista: new Date("2024-02-15"),
      data_entrega: new Date("2024-02-14"),
      leitor: pessoa,
      livro: livro
    });

    expect(emprestimo.livro).toBe(livro);
    expect(emprestimo.leitor).toBe(pessoa);
    expect(emprestimo.livro?.titulo).toBe("Design Patterns");
    expect(emprestimo.leitor?.nome).toBe("Maria Santos");
  });

  test("deve permitir emprestimo sem leitor e livro carregados", () => {
    const emprestimo = Emprestimo.build({
      leitor_id: "leitor-aaa",
      livro_id: "livro-aaa",
      data: new Date("2024-03-01")
    });

    expect(emprestimo.leitor).toBeUndefined();
    expect(emprestimo.livro).toBeUndefined();
    expect(emprestimo.leitor_id).toBe("leitor-aaa");
    expect(emprestimo.livro_id).toBe("livro-aaa");
  });

  test("status pode ser diferente valores para representar estados", () => {
    const emp1 = Emprestimo.assemble({
      id: "emp-s0",
      leitor_id: "leitor",
      livro_id: "livro",
      status: "0",
      data: new Date()
    });

    const emp2 = Emprestimo.assemble({
      id: "emp-s1",
      leitor_id: "leitor",
      livro_id: "livro",
      status: "1",
      data: new Date()
    });

    expect(emp1.status).toBe("0");
    expect(emp2.status).toBe("1");
    expect(emp1.status).not.toBe(emp2.status);
  });

  test("deve permitir datas diferentes para emprestimo", () => {
    const dataEmprestimo = new Date("2024-01-01");
    const dataPrevista = new Date("2024-01-15");
    const dataEntrega = new Date("2024-01-14");

    const emprestimo = Emprestimo.assemble({
      id: "emp-datas",
      leitor_id: "leitor-datas",
      livro_id: "livro-datas",
      status: "1",
      data: dataEmprestimo,
      data_prevista: dataPrevista,
      data_entrega: dataEntrega
    });

    expect(emprestimo.data).toEqual(dataEmprestimo);
    expect(emprestimo.data_prevista).toEqual(dataPrevista);
    expect(emprestimo.data_entrega).toEqual(dataEntrega);
    expect(emprestimo.data_entrega! < emprestimo.data_prevista!).toBe(true);
  });

  test("emprestimo entregue dentro do prazo", () => {
    const dataEmprestimo = new Date("2024-01-01");
    const dataPrevista = new Date("2024-01-30");
    const dataEntrega = new Date("2024-01-20");

    const emprestimo = Emprestimo.assemble({
      id: "emp-prazo",
      leitor_id: "leitor",
      livro_id: "livro",
      status: "1",
      data: dataEmprestimo,
      data_prevista: dataPrevista,
      data_entrega: dataEntrega
    });

    expect(emprestimo.data_entrega! <= emprestimo.data_prevista!).toBe(true);
  });

  test("emprestimo devolvido com atraso", () => {
    const dataEmprestimo = new Date("2024-01-01");
    const dataPrevista = new Date("2024-01-15");
    const dataEntrega = new Date("2024-01-20");

    const emprestimo = Emprestimo.assemble({
      id: "emp-atraso",
      leitor_id: "leitor",
      livro_id: "livro",
      status: "1",
      data: dataEmprestimo,
      data_prevista: dataPrevista,
      data_entrega: dataEntrega
    });

    expect(emprestimo.data_entrega! > emprestimo.data_prevista!).toBe(true);
  });

  test("emprestimo ativo não deve ter data de entrega", () => {
    const emprestimo = Emprestimo.build({
      leitor_id: "leitor-ativo",
      livro_id: "livro-ativo",
      data: new Date("2024-01-01")
    });

    expect(emprestimo.status).toBe("0");
    expect(emprestimo.data_entrega).toBeUndefined();
  });

  test("ID gerado deve estar no formato UUID", () => {
    const emprestimo = Emprestimo.build({
      leitor_id: "leitor-uuid",
      livro_id: "livro-uuid",
      data: new Date()
    });

    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    expect(emprestimo.id).toMatch(uuidRegex);
  });

  test("deve retornar props completas", () => {
    const livro = Livro.construir("livro-props", "Arquitetura Limpa", "Uncle Bob", "Editora", 2019, 2);
    const pessoa = Pessoa.assemble("pessoa-props", "Pedro Oliveira");

    const emprestimoDto: EmprestimoDtoCreate = {
      leitor_id: "pessoa-props",
      livro_id: "livro-props",
      data: new Date("2024-04-01")
    };

    const emprestimo = Emprestimo.build(emprestimoDto);
    const props = emprestimo.props;

    expect(props.id).toBe(emprestimo.id);
    expect(props.leitor_id).toBe("pessoa-props");
    expect(props.livro_id).toBe("livro-props");
    expect(props.status).toBe("0");
    expect(props.data).toEqual(new Date("2024-04-01"));
  });

  test("múltiplos emprestimos do mesmo livro podem estar associados a diferentes pessoas", () => {
    const livro = Livro.construir("livro-popular", "1984", "George Orwell", "Editora", 1949, 10);
    const pessoa1 = Pessoa.assemble("p1", "João");
    const pessoa2 = Pessoa.assemble("p2", "Maria");

    const emp1 = Emprestimo.assemble({
      id: "emp1",
      leitor_id: "p1",
      livro_id: "livro-popular",
      status: "1",
      data: new Date("2024-01-01"),
      livro: livro,
      leitor: pessoa1
    });

    const emp2 = Emprestimo.assemble({
      id: "emp2",
      leitor_id: "p2",
      livro_id: "livro-popular",
      status: "0",
      data: new Date("2024-02-01"),
      livro: livro,
      leitor: pessoa2
    });

    expect(emp1.livro).toBe(emp2.livro);
    expect(emp1.leitor).not.toBe(emp2.leitor);
    expect(emp1.id).not.toBe(emp2.id);
  });
});
