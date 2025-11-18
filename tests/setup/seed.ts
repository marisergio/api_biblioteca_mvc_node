import conexao from "../../src/util/conexao";
import crypto from "crypto";

function gerarNumeroAleatorioCPF(): string {
  let numero = '';
  for (let i = 0; i < 11; i++) {
    numero += Math.floor(Math.random() * 10); // gera dígito de 0 a 9
  }
  return numero;
}


export async function criarPessoa(nome = "João") {
  const id = crypto.randomUUID();
  await conexao.query(
    `INSERT INTO pessoas(id, nome, cpf) VALUES(?, ?, ?)`,
    [id, nome, gerarNumeroAleatorioCPF()],
  );
  return id;
}

export async function criarLivro(titulo = "Livro Teste", quantidade = 1) {
  const id = crypto.randomUUID();
  await conexao.query(
    `INSERT INTO livro(id, titulo, autor, editora, ano_lancamento, quantidade) VALUES(?, ?, ?, ?, ?, ?)`,
    [id, titulo, "Autor", "Editora", 2024, quantidade],
  );
  return id;
}
