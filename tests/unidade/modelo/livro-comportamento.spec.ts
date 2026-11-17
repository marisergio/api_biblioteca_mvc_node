import { describe, test, expect } from "vitest";
import { Livro } from "../../../src/modelo/livro";

describe("Livro (modelo de domínio) - Comportamento de empréstimo", () => {

  test("deve decrementar quantidade gradualmente até zero", () => {
    const livro = Livro.construir("livro-decr", "Teste Decremento", "Autor", "Editora", 2024, 5);

    expect(livro.emprestar()).toBe(true);
    expect(livro.quantidade).toBe(4);

    expect(livro.emprestar()).toBe(true);
    expect(livro.quantidade).toBe(3);

    expect(livro.emprestar()).toBe(true);
    expect(livro.quantidade).toBe(2);

    expect(livro.emprestar()).toBe(true);
    expect(livro.quantidade).toBe(1);

    expect(livro.emprestar()).toBe(true);
    expect(livro.quantidade).toBe(0);

    expect(livro.emprestar()).toBe(false);
    expect(livro.quantidade).toBe(0);
  });

  test("quantidade deve permanecer zero após falha de emprestimo", () => {
    const livro = Livro.construir("livro-zero", "Sem Cópias", "Autor", "Editora", 2024, 0);

    expect(livro.emprestar()).toBe(false);
    expect(livro.emprestar()).toBe(false);
    expect(livro.emprestar()).toBe(false);
    expect(livro.quantidade).toBe(0);
  });

  test("titulo com espaços em branco deve ser considerado vazio", () => {
    expect(() => Livro.build("   ", "Autor", "Editora", 2024)).toThrow("Título não pode ser vazio");
    expect(() => Livro.build("\t\t", "Autor", "Editora", 2024)).toThrow("Título não pode ser vazio");
    expect(() => Livro.build("\n\n", "Autor", "Editora", 2024)).toThrow("Título não pode ser vazio");
  });

  test("titulo com caracteres válidos após trim deve funcionar", () => {
    const livro = Livro.build("  Válido  ", "Autor", "Editora", 2024);
    expect(livro.titulo).toBe("  Válido  ");
  });

  test("quantidade com valor muito alto deve ser suportada", () => {
    const livro = Livro.construir("livro-alto", "Bestseller", "Autor", "Editora", 2024, 999999);

    expect(livro.quantidade).toBe(999999);
    expect(livro.emprestar()).toBe(true);
    expect(livro.quantidade).toBe(999998);
  });

  test("dois livros com mesmo ID devem ter props diferentes se quantidades forem diferentes", () => {
    const livro1 = Livro.construir("mesmo-id", "Título", "Autor", "Editora", 2024, 5);
    const livro2 = Livro.construir("mesmo-id", "Título", "Autor", "Editora", 2024, 10);

    expect(livro1.id).toBe(livro2.id);
    expect(livro1.quantidade).not.toBe(livro2.quantidade);
  });

  test("emprestimo deve mutar o estado interno do livro", () => {
    const livro = Livro.construir("livro-muta", "Teste Mutação", "Autor", "Editora", 2024, 3);
    const quantidadeInicial = livro.quantidade;

    livro.emprestar();
    const quantidadeAposPrimeiro = livro.quantidade;

    expect(quantidadeAposPrimeiro).toBe(quantidadeInicial - 1);
  });

  test("getters devem retornar valores corretos após emprestimos", () => {
    const livro = Livro.construir("livro-gets", "Teste Getters", "Fulano", "Editora XYZ", 2015, 7);

    expect(livro.id).toBe("livro-gets");
    expect(livro.titulo).toBe("Teste Getters");
    expect(livro.autor).toBe("Fulano");
    expect(livro.editora).toBe("Editora XYZ");
    expect(livro.anoLancamento).toBe(2015);
    expect(livro.quantidade).toBe(7);

    livro.emprestar();
    livro.emprestar();

    expect(livro.id).toBe("livro-gets");
    expect(livro.titulo).toBe("Teste Getters");
    expect(livro.autor).toBe("Fulano");
    expect(livro.editora).toBe("Editora XYZ");
    expect(livro.anoLancamento).toBe(2015);
    expect(livro.quantidade).toBe(5);
  });

  test("construir com quantidade negativa deve ser permitido (edge case)", () => {
    const livro = Livro.construir("livro-neg", "Negativo", "Autor", "Editora", 2024, -5);

    expect(livro.quantidade).toBe(-5);
    expect(livro.emprestar()).toBe(false);
  });

  test("build deve sempre iniciar com quantidade zero", () => {
    const livro1 = Livro.build("Livro 1", "Autor 1", "Editora 1", 2020);
    const livro2 = Livro.build("Livro 2", "Autor 2", "Editora 2", 2021);
    const livro3 = Livro.build("Livro 3", "Autor 3", "Editora 3", 2022);

    expect(livro1.quantidade).toBe(0);
    expect(livro2.quantidade).toBe(0);
    expect(livro3.quantidade).toBe(0);
  });

  test("construir com mesmo título mas diferentes autores devem ter IDs diferentes se usando build", () => {
    const livro1 = Livro.build("Mesmo Título", "Autor A", "Editora", 2024);
    const livro2 = Livro.build("Mesmo Título", "Autor B", "Editora", 2024);

    expect(livro1.titulo).toBe(livro2.titulo);
    expect(livro1.autor).not.toBe(livro2.autor);
    expect(livro1.id).not.toBe(livro2.id);
  });

  test("props devem ser imutáveis através dos getters", () => {
    const livro = Livro.construir("livro-imut", "Imutável", "Autor", "Editora", 2024, 10);

    const id = livro.id;
    const titulo = livro.titulo;
    const quantidade = livro.quantidade;

    livro.emprestar();

    expect(livro.id).toBe(id);
    expect(livro.titulo).toBe(titulo);
    expect(livro.quantidade).not.toBe(quantidade);
  });
});
