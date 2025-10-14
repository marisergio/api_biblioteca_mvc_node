import { Livro } from "../../src/modelo/livro";

describe("Livro (modelo de domínio)", () => {

  // 🔹 Testa o método estático build()
  test("deve construir um livro corretamente com build()", () => {
    const livro = Livro.build("O Hobbit", "Tolkien");

    // O ID deve ser uma string gerada
    expect(typeof livro.id).toBe("string");
    // O título e o autor devem corresponder ao informado
    expect(livro.titulo).toBe("O Hobbit");
    expect(livro.autor).toBe("Tolkien");
    // A quantidade inicial deve ser 0
    expect(livro.quantidade).toBe(0);
  });

  // 🔹 Testa o método estático construir()
  test("deve construir um livro corretamente com construir()", () => {
    const livro = Livro.construir("123", "1984", "George Orwell", 5);

    expect(livro.id).toBe("123");
    expect(livro.titulo).toBe("1984");
    expect(livro.autor).toBe("George Orwell");
    expect(livro.quantidade).toBe(5);
  });

  // 🔹 Testa o método emprestar() com sucesso
  test("deve emprestar um livro quando há quantidade disponível", () => {
    const livro = Livro.construir("1", "Clean Code", "Robert Martin", 3);

    const resultado = livro.emprestar();

    // O método deve retornar true
    expect(resultado).toBe(true);
    // A quantidade deve diminuir em 1
    expect(livro.quantidade).toBe(2);
  });

  // 🔹 Testa o método emprestar() quando não há mais exemplares
  test("não deve emprestar livro quando quantidade é 0", () => {
    const livro = Livro.construir("2", "Design Patterns", "GoF", 0);

    const resultado = livro.emprestar();

    // O método deve retornar false e manter a quantidade
    expect(resultado).toBe(false);
    expect(livro.quantidade).toBe(0);
  });

  // 🔹 Testa se o getter retorna as props corretamente
  test("getters devem retornar os valores corretos", () => {
    const livro = Livro.construir("abc", "DDD", "Eric Evans", 7);

    expect(livro.id).toBe("abc");
    expect(livro.titulo).toBe("DDD");
    expect(livro.autor).toBe("Eric Evans");
    expect(livro.quantidade).toBe(7);
  });

  // 🔹 Teste de comportamento: emprestar repetidas vezes até acabar
  test("deve permitir emprestar até quantidade chegar a zero", () => {
    const livro = Livro.construir("x", "Arquitetura Limpa", "Uncle Bob", 2);

    expect(livro.emprestar()).toBe(true); // 2 → 1
    expect(livro.emprestar()).toBe(true); // 1 → 0
    expect(livro.emprestar()).toBe(false); // 0 → 0
    expect(livro.quantidade).toBe(0);
  });

  test("deve lançar erro se título for vazio", () => {
    expect(() => Livro.build("", "Autor")).toThrow("Título não pode ser vazio");
  });

});
