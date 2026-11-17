import { describe, test, expect } from "vitest";
import { Estado } from "../../../src/modelo/estado";
import { Cidade } from "../../../src/modelo/cidade";

describe("Estado (modelo de domínio)", () => {
  test("deve construir um estado corretamente", () => {
    const estado = new Estado(1, "São Paulo");

    expect(estado.id).toBe(1);
    expect(estado.nome).toBe("São Paulo");
  });

  test("deve permitir diferentes IDs de estado", () => {
    const estado1 = new Estado(1, "São Paulo");
    const estado2 = new Estado(2, "Rio de Janeiro");

    expect(estado1.id).not.toBe(estado2.id);
    expect(estado1.nome).not.toBe(estado2.nome);
  });

  test("deve retornar nome do estado", () => {
    const estado = new Estado(5, "Minas Gerais");

    expect(estado.nome).toBe("Minas Gerais");
  });

  test("ID deve ser numérico", () => {
    const estado = new Estado(10, "Bahia");

    expect(typeof estado.id).toBe("number");
  });

  test("Nome deve ser string", () => {
    const estado = new Estado(7, "Paraná");

    expect(typeof estado.nome).toBe("string");
  });
});

describe("Cidade (modelo de domínio)", () => {
  test("deve construir uma cidade corretamente", () => {
    const estado = new Estado(1, "São Paulo");
    const cidade = new Cidade(1, "São Paulo", estado);

    expect(cidade.id).toBe(1);
    expect(cidade.nome).toBe("São Paulo");
    expect(cidade.estado).toEqual(estado);
  });

  test("deve relacionar cidade com seu estado", () => {
    const estado = new Estado(2, "Rio de Janeiro");
    const cidade = new Cidade(2, "Rio de Janeiro", estado);

    expect(cidade.estado.id).toBe(2);
    expect(cidade.estado.nome).toBe("Rio de Janeiro");
  });

  test("deve permitir diferentes cidades do mesmo estado", () => {
    const estado = new Estado(1, "São Paulo");
    const cidade1 = new Cidade(1, "São Paulo", estado);
    const cidade2 = new Cidade(2, "Campinas", estado);

    expect(cidade1.estado).toBe(cidade2.estado);
    expect(cidade1.nome).not.toBe(cidade2.nome);
  });

  test("deve permitir cidades diferentes de diferentes estados", () => {
    const estadoSP = new Estado(1, "São Paulo");
    const estadoRJ = new Estado(2, "Rio de Janeiro");
    const cidadeSP = new Cidade(1, "São Paulo", estadoSP);
    const cidadeRJ = new Cidade(2, "Rio de Janeiro", estadoRJ);

    expect(cidadeSP.estado).not.toBe(cidadeRJ.estado);
    expect(cidadeSP.nome).not.toBe(cidadeRJ.nome);
  });

  test("ID da cidade deve ser diferente do ID do estado", () => {
    const estado = new Estado(1, "São Paulo");
    const cidade = new Cidade(5, "Santos", estado);

    expect(cidade.id).not.toBe(cidade.estado.id);
  });

  test("deve retornar todos os dados da cidade", () => {
    const estado = new Estado(3, "Minas Gerais");
    const cidade = new Cidade(10, "Belo Horizonte", estado);

    expect(cidade.id).toBe(10);
    expect(cidade.nome).toBe("Belo Horizonte");
    expect(cidade.estado.nome).toBe("Minas Gerais");
  });
});
