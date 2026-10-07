// src/App.tsx
import React, { useState, useEffect } from 'react';

// Tipagem estrita
interface Comment {
  id: string;
  author: string;
  belt: string;
  text: string;
  timestamp: string;
}

interface Post {
  id: string;
  author: string;
  belt: string;
  title: string;
  category: string;
  type: 'text' | 'image' | 'video';
  content: string;
  mediaUrl?: string;
  likes: number;
  userLiked?: boolean;
  comments: Comment[];
  timestamp: string;
}

type FilterType = 'all' | 'video' | 'image' | 'text';

const INITIAL_POSTS: Post[] = [
  {
    id: 'post-1',
    author: 'Rodrigo "Caveira"',
    belt: 'Faixa Preta',
    title: 'Ajuste Fino na Pressão do Armlock da Guarda Fechada',
    category: 'Finalização',
    type: 'video',
    content: 'Muitos praticantes erram ao tentar puxar o braço com a força do bíceps. O segredo principal está em elevar o quadril, colar a virilha no ombro do oponente e fazer o movimento de alavanca com o corpo inteiro.',
    mediaUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    likes: 42,
    userLiked: false,
    timestamp: 'Há 2 horas',
    comments: [
      {
        id: 'c1',
        author: 'Lucas Silva',
        belt: 'Faixa Branca',
        text: 'Sensacional mestre! Eu sempre deixava espaço na virilha. Vou testar hoje no treino.',
        timestamp: 'Há 1 hora'
      },
      {
        id: 'c2',
        author: 'Camila Rossi',
        belt: 'Faixa Azul',
        text: 'Ajuste perfeito. Mudou meu jogo de guarda fechada!',
        timestamp: 'Há 30 min'
      }
    ]
  },
  {
    id: 'post-2',
    author: 'Gabriel Santos',
    belt: 'Faixa Roxa',
    title: 'Postura Defensiva e Prevenção de Lesões no Ombro',
    category: 'Preparação Física',
    type: 'image',
    content: 'Foto do aquecimento específico antes dos rolas pesados. Fortalecimento de manguito rotador e mobilidade de quadril são fundamentais para quem treina 5x por semana.',
    mediaUrl: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=1000&q=80',
    likes: 28,
    userLiked: false,
    timestamp: 'Há 5 horas',
    comments: [
      {
        id: 'c3',
        author: 'Fernando "Tropeço"',
        belt: 'Faixa Marrom',
        text: 'Treinar sem mobilidade é pedir para ficar no departamento médico.',
        timestamp: 'Há 3 horas'
      }
    ]
  },
  {
    id: 'post-3',
    author: 'Ana Paula BJJ',
    belt: 'Faixa Azul',
    title: 'Dica: Conceito da Lapela na Meia Guarda Profunda',
    category: 'Dica Técnica',
    type: 'text',
    content: 'Quando você estiver por baixo na meia guarda, em vez de buscar a esgrima imediatamente, tente dominar a ponta da lapela oposta. Isso anula a pressão da cabeça do passador e abre caminho para a raspagem da baiana ou ida para as costas.',
    likes: 19,
    userLiked: false,
    timestamp: 'Há 1 dia',
    comments: []
  }
];

export function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [posts, setPosts] = useState<Post[]>(() => {
    const saved = localStorage.getItem('monkey_help_posts');
    return saved ? JSON.parse(saved) : INITIAL_POSTS;
  });
  const [currentFilter, setCurrentFilter] = useState<FilterType>('all');

  // Formulário de Post
  const [authorName, setAuthorName] = useState('');
  const [authorBelt, setAuthorBelt] = useState('Faixa Branca');
  const [postTitle, setPostTitle] = useState('');
  const [postCategory, setPostCategory] = useState('Dica Técnica');
  const [postType, setPostType] = useState<'text' | 'image' | 'video'>('text');
  const [mediaUrl, setMediaUrl] = useState('');
  const [postContent, setPostContent] = useState('');

  // Formulários de Comentários
  const [commentInputs, setCommentInputs] = useState<{ [postId: string]: { author: string; text: string } }>({});

  useEffect(() => {
    localStorage.setItem('monkey_help_posts', JSON.stringify(posts));
  }, [posts]);

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!authorName.trim() || !postTitle.trim() || !postContent.trim()) return;

    const newPost: Post = {
      id: `post-${Date.now()}`,
      author: authorName.trim(),
      belt: authorBelt,
      title: postTitle.trim(),
      category: postCategory,
      type: postType,
      content: postContent.trim(),
      mediaUrl: mediaUrl.trim() || undefined,
      likes: 0,
      userLiked: false,
      timestamp: 'Agora mesmo',
      comments: []
    };

    setPosts([newPost, ...posts]);
    setAuthorName('');
    setPostTitle('');
    setPostContent('');
    setMediaUrl('');
    setPostType('text');

    const feedEl = document.getElementById('feed');
    if (feedEl) feedEl.scrollIntoView({ behavior: 'smooth' });
  };

  const handleLike = (postId: string) => {
    setPosts(prev => prev.map(p => {
      if (p.id === postId) {
        return {
          ...p,
          likes: p.userLiked ? p.likes - 1 : p.likes + 1,
          userLiked: !p.userLiked
        };
      }
      return p;
    }));
  };

  const handleCommentChange = (postId: string, field: 'author' | 'text', value: string) => {
    setCommentInputs(prev => ({
      ...prev,
      [postId]: {
        ...prev[postId],
        [field]: value
      }
    }));
  };

  const handleAddComment = (e: React.FormEvent, postId: string) => {
    e.preventDefault();
    const input = commentInputs[postId];
    if (!input || !input.author?.trim() || !input.text?.trim()) return;

    const newComment: Comment = {
      id: `c-${Date.now()}`,
      author: input.author.trim(),
      belt: 'Praticante',
      text: input.text.trim(),
      timestamp: 'Agora mesmo'
    };

    setPosts(prev => prev.map(p => {
      if (p.id === postId) {
        return { ...p, comments: [...p.comments, newComment] };
      }
      return p;
    }));

    setCommentInputs(prev => ({
      ...prev,
      [postId]: { author: '', text: '' }
    }));
  };

  const filteredPosts = posts.filter(p => {
    if (currentFilter === 'all') return true;
    return p.type === currentFilter;
  });

  return (
    <div className="monkey-app">
      {/* HEADER & NAVEGAÇÃO */}
      <header className="main-header">
        <div className="container header-container">
          <a href="#hero" className="brand-logo" aria-label="Monkey Help Home">
            <svg className="monkey-icon" viewBox="0 0 100 100" width="46" height="46" aria-hidden="true">
              <circle cx="16" cy="45" r="14" fill="#E50914" />
              <circle cx="16" cy="45" r="8" fill="#0D0D0D" />
              <circle cx="84" cy="45" r="14" fill="#E50914" />
              <circle cx="84" cy="45" r="8" fill="#0D0D0D" />
              <path d="M50 8 C22 8, 12 30, 12 52 C12 72, 26 88, 50 92 C74 92, 88 72, 88 52 C88 30, 78 8, 50 8 Z" fill="#E50914" />
              <path d="M50 28 C36 28, 28 38, 28 54 C28 72, 36 80, 50 80 C64 80, 72 72, 72 54 C72 38, 64 28, 50 28 Z" fill="#0D0D0D" />
              <ellipse cx="40" cy="48" rx="6" ry="7" fill="#FFFFFF" />
              <circle cx="41" cy="48" r="3" fill="#E50914" />
              <ellipse cx="60" cy="48" rx="6" ry="7" fill="#FFFFFF" />
              <circle cx="59" cy="48" r="3" fill="#E50914" />
              <polygon points="50,56 45,63 55,63" fill="#E50914" />
              <path d="M40 70 Q50 76 60 70" stroke="#E50914" strokeWidth="3" fill="none" strokeLinecap="round" />
              <rect x="24" y="24" width="52" height="9" rx="2" fill="#FFFFFF" />
              <rect x="58" y="24" width="18" height="9" rx="1" fill="#E50914" />
              <rect x="70" y="24" width="2" height="9" fill="#FFFFFF" />
            </svg>
            <span className="brand-name">MONKEY <span className="highlight-red">HELP</span></span>
          </a>

          <button className="menu-toggle" onClick={() => setIsMenuOpen(!isMenuOpen)} aria-label="Abrir menu">
            <span className="bar"></span>
            <span className="bar"></span>
            <span className="bar"></span>
          </button>

          <nav className={`main-nav ${isMenuOpen ? 'active' : ''}`}>
            <ul>
              <li><a href="#sobre" onClick={() => setIsMenuOpen(false)}>O que é Jiu-Jitsu</a></li>
              <li><a href="#faixas" onClick={() => setIsMenuOpen(false)}>Sistema de Faixas</a></li>
              <li><a href="#feed" onClick={() => setIsMenuOpen(false)}>Comunidade & Dicas</a></li>
              <li><a href="#postar" className="btn btn-primary" onClick={() => setIsMenuOpen(false)}>Postar Dica</a></li>
            </ul>
          </nav>
        </div>
      </header>

      <main>
        {/* HERO SECTION */}
        <section id="hero" className="hero-section">
          <div className="container hero-content">
            <span className="badge-belt"><span className="belt-bar red"></span> A Arte Suave em Suas Mãos</span>
            <h1>Evolua Seu Jiu-Jitsu Com A Nossa <span className="highlight-red">Matilha de Tatame</span></h1>
            <p>Compartilhe posições, assista a treinos em vídeo, tire dúvidas com praticantes de todas as faixas e domine os segredos da arte suave no <strong>Monkey Help</strong>.</p>
            <div className="hero-actions">
              <a href="#feed" className="btn btn-primary btn-lg">Explorar Feed</a>
              <a href="#sobre" className="btn btn-outline btn-lg">Entender a Arte</a>
            </div>
            <div className="hero-stats">
              <div class="stat-item">
                <span className="stat-number">+15k</span>
                <span className="stat-label">Praticantes</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">+8.200</span>
                <span className="stat-label">Dicas & Variações</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">100%</span>
                <span className="stat-label">Comunidade Jiu-Jitsu</span>
              </div>
            </div>
          </div>
        </section>

        {/* O QUE É JIU-JITSU */}
        <section id="sobre" className="about-section">
          <div className="container">
            <div className="section-title text-center">
              <h2>O Que É O <span className="highlight-red">Jiu-Jitsu</span>?</h2>
              <p className="subtitle">A ciência da alavanca, controle e eficácia técnica sem dependência da força bruta.</p>
            </div>

            <div className="about-grid">
              <article className="about-card">
                <div className="card-icon">🥋</div>
                <h3>Conceito & Filosofia</h3>
                <p><strong>Jiu-Jitsu</strong> (柔術), literalmente <em>"Arte Suave"</em>, é uma arte marcial e sistema de defesa pessoal focado no combate no chão. Seu princípio fundamental é permitir que uma pessoa menor e mais fraca consiga se defender e dominar um oponente maior e mais forte através do uso eficiente de <strong>alavancas, biomecânica e distribuição de peso</strong>.</p>
              </article>

              <article className="about-card">
                <div className="card-icon">📜</div>
                <h3>Origem & Evolução</h3>
                <p>Surgiu no Japão feudal e passou por constante aperfeiçoamento. No início do século XX, o mestre japonês <strong>Mitsuyo Maeda (Conde Koma)</strong> trouxe a arte ao Brasil, onde os irmãos <strong>Carlos e Hélio Gracie</strong> refinaram o combate no solo, dando origem ao lendário <em>Brazilian Jiu-Jitsu (BJJ)</em>, hoje praticado em todo o mundo.</p>
              </article>

              <article className="about-card">
                <div className="card-icon">⚙️</div>
                <h3>Mecanismos de Combate</h3>
                <p>O combate no Jiu-Jitsu se divide em fases estratégicas: <strong>queda/projeção</strong>, <strong>passagem de guarda</strong>, <strong>estabilização de posições de controle</strong> (como montada, 100kg e costas) e finalização por meio de <strong>estrangulamentos</strong> ou <strong>chaves articulares</strong> (armlock, kimura, omoplata).</p>
              </article>
            </div>

            <div className="about-deep-dive">
              <h3>Pilares Fundamentais do Tatame</h3>
              <div className="pillars-container">
                <div className="pillar-box">
                  <h4>1. A Guarda</h4>
                  <p>Considerada o coração do Jiu-Jitsu. A habilidade de combater eficientemente de costas no chão, utilizando as pernas para controlar, raspar ou finalizar o adversário.</p>
                </div>
                <div className="pillar-box">
                  <h4>2. Pressão e Postura</h4>
                  <p>O controle absoluto do espaço. Saber alinhar a coluna para defender e aplicar o peso corporal exato sobre o oponente para esgotar sua energia.</p>
                </div>
                <div className="pillar-box">
                  <h4>3. Transição e Escapes</h4>
                  <p>Saber sair das piores posições (saídas de montada, costas e imobilizações) mantendo a calma sob extrema pressão física e psicológica.</p>
                </div>
                <div className="pillar-box">
                  <h4>4. Finalização</h4>
                  <p>O encerramento técnico da luta. Obriga o oponente a desistir (dar três tapas) sem a necessidade de golpes traumatizantes (como socos ou chutes).</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SISTEMA DE FAIXAS */}
        <section id="faixas" className="belts-section">
          <div className="container">
            <div className="section-title text-center">
              <h2>Sistema Oficial de <span className="highlight-red">Faixas do Jiu-Jitsu</span></h2>
              <p className="subtitle">A jornada de evolução do praticante, dividida pelas graduações oficiais (IBJJF / CBJJ).</p>
            </div>

            <div className="belt-category-title">
              <h3>Graduação Adulto (A partir de 16 Anos)</h3>
            </div>

            <div className="belts-grid">
              <div className="belt-card">
                <div className="belt-display white-belt"><span className="belt-sleeve black-sleeve"></span></div>
                <h4>Faixa Branca</h4>
                <span className="belt-level">Iniciante / Sobrevivência</span>
                <p>Foco em aprender a postura básica, defesas essenciais, conceitos de alavanca e sobrevivência no tatame.</p>
              </div>

              <div className="belt-card">
                <div className="belt-display blue-belt"><span className="belt-sleeve black-sleeve"></span></div>
                <h4>Faixa Azul</h4>
                <span className="belt-level">Intermediário / Fundamentação</span>
                <p>O atleta constrói seu repertório técnico de raspagens, passagens de guarda e finalizações primárias.</p>
              </div>

              <div className="belt-card">
                <div className="belt-display purple-belt"><span className="belt-sleeve black-sleeve"></span></div>
                <h4>Faixa Roxa</h4>
                <span className="belt-level">Avançado / Desenvolvimento</span>
                <p>Ajuste de tempo de reação, criação de combinações de ataques e refinamento do estilo individual de luta.</p>
              </div>

              <div className="belt-card">
                <div className="belt-display brown-belt"><span className="belt-sleeve black-sleeve"></span></div>
                <h4>Faixa Marrom</h4>
                <span className="belt-level">Pré-Maestria / Polimento</span>
                <p>Transição para a maturidade. Correção de mínimos detalhes técnicos e forte domínio de defesas e ataques.</p>
              </div>

              <div className="belt-card">
                <div className="belt-display black-belt"><span className="belt-sleeve red-sleeve"></span></div>
                <h4>Faixa Preta</h4>
                <span className="belt-level">Mestre / Excelência</span>
                <p>Domínio completo da arte. A faixa preta marca o reinício do aprendizado em um nível mais profundo e filosófico.</p>
              </div>

              <div className="belt-card">
                <div className="belt-display coral-red-black-belt"><span className="belt-sleeve white-sleeve"></span></div>
                <h4>Vermelha e Preta (7º Grau)</h4>
                <span className="belt-level">Mestre</span>
                <p>Concedida após décadas de dedicação como faixa preta ativo e contribuição exemplar para a arte suave.</p>
              </div>

              <div className="belt-card">
                <div className="belt-display coral-red-white-belt"><span className="belt-sleeve black-sleeve"></span></div>
                <h4>Vermelha e Branca (8º Grau)</h4>
                <span className="belt-level">Grand Mestre</span>
                <p>Reservada a mestres com mais de 50 anos de prática contínua no Jiu-Jitsu e impacto histórico relevante.</p>
              </div>

              <div className="belt-card">
                <div className="belt-display red-belt"><span className="belt-sleeve gold-sleeve"></span></div>
                <h4>Faixa Vermelha (9º e 10º Grau)</h4>
                <span className="belt-level">Grão-Mestre (Nível Máximo)</span>
                <p>O ápice absoluto do Jiu-Jitsu. O 10º Grau é reservado apenas aos pioneiros criadores do Jiu-Jitsu Brasileiro.</p>
              </div>
            </div>

            <div className="belt-category-title mt-large">
              <h3>Graduação Infantil (Até 15 Anos)</h3>
            </div>
            <div className="kids-belts-info">
              <p>Para o público infantil, o sistema inclui faixas intermediárias para premiar o progresso pedagógico:</p>
              <div className="kids-tags">
                <span className="tag-belt kb-white">Branca</span>
                <span className="tag-belt kb-grey">Cinza/Branca</span>
                <span className="tag-belt kb-grey-solid">Cinza</span>
                <span className="tag-belt kb-grey-black">Cinza/Preta</span>
                <span className="tag-belt kb-yellow-white">Amarela/Branca</span>
                <span className="tag-belt kb-yellow">Amarela</span>
                <span className="tag-belt kb-yellow-black">Amarela/Preta</span>
                <span className="tag-belt kb-orange-white">Laranja/Branca</span>
                <span className="tag-belt kb-orange">Laranja</span>
                <span className="tag-belt kb-orange-black">Laranja/Preta</span>
                <span className="tag-belt kb-green-white">Verde/Branca</span>
                <span className="tag-belt kb-green">Verde</span>
                <span className="tag-belt kb-green-black">Verde/Preta</span>
              </div>
            </div>
          </div>
        </section>

        {/* POSTAR CONTEÚDO */}
        <section id="postar" className="create-post-section">
          <div className="container">
            <div className="post-form-card">
              <div className="form-header">
                <h3><span className="highlight-red">🐒 Monkey Help:</span> Compartilhe Sua Dica ou Mídia</h3>
                <p>Ajude a comunidade postando uma técnica, foto de treino ou vídeo de posição!</p>
              </div>

              <form onSubmit={handleCreatePost} className="post-form">
                <div className="form-row">
                  <div className="form-group">
                    <label>Seu Nome / Apelido *</label>
                    <input 
                      type="text" 
                      placeholder="Ex: Mestre Bernardo" 
                      value={authorName} 
                      onChange={e => setAuthorName(e.target.value)} 
                      required 
                    />
                  </div>
                  <div className="form-group">
                    <label>Sua Faixa Atual *</label>
                    <select value={authorBelt} onChange={e => setAuthorBelt(e.target.value)} required>
                      <option value="Faixa Branca">Faixa Branca</option>
                      <option value="Faixa Azul">Faixa Azul</option>
                      <option value="Faixa Roxa">Faixa Roxa</option>
                      <option value="Faixa Marrom">Faixa Marrom</option>
                      <option value="Faixa Preta">Faixa Preta</option>
                      <option value="Faixa Coral">Faixa Coral</option>
                      <option value="Faixa Vermelha">Faixa Vermelha</option>
                    </select>
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Título da Dica ou Post *</label>
                    <input 
                      type="text" 
                      placeholder="Ex: Detalhe do quadril para encaixar o Armlock" 
                      value={postTitle} 
                      onChange={e => setPostTitle(e.target.value)} 
                      required 
                    />
                  </div>
                  <div className="form-group">
                    <label>Categoria *</label>
                    <select value={postCategory} onChange={e => setPostCategory(e.target.value)} required>
                      <option value="Dica Técnica">Dica Técnica</option>
                      <option value="Raspagem">Raspagem</option>
                      <option value="Finalização">Finalização</option>
                      <option value="Passagem de Guarda">Passagem de Guarda</option>
                      <option value="Preparação Física">Preparação Física</option>
                    </select>
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Tipo de Mídia *</label>
                    <select value={postType} onChange={e => setPostType(e.target.value as any)}>
                      <option value="text">Apenas Texto</option>
                      <option value="image">Link de Foto (URL)</option>
                      <option value="video">Link de Vídeo (YouTube Embed ou MP4)</option>
                    </select>
                  </div>
                  {postType !== 'text' && (
                    <div className="form-group">
                      <label>URL da Imagem ou Vídeo</label>
                      <input 
                        type="url" 
                        placeholder="https://exemplo.com/foto.jpg ou https://youtube.com/embed/..." 
                        value={mediaUrl} 
                        onChange={e => setMediaUrl(e.target.value)} 
                      />
                    </div>
                  )}
                </div>

                <div className="form-group">
                  <label>Descrição Detalhada / Passo a Passo *</label>
                  <textarea 
                    rows={4} 
                    placeholder="Explique os detalhes da posição, onde colocar a pegada, peso do quadril..." 
                    value={postContent} 
                    onChange={e => setPostContent(e.target.value)} 
                    required 
                  />
                </div>

                <button type="submit" className="btn btn-primary btn-block">Publicar no Feed Monkey Help</button>
              </form>
            </div>
          </div>
        </section>

        {/* FEED DE POSTAGENS */}
        <section id="feed" className="feed-section">
          <div className="container">
            <div className="feed-header">
              <div>
                <h2>Feed da <span className="highlight-red">Comunidade</span></h2>
                <p>Dicas recentes, vídeos demonstrativos e trocas de experiências entre casca-grossas.</p>
              </div>
              <div className="feed-filters">
                <button className={`filter-btn ${currentFilter === 'all' ? 'active' : ''}`} onClick={() => setCurrentFilter('all')}>Todos</button>
                <button className={`filter-btn ${currentFilter === 'video' ? 'active' : ''}`} onClick={() => setCurrentFilter('video')}>Vídeos</button>
                <button className={`filter-btn ${currentFilter === 'image' ? 'active' : ''}`} onClick={() => setCurrentFilter('image')}>Fotos</button>
                <button className={`filter-btn ${currentFilter === 'text' ? 'active' : ''}`} onClick={() => setCurrentFilter('text')}>Dicas em Texto</button>
              </div>
            </div>

            <div className="posts-list">
              {filteredPosts.length === 0 ? (
                <div className="text-center" style={{ padding: '3rem', color: 'var(--color-text-muted)' }}>
                  <p>Nenhuma publicação encontrada para este filtro no momento.</p>
                </div>
              ) : (
                filteredPosts.map(post => (
                  <article key={post.id} className="post-card">
                    <div className="post-author-bar">
                      <div className="author-info">
                        <div className="author-avatar">{post.author.charAt(0).toUpperCase()}</div>
                        <div className="author-details">
                          <h4>{post.author}</h4>
                          <span className="user-belt-badge">🥋 {post.belt}</span>
                        </div>
                      </div>
                      <span className="post-date">{post.timestamp}</span>
                    </div>

                    <h3 className="post-title">{post.title}</h3>
                    <span className="post-category-tag">📌 {post.category}</span>

                    <p className="post-text">{post.content}</p>

                    {post.type === 'image' && post.mediaUrl && (
                      <div className="post-media">
                        <img src={post.mediaUrl} alt="Foto da Dica" loading="lazy" />
                      </div>
                    )}

                    {post.type === 'video' && post.mediaUrl && (
                      <div className="post-media">
                        {post.mediaUrl.includes('youtube.com') || post.mediaUrl.includes('youtu.be') ? (
                          <iframe src={post.mediaUrl} allowFullScreen title="Vídeo de Jiu-Jitsu"></iframe>
                        ) : (
                          <video controls width="100%"><source src={post.mediaUrl} type="video/mp4" /></video>
                        )}
                      </div>
                    )}

                    <div className="post-actions">
                      <button className={`action-btn ${post.userLiked ? 'liked' : ''}`} onClick={() => handleLike(post.id)}>
                        <span>{post.userLiked ? '❤️' : '🤍'}</span>
                        <span>{post.likes} Casca-Grossas curtiram</span>
                      </button>
                      <span className="action-btn">💬 {post.comments.length} Comentários</span>
                    </div>

                    {/* COMENTÁRIOS */}
                    <div className="comments-section">
                      <div className="comments-list">
                        {post.comments.length === 0 ? (
                          <p style={{ fontSize: '0.85rem', color: '#777' }}>Seja o primeiro a comentar esta dica!</p>
                        ) : (
                          post.comments.map(c => (
                            <div key={c.id} className="comment-item">
                              <div className="comment-header">
                                <span><strong className="comment-author">{c.author}</strong> <span className="comment-belt">({c.belt})</span></span>
                                <span className="post-date">{c.timestamp}</span>
                              </div>
                              <p className="comment-text">{c.text}</p>
                            </div>
                          ))
                        )}
                      </div>

                      <form onSubmit={e => handleAddComment(e, post.id)} className="comment-form">
                        <input 
                          type="text" 
                          placeholder="Seu Nome" 
                          style={{ width: '30%' }}
                          value={commentInputs[post.id]?.author || ''}
                          onChange={e => handleCommentChange(post.id, 'author', e.target.value)}
                          required 
                        />
                        <input 
                          type="text" 
                          placeholder="Comentar técnica ou tirar dúvida..." 
                          style={{ flex: 1 }}
                          value={commentInputs[post.id]?.text || ''}
                          onChange={e => handleCommentChange(post.id, 'text', e.target.value)}
                          required 
                        />
                        <button type="submit" className="btn btn-primary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}>Enviar</button>
                      </form>
                    </div>
                  </article>
                ))
              )}
            </div>
          </div>
        </section>
      </main>

      {/* RODAPÉ */}
      <footer className="main-footer">
        <div className="container footer-content">
          <div className="footer-brand">
            <div className="brand-logo">
              <span className="brand-name">MONKEY <span className="highlight-red">HELP</span></span>
            </div>
            <p>A plataforma feita por praticantes de Jiu-Jitsu para praticantes de Jiu-Jitsu. Oss!</p>
          </div>

          <div className="footer-links">
            <h4>Navegação</h4>
            <ul>
              <li><a href="#hero">Início</a></li>
              <li><a href="#sobre">O que é Jiu-Jitsu</a></li>
              <li><a href="#faixas">Graduação de Faixas</a></li>
              <li><a href="#feed">Feed de Dicas</a></li>
            </ul>
          </div>

          <div className="footer-motto">
            <h4>Filosofia</h4>
            <p><em>"Não existe adversário difícil quando a sua técnica é aperfeiçoada diariamente no tatame."</em></p>
            <span className="oss-tag">OSS! 🥋</span>
          </div>
        </div>
        <div className="footer-bottom text-center">
          <p>&copy; 2026 Monkey Help Jiu-Jitsu. Todos os direitos reservados.</p>
        </div>
      </footer>
    </div>
  );
}

export default App;