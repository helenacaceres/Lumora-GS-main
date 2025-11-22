// Lumora Platform - Main Application Logic

// ============================================================================
// DATA STRUCTURE & INITIALIZATION
// ============================================================================

class LumoraApp {
    constructor() {
        const storedTheme = localStorage.getItem('theme') || 'dark';
        this.theme = storedTheme;

        this.currentUser = {
            id: 1,
            name: 'Você',
            role: 'Gerente de Projetos',
            avatar: '👤',
            department: 'Inovação'
        };

        this.users = [
            { id: 1, name: 'Você', role: 'Gerente de Projetos', avatar: '👤', department: 'Inovação' },
            { id: 2, name: 'Ana Silva', role: 'Designer', avatar: '👩‍💼', department: 'Design' },
            { id: 3, name: 'Carlos Santos', role: 'Desenvolvedor', avatar: '👨‍💻', department: 'Tech' },
            { id: 4, name: 'Maria Costa', role: 'Analista de Dados', avatar: '👩‍🔬', department: 'Analytics' },
            { id: 5, name: 'João Oliveira', role: 'Product Manager', avatar: '👨‍💼', department: 'Produto' },
            { id: 6, name: 'Laura Ferreira', role: 'UX Researcher', avatar: '👩‍🔬', department: 'Design' }
        ];

        this.posts = [
            {
                id: 1,
                author: this.users[1],
                content: 'Acabei de finalizar o novo design do dashboard! Ficou incrível 🎨',
                timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
                likes: 12,
                comments: 3,
                liked: false,
                favorited: false
            },
            {
                id: 2,
                author: this.users[2],
                content: 'Alguém quer fazer um break de 15 minutos? Vou jogar um jogo rápido no Break!',
                timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
                likes: 8,
                comments: 5,
                liked: false,
                favorited: false
            }
        ];

        this.tasks = [
            {
                id: 1,
                title: 'Revisar Proposta de Projeto',
                description: 'Revisar a proposta técnica do novo projeto de IA',
                status: 'pending',
                priority: 'high',
                assignees: [this.users[0], this.users[4]],
                dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
                completed: false
            },
            {
                id: 2,
                title: 'Implementar Autenticação',
                description: 'Implementar sistema de autenticação OAuth2',
                status: 'in_progress',
                priority: 'high',
                assignees: [this.users[2]],
                dueDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
                completed: false
            },
            {
                id: 3,
                title: 'Análise de Dados de Usuários',
                description: 'Gerar relatório de comportamento de usuários',
                status: 'pending',
                priority: 'medium',
                assignees: [this.users[3], this.users[0]],
                dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
                completed: false
            },
            {
                id: 4,
                title: 'Testes de Usabilidade',
                description: 'Conduzir testes com usuários reais',
                status: 'completed',
                priority: 'medium',
                assignees: [this.users[5]],
                dueDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
                completed: true
            }
        ];

        this.activities = [
            { id: 1, name: 'Jogo da Memória', icon: '🧠', description: 'Teste sua memória com nosso jogo clássico', participants: 0 },
            { id: 2, name: 'Trivia', icon: '🧩', description: 'Perguntas de conhecimento geral', participants: 0 },
            { id: 3, name: 'Yoga', icon: '🧘', description: 'Sessão de relaxamento e alongamento', participants: 0 },
            { id: 4, name: 'Meditação', icon: '🕉️', description: 'Meditação guiada de 10 minutos', participants: 0 },
            { id: 5, name: 'Desenho Colaborativo', icon: '🎨', description: 'Desenhe junto com colegas', participants: 0 },
            { id: 6, name: 'Karaokê', icon: '🎤', description: 'Cante suas músicas favoritas', participants: 0 }
        ];

        this.chatMessages = [
            { id: 1, author: this.users[1], content: 'Oi! Como estão?', timestamp: new Date(Date.now() - 30 * 60 * 1000), own: false },
            { id: 2, author: this.currentUser, content: 'Tudo bem! E você?', timestamp: new Date(Date.now() - 25 * 60 * 1000), own: true },
            { id: 3, author: this.users[2], content: 'Alguém quer fazer um break agora?', timestamp: new Date(Date.now() - 10 * 60 * 1000), own: false }
        ];

        this.favorites = [];
        this.currentPage = 'feed';
        this.darkMode = localStorage.getItem('darkMode') === 'true';

        // Profissões do Futuro (GS - SPA)
        this.professions = [];
        this.professionFilters = {
            area: 'all',
            demand: 'all',
            search: ''
        };

        this.init();
    }

    init() {
        // 1) Tenta carregar um perfil salvo no localStorage (se não tiver, ignora)
        this.loadProfileFromStorage();

        // 2) Aplica o tema (claro/escuro)
        this.setupTheme();

        // 3) Liga todos os botões e eventos
        this.setupEventListeners();

        // 3.1) Inicializa módulo de Profissões do Futuro (GS)
        this.initProfessionsExplorer();

        // 4) Mostra o feed
        this.renderFeed();

        // 5) Garante que a tela de perfil já esteja preenchida com os dados atuais
        this.renderProfile();
    }


    // ========================================================================
    // THEME MANAGEMENT
    // ========================================================================

    setupTheme() {
        const root = document.documentElement;
        if (this.theme === 'dark') {
            root.classList.add('dark');
        } else {
            root.classList.remove('dark');
        }
    }

    toggleTheme() {
        const root = document.documentElement;
        this.theme = this.theme === 'dark' ? 'light' : 'dark';
        if (this.theme === 'dark') {
            root.classList.add('dark');
        } else {
            root.classList.remove('dark');
        }
        localStorage.setItem('theme', this.theme);
        this.showNotification('Tema alterado com sucesso');
    }

    showProfileInfo() {
        this.navigateTo('profile');
    }



    showNotification(message) {
        const notification = document.createElement('div');
        notification.className = 'fixed bottom-4 right-4 bg-blue-600 text-white px-4 py-2 rounded-lg shadow-lg animate-bounce';
        notification.textContent = message;
        document.body.appendChild(notification);
        setTimeout(() => notification.remove(), 3000);
    }

    // ========================================================================
    // PROFILE STORAGE
    // ========================================================================

    loadProfileFromStorage() {
        const saved = localStorage.getItem('lumoraProfile');
        if (!saved) return;

        try {
            const data = JSON.parse(saved);
            this.currentUser = {
                ...this.currentUser,
                ...data
            };
        } catch (e) {
            console.error('Erro ao carregar perfil salvo', e);
        }
    }

    saveProfileToStorage() {
        try {
            localStorage.setItem('lumoraProfile', JSON.stringify(this.currentUser));
        } catch (e) {
            console.error('Erro ao salvar perfil', e);
        }
    }

    // ========================================================================
    // EVENT LISTENERS
    // ========================================================================

    setupEventListeners() {
        // Theme toggle
        document.getElementById('themeToggle').addEventListener('click', () => this.toggleTheme());

        // Profile button
        document.getElementById('profileBtn').addEventListener('click', () => this.showProfileInfo());

        // Navigation (sidebar + menu mobile, ambos usam .nav-item)
        document.querySelectorAll('.nav-item').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const page = e.currentTarget.dataset.page;
                this.navigateTo(page);

                // ====== Perfil: salvar dados ======
                const saveProfileBtn = document.getElementById('profileSaveBtn');
                if (saveProfileBtn) {
                    saveProfileBtn.addEventListener('click', (e) => {
                        e.preventDefault();
                        this.saveProfileFromForm();
                    });
                }

                // ====== Perfil: trocar foto ======
                const photoBtn = document.getElementById('profilePhotoButton');
                const photoInput = document.getElementById('profilePhotoInput');

                if (photoBtn && photoInput) {
                    photoBtn.addEventListener('click', () => {
                        photoInput.click();
                    });

                    photoInput.addEventListener('change', (e) => this.handleProfilePhotoChange(e));
                }
            });
        });

        // Menu mobile (hambúrguer)
        const mobileToggle = document.getElementById('mobileMenuToggle');
        const mobileMenu = document.getElementById('mobileMenu');

        if (mobileToggle && mobileMenu) {
            // abre/fecha o menu
            mobileToggle.addEventListener('click', () => {
                mobileMenu.classList.toggle('hidden');
            });

            // ao clicar em qualquer item do menu mobile, fecha o menu
            mobileMenu.querySelectorAll('.nav-item').forEach(btn => {
                btn.addEventListener('click', () => {
                    mobileMenu.classList.add('hidden');
                });
            });
        }

        // Feed
        document.getElementById('postBtn').addEventListener('click', () => this.createPost());
        document.getElementById('newPostText').addEventListener('keydown', (e) => {
            if (e.ctrlKey && e.key === 'Enter') {
                this.createPost();
            }
        });

        // Tasks – filtros
        document.querySelectorAll('.task-filter').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelectorAll('.task-filter').forEach(b =>
                    b.classList.remove(
                        'bg-blue-100',
                        'dark:bg-blue-900/30',
                        'text-blue-600',
                        'dark:text-blue-400'
                    )
                );

                e.currentTarget.classList.add(
                    'bg-blue-100',
                    'dark:bg-blue-900/30',
                    'text-blue-600',
                    'dark:text-blue-400'
                );

                this.filterTasks(e.currentTarget.dataset.filter);
            });
        });

        // Break
        document.getElementById('findMatchBtn').addEventListener('click', () => this.findMatches());

        // Chat
        document.getElementById('sendChatBtn').addEventListener('click', () => this.sendMessage());
        document.getElementById('chatInput').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.sendMessage();
            }
        });
    }

    // ========================================================================
    // NAVIGATION
    // ========================================================================

    navigateTo(page) {
        // Esconde todas as páginas
        document.querySelectorAll('.page-content').forEach(p => p.classList.add('hidden'));

        // Remove destaque de todos os itens de navegação
        document.querySelectorAll('.nav-item').forEach(btn => {
            btn.classList.remove(
                'bg-blue-50',
                'dark:bg-blue-900/20',
                'text-blue-600',
                'dark:text-blue-400',
                'font-medium'
            );
        });

        // Mostra a página selecionada
        const pageEl = document.getElementById(`${page}-page`);
        if (pageEl) {
            pageEl.classList.remove('hidden');
        }

        // Destaca TODOS os itens dessa página (sidebar + menu mobile)
        document.querySelectorAll(`.nav-item[data-page="${page}"]`).forEach(btn => {
            btn.classList.add(
                'bg-blue-50',
                'dark:bg-blue-900/20',
                'text-blue-600',
                'dark:text-blue-400',
                'font-medium'
            );
        });

        // Renderiza conteúdo da página
        if (page === 'feed') this.renderFeed();
        else if (page === 'tasks') this.renderTasks();
        else if (page === 'break') this.renderBreak();
        else if (page === 'chat') this.renderChat();
        else if (page === 'profile') this.renderProfile();
        else if (page === 'professions') this.renderProfessions();


    }
    // ========================================================================
    // PROFILE FUNCTIONALITY
    // ========================================================================

    renderProfile() {
        const nameEl = document.getElementById('profile-name');
        const roleEl = document.getElementById('profile-role');
        const deptEl = document.getElementById('profile-department');
        const initialsEl = document.getElementById('profile-initials');

        if (!nameEl || !roleEl || !deptEl) return;

        nameEl.textContent = this.currentUser.name;
        roleEl.textContent = this.currentUser.role;
        deptEl.textContent = this.currentUser.department;

        if (initialsEl) {
            const parts = this.currentUser.name.split(' ');
            const initials = parts
                .filter(Boolean)
                .slice(0, 2)
                .map(p => p[0].toUpperCase())
                .join('');
            initialsEl.textContent = initials || 'U';
        }
    }

    // ========================================================================
    // PROFILE FUNCTIONALITY
    // ========================================================================

    renderProfile() {
        const fullNameInput = document.getElementById('profile-fullname');
        if (!fullNameInput) return; // página ainda não carregada

        const usernameInput = document.getElementById('profile-username');
        const roleInput = document.getElementById('profile-role');
        const deptInput = document.getElementById('profile-department');
        const locationInput = document.getElementById('profile-location');
        const emailInput = document.getElementById('profile-email');
        const bioInput = document.getElementById('profile-bio');

        const displayNameEl = document.getElementById('profile-display-name');
        const displayRoleEl = document.getElementById('profile-display-role');
        const displayDeptEl = document.getElementById('profile-display-dept');
        const displayUserEl = document.getElementById('profile-display-username');

        const photoImg = document.getElementById('profile-photo');
        const initialsEl = document.getElementById('profile-initials');

        // Preenche inputs
        fullNameInput.value = this.currentUser.name || '';
        if (usernameInput) usernameInput.value = this.currentUser.username || '';
        if (roleInput) roleInput.value = this.currentUser.role || '';
        if (deptInput) deptInput.value = this.currentUser.department || '';
        if (locationInput) locationInput.value = this.currentUser.location || '';
        if (emailInput) emailInput.value = this.currentUser.email || '';
        if (bioInput) bioInput.value = this.currentUser.bio || '';

        // Preenche textos de exibição
        if (displayNameEl) displayNameEl.textContent = this.currentUser.name || 'Seu nome';
        if (displayRoleEl) displayRoleEl.textContent = this.currentUser.role || 'Seu cargo';
        if (displayDeptEl) displayDeptEl.textContent = this.currentUser.department || 'Departamento';
        if (displayUserEl) displayUserEl.textContent = this.currentUser.username || '@usuario';

        // Foto ou iniciais
        const parts = (this.currentUser.name || '').split(' ').filter(Boolean);
        const initials = parts.slice(0, 2).map(p => p[0].toUpperCase()).join('') || 'U';

        if (this.currentUser.photo && photoImg) {
            photoImg.src = this.currentUser.photo;
            photoImg.classList.remove('hidden');
            if (initialsEl) initialsEl.classList.add('hidden');
        } else {
            if (photoImg) photoImg.classList.add('hidden');
            if (initialsEl) {
                initialsEl.textContent = initials;
                initialsEl.classList.remove('hidden');
            }
        }
    }

    saveProfileFromForm() {
        const fullNameInput = document.getElementById('profile-fullname');
        if (!fullNameInput) return;

        const usernameInput = document.getElementById('profile-username');
        const roleInput = document.getElementById('profile-role');
        const deptInput = document.getElementById('profile-department');
        const locationInput = document.getElementById('profile-location');
        const emailInput = document.getElementById('profile-email');
        const bioInput = document.getElementById('profile-bio');

        this.currentUser.name = fullNameInput.value.trim() || 'Você';
        this.currentUser.username = usernameInput ? usernameInput.value.trim() : this.currentUser.username;
        this.currentUser.role = roleInput ? roleInput.value.trim() : this.currentUser.role;
        this.currentUser.department = deptInput ? deptInput.value.trim() : this.currentUser.department;
        this.currentUser.location = locationInput ? locationInput.value.trim() : this.currentUser.location;
        this.currentUser.email = emailInput ? emailInput.value.trim() : this.currentUser.email;
        this.currentUser.bio = bioInput ? bioInput.value.trim() : this.currentUser.bio;

        this.saveProfileToStorage();
        this.renderProfile();
        this.showNotification('Perfil atualizado!');
    }

    handleProfilePhotoChange(e) {
        const file = e.target.files && e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = () => {
            this.currentUser.photo = reader.result; // dataURL
            this.saveProfileToStorage();
            this.renderProfile();
            this.showNotification('Foto de perfil atualizada!');
        };
        reader.readAsDataURL(file);
    }

    // ========================================================================
    // FEED FUNCTIONALITY
    // ========================================================================

    createPost() {
        const textarea = document.getElementById('newPostText');
        const content = textarea.value.trim();

        if (!content) {
            this.showNotification('Digite algo antes de postar!');
            return;
        }

        const newPost = {
            id: this.posts.length + 1,
            author: this.currentUser,
            content: content,
            timestamp: new Date(),
            likes: 0,
            comments: 0,
            liked: false,
            favorited: false
        };

        this.posts.unshift(newPost);
        textarea.value = '';
        this.renderFeed();
        this.showNotification('Postagem criada com sucesso!');
    }

    renderFeed() {
        const feedList = document.getElementById('feed-list');
        feedList.innerHTML = this.posts.map(post => this.createPostHTML(post)).join('');

        // Like / RT
        document.querySelectorAll('.like-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const postId = parseInt(e.currentTarget.dataset.postId);
                this.toggleLike(postId);
            });
        });

    }


    createPostHTML(post) {
    const timeAgo = this.formatTimeAgo(post.timestamp);

    return `
        <div class="post-card border border-slate-200 dark:border-slate-700 rounded-2xl bg-white dark:bg-slate-800 p-4 shadow-sm">
            <div class="flex gap-3 mb-3">
                <div class="w-10 h-10 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-lg flex-shrink-0">
                    ${post.author.avatar}
                </div>
                <div class="flex-1 min-w-0">
                    <div class="font-semibold text-sm text-slate-900 dark:text-slate-50">
                        ${this.escapeHtml(post.author.name)}
                    </div>
                    <div class="text-xs text-slate-500 dark:text-slate-400">
                        ${this.escapeHtml(post.author.role)} • ${timeAgo}
                    </div>
                </div>
            </div>
            <p class="text-sm mb-3 leading-relaxed text-slate-700 dark:text-slate-200">
                ${this.escapeHtml(post.content)}
            </p>
            <div class="flex gap-4 pt-3 border-t border-slate-200 dark:border-slate-700">
                <!-- Botão de RT (usa a mesma lógica de like) -->
                <button
                    class="like-btn flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                    data-post-id="${post.id}">
                    <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none"
                         stroke="currentColor" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round"
                              d="M4 7h11l-2.5-2.5M15 7L12.5 9.5M20 17H9l2.5-2.5M9 17l2.5 2.5" />
                    </svg>
                    ${post.likes}
                </button>

                <!-- Botão de comentar (mantido) -->
                <button class="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                              d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z">
                        </path>
                    </svg>
                    ${post.comments}
                </button>
            </div>
        </div>
    `;
}



    toggleLike(postId) {
        const post = this.posts.find(p => p.id === postId);
        if (post) {
            post.liked = !post.liked;
            post.likes += post.liked ? 1 : -1;
            this.renderFeed();
        }
    }

    toggleFavorite(postId) {
        const index = this.favorites.indexOf(postId);
        if (index > -1) {
            this.favorites.splice(index, 1);
        } else {
            this.favorites.push(postId);
        }
        this.renderFeed();
    }

    // ========================================================================
    // TASKS FUNCTIONALITY
    // ========================================================================

    renderTasks(filter = 'all') {
        const tasksList = document.getElementById('tasks-list');
        let filteredTasks = this.tasks;

        if (filter === 'assigned') {
            filteredTasks = this.tasks.filter(t => t.assignees.some(a => a.id === this.currentUser.id));
        } else if (filter === 'completed') {
            filteredTasks = this.tasks.filter(t => t.completed);
        }

        tasksList.innerHTML = filteredTasks.map(task => this.createTaskHTML(task)).join('');

        // Add event listeners
        document.querySelectorAll('.task-toggle').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const taskId = parseInt(e.currentTarget.dataset.taskId);
                this.toggleTask(taskId);
            });
        });
    }

    createTaskHTML(task) {
        const dueDate = this.formatDate(task.dueDate);
        const priorityClass = {
            'high': 'badge-danger',
            'medium': 'badge-warning',
            'low': 'badge-primary'
        }[task.priority];

        const statusClass = task.completed ? 'completed' : '';

        return `
            <div class="task-card ${statusClass}">
                <div class="flex items-start gap-3 mb-2">
                    <input type="checkbox" class="task-toggle mt-1" data-task-id="${task.id}" ${task.completed ? 'checked' : ''}>
                    <div class="flex-1 min-w-0">
                        <h3 class="font-semibold text-sm ${task.completed ? 'line-through' : ''}">${this.escapeHtml(task.title)}</h3>
                        <p class="text-xs text-slate-600 dark:text-slate-400 mt-1">${this.escapeHtml(task.description)}</p>
                    </div>
                </div>
                <div class="flex items-center gap-2 mt-3 flex-wrap">
                    <span class="badge ${priorityClass}">${task.priority}</span>
                    <span class="text-xs text-slate-500 dark:text-slate-400">Vence: ${dueDate}</span>
                </div>
                <div class="mt-3 pt-3 border-t border-slate-200 dark:border-slate-700">
                    <p class="text-xs font-medium text-slate-600 dark:text-slate-400 mb-2">Responsáveis:</p>
                    <div class="flex gap-2 flex-wrap">
                        ${task.assignees.map(assignee => `
                            <div class="flex items-center gap-1 px-2 py-1 bg-slate-100 dark:bg-slate-700 rounded-full text-xs">
                                <span>${assignee.avatar}</span>
                                <span>${this.escapeHtml(assignee.name)}</span>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
        `;
    }

    filterTasks(filter) {
        this.renderTasks(filter);
    }

    toggleTask(taskId) {
        const task = this.tasks.find(t => t.id === taskId);
        if (task) {
            task.completed = !task.completed;
            task.status = task.completed ? 'completed' : 'pending';
            this.renderTasks();
            const message = task.completed ? 'Tarefa marcada como concluída!' : 'Tarefa desmarcada!';
            this.showNotification(message);
        }
    }

    // ========================================================================
    // BREAK FUNCTIONALITY
    // ========================================================================

    renderBreak() {
        const grid = document.getElementById('activities-grid');
        grid.innerHTML = this.activities.map(activity => `
            <div class="activity-card">
                <div class="activity-icon">${activity.icon}</div>
                <h3 class="font-semibold text-sm mb-1">${this.escapeHtml(activity.name)}</h3>
                <p class="text-xs text-slate-600 dark:text-slate-400">${this.escapeHtml(activity.description)}</p>
                <button class="mt-3 px-3 py-1 text-xs font-medium bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors">Participar</button>
            </div>
        `).join('');
    }

    findMatches() {
        const matchResults = document.getElementById('match-results');

        // Simulated AI matching algorithm
        const matches = this.users
            .filter(u => u.id !== this.currentUser.id)
            .sort(() => Math.random() - 0.5)
            .slice(0, 3)
            .map((user, index) => {
                const compatibility = Math.floor(Math.random() * 30 + 70);
                return {
                    user,
                    compatibility,
                    activity: this.activities[Math.floor(Math.random() * this.activities.length)]
                };
            });

        matchResults.innerHTML = matches.map(match => `
            <div class="bg-slate-50 dark:bg-slate-700 rounded-lg p-4 flex items-center justify-between">
                <div class="flex items-center gap-3">
                    <div class="w-10 h-10 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center text-lg">
                        ${match.user.avatar}
                    </div>
                    <div>
                        <p class="font-semibold text-sm">${this.escapeHtml(match.user.name)}</p>
                        <p class="text-xs text-slate-600 dark:text-slate-400">${match.activity.icon} ${this.escapeHtml(match.activity.name)}</p>
                    </div>
                </div>
                <div class="text-right">
                    <p class="font-bold text-lg text-green-600 dark:text-green-400">${match.compatibility}%</p>
                    <p class="text-xs text-slate-600 dark:text-slate-400">compatível</p>
                </div>
            </div>
        `).join('');
    }

    // ========================================================================
    // CHAT FUNCTIONALITY
    // ========================================================================

    renderChat() {
        const messagesContainer = document.getElementById('chat-messages');
        messagesContainer.innerHTML = this.chatMessages.map(msg => `
            <div class="chat-message ${msg.own ? 'own' : ''}">
                ${!msg.own ? `
                    <div class="w-8 h-8 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-sm flex-shrink-0 mr-2">
                        ${msg.author.avatar}
                    </div>
                ` : ''}
                <div>
                    ${!msg.own ? `<p class="text-xs text-slate-600 dark:text-slate-400 mb-1">${this.escapeHtml(msg.author.name)}</p>` : ''}
                    <div class="chat-bubble">${this.escapeHtml(msg.content)}</div>
                    <p class="text-xs text-slate-500 dark:text-slate-400 mt-1">${this.formatTimeAgo(msg.timestamp)}</p>
                </div>
            </div>
        `).join('');

        // Scroll to bottom
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    sendMessage() {
        const input = document.getElementById('chatInput');
        const content = input.value.trim();

        if (!content) {
            this.showNotification('Digite uma mensagem!');
            return;
        }

        const newMessage = {
            id: this.chatMessages.length + 1,
            author: this.currentUser,
            content: content,
            timestamp: new Date(),
            own: true
        };

        this.chatMessages.push(newMessage);
        input.value = '';
        this.renderChat();
        this.showNotification('Mensagem enviada!');
    }

    // ========================================================================
    // UTILITY FUNCTIONS
    // ========================================================================

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    formatTimeAgo(date) {
        const seconds = Math.floor((new Date() - date) / 1000);
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);
        const days = Math.floor(hours / 24);

        if (seconds < 60) return 'agora';
        if (minutes < 60) return `${minutes}m atrás`;
        if (hours < 24) return `${hours}h atrás`;
        if (days < 7) return `${days}d atrás`;

        return date.toLocaleDateString('pt-BR');
    }

    formatDate(date) {
        return date.toLocaleDateString('pt-BR', { month: 'short', day: 'numeric' });
    }
    // ========================================================================
    // PROFESSIONS OF THE FUTURE (GS MODULE)
    // ========================================================================

    async initProfessionsExplorer() {
        const section = document.getElementById('professions-section');
        const listEl = document.getElementById('professions-list');
        const searchInput = document.getElementById('professions-search');
        const areaButtons = document.querySelectorAll('.profession-area-filter');
        const demandButtons = document.querySelectorAll('.profession-demand-filter');

        if (!section || !listEl) {
            // Página ainda não tem o módulo (para não quebrar nada)
            return;
        }

        try {
            await this.loadProfessionsFromJSON();
            this.renderProfessions();
        } catch (err) {
            console.error('Erro ao carregar profissões:', err);
            listEl.innerHTML = '<p class="text-sm text-red-500">Não foi possível carregar as profissões. Tente novamente mais tarde.</p>';
        }

        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.professionFilters.search = e.target.value.toLowerCase();
                this.renderProfessions();
            });
        }

        areaButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const area = btn.dataset.area || 'all';
                this.professionFilters.area = area;
                this.updateChipGroup(areaButtons, btn);
                this.renderProfessions();
            });
        });

        demandButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const demand = btn.dataset.demand || 'all';
                this.professionFilters.demand = demand;
                this.updateChipGroup(demandButtons, btn);
                this.renderProfessions();
            });
        });
    }

    updateChipGroup(buttons, activeButton) {
        buttons.forEach(b => {
            b.classList.remove(
                'bg-blue-600',
                'text-white',
                'border-blue-600',
                'dark:bg-blue-500',
                'dark:border-blue-500'
            );
        });

        activeButton.classList.add(
            'bg-blue-600',
            'text-white',
            'border-blue-600',
            'dark:bg-blue-500',
            'dark:border-blue-500'
        );
    }

    async loadProfessionsFromJSON() {
        if (this.professions && this.professions.length > 0) return;

        try {
            const response = await fetch('http://localhost:3000/api/professions');
            if (!response.ok) throw new Error('Erro ao buscar JSON de profissões');
            const data = await response.json();
            if (!Array.isArray(data)) throw new Error('Formato inválido de JSON');

            this.professions = data;
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    renderProfessions() {
        const listEl = document.getElementById('professions-list');
        if (!listEl) return;

        const { area, demand, search } = this.professionFilters;

        const filtered = this.professions.filter(prof => {
            const matchArea = area === 'all' || prof.area === area;
            const matchDemand = demand === 'all' || prof.demanda === demand || prof.demanda === demand;
            const title = (prof.titulo || '').toLowerCase();
            const matchSearch = !search || title.includes(search);
            return matchArea && matchDemand && matchSearch;
        });

        if (filtered.length === 0) {
            listEl.innerHTML = '<p class="text-sm text-slate-500 dark:text-slate-400 col-span-full">Nenhuma profissão encontrada com esses filtros.</p>';
            return;
        }

        listEl.innerHTML = filtered.map(p => this.createProfessionCardHTML(p)).join('');
    }

    createProfessionCardHTML(prof) {
        const demanda = prof.demanda || prof.demanda;
        let demandaClass = 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200';
        if (demanda === 'Alta') demandaClass = 'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300';
        else if (demanda === 'Média') demandaClass = 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-300';
        else if (demanda === 'Baixa') demandaClass = 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200';

        return `
            <article class="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4 flex flex-col gap-2">
                <header class="flex items-start justify-between gap-2">
                    <div>
                        <h3 class="font-semibold text-sm mb-1">${this.escapeHtml(prof.titulo || '')}</h3>
                        <p class="text-xs text-slate-500 dark:text-slate-400">${this.escapeHtml(prof.area || '')}</p>
                    </div>
                    <span class="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium ${demandaClass}">
                        Demanda: ${this.escapeHtml(demanda || '')}
                    </span>
                </header>
                <p class="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    ${this.escapeHtml(prof.descricao || '')}
                </p>
            </article>
        `;
    }


}

// ============================================================================
// INITIALIZATION
// ============================================================================
document.addEventListener('DOMContentLoaded', () => {
    window.app = new LumoraApp();
});
