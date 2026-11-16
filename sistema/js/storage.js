/**
 * Sistema de Gerenciamento Acadêmico
 * storage.js - Módulo de persistência com LocalStorage
 * Aula 11 - Programação Web I
 */

console.log("Módulo de armazenamento carregado.");

/* ============================================
   CHAVES DE ARMAZENAMENTO
   ============================================ */
const STORAGE_KEYS = {
  alunos: "academico_alunos",
  cursos: "academico_cursos",
  matriculas: "academico_matriculas",
  usuarios: "academico_usuarios"
};

/* ============================================
   FUNÇÕES DE PERSISTÊNCIA
   ============================================ */

/**
 * Salva um array no LocalStorage (serializado em JSON)
 * @param {string} chave - Chave do LocalStorage
 * @param {Array} dados - Array a ser salvo
 */
function salvarDados(chave, dados) {
  try {
    const json = JSON.stringify(dados);
    localStorage.setItem(chave, json);
    return true;
  } catch (erro) {
    console.error("Erro ao salvar dados:", erro);
    return false;
  }
}

/**
 * Carrega um array do LocalStorage
 * @param {string} chave - Chave do LocalStorage
 * @param {Array} padrao - Valor padrão caso não exista
 * @returns {Array}
 */
function carregarDados(chave, padrao = []) {
  try {
    const json = localStorage.getItem(chave);
    if (json === null) {
      return padrao;
    }
    return JSON.parse(json);
  } catch (erro) {
    console.error("Erro ao carregar dados:", erro);
    return padrao;
  }
}

/**
 * Remove uma chave do LocalStorage
 * @param {string} chave
 */
function removerDados(chave) {
  try {
    localStorage.removeItem(chave);
    return true;
  } catch (erro) {
    console.error("Erro ao remover dados:", erro);
    return false;
  }
}

/**
 * Restaura todos os dados iniciais do sistema
 */
function restaurarDadosIniciais() {
  try {
    salvarDados(STORAGE_KEYS.alunos, alunosIniciais);
    salvarDados(STORAGE_KEYS.cursos, cursosIniciais);
    salvarDados(STORAGE_KEYS.matriculas, matriculasIniciais);
    salvarDados(STORAGE_KEYS.usuarios, usuariosIniciais);
    console.log("Dados iniciais restaurados com sucesso.");
    return true;
  } catch (erro) {
    console.error("Erro ao restaurar dados:", erro);
    return false;
  }
}

/**
 * Inicializa o armazenamento.
 * Se não houver dados salvos, grava os dados iniciais.
 */
function inicializarStorage() {
  const alunosSalvos = localStorage.getItem(STORAGE_KEYS.alunos);

  if (alunosSalvos === null) {
    console.log("Nenhum dado encontrado. Carregando dados iniciais...");
    restaurarDadosIniciais();
  } else {
    console.log("Dados encontrados no LocalStorage.");
  }
}

/**
 * Gera um novo ID seguro baseado no maior ID existente
 * @param {Array} lista - Array de objetos com propriedade id
 * @returns {number}
 */
function gerarNovoId(lista) {
  if (!lista || lista.length === 0) {
    return 1;
  }
  const maiorId = Math.max(...lista.map((item) => item.id));
  return maiorId + 1;
}
