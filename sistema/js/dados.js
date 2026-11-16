/**
 * Sistema de Gerenciamento Acadêmico
 * dados.js - Dados iniciais do sistema
 * Aula 11 - Programação Web I
 */

const alunosIniciais = [
  {
    id: 1,
    nome: "Ana Souza",
    email: "ana.souza@email.com",
    telefone: "(65) 99911-2233",
    cursoId: 1,
    status: "ativo",
    dataCadastro: "2026-02-10"
  },
  {
    id: 2,
    nome: "Bruno Oliveira",
    email: "bruno.oliveira@email.com",
    telefone: "(65) 98822-3344",
    cursoId: 2,
    status: "ativo",
    dataCadastro: "2026-02-12"
  },
  {
    id: 3,
    nome: "Carla Mendes",
    email: "carla.mendes@email.com",
    telefone: "(65) 97733-4455",
    cursoId: 1,
    status: "inativo",
    dataCadastro: "2026-01-20"
  },
  {
    id: 4,
    nome: "Diego Santos",
    email: "diego.santos@email.com",
    telefone: "(65) 96644-5566",
    cursoId: 3,
    status: "ativo",
    dataCadastro: "2026-03-05"
  },
  {
    id: 5,
    nome: "Elena Costa",
    email: "elena.costa@email.com",
    telefone: "(65) 95555-6677",
    cursoId: 2,
    status: "ativo",
    dataCadastro: "2026-03-15"
  }
];

const cursosIniciais = [
  {
    id: 1,
    nome: "Análise e Desenvolvimento de Sistemas",
    codigo: "ADS",
    cargaHoraria: 2000,
    status: "ativo",
    descricao: "Curso superior de tecnologia focado em desenvolvimento de software."
  },
  {
    id: 2,
    nome: "Ciência da Computação",
    codigo: "CC",
    cargaHoraria: 3200,
    status: "ativo",
    descricao: "Bacharelado em Ciência da Computação com ênfase em algoritmos e sistemas."
  },
  {
    id: 3,
    nome: "Engenharia de Software",
    codigo: "ES",
    cargaHoraria: 3600,
    status: "ativo",
    descricao: "Engenharia de Software com foco em processos e qualidade."
  },
  {
    id: 4,
    nome: "Redes de Computadores",
    codigo: "RC",
    cargaHoraria: 1600,
    status: "inativo",
    descricao: "Curso técnico em infraestrutura e redes."
  }
];

const matriculasIniciais = [
  {
    id: 1,
    alunoId: 1,
    cursoId: 1,
    dataMatricula: "2026-02-15",
    status: "ativa",
    semestre: "2026/1"
  },
  {
    id: 2,
    alunoId: 2,
    cursoId: 2,
    dataMatricula: "2026-02-18",
    status: "ativa",
    semestre: "2026/1"
  },
  {
    id: 3,
    alunoId: 3,
    cursoId: 1,
    dataMatricula: "2026-01-25",
    status: "cancelada",
    semestre: "2026/1"
  },
  {
    id: 4,
    alunoId: 4,
    cursoId: 3,
    dataMatricula: "2026-03-08",
    status: "ativa",
    semestre: "2026/1"
  },
  {
    id: 5,
    alunoId: 5,
    cursoId: 2,
    dataMatricula: "2026-03-20",
    status: "ativa",
    semestre: "2026/1"
  }
];

const usuariosIniciais = [
  {
    id: 1,
    nome: "Josemar Cristiano da Silva",
    email: "josemar@institutoinvest.edu.br",
    perfil: "admin",
    status: "ativo"
  },
  {
    id: 2,
    nome: "Maria Fernanda Lima",
    email: "maria.lima@institutoinvest.edu.br",
    perfil: "secretario",
    status: "ativo"
  },
  {
    id: 3,
    nome: "Roberto Alves",
    email: "roberto.alves@institutoinvest.edu.br",
    perfil: "coordenador",
    status: "ativo"
  },
  {
    id: 4,
    nome: "Patricia Souza",
    email: "patricia.souza@institutoinvest.edu.br",
    perfil: "secretario",
    status: "inativo"
  }
];
