/**
 * Sistema de Gerenciamento Acadêmico
 * app.js - Lógica principal da aplicação
 * Aula 11 - Programação Web I
 */

console.log("Sistema Acadêmico iniciado.");

/* ============================================
   ESTADO GLOBAL (carregado do LocalStorage)
   ============================================ */
let alunos = [];
let cursos = [];
let matriculas = [];
let usuarios = [];

/* ============================================
   INICIALIZAÇÃO
   ============================================ */
function inicializarApp() {
  inicializarStorage();

  alunos = carregarDados(STORAGE_KEYS.alunos, alunosIniciais);
  cursos = carregarDados(STORAGE_KEYS.cursos, cursosIniciais);
  matriculas = carregarDados(STORAGE_KEYS.matriculas, matriculasIniciais);
  usuarios = carregarDados(STORAGE_KEYS.usuarios, usuariosIniciais);

  const pagina = document.body.dataset.page;

  if (pagina === "dashboard") {
    atualizarDashboard();
  } else if (pagina === "alunos") {
    configurarPaginaAlunos();
  } else if (pagina === "cursos") {
    configurarPaginaCursos();
  } else if (pagina === "matriculas") {
    configurarPaginaMatriculas();
  } else if (pagina === "usuarios") {
    configurarPaginaUsuarios();
  }

  // Destacar link ativo no menu
  document.querySelectorAll(".nav a").forEach((link) => {
    if (link.dataset.page === pagina) {
      link.classList.add("active");
    }
  });
}

/* ============================================
   DASHBOARD
   ============================================ */
function atualizarDashboard() {
  const totalAlunos = document.querySelector("#total-alunos");
  const totalCursos = document.querySelector("#total-cursos");
  const totalMatriculas = document.querySelector("#total-matriculas");
  const totalUsuarios = document.querySelector("#total-usuarios");

  const alunosAtivos = document.querySelector("#alunos-ativos");
  const cursosAtivos = document.querySelector("#cursos-ativos");
  const matriculasAtivas = document.querySelector("#matriculas-ativas");
  const usuariosAtivos = document.querySelector("#usuarios-ativos");

  if (totalAlunos) totalAlunos.textContent = alunos.length;
  if (totalCursos) totalCursos.textContent = cursos.length;
  if (totalMatriculas) totalMatriculas.textContent = matriculas.length;
  if (totalUsuarios) totalUsuarios.textContent = usuarios.length;

  if (alunosAtivos) {
    alunosAtivos.textContent = alunos.filter((a) => a.status === "ativo").length + " ativos";
  }
  if (cursosAtivos) {
    cursosAtivos.textContent = cursos.filter((c) => c.status === "ativo").length + " ativos";
  }
  if (matriculasAtivas) {
    matriculasAtivas.textContent = matriculas.filter((m) => m.status === "ativa").length + " ativas";
  }
  if (usuariosAtivos) {
    usuariosAtivos.textContent = usuarios.filter((u) => u.status === "ativo").length + " ativos";
  }
}

/* ============================================
   HELPERS
   ============================================ */
function obterNomeCurso(cursoId) {
  const curso = cursos.find((c) => c.id === cursoId);
  return curso ? curso.nome : "—";
}

function obterNomeAluno(alunoId) {
  const aluno = alunos.find((a) => a.id === alunoId);
  return aluno ? aluno.nome : "—";
}

function formatarData(dataStr) {
  if (!dataStr) return "—";
  const [ano, mes, dia] = dataStr.split("-");
  return `${dia}/${mes}/${ano}`;
}

function mostrarAlerta(mensagem, tipo = "success") {
  const alerta = document.querySelector("#alerta");
  if (!alerta) return;

  alerta.textContent = mensagem;
  alerta.className = `alert alert-${tipo} show`;

  setTimeout(() => {
    alerta.classList.remove("show");
  }, 3500);
}

function abrirModal(id) {
  const modal = document.querySelector(`#${id}`);
  if (modal) modal.classList.add("open");
}

function fecharModal(id) {
  const modal = document.querySelector(`#${id}`);
  if (modal) modal.classList.remove("open");
}

/* ============================================
   PÁGINA DE ALUNOS
   ============================================ */
function configurarPaginaAlunos() {
  renderizarAlunos(alunos);
  atualizarDashboard(); // atualiza contadores se existirem

  // Busca
  const campoBusca = document.querySelector("#busca-aluno");
  if (campoBusca) {
    campoBusca.addEventListener("input", filtrarAlunos);
  }

  // Filtro de status
  const filtroStatus = document.querySelector("#filtro-status");
  if (filtroStatus) {
    filtroStatus.addEventListener("change", filtrarAlunos);
  }

  // Botão novo aluno
  const btnNovo = document.querySelector("#btn-novo-aluno");
  if (btnNovo) {
    btnNovo.addEventListener("click", () => {
      document.querySelector("#form-aluno").reset();
      document.querySelector("#aluno-id").value = "";
      document.querySelector("#modal-aluno-titulo").textContent = "Novo Aluno";
      preencherSelectCursos();
      abrirModal("modal-aluno");
    });
  }

  // Submit do formulário
  const form = document.querySelector("#form-aluno");
  if (form) {
    form.addEventListener("submit", salvarAluno);
  }

  // Fechar modal
  document.querySelectorAll("[data-close]").forEach((btn) => {
    btn.addEventListener("click", () => {
      fecharModal(btn.dataset.close);
    });
  });

  // Restaurar dados
  const btnRestaurar = document.querySelector("#btn-restaurar");
  if (btnRestaurar) {
    btnRestaurar.addEventListener("click", () => {
      if (confirm("Deseja restaurar os dados iniciais? Todas as alterações serão perdidas.")) {
        restaurarDadosIniciais();
        alunos = carregarDados(STORAGE_KEYS.alunos, alunosIniciais);
        cursos = carregarDados(STORAGE_KEYS.cursos, cursosIniciais);
        matriculas = carregarDados(STORAGE_KEYS.matriculas, matriculasIniciais);
        usuarios = carregarDados(STORAGE_KEYS.usuarios, usuariosIniciais);
        renderizarAlunos(alunos);
        mostrarAlerta("Dados iniciais restaurados com sucesso!", "info");
      }
    });
  }
}

function preencherSelectCursos() {
  const select = document.querySelector("#aluno-curso");
  if (!select) return;

  select.innerHTML = '<option value="">Selecione o curso</option>';
  cursos
    .filter((c) => c.status === "ativo")
    .forEach((curso) => {
      const option = document.createElement("option");
      option.value = curso.id;
      option.textContent = curso.nome;
      select.appendChild(option);
    });
}

function filtrarAlunos() {
  const termo = (document.querySelector("#busca-aluno")?.value || "").toLowerCase().trim();
  const status = document.querySelector("#filtro-status")?.value || "";

  let resultado = [...alunos];

  if (termo) {
    resultado = resultado.filter(
      (a) =>
        a.nome.toLowerCase().includes(termo) ||
        a.email.toLowerCase().includes(termo)
    );
  }

  if (status) {
    resultado = resultado.filter((a) => a.status === status);
  }

  renderizarAlunos(resultado);
}

function renderizarAlunos(lista) {
  const tbody = document.querySelector("#lista-alunos");
  if (!tbody) return;

  tbody.innerHTML = "";

  if (lista.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="6">
          <div class="empty-state">
            <div class="empty-state-icon">📋</div>
            <p>Nenhum aluno encontrado.</p>
          </div>
        </td>
      </tr>`;
    return;
  }

  lista.forEach((aluno) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td><strong>${aluno.nome}</strong></td>
      <td>${aluno.email}</td>
      <td>${obterNomeCurso(aluno.cursoId)}</td>
      <td><span class="badge badge-${aluno.status}">${aluno.status}</span></td>
      <td>${formatarData(aluno.dataCadastro)}</td>
      <td>
        <div class="actions">
          <button class="btn btn-outline btn-sm btn-icon" title="Detalhes" onclick="verDetalhesAluno(${aluno.id})">👁️</button>
          <button class="btn btn-outline btn-sm btn-icon" title="Editar" onclick="editarAluno(${aluno.id})">✏️</button>
          <button class="btn btn-outline btn-sm btn-icon" title="Alternar status" onclick="alternarStatusAluno(${aluno.id})">🔄</button>
          <button class="btn btn-danger btn-sm btn-icon" title="Remover" onclick="removerAluno(${aluno.id})">🗑️</button>
        </div>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

function salvarAluno(event) {
  event.preventDefault();

  const id = document.querySelector("#aluno-id").value;
  const nome = document.querySelector("#aluno-nome").value.trim();
  const email = document.querySelector("#aluno-email").value.trim();
  const telefone = document.querySelector("#aluno-telefone").value.trim();
  const cursoId = Number(document.querySelector("#aluno-curso").value);
  const status = document.querySelector("#aluno-status").value;

  if (!nome || !email || !cursoId) {
    mostrarAlerta("Preencha todos os campos obrigatórios.", "error");
    return;
  }

  if (id) {
    // Edição
    const index = alunos.findIndex((a) => a.id === Number(id));
    if (index !== -1) {
      alunos[index] = {
        ...alunos[index],
        nome,
        email,
        telefone,
        cursoId,
        status
      };
      mostrarAlerta("Aluno atualizado com sucesso!");
    }
  } else {
    // Novo cadastro
    const novoAluno = {
      id: gerarNovoId(alunos),
      nome,
      email,
      telefone,
      cursoId,
      status,
      dataCadastro: new Date().toISOString().split("T")[0]
    };
    alunos.push(novoAluno);
    mostrarAlerta("Aluno cadastrado com sucesso!");
  }

  salvarDados(STORAGE_KEYS.alunos, alunos);
  renderizarAlunos(alunos);
  fecharModal("modal-aluno");

  // Limpar filtros
  const busca = document.querySelector("#busca-aluno");
  const filtro = document.querySelector("#filtro-status");
  if (busca) busca.value = "";
  if (filtro) filtro.value = "";
}

function editarAluno(id) {
  const aluno = alunos.find((a) => a.id === id);
  if (!aluno) return;

  preencherSelectCursos();

  document.querySelector("#aluno-id").value = aluno.id;
  document.querySelector("#aluno-nome").value = aluno.nome;
  document.querySelector("#aluno-email").value = aluno.email;
  document.querySelector("#aluno-telefone").value = aluno.telefone || "";
  document.querySelector("#aluno-curso").value = aluno.cursoId;
  document.querySelector("#aluno-status").value = aluno.status;
  document.querySelector("#modal-aluno-titulo").textContent = "Editar Aluno";

  abrirModal("modal-aluno");
}

function verDetalhesAluno(id) {
  const aluno = alunos.find((a) => a.id === id);
  if (!aluno) return;

  const body = document.querySelector("#detalhes-aluno-body");
  body.innerHTML = `
    <div class="detail-grid">
      <div class="detail-item">
        <span class="detail-label">Nome</span>
        <span class="detail-value">${aluno.nome}</span>
      </div>
      <div class="detail-item">
        <span class="detail-label">E-mail</span>
        <span class="detail-value">${aluno.email}</span>
      </div>
      <div class="detail-item">
        <span class="detail-label">Telefone</span>
        <span class="detail-value">${aluno.telefone || "—"}</span>
      </div>
      <div class="detail-item">
        <span class="detail-label">Curso</span>
        <span class="detail-value">${obterNomeCurso(aluno.cursoId)}</span>
      </div>
      <div class="detail-item">
        <span class="detail-label">Status</span>
        <span class="detail-value"><span class="badge badge-${aluno.status}">${aluno.status}</span></span>
      </div>
      <div class="detail-item">
        <span class="detail-label">Data de Cadastro</span>
        <span class="detail-value">${formatarData(aluno.dataCadastro)}</span>
      </div>
    </div>
  `;

  abrirModal("modal-detalhes");
}

function alternarStatusAluno(id) {
  const index = alunos.findIndex((a) => a.id === id);
  if (index === -1) return;

  alunos[index].status = alunos[index].status === "ativo" ? "inativo" : "ativo";
  salvarDados(STORAGE_KEYS.alunos, alunos);
  filtrarAlunos();
  mostrarAlerta(`Status alterado para "${alunos[index].status}".`);
}

function removerAluno(id) {
  const aluno = alunos.find((a) => a.id === id);
  if (!aluno) return;

  if (!confirm(`Deseja realmente remover o aluno "${aluno.nome}"?`)) return;

  alunos = alunos.filter((a) => a.id !== id);
  salvarDados(STORAGE_KEYS.alunos, alunos);
  filtrarAlunos();
  mostrarAlerta("Aluno removido com sucesso!");
}

/* ============================================
   PÁGINA DE CURSOS
   ============================================ */
function configurarPaginaCursos() {
  renderizarCursos(cursos);

  const campoBusca = document.querySelector("#busca-curso");
  if (campoBusca) {
    campoBusca.addEventListener("input", () => {
      const termo = campoBusca.value.toLowerCase().trim();
      const filtrados = cursos.filter(
        (c) =>
          c.nome.toLowerCase().includes(termo) ||
          c.codigo.toLowerCase().includes(termo)
      );
      renderizarCursos(filtrados);
    });
  }

  const btnNovo = document.querySelector("#btn-novo-curso");
  if (btnNovo) {
    btnNovo.addEventListener("click", () => {
      document.querySelector("#form-curso").reset();
      document.querySelector("#curso-id").value = "";
      document.querySelector("#modal-curso-titulo").textContent = "Novo Curso";
      abrirModal("modal-curso");
    });
  }

  const form = document.querySelector("#form-curso");
  if (form) {
    form.addEventListener("submit", salvarCurso);
  }

  document.querySelectorAll("[data-close]").forEach((btn) => {
    btn.addEventListener("click", () => fecharModal(btn.dataset.close));
  });
}

function renderizarCursos(lista) {
  const tbody = document.querySelector("#lista-cursos");
  if (!tbody) return;

  tbody.innerHTML = "";

  if (lista.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="5">
          <div class="empty-state">
            <div class="empty-state-icon">📚</div>
            <p>Nenhum curso encontrado.</p>
          </div>
        </td>
      </tr>`;
    return;
  }

  lista.forEach((curso) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td><strong>${curso.codigo}</strong></td>
      <td>${curso.nome}</td>
      <td>${curso.cargaHoraria}h</td>
      <td><span class="badge badge-${curso.status}">${curso.status}</span></td>
      <td>
        <div class="actions">
          <button class="btn btn-outline btn-sm btn-icon" title="Editar" onclick="editarCurso(${curso.id})">✏️</button>
          <button class="btn btn-outline btn-sm btn-icon" title="Alternar status" onclick="alternarStatusCurso(${curso.id})">🔄</button>
          <button class="btn btn-danger btn-sm btn-icon" title="Remover" onclick="removerCurso(${curso.id})">🗑️</button>
        </div>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

function salvarCurso(event) {
  event.preventDefault();

  const id = document.querySelector("#curso-id").value;
  const nome = document.querySelector("#curso-nome").value.trim();
  const codigo = document.querySelector("#curso-codigo").value.trim().toUpperCase();
  const cargaHoraria = Number(document.querySelector("#curso-carga").value);
  const status = document.querySelector("#curso-status").value;
  const descricao = document.querySelector("#curso-descricao").value.trim();

  if (!nome || !codigo || !cargaHoraria) {
    mostrarAlerta("Preencha todos os campos obrigatórios.", "error");
    return;
  }

  if (id) {
    const index = cursos.findIndex((c) => c.id === Number(id));
    if (index !== -1) {
      cursos[index] = { ...cursos[index], nome, codigo, cargaHoraria, status, descricao };
      mostrarAlerta("Curso atualizado com sucesso!");
    }
  } else {
    const novoCurso = {
      id: gerarNovoId(cursos),
      nome,
      codigo,
      cargaHoraria,
      status,
      descricao
    };
    cursos.push(novoCurso);
    mostrarAlerta("Curso cadastrado com sucesso!");
  }

  salvarDados(STORAGE_KEYS.cursos, cursos);
  renderizarCursos(cursos);
  fecharModal("modal-curso");
}

function editarCurso(id) {
  const curso = cursos.find((c) => c.id === id);
  if (!curso) return;

  document.querySelector("#curso-id").value = curso.id;
  document.querySelector("#curso-nome").value = curso.nome;
  document.querySelector("#curso-codigo").value = curso.codigo;
  document.querySelector("#curso-carga").value = curso.cargaHoraria;
  document.querySelector("#curso-status").value = curso.status;
  document.querySelector("#curso-descricao").value = curso.descricao || "";
  document.querySelector("#modal-curso-titulo").textContent = "Editar Curso";

  abrirModal("modal-curso");
}

function alternarStatusCurso(id) {
  const index = cursos.findIndex((c) => c.id === id);
  if (index === -1) return;

  cursos[index].status = cursos[index].status === "ativo" ? "inativo" : "ativo";
  salvarDados(STORAGE_KEYS.cursos, cursos);
  renderizarCursos(cursos);
  mostrarAlerta(`Status alterado para "${cursos[index].status}".`);
}

function removerCurso(id) {
  const curso = cursos.find((c) => c.id === id);
  if (!curso) return;

  if (!confirm(`Deseja realmente remover o curso "${curso.nome}"?`)) return;

  cursos = cursos.filter((c) => c.id !== id);
  salvarDados(STORAGE_KEYS.cursos, cursos);
  renderizarCursos(cursos);
  mostrarAlerta("Curso removido com sucesso!");
}

/* ============================================
   PÁGINA DE MATRÍCULAS
   ============================================ */
function configurarPaginaMatriculas() {
  renderizarMatriculas(matriculas);

  const campoBusca = document.querySelector("#busca-matricula");
  if (campoBusca) {
    campoBusca.addEventListener("input", () => {
      const termo = campoBusca.value.toLowerCase().trim();
      const filtrados = matriculas.filter((m) => {
        const nomeAluno = obterNomeAluno(m.alunoId).toLowerCase();
        const nomeCurso = obterNomeCurso(m.cursoId).toLowerCase();
        return nomeAluno.includes(termo) || nomeCurso.includes(termo);
      });
      renderizarMatriculas(filtrados);
    });
  }

  const btnNovo = document.querySelector("#btn-nova-matricula");
  if (btnNovo) {
    btnNovo.addEventListener("click", () => {
      document.querySelector("#form-matricula").reset();
      document.querySelector("#matricula-id").value = "";
      document.querySelector("#modal-matricula-titulo").textContent = "Nova Matrícula";
      preencherSelectsMatricula();
      abrirModal("modal-matricula");
    });
  }

  const form = document.querySelector("#form-matricula");
  if (form) {
    form.addEventListener("submit", salvarMatricula);
  }

  document.querySelectorAll("[data-close]").forEach((btn) => {
    btn.addEventListener("click", () => fecharModal(btn.dataset.close));
  });
}

function preencherSelectsMatricula() {
  const selectAluno = document.querySelector("#matricula-aluno");
  const selectCurso = document.querySelector("#matricula-curso");

  if (selectAluno) {
    selectAluno.innerHTML = '<option value="">Selecione o aluno</option>';
    alunos
      .filter((a) => a.status === "ativo")
      .forEach((aluno) => {
        const option = document.createElement("option");
        option.value = aluno.id;
        option.textContent = aluno.nome;
        selectAluno.appendChild(option);
      });
  }

  if (selectCurso) {
    selectCurso.innerHTML = '<option value="">Selecione o curso</option>';
    cursos
      .filter((c) => c.status === "ativo")
      .forEach((curso) => {
        const option = document.createElement("option");
        option.value = curso.id;
        option.textContent = curso.nome;
        selectCurso.appendChild(option);
      });
  }
}

function renderizarMatriculas(lista) {
  const tbody = document.querySelector("#lista-matriculas");
  if (!tbody) return;

  tbody.innerHTML = "";

  if (lista.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="5">
          <div class="empty-state">
            <div class="empty-state-icon">📝</div>
            <p>Nenhuma matrícula encontrada.</p>
          </div>
        </td>
      </tr>`;
    return;
  }

  lista.forEach((mat) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td><strong>${obterNomeAluno(mat.alunoId)}</strong></td>
      <td>${obterNomeCurso(mat.cursoId)}</td>
      <td>${mat.semestre}</td>
      <td><span class="badge badge-${mat.status}">${mat.status}</span></td>
      <td>
        <div class="actions">
          <button class="btn btn-outline btn-sm btn-icon" title="Alternar status" onclick="alternarStatusMatricula(${mat.id})">🔄</button>
          <button class="btn btn-danger btn-sm btn-icon" title="Remover" onclick="removerMatricula(${mat.id})">🗑️</button>
        </div>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

function salvarMatricula(event) {
  event.preventDefault();

  const alunoId = Number(document.querySelector("#matricula-aluno").value);
  const cursoId = Number(document.querySelector("#matricula-curso").value);
  const semestre = document.querySelector("#matricula-semestre").value.trim();
  const status = document.querySelector("#matricula-status").value;

  if (!alunoId || !cursoId || !semestre) {
    mostrarAlerta("Preencha todos os campos obrigatórios.", "error");
    return;
  }

  const novaMatricula = {
    id: gerarNovoId(matriculas),
    alunoId,
    cursoId,
    dataMatricula: new Date().toISOString().split("T")[0],
    status,
    semestre
  };

  matriculas.push(novaMatricula);
  salvarDados(STORAGE_KEYS.matriculas, matriculas);
  renderizarMatriculas(matriculas);
  fecharModal("modal-matricula");
  mostrarAlerta("Matrícula realizada com sucesso!");
}

function alternarStatusMatricula(id) {
  const index = matriculas.findIndex((m) => m.id === id);
  if (index === -1) return;

  const statusAtual = matriculas[index].status;
  if (statusAtual === "ativa") {
    matriculas[index].status = "cancelada";
  } else {
    matriculas[index].status = "ativa";
  }

  salvarDados(STORAGE_KEYS.matriculas, matriculas);
  renderizarMatriculas(matriculas);
  mostrarAlerta(`Status alterado para "${matriculas[index].status}".`);
}

function removerMatricula(id) {
  if (!confirm("Deseja realmente remover esta matrícula?")) return;

  matriculas = matriculas.filter((m) => m.id !== id);
  salvarDados(STORAGE_KEYS.matriculas, matriculas);
  renderizarMatriculas(matriculas);
  mostrarAlerta("Matrícula removida com sucesso!");
}

/* ============================================
   PÁGINA DE USUÁRIOS
   ============================================ */
function configurarPaginaUsuarios() {
  renderizarUsuarios(usuarios);

  const campoBusca = document.querySelector("#busca-usuario");
  if (campoBusca) {
    campoBusca.addEventListener("input", () => {
      const termo = campoBusca.value.toLowerCase().trim();
      const filtrados = usuarios.filter(
        (u) =>
          u.nome.toLowerCase().includes(termo) ||
          u.email.toLowerCase().includes(termo)
      );
      renderizarUsuarios(filtrados);
    });
  }

  const btnNovo = document.querySelector("#btn-novo-usuario");
  if (btnNovo) {
    btnNovo.addEventListener("click", () => {
      document.querySelector("#form-usuario").reset();
      document.querySelector("#usuario-id").value = "";
      document.querySelector("#modal-usuario-titulo").textContent = "Novo Usuário";
      abrirModal("modal-usuario");
    });
  }

  const form = document.querySelector("#form-usuario");
  if (form) {
    form.addEventListener("submit", salvarUsuario);
  }

  document.querySelectorAll("[data-close]").forEach((btn) => {
    btn.addEventListener("click", () => fecharModal(btn.dataset.close));
  });
}

function renderizarUsuarios(lista) {
  const tbody = document.querySelector("#lista-usuarios");
  if (!tbody) return;

  tbody.innerHTML = "";

  if (lista.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="4">
          <div class="empty-state">
            <div class="empty-state-icon">👤</div>
            <p>Nenhum usuário encontrado.</p>
          </div>
        </td>
      </tr>`;
    return;
  }

  lista.forEach((usuario) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td><strong>${usuario.nome}</strong></td>
      <td>${usuario.email}</td>
      <td><span class="badge badge-${usuario.perfil}">${usuario.perfil}</span></td>
      <td>
        <div class="actions">
          <button class="btn btn-outline btn-sm btn-icon" title="Editar" onclick="editarUsuario(${usuario.id})">✏️</button>
          <button class="btn btn-outline btn-sm btn-icon" title="Alternar status" onclick="alternarStatusUsuario(${usuario.id})">🔄</button>
          <button class="btn btn-danger btn-sm btn-icon" title="Remover" onclick="removerUsuario(${usuario.id})">🗑️</button>
        </div>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

function salvarUsuario(event) {
  event.preventDefault();

  const id = document.querySelector("#usuario-id").value;
  const nome = document.querySelector("#usuario-nome").value.trim();
  const email = document.querySelector("#usuario-email").value.trim();
  const perfil = document.querySelector("#usuario-perfil").value;
  const status = document.querySelector("#usuario-status").value;

  if (!nome || !email || !perfil) {
    mostrarAlerta("Preencha todos os campos obrigatórios.", "error");
    return;
  }

  if (id) {
    const index = usuarios.findIndex((u) => u.id === Number(id));
    if (index !== -1) {
      usuarios[index] = { ...usuarios[index], nome, email, perfil, status };
      mostrarAlerta("Usuário atualizado com sucesso!");
    }
  } else {
    const novoUsuario = {
      id: gerarNovoId(usuarios),
      nome,
      email,
      perfil,
      status
    };
    usuarios.push(novoUsuario);
    mostrarAlerta("Usuário cadastrado com sucesso!");
  }

  salvarDados(STORAGE_KEYS.usuarios, usuarios);
  renderizarUsuarios(usuarios);
  fecharModal("modal-usuario");
}

function editarUsuario(id) {
  const usuario = usuarios.find((u) => u.id === id);
  if (!usuario) return;

  document.querySelector("#usuario-id").value = usuario.id;
  document.querySelector("#usuario-nome").value = usuario.nome;
  document.querySelector("#usuario-email").value = usuario.email;
  document.querySelector("#usuario-perfil").value = usuario.perfil;
  document.querySelector("#usuario-status").value = usuario.status;
  document.querySelector("#modal-usuario-titulo").textContent = "Editar Usuário";

  abrirModal("modal-usuario");
}

function alternarStatusUsuario(id) {
  const index = usuarios.findIndex((u) => u.id === id);
  if (index === -1) return;

  usuarios[index].status = usuarios[index].status === "ativo" ? "inativo" : "ativo";
  salvarDados(STORAGE_KEYS.usuarios, usuarios);
  renderizarUsuarios(usuarios);
  mostrarAlerta(`Status alterado para "${usuarios[index].status}".`);
}

function removerUsuario(id) {
  const usuario = usuarios.find((u) => u.id === id);
  if (!usuario) return;

  if (!confirm(`Deseja realmente remover o usuário "${usuario.nome}"?`)) return;

  usuarios = usuarios.filter((u) => u.id !== id);
  salvarDados(STORAGE_KEYS.usuarios, usuarios);
  renderizarUsuarios(usuarios);
  mostrarAlerta("Usuário removido com sucesso!");
}

/* ============================================
   INICIAR QUANDO O DOM ESTIVER PRONTO
   ============================================ */
document.addEventListener("DOMContentLoaded", inicializarApp);
