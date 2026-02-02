/**
 * DEV_RESCUE // CORE_ENGINE
 * Terminal Brutalism Edition
 */

// SUPABASE CONFIGURATION
const SUPABASE_URL = 'https://pyiftzhzijcpqvvzhhjy.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB5aWZ0emh6aWpjcHF2dnpoaGp5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzAwMjM0NTksImV4cCI6MjA4NTU5OTQ1OX0.lmDc5prm73X-nFRgopxCqkodOaGWEOVcDM19BZGyoDU';

const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

const App = {
    allProblems: [],
    filteredProblems: [],
    currentCategory: 'ALL',
    searchQuery: '',

    elements: {
        searchField: document.getElementById('main-search'),
        categoryContainer: document.getElementById('category-list'),
        resultsGrid: document.getElementById('results-grid'),
        statusCount: document.getElementById('result-count'),
        statusLine: document.getElementById('status-line'),
        emptyState: document.getElementById('empty-state'),
        loader: document.getElementById('loader'),
        themeToggle: document.getElementById('theme-toggle'),
        body: document.body,
        clock: document.getElementById('clock')
    },

    async init() {
        this.setupEventListeners();
        this.startClock();
        this.loadTheme();
        await this.loadData();
    },

    setupEventListeners() {
        // Search Input
        this.elements.searchField.addEventListener('input', (e) => {
            this.searchQuery = e.target.value.toLowerCase().trim();
            this.applyFilters();
        });

        // Keyboard Shortcut: '/' to focus search
        document.addEventListener('keydown', (e) => {
            if (e.key === '/' && document.activeElement !== this.elements.searchField) {
                e.preventDefault();
                this.elements.searchField.focus();
            }
        });

        // Theme Toggle
        this.elements.themeToggle.addEventListener('click', () => {
            const isWhite = this.elements.body.classList.toggle('paper-white');
            this.elements.themeToggle.textContent = isWhite ? '[ DARK_MODE ]' : '[ LIGHT_MODE ]';
            localStorage.setItem('theme', isWhite ? 'paper-white' : 'dark-mode');
        });
    },

    startClock() {
        const update = () => {
            const now = new Date();
            this.elements.clock.textContent = now.toTimeString().split(' ')[0];
        };
        setInterval(update, 1000);
        update();
    },

    loadTheme() {
        const savedTheme = localStorage.getItem('theme') || 'dark-mode';
        if (savedTheme === 'paper-white') {
            this.elements.body.classList.add('paper-white');
            this.elements.themeToggle.textContent = '[ DARK_MODE ]';
        } else {
            this.elements.themeToggle.textContent = '[ LIGHT_MODE ]';
        }
    },

    async loadData() {
        try {
            this.elements.loader.classList.remove('hidden');
            
            // FETCH DIRECTLY FROM SUPABASE
            const { data, error } = await supabase
                .from('problems')
                .select(`
                    *,
                    solutions (*)
                `);

            if (error) throw error;

            // Map data to match internal structure
            // Supabase returns 'platforms' (DB col), we might need 'platform' (JS prop)
            this.allProblems = data.map(p => ({
                ...p,
                platform: p.platforms || [] // Map DB 'platforms' to 'platform'
            }));
            
            this.filteredProblems = [...this.allProblems];

            this.renderCategories();
            this.renderResults();
            this.elements.loader.classList.add('hidden');
            
            console.log('SUCCESS: CONNECTED_TO_SUPABASE_DIRECTLY');
            
        } catch (error) {
            console.error('CRITICAL//LOAD_ERROR:', error);
            this.elements.resultsGrid.innerHTML = `
                <div class="terminal-error">
                    <p class="text-error">> FATAL: UNABLE_TO_ACCESS_SUPABASE.</p>
                    <p class="text-dim">> CHECK_NETWORK_CONNECTION.</p>
                    <p class="text-dim">> ERROR: ${error.message}</p>
                </div>
            `;
            this.elements.loader.classList.add('hidden');
        }
    },

    renderCategories() {
        // Safe check for missing categories
        const categories = ['ALL', ...new Set(this.allProblems.map(p => (p.category || 'MISC').toUpperCase()))];
        this.elements.categoryContainer.innerHTML = '';

        categories.sort().forEach(cat => {
            const pill = document.createElement('button');
            pill.className = `pill-terminal ${cat === this.currentCategory ? 'active' : ''}`;
            pill.textContent = `[ ${cat} ]`;
            pill.onclick = () => {
                this.currentCategory = cat;
                document.querySelectorAll('.pill-terminal').forEach(p => p.classList.remove('active'));
                pill.classList.add('active');
                this.applyFilters();
            };
            this.elements.categoryContainer.appendChild(pill);
        });
    },

    applyFilters() {
        this.filteredProblems = this.allProblems.filter(p => {
            const cat = (p.category || 'MISC').toUpperCase();
            const matchesCategory = this.currentCategory === 'ALL' || cat === this.currentCategory;

            const searchTerms = [
                p.title || '',
                p.problem_description || '',
                ...(p.search_phrases || []),
                ...(p.platform || []),
                p.category || ''
            ].join(' ').toLowerCase();

            const matchesSearch = this.searchQuery === '' ||
                this.searchQuery.split(' ').every(term => searchTerms.includes(term));

            return matchesCategory && matchesSearch;
        });

        this.renderResults();
    },

    renderResults() {
        this.elements.resultsGrid.innerHTML = '';

        if (this.filteredProblems.length === 0) {
            this.elements.emptyState.classList.remove('hidden');
            this.elements.statusLine.classList.add('hidden');
            return;
        }

        this.elements.emptyState.classList.add('hidden');
        this.elements.statusLine.classList.remove('hidden');
        this.elements.statusCount.textContent = this.filteredProblems.length;

        const fragment = document.createDocumentFragment();

        this.filteredProblems.forEach(problem => {
            const brick = document.createElement('article');
            brick.className = 'brick';

            const meta = document.createElement('div');
            meta.className = 'brick-meta';
            meta.innerHTML = `
                <span>ID: ${(problem.id || 'N/A').toUpperCase()}</span>
                <span>CAT: ${(problem.category || 'MISC').toUpperCase()}</span>
                <span>PLAT: ${(problem.platform || []).join(', ').toUpperCase()}</span>
            `;
            brick.appendChild(meta);

            const title = document.createElement('h2');
            title.className = 'brick-title';
            title.textContent = problem.title;
            brick.appendChild(title);

            const desc = document.createElement('p');
            desc.className = 'brick-desc';
            desc.textContent = problem.problem_description;
            brick.appendChild(desc);

            // Solutions
            // Supabase returns relations as arrays, so problem.solutions is correct
            (problem.solutions || []).forEach(sol => {
                const solDiv = document.createElement('div');
                solDiv.className = 'terminal-sol';

                const header = document.createElement('div');
                header.className = 'sol-header';

                const labelText = (sol.label || 'SOLUTION').toUpperCase();
                const label = document.createElement('span');
                label.className = 'sol-label';
                label.textContent = `> ${labelText}`;
                header.appendChild(label);

                const riskLevel = (sol.risk_level || 'UNKNOWN').toLowerCase();
                const risk = document.createElement('span');
                risk.className = `brick-risk risk-${riskLevel}`;
                risk.textContent = `LVL: ${riskLevel.toUpperCase()}`;
                header.appendChild(risk);

                solDiv.appendChild(header);

                // Commands
                (sol.commands || []).forEach(cmd => {
                    const cmdDiv = document.createElement('div');
                    cmdDiv.className = 'terminal-cmd';

                    const code = document.createElement('code');
                    code.textContent = cmd;
                    cmdDiv.appendChild(code);

                    const copyBtn = document.createElement('button');
                    copyBtn.className = 'btn-copy-terminal';
                    copyBtn.textContent = '[ COPY ]';
                    copyBtn.onclick = () => this.copyToClipboard(cmd, copyBtn);
                    cmdDiv.appendChild(copyBtn);

                    solDiv.appendChild(cmdDiv);
                });

                const explanation = document.createElement('p');
                explanation.className = 'brick-explanation';
                explanation.textContent = sol.explanation;
                solDiv.appendChild(explanation);

                if (sol.undo_or_recovery) {
                    const recovery = document.createElement('div');
                    recovery.className = 'recovery-zone';

                    const rTitle = document.createElement('div');
                    rTitle.className = 'recovery-title';
                    rTitle.textContent = '// UNDO_PROCEDURE:';

                    const rBody = document.createElement('p');
                    rBody.className = 'recovery-body';
                    rBody.textContent = sol.undo_or_recovery;

                    recovery.appendChild(rTitle);
                    recovery.appendChild(rBody);
                    solDiv.appendChild(recovery);
                }

                brick.appendChild(solDiv);
            });

            if (problem.warnings) {
                const warning = document.createElement('div');
                warning.className = 'terminal-warning';
                warning.textContent = `!! WARNING: ${problem.warnings.toUpperCase()}`;
                brick.appendChild(warning);
            }

            fragment.appendChild(brick);
        });

        this.elements.resultsGrid.appendChild(fragment);
    },

    copyToClipboard(text, btn) {
        navigator.clipboard.writeText(text).then(() => {
            const originalText = btn.textContent;
            btn.textContent = '[ COPIED_OK ]';
            btn.style.color = 'var(--signal-green)';
            btn.style.borderColor = 'var(--signal-green)';
            setTimeout(() => {
                btn.textContent = originalText;
                btn.style.color = '';
                btn.style.borderColor = '';
            }, 2000);
        }).catch(err => {
            console.error('SYSTEM//CLIPBOARD_FAILURE:', err);
        });
    }
};

document.addEventListener('DOMContentLoaded', () => App.init());
