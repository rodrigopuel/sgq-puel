// Cliente Supabase para SGQ PUEL
// Configuração e funções de acesso ao banco de dados

class SupabaseClient {
  constructor() {
    // Configuração do Supabase - substitua com suas credenciais
    this.supabaseUrl = 'https://gbqconazgradrkmqkazl.supabase.co';
    this.supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdicWNvbmF6Z3JhZHJrbXFrYXpsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzcyMjY2NDAsImV4cCI6MjA5MjgwMjY0MH0.KR2VyUXp5aoSN0Y1GrPhLIylWLqzlMMOPI4wFHw1lR8';
    
    // Inicializa o cliente Supabase
    this.client = null;
    this.usuarioAtual = null;
    this.init();
  }

  async init() {
    // Carrega o SDK do Supabase
    await this.loadSupabaseSDK();
    
    // Inicializa o cliente
    this.client = window.supabase.createClient(this.supabaseUrl, this.supabaseKey);
    
    // Verifica sessão existente
    const { data: { session } } = await this.client.auth.getSession();
    if (session) {
      this.usuarioAtual = session.user;
    }
  }

  async loadSupabaseSDK() {
    return new Promise((resolve, reject) => {
      if (window.supabase) {
        resolve();
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://unpkg.com/@supabase/supabase-js@2';
      script.onload = resolve;
      script.onerror = reject;
      document.head.appendChild(script);
    });
  }

  // Autenticação
  async login(email, senha) {
    try {
      console.log('Tentando login com:', email, senha);
      console.log('URL Supabase:', this.supabaseUrl);
      
      // Teste básico de conexão
      const { data: testData, error: testError } = await this.client
        .from('usuarios')
        .select('count')
        .limit(1);
      
      console.log('Teste de conexão:', testData, testError);
      
      // Tenta buscar sem filtros primeiro
      const { data: todosUsuarios, error: allError } = await this.client
        .from('usuarios')
        .select('email, nome, ativo, senha');
      
      console.log('Todos os usuários (sem filtro):', todosUsuarios);
      console.log('Erro geral:', allError);
      
      // Se não encontrar nada, tenta desabilitar RLS temporariamente
      if (!todosUsuarios || todosUsuarios.length === 0) {
        console.log('Tentando bypass RLS...');
        const { data: bypassData, error: bypassError } = await this.client
          .rpc('get_all_users');
        
        console.log('Bypass result:', bypassData, bypassError);
      }
      
      // Busca usuário específico
      const { data: usuarios, error } = await this.client
        .from('usuarios')
        .select('*')
        .eq('email', email)
        .eq('senha', senha)
        .eq('ativo', true);
      
      console.log('Usuários encontrados:', usuarios);
      console.log('Erro na consulta:', error);
      
      if (error) {
        console.error('Erro na consulta:', error);
        throw new Error('Erro ao buscar usuário: ' + error.message);
      }
      
      const usuario = usuarios && usuarios.length > 0 ? usuarios[0] : null;
      
      if (!usuario) {
        console.log('Nenhum usuário encontrado com os critérios');
        // Mostra todos os usuários para debug
        if (todosUsuarios && todosUsuarios.length > 0) {
          console.log('Usuários disponíveis:', todosUsuarios.map(u => ({email: u.email, ativo: u.ativo})));
        }
        throw new Error('E-mail ou senha incorretos');
      }

      this.usuarioAtual = usuario;
      return usuario;
    } catch (error) {
      console.error('Erro no login:', error);
      throw error;
    }
  }

  async logout() {
    this.usuarioAtual = null;
    // Futuro: await this.client.auth.signOut();
  }

  // Funções genéricas CRUD
  async get(tabela, filtros = {}) {
    try {
      let query = this.client.from(tabela).select('*');
      
      Object.entries(filtros).forEach(([chave, valor]) => {
        if (Array.isArray(valor)) {
          query = query.in(chave, valor);
        } else {
          query = query.eq(chave, valor);
        }
      });

      const { data, error } = await query;
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error(`Erro ao buscar ${tabela}:`, error);
      return [];
    }
  }

  async getById(tabela, id) {
    try {
      const { data, error } = await this.client
        .from(tabela)
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error(`Erro ao buscar ${tabela} por ID:`, error);
      return null;
    }
  }

  async insert(tabela, dados) {
    try {
      const { data, error } = await this.client
        .from(tabela)
        .insert([dados])
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error(`Erro ao inserir em ${tabela}:`, error);
      throw error;
    }
  }

  async update(tabela, id, dados) {
    try {
      const { data, error } = await this.client
        .from(tabela)
        .update(dados)
        .eq('id', id)
        .select();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error(`Erro ao atualizar ${tabela}:`, error);
      throw error;
    }
  }

  async remove(tabela, id) {
    try {
      console.log(`Tentando remover ${tabela} com id ${id}`);
      const { data, error } = await this.client
        .from(tabela)
        .delete()
        .eq('id', id)
        .select();

      console.log(`Resultado remove ${tabela}:`, { data, error });
      
      if (error) throw error;
      console.log(`${tabela} excluída com sucesso, registros afetados:`, data?.length || 0);
      return data;
    } catch (error) {
      console.error(`Erro ao remover ${tabela}:`, error);
      throw error;
    }
  }

  // Funções específicas do SGQ
  async getUsuarios() {
    return this.get('usuarios'); // Retorna todos os usuários (ativos e inativos)
  }

  async getObras(ativas = false) {
    const filtros = ativas ? { status: 'ativa' } : {};
    return this.get('obras', filtros);
  }

  async getTemplatesFVS() {
    return this.get('templates_fvs', { status: 'vigor' });
  }

  async getTemplatesFVM() {
    return this.get('templates_fvm');
  }

  async getFVS(filtros = {}) {
    return this.get('fvs', filtros);
  }

  async getFVM(filtros = {}) {
    return this.get('fvm', filtros);
  }

  async getOcorrencias(filtros = {}) {
    return this.get('ocorrencias', filtros);
  }

  async getFornecedores(ativos = true) {
    const filtros = ativos ? { status: 'ativo' } : {};
    return this.get('fornecedores', filtros);
  }

  // Funções para migração de dados
  async migrarDadosLocais() {
    if (!confirm('Deseja migrar todos os dados do localStorage para o Supabase? Esta ação não pode ser desfeita.')) {
      return;
    }

    try {
      toast('Iniciando migração...', 'info');
      
      // Migrar usuários
      await this.migrarUsuarios();
      
      // Migrar obras
      await this.migrarObras();
      
      // Migrar templates
      await this.migrarTemplates();
      
      // Migrar FVS
      await this.migrarFVS();
      
      // Migrar FVM
      await this.migrarFVM();
      
      // Migrar fornecedores
      await this.migrarFornecedores();
      
      toast('Migração concluída com sucesso!', 'success');
    } catch (error) {
      console.error('Erro na migração:', error);
      toast('Erro na migração: ' + error.message, 'error');
    }
  }

  async migrarUsuarios() {
    const usuarios = DB.getArr('usuarios');
    for (const usuario of usuarios) {
      try {
        await this.insert('usuarios', {
          id: usuario.id,
          nome: usuario.nome,
          email: usuario.email,
          perfil: usuario.perfil,
          senha: usuario.senha, // Temporário
          ativo: usuario.ativo
        });
      } catch (error) {
        // Ignora erros de duplicidade
        if (!error.message.includes('duplicate key')) {
          throw error;
        }
      }
    }
  }

  async migrarObras() {
    const obras = DB.getArr('obras');
    for (const obra of obras) {
      try {
        await this.insert('obras', {
          id: obra.id,
          nome: obra.nome,
          cod: obra.cod,
          tipo: obra.tipo,
          endereco: obra.end,
          data_inicio: obra.inicio,
          engenheiro_id: obra.engId,
          status: obra.status,
          loc_config: obra.locConfig
        });
      } catch (error) {
        if (!error.message.includes('duplicate key')) {
          throw error;
        }
      }
    }
  }

  async migrarTemplates() {
    // Migrar templates FVS
    const templatesFVS = DB.getArr('templates');
    for (const template of templatesFVS) {
      try {
        await this.insert('templates_fvs', {
          id: template.id,
          servico: template.servico,
          norma: template.norma,
          frequencia: template.freq,
          plano_amostragem: template.amostra,
          disciplina: template.disciplina,
          status: template.status,
          revisao_atual: template.revisaoAtual,
          historico: template.historico,
          criterios: template.criterios
        });
      } catch (error) {
        if (!error.message.includes('duplicate key')) {
          throw error;
        }
      }
    }

    // Migrar templates FVM
    const templatesFVM = DB.getArr('templates_fvm');
    for (const template of templatesFVM) {
      try {
        await this.insert('templates_fvm', {
          id: template.id,
          nome: template.nome,
          revisao: template.revisao,
          criterios: template.criterios
        });
      } catch (error) {
        if (!error.message.includes('duplicate key')) {
          throw error;
        }
      }
    }
  }

  async migrarFVS() {
    const fvsList = DB.getArr('fvs');
    for (const fvs of fvsList) {
      try {
        await this.insert('fvs', {
          id: fvs.id,
          cod: fvs.cod,
          obra_id: fvs.obraId,
          template_id: fvs.templateId,
          servico: fvs.servico,
          criterios: fvs.criterios,
          locais: fvs.locais,
          inspetor_id: fvs.inspectorId,
          status: fvs.status,
          abertura: fvs.abertura,
          fechamento: fvs.fechamento,
          obs_finais: fvs.obsFinais,
          assinatura: fvs.assinatura,
          resultados: fvs.resultados
        });

        // Migrar ocorrências
        if (fvs.ocorrencias && fvs.ocorrencias.length > 0) {
          for (const ocorrencia of fvs.ocorrencias) {
            await this.insert('ocorrencias', {
              id: ocorrencia.id,
              fvs_id: fvs.id,
              criterio_id: ocorrencia.critId,
              criterio_item: ocorrencia.critItem,
              local: ocorrencia.local,
              descricao: ocorrencia.desc,
              tipo: ocorrencia.tipo,
              acao: ocorrencia.acao,
              responsavel_id: ocorrencia.respId,
              prazo: ocorrencia.prazo,
              status: ocorrencia.status,
              abertura: ocorrencia.abertura,
              fechamento: ocorrencia.fechamento,
              rc_foto: ocorrencia.rcFoto
            });
          }
        }
      } catch (error) {
        if (!error.message.includes('duplicate key')) {
          throw error;
        }
      }
    }
  }

  async migrarFVM() {
    const fvmList = DB.getArr('fvm');
    for (const fvm of fvmList) {
      try {
        await this.insert('fvm', {
          id: fvm.id,
          cod: fvm.cod,
          obra_id: fvm.obraId,
          template_id: fvm.templateId,
          servico: fvm.servico,
          criterios: fvm.criterios,
          inspetor_id: fvm.inspetorId,
          status: fvm.status,
          abertura: fvm.abertura,
          fechamento: fvm.fechamento,
          dados: fvm.dados,
          nota_final: fvm.notaFinal,
          resultado: fvm.resultado,
          assinatura: fvm.assinatura
        });
      } catch (error) {
        if (!error.message.includes('duplicate key')) {
          throw error;
        }
      }
    }
  }

  async migrarFornecedores() {
    const fornecedores = DB.getArr('fornecedores');
    for (const fornecedor of fornecedores) {
      try {
        await this.insert('fornecedores', {
          id: fornecedor.id,
          nome: fornecedor.nome,
          documento: fornecedor.documento,
          tipo_documento: fornecedor.tipoDocumento,
          status: fornecedor.status
        });
      } catch (error) {
        if (!error.message.includes('duplicate key')) {
          throw error;
        }
      }
    }
  }
}

// Instância global do cliente Supabase
window.supabaseClient = new SupabaseClient();
