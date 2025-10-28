import { Livro } from "../../src/modelo/livro";

describe("Teste da classe Livro", () => {

    // Teste para o método estático 'build'
    it("Deve criar um livro corretamente com o build", () => {
        const livro = Livro.build("Título Exemplo", "Autor Exemplo", "Editora Exemplo", 2023)

        expect(typeof livro.id).toBe("string");
        expect(livro.titulo).toBe("Título Exemplo");
        expect(livro.autor).toBe("Autor Exemplo");
        expect(livro.editora).toBe("Editora Exemplo");
        expect(livro.anoLancamento).toBe(2023);
        expect(livro.quantidade).toBe(0);
    })

    // Teste para o método estático 'construir'
    it("Deve criar um livro corretamente com o constuir", () => {
        const livro = Livro.construir("IDteste","Título Exemplo", "Autor Exemplo", "Editora Exemplo", 2023,3)

        expect(livro.id).toBe("IDteste");
        expect(livro.titulo).toBe("Título Exemplo");
        expect(livro.autor).toBe("Autor Exemplo");
        expect(livro.editora).toBe("Editora Exemplo");
        expect(livro.anoLancamento).toBe(2023);
        expect(livro.quantidade).toBe(3);
    })

    // Teste para o método 'emprestar'
    it("Deve emprestar um livro corretamente", () => {
        const livro = Livro.construir("IDteste","Título Exemplo", "Autor Exemplo", "Editora Exemplo", 2023,2)

        expect(livro.emprestar()).toBe(true);
        expect(livro.quantidade).toBe(1);
    })

    // Teste build com título vazio
    it("Deve retornar erro ao tentar criar um livro com título vazio", () => {
        expect(() => {
            Livro.build("", "Autor Exemplo", "Editora Exemplo", 2023)
        }).toThrow("Título não pode ser vazio");
    })

});