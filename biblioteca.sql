-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Tempo de geração: 28-Nov-2024 às 19:15
-- Versão do servidor: 10.4.25-MariaDB
-- versão do PHP: 7.4.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Banco de dados: `biblioteca`
--

-- --------------------------------------------------------

--
-- Estrutura da tabela `cidade`
--

CREATE TABLE `cidade` (
  `id` int(11) NOT NULL,
  `nome` varchar(150) NOT NULL,
  `estado_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Extraindo dados da tabela `cidade`
--

INSERT INTO `cidade` (`id`, `nome`, `estado_id`) VALUES
(1, 'Rio Branco', 1),
(2, 'Maceió', 2),
(3, 'Macapá', 3),
(4, 'Manaus', 4),
(5, 'Salvador', 5),
(6, 'Fortaleza', 6),
(7, 'Brasília', 7),
(8, 'Vitória', 8),
(9, 'Goiânia', 9),
(10, 'São Luís', 10),
(11, 'Cuiabá', 11),
(12, 'Campo Grande', 12),
(13, 'Belo Horizonte', 13),
(14, 'Belém', 14),
(15, 'João Pessoa', 15),
(16, 'Curitiba', 16),
(17, 'Recife', 17),
(18, 'Teresina', 18),
(19, 'Rio de Janeiro', 19),
(20, 'Natal', 20),
(21, 'Porto Alegre', 21),
(22, 'Porto Velho', 22),
(23, 'Boa Vista', 23),
(24, 'Florianópolis', 24),
(25, 'São Paulo', 25),
(26, 'Aracaju', 26),
(27, 'Palmas', 27);

-- --------------------------------------------------------

--
-- Estrutura da tabela `emprestimo`
--

CREATE TABLE `emprestimo` (
  `id` varchar(36) NOT NULL,
  `leitor_id` varchar(36) NOT NULL,
  `livro_id` varchar(36) NOT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime NOT NULL,
  `status` tinyint(4) NOT NULL DEFAULT 0,
  `data` date NOT NULL,
  `data_prevista` date DEFAULT NULL,
  `data_entregue` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Estrutura da tabela `estado`
--

CREATE TABLE `estado` (
  `id` int(11) NOT NULL,
  `nome` varchar(100) NOT NULL,
  `sigla` char(2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Extraindo dados da tabela `estado`
--

INSERT INTO `estado` (`id`, `nome`, `sigla`) VALUES
(1, 'Acre', 'AC'),
(2, 'Alagoas', 'AL'),
(3, 'Amapá', 'AP'),
(4, 'Amazonas', 'AM'),
(5, 'Bahia', 'BA'),
(6, 'Ceará', 'CE'),
(7, 'Distrito Federal', 'DF'),
(8, 'Espírito Santo', 'ES'),
(9, 'Goiás', 'GO'),
(10, 'Maranhão', 'MA'),
(11, 'Mato Grosso', 'MT'),
(12, 'Mato Grosso do Sul', 'MS'),
(13, 'Minas Gerais', 'MG'),
(14, 'Pará', 'PA'),
(15, 'Paraíba', 'PB'),
(16, 'Paraná', 'PR'),
(17, 'Pernambuco', 'PE'),
(18, 'Piauí', 'PI'),
(19, 'Rio de Janeiro', 'RJ'),
(20, 'Rio Grande do Norte', 'RN'),
(21, 'Rio Grande do Sul', 'RS'),
(22, 'Rondônia', 'RO'),
(23, 'Roraima', 'RR'),
(24, 'Santa Catarina', 'SC'),
(25, 'São Paulo', 'SP'),
(26, 'Sergipe', 'SE'),
(27, 'Tocantins', 'TO');

-- --------------------------------------------------------

--
-- Estrutura da tabela `livro`
--

CREATE TABLE `livro` (
  `id` varchar(36) NOT NULL,
  `titulo` varchar(80) NOT NULL,
  `autor` varchar(80) NOT NULL,
  `quantidade` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Extraindo dados da tabela `livro`
--

INSERT INTO `livro` (`id`, `titulo`, `autor`, `quantidade`) VALUES
('480a732a-9cb6-458d-957b-b8115f447867', 'Verdadeiro Evangelho', 'Paul Washer', 0),
('e9da1d38-b8a4-4d29-8d8b-43fa2165cc1e', 'Números', 'Moisés', 9),
('ed3ad3dd-300d-4e76-b179-cabd8562a63f', 'Atos', 'Lucas', 0);

-- --------------------------------------------------------

--
-- Estrutura da tabela `pessoa`
--

CREATE TABLE `pessoa` (
  `id` varchar(36) NOT NULL,
  `nome` varchar(80) NOT NULL,
  `nascimento` date NOT NULL,
  `sexo` char(1) NOT NULL,
  `cpf` varchar(20) NOT NULL,
  `celular` varchar(20) NOT NULL,
  `email` varchar(80) NOT NULL,
  `logradouro` varchar(60) NOT NULL,
  `numero` varchar(20) NOT NULL,
  `bairro` varchar(60) NOT NULL,
  `cep` varchar(20) NOT NULL,
  `cidade_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Extraindo dados da tabela `pessoa`
--

INSERT INTO `pessoa` (`id`, `nome`, `nascimento`, `sexo`, `cpf`, `celular`, `email`, `logradouro`, `numero`, `bairro`, `cep`, `cidade_id`) VALUES
('1733f446-8955-4d60-b2e8-c4018e41054d', 'Maris Lima', '2018-10-01', 'F', '4454345454', '88999342321', 'maris@gmail.com', 'Rua Francisco dos Santos', '45', 'Padre Assis Monteiro', '62930000', 2),
('f628b8e0-5fc9-46bb-864d-70338a4f1ccf', 'Juca Carlos', '2024-10-01', 'M', '4454345454', '88999342321', 'juca@gmail.com', 'Rua Pedro Alves', '45', 'Centro', '62930000', 1),
('f69acb8e-4fbb-4285-bd38-11b46bbb4e6f', 'Sérgio Lima Oliveira', '2015-09-30', 'M', '09876543212', '88999342321', 'sergio@gmail.com', 'Rua Francisco dos Santos', '45', 'Padre Assis Monteiro', '62930000', 3);

--
-- Índices para tabelas despejadas
--

--
-- Índices para tabela `cidade`
--
ALTER TABLE `cidade`
  ADD PRIMARY KEY (`id`),
  ADD KEY `estado_id` (`estado_id`);

--
-- Índices para tabela `emprestimo`
--
ALTER TABLE `emprestimo`
  ADD PRIMARY KEY (`id`),
  ADD KEY `leitor_id` (`leitor_id`),
  ADD KEY `livro_id` (`livro_id`);

--
-- Índices para tabela `estado`
--
ALTER TABLE `estado`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `sigla` (`sigla`);

--
-- Índices para tabela `livro`
--
ALTER TABLE `livro`
  ADD PRIMARY KEY (`id`);

--
-- Índices para tabela `pessoa`
--
ALTER TABLE `pessoa`
  ADD PRIMARY KEY (`id`),
  ADD KEY `cidade_id` (`cidade_id`);

--
-- AUTO_INCREMENT de tabelas despejadas
--

--
-- AUTO_INCREMENT de tabela `cidade`
--
ALTER TABLE `cidade`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=28;

--
-- AUTO_INCREMENT de tabela `estado`
--
ALTER TABLE `estado`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=28;

--
-- Restrições para despejos de tabelas
--

--
-- Limitadores para a tabela `cidade`
--
ALTER TABLE `cidade`
  ADD CONSTRAINT `cidade_ibfk_1` FOREIGN KEY (`estado_id`) REFERENCES `estado` (`id`);

--
-- Limitadores para a tabela `emprestimo`
--
ALTER TABLE `emprestimo`
  ADD CONSTRAINT `emprestimo_ibfk_1` FOREIGN KEY (`leitor_id`) REFERENCES `pessoa` (`id`),
  ADD CONSTRAINT `emprestimo_ibfk_2` FOREIGN KEY (`livro_id`) REFERENCES `pessoa` (`id`);

--
-- Limitadores para a tabela `pessoa`
--
ALTER TABLE `pessoa`
  ADD CONSTRAINT `pessoa_ibfk_1` FOREIGN KEY (`cidade_id`) REFERENCES `cidade` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
