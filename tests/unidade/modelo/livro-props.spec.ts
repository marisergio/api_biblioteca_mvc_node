import { describe, test, expect, beforeEach } from "vitest";
import { Livro } from "../../../src/modelo/livro";

describe("Livro (modelo de domínio) - Props e estado", () => {

  test("props deve conter todos os dados do livro", () => {
    const livro = Livro.construir("props-123", "Props Livro", "Props Autor", "Props Editora", 2024, 15);

    expect(livro.props).toBeDefined();
    expect(livro.props.id).toBe("props-123");
    expect(livro.props.titulo).toBe("Props Livro");
    expect(livro.props.autor).toBe("Props Autor");
    expect(livro.props.editora).toBe("Props Editora");
    expect(livro.props.anoLancamento).toBe(2024);
    expect(livro.props.quantidade).toBe(15);
  });

  test("props.quantidade deve refletir modificações através de emprestar()", () => {
    const livro = Livro.construir("prop-qty", "Teste", "Autor", "Editora", 2024, 5);

    expect(livro.props.quantidade).toBe(5);

    livro.emprestar();
    expect(livro.props.quantidade).toBe(4);

    livro.emprestar();
    expect(livro.props.quantidade).toBe(3);
  });

  test("dois livros criados com construir devem ter props independentes", () => {
    const livro1 = Livro.construir("id1", "Título 1", "Autor 1", "Editora 1", 2020, 10);
    const livro2 = Livro.construir("id2", "Título 2", "Autor 2", "Editora 2", 2021, 20);

    livro1.emprestar();

    expect(livro1.props.quantidade).toBe(9);
    expect(livro2.props.quantidade).toBe(20);
  });

  test("build deve retornar livro com UUID e quantidade zero", () => {
    const livro = Livro.build("Test Build", "Author Test", "Editora Test", 2024);
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

    expect(livro.props.id).toMatch(uuidRegex);
    expect(livro.props.quantidade).toBe(0);
    expect(livro.props.titulo).toBe("Test Build");
    expect(livro.props.autor).toBe("Author Test");
    expect(livro.props.editora).toBe("Editora Test");
    expect(livro.props.anoLancamento).toBe(2024);
  });

  test("titulo vazio deve lançar erro mesmo em build", () => {
    expect(() => Livro.build("", "Autor", "Editora", 2024)).toThrow();
    expect(() => Livro.build("   ", "Autor", "Editora", 2024)).toThrow();
  });

  test("dois livros com mesmo ID via construir devem ter props iguais apenas para o ID", () => {
    const livro1 = Livro.construir("mesmo-id", "Título A", "Autor A", "Editora A", 2000, 5);
    const livro2 = Livro.construir("mesmo-id", "Título B", "Autor B", "Editora B", 2010, 10);

    expect(livro1.props.id).toBe(livro2.props.id);
    expect(livro1.props.titulo).not.toBe(livro2.props.titulo);
    expect(livro1.props.autor).not.toBe(livro2.props.autor);
    expect(livro1.props.quantidade).not.toBe(livro2.props.quantidade);
  });

  test("sequência de emprestar deve ser reversível através de props", () => {
    const livro = Livro.construir("seq-test", "Teste Seq", "Autor", "Editora", 2024, 10);

    for (let i = 0; i < 5; i++) {
      livro.emprestar();
    }

    expect(livro.props.quantidade).toBe(5);

    for (let i = 0; i < 5; i++) {
      expect(livro.emprestar()).toBe(true);
    }

    expect(livro.props.quantidade).toBe(0);
  });

  test("props deve retornar tipo LivroProps correto", () => {
    const livro = Livro.construir("type-test", "Type", "Author", "Publisher", 2024, 5);

    const props = livro.props;

    expect(typeof props.id).toBe("string");
    expect(typeof props.titulo).toBe("string");
    expect(typeof props.autor).toBe("string");
    expect(typeof props.editora).toBe("string");
    expect(typeof props.anoLancamento).toBe("number");
    expect(typeof props.quantidade).toBe("number");
  });

  test("construir com quantidade zero deve permitir emprestimo falhar", () => {
    const livro = Livro.construir("zero-qty", "Sem Cópias", "Autor", "Editora", 2024, 0);

    expect(livro.props.quantidade).toBe(0);
    expect(livro.emprestar()).toBe(false);
    expect(livro.props.quantidade).toBe(0);
  });

  test("vários livros criados com build devem todos ter quantidade zero", () => {
    const livros = Array.from({ length: 5 }, (_, i) =>
      Livro.build(`Livro ${i}`, `Autor ${i}`, `Editora ${i}`, 2024)
    );

    livros.forEach(livro => {
      expect(livro.props.quantidade).toBe(0);
      expect(livro.emprestar()).toBe(false);
    });
  });
});
