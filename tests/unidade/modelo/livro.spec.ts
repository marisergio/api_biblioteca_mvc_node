import { describe, it, test, expect } from "vitest";
import { Livro } from "../../../src/modelo/livro";

describe("Livro (modelo de domínio)", () => {

  // Testa o método estático build()
  it("deve construir um livro corretamente com build()", () => {
    const livro = Livro.build("O Hobbit", "Tolkien","Editora XYZ", 1937);

    // O ID deve ser uma string gerada
    expect(typeof livro.id).toBe("string");
    // O título e o autor devem corresponder ao informado
    expect(livro.titulo).toBe("O Hobbit");
    expect(livro.autor).toBe("Tolkien");
    // A quantidade inicial deve ser 0
    expect(livro.quantidade).toBe(0);
  });

  // Testa o método estático construir()
  test("deve construir um livro corretamente com construir()", () => {
    const livro = Livro.construir("123", "Titulo Livro", "George Orwell", "Editora Livro", 1985, 5);

    expect(livro.id).toBe("123");
    expect(livro.titulo).toBe("Titulo Livro");
    expect(livro.autor).toBe("George Orwell");
    expect(livro.quantidade).toBe(5);
  });

  // Testa o método emprestar() com sucesso
  test("deve emprestar um livro quando há quantidade disponível", () => {
    const livro = Livro.construir("1", "Clean Code", "Robert Martin", "Editora Clean Code", 2008, 3);

    const resultado = livro.emprestar();

    // O método deve retornar true
    expect(resultado).toBe(true);
    // A quantidade deve diminuir em 1
    expect(livro.quantidade).toBe(2);
  });

  // Testa o método emprestar() quando não há mais exemplares
  test("não deve emprestar livro quando quantidade é 0", () => {
    const livro = Livro.construir("2", "Design Patterns", "GoF","Editora Design Patterns", 2020, 0);

    const resultado = livro.emprestar();

    // O método deve retornar false e manter a quantidade
    expect(resultado).toBe(false);
    expect(livro.quantidade).toBe(0);
  });

  // Testa se o getter retorna as props corretamente
  test("getters devem retornar os valores corretos", () => {
    const livro = Livro.construir("abc", "DDD", "Eric Evans", "Editora DDD", 2000, 7);

    expect(livro.id).toBe("abc");
    expect(livro.titulo).toBe("DDD");
    expect(livro.autor).toBe("Eric Evans");
    expect(livro.quantidade).toBe(7);
  });

  // Teste de comportamento: emprestar repetidas vezes até acabar
  test("deve permitir emprestar até quantidade chegar a zero", () => {
    const livro = Livro.construir("x", "Arquitetura Limpa", "Uncle Bob", "Editora Arquitetura Limpa", 2019, 2);

    expect(livro.emprestar()).toBe(true); // 2 → 1
    expect(livro.emprestar()).toBe(true); // 1 → 0
    expect(livro.emprestar()).toBe(false); // 0 → 0
    expect(livro.quantidade).toBe(0);
  });

  test("deve lançar erro se título for vazio", () => {
    expect(() => Livro.build("", "Autor","Editora Livro", 2020)).toThrow("Título não pode ser vazio");
  });

  test("deve lançar erro se título conter apenas espaços", () => {
    expect(() => Livro.build("   ", "Autor", "Editora", 2020)).toThrow("Título não pode ser vazio");
  });

  test("deve lançar erro se título for apenas tabs e espaços", () => {
    expect(() => Livro.build("\t  \n", "Autor", "Editora", 2020)).toThrow("Título não pode ser vazio");
  });

  test("deve retornar todos os getters corretamente", () => {
    const livro = Livro.construir("xyz", "Título Test", "Autor Test", "Editora Test", 2023, 10);

    expect(livro.id).toBe("xyz");
    expect(livro.titulo).toBe("Título Test");
    expect(livro.autor).toBe("Autor Test");
    expect(livro.editora).toBe("Editora Test");
    expect(livro.anoLancamento).toBe(2023);
    expect(livro.quantidade).toBe(10);
  });

  test("ID gerado deve ser diferente para livros diferentes", () => {
    const livro1 = Livro.build("Livro 1", "Autor 1", "Editora 1", 2020);
    const livro2 = Livro.build("Livro 2", "Autor 2", "Editora 2", 2021);

    expect(livro1.id).not.toBe(livro2.id);
  });

  test("deve permitir emprestar um livro e sua quantidade deve ficar uma unidade menor", () => {
    const livro = Livro.construir("5", "Teste Empresa", "Autor", "Editora", 2000, 5);

    expect(livro.quantidade).toBe(5);
    livro.emprestar();
    expect(livro.quantidade).toBe(4);
    livro.emprestar();
    expect(livro.quantidade).toBe(3);
  });

  test("deve retornar props corretamente", () => {
    const livro = Livro.construir("props-test", "Título Props", "Autor Props", "Editora Props", 2022, 8);
    const props = livro.props;

    expect(props.id).toBe("props-test");
    expect(props.titulo).toBe("Título Props");
    expect(props.autor).toBe("Autor Props");
    expect(props.editora).toBe("Editora Props");
    expect(props.anoLancamento).toBe(2022);
    expect(props.quantidade).toBe(8);
  });

  test("construir deve funcionar com quantidade zero", () => {
    const livro = Livro.construir("zero", "Livro Zero", "Autor", "Editora", 2024, 0);

    expect(livro.quantidade).toBe(0);
    expect(livro.emprestar()).toBe(false);
  });

  test("construir deve funcionar com quantidade negativa (edge case)", () => {
    const livro = Livro.construir("neg", "Livro Neg", "Autor", "Editora", 2024, -1);

    expect(livro.quantidade).toBe(-1);
    expect(livro.emprestar()).toBe(false);
  });

  test("build deve gerar ID no formato UUID", () => {
    const livro = Livro.build("Livro UUID", "Autor", "Editora", 2024);
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

    expect(livro.id).toMatch(uuidRegex);
  });
});
