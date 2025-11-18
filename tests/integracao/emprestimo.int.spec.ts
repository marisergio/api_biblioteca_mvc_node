import request from "supertest";
import "reflect-metadata";
import { Api } from "../../src/api/api";
import { EmprestimoApi } from "../../src/api/emprestimo.api";
import { LivroApi } from "../../src/api/livro.api";
import { PessoaApi } from "../../src/api/pessoa.api";
import { criarLivro, criarPessoa } from "../setup/seed";
import { EmprestimoServico } from "../../src/servico/emprestimo.servico";
import { EmprestimoDao } from "../../src/dao/emprestimo.dao";
import { LivroDao } from "../../src/dao/livro.dao";
import { EmprestimoDtoCreate } from "../../src/dto/emprestimo.dto";

let app: any;

describe("Integração - Emprestar Livro", () => {

  beforeAll(() => {
    const api = Api.build();
    PessoaApi.build(api);
    LivroApi.build(api);
    EmprestimoApi.build(api);
    app = api["app"]; // pega o Express interno sem dar listen()
  });

  test("deve emprestar um livro com sucesso (201)", async () => {
    const leitorId = await criarPessoa();
    const livroId = await criarLivro("Clean Code", 2);

    const payload: EmprestimoDtoCreate = {
      leitor_id: leitorId,
      livro_id: livroId,
      data: new Date(),
    };
    
    const emprestimoServico = new EmprestimoServico(new EmprestimoDao(), new LivroDao());
    const res = await emprestimoServico.emprestar(payload);
    expect(res).toBe(true);

    //const res = await request(app).post("/emprestimo").send(payload);
    //expect(res.status).toBe(201);
  });

  test("não deve permitir empréstimo se o leitor já tem 2 empréstimos ativos", async () => {
    const leitorId = await criarPessoa();
    const livro1 = await criarLivro("Livro 1", 5);
    const livro2 = await criarLivro("Livro 2", 5);
    const livro3 = await criarLivro("Livro 3", 5);

    const data = new Date().toISOString();

    // 1° empréstimo
    await request(app).post("/emprestimo").send({
      leitor_id: leitorId,
      livro_id: livro1,
      data,
    });

    // 2° empréstimo
    await request(app).post("/emprestimo").send({
      leitor_id: leitorId,
      livro_id: livro2,
      data,
    });

    // 3° deve falhar
    const res3 = await request(app).post("/emprestimo").send({
      leitor_id: leitorId,
      livro_id: livro3,
      data,
    });

    expect(res3.status).toBe(500);
    expect(res3.body.mensagem.message).toBe("Erro: leitor já possui 2 empréstimos.");
  });

  test("não deve permitir empréstimo quando não há mais unidades disponíveis", async () => {
    const leitor1 = await criarPessoa("Pessoa 1");
    const leitor2 = await criarPessoa("Pessoa 2");

    const livroId = await criarLivro("Sapiens", 1); // só 1 unidade

    const data = new Date().toISOString();

    // 1º leitor empresta normalmente
    await request(app).post("/emprestimo").send({
      leitor_id: leitor1,
      livro_id: livroId,
      data,
    });

    // 2º leitor tenta pegar o mesmo livro → deve falhar
    const res = await request(app).post("/emprestimo").send({
      leitor_id: leitor2,
      livro_id: livroId,
      data,
    });

    expect(res.status).toBe(500);
    expect(res.body.mensagem.message).toBe("Erro: este livro não está disponível.");
  });

  test("deve retornar 400 quando o DTO for inválido", async () => {
    const res = await request(app).post("/emprestimo").send({
      leitor_id: "",
      livro_id: "",
      data: "not a date",
    });

    expect(res.status).toBe(400);
    expect(res.body.errors).toBeDefined();
  });
});
