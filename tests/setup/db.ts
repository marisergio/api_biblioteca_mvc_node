import conexao from "../../src/util/conexao";
import "reflect-metadata";


beforeAll(async () => {
  await conexao.query("DELETE FROM emprestimos");
  await conexao.query("DELETE FROM livro");
  await conexao.query("DELETE FROM pessoas");
});

beforeEach(async () => {
  // limpa só a tabela de empréstimos entre os cenários
  await conexao.query("DELETE FROM emprestimos");
});

afterAll(async () => {
  await conexao.end();
});
