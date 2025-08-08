// Variáveis globais
let xmlData = [];
let chart = null;
let currentUser = null;

// Elementos DOM
const authSection = document.getElementById('authSection');
const userInfo = document.getElementById('userInfo');
const uploadSection = document.getElementById('uploadSection');
const dashboard = document.getElementById('dashboard');
const loginTab = document.getElementById('loginTab');
const signupTab = document.getElementById('signupTab');
const loginForm = document.getElementById('loginForm');
const signupForm = document.getElementById('signupForm');
const userEmailSpan = document.getElementById('userEmail');
const logoutBtn = document.getElementById('logoutBtn');

// Verificar se há usuário logado ao carregar a página
window.addEventListener('load', async () => {
    const { data: { user } } = await window.supabase.auth.getUser();
    if (user) {
        currentUser = user;
        showMainApp();
    } else {
        showAuthSection();
    }
});

// Navegação entre abas
loginTab.addEventListener('click', () => {
    loginTab.classList.add('active');
    signupTab.classList.remove('active');
    loginForm.style.display = 'block';
    signupForm.style.display = 'none';
});

signupTab.addEventListener('click', () => {
    signupTab.classList.add('active');
    loginTab.classList.remove('active');
    signupForm.style.display = 'block';
    loginForm.style.display = 'none';
});

// Event listener para o formulário de login
document.getElementById('loginFormElement').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const email = document.getElementById('loginEmail').value.trim();
    const password = document.getElementById('loginPassword').value;
    
    // Validações de segurança
    if (!email || !password) {
        alert('❌ Por favor, preencha todos os campos.');
        return;
    }
    
    if (!isValidEmail(email)) {
        alert('❌ Por favor, insira um email válido.');
        return;
    }
    
    if (password.length < 6) {
        alert('❌ A senha deve ter pelo menos 6 caracteres.');
        return;
    }
    
    try {
        const { data, error } = await window.supabase.auth.signInWithPassword({
            email: email,
            password: password
        });
        
        if (error) {
            // Tratar erro de email não confirmado
            if (error.message.includes('Email not confirmed') || error.message.includes('email_not_confirmed')) {
                alert('⚠️ Email não confirmado!\n\nPara fazer login, você precisa confirmar seu email primeiro.\n\nVerifique sua caixa de entrada, pasta de SPAM ou LIXEIRA e clique no link de confirmação que enviamos.\n\nSe não encontrar o email, tente fazer um novo cadastro.');
            } else if (error.message.includes('Invalid login credentials')) {
                alert('❌ Credenciais inválidas!\n\nVerifique se o email e senha estão corretos.');
            } else {
                alert('Erro no login: ' + error.message);
            }
        } else {
            currentUser = data.user;
            showMainApp();
        }
    } catch (error) {
        alert('Erro: ' + error.message);
    }
});

// Event listener para o formulário de cadastro
document.getElementById('signupFormElement').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const email = document.getElementById('signupEmail').value.trim();
    const password = document.getElementById('signupPassword').value;
    
    // Validações de segurança
    if (!email || !password) {
        alert('❌ Por favor, preencha todos os campos.');
        return;
    }
    
    if (!isValidEmail(email)) {
        alert('❌ Por favor, insira um email válido.');
        return;
    }
    
    if (password.length < 6) {
        alert('❌ A senha deve ter pelo menos 6 caracteres.');
        return;
    }
    
    if (password.length > 128) {
        alert('❌ A senha não pode ter mais de 128 caracteres.');
        return;
    }
    
    try {
        const { data, error } = await window.supabase.auth.signUp({
            email: email,
            password: password
        });
        
        if (error) {
            if (error.message.includes('User already registered')) {
                alert('❌ Este email já está cadastrado!\n\nTente fazer login ou use outro email.');
            } else {
                alert('Erro no cadastro: ' + error.message);
            }
        } else {
            alert('✅ Cadastro realizado com sucesso!\n\n📧 Enviamos um email de confirmação para: ' + email + '\n\n⚠️ IMPORTANTE: Verifique sua caixa de entrada, pasta de SPAM ou LIXEIRA e clique no link de confirmação.\n\nApós confirmar o email, você poderá fazer login normalmente.');
            // Mudar para aba de login após cadastro
            loginTab.click();
        }
    } catch (error) {
        alert('Erro: ' + error.message);
    }
});

// Event listener para logout
logoutBtn.addEventListener('click', async () => {
    try {
        const { error } = await window.supabase.auth.signOut();
        if (error) {
            alert('Erro ao sair: ' + error.message);
        } else {
            currentUser = null;
            showAuthSection();
            // Limpar dados
            xmlData = [];
            if (chart) {
                chart.destroy();
                chart = null;
            }
        }
    } catch (error) {
        alert('Erro: ' + error.message);
    }
});

// Funções para controlar visibilidade das seções
function showAuthSection() {
    authSection.style.display = 'block';
    userInfo.style.display = 'none';
    uploadSection.style.display = 'none';
    dashboard.style.display = 'none';
}

function showMainApp() {
    authSection.style.display = 'none';
    userInfo.style.display = 'block';
    uploadSection.style.display = 'block';
    userEmailSpan.textContent = currentUser.email;
}

class MT5OptimizerAnalyzer {
    constructor() {
        this.data = [];
        this.bestSetups = [];
        // Wait for DOM to be fully loaded
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                this.initializeEventListeners();
            });
        } else {
            this.initializeEventListeners();
        }
    }

    initializeEventListeners() {
        const uploadArea = document.getElementById('uploadArea');
        const fileInput = document.getElementById('xmlFile');
        
        if (!uploadArea || !fileInput) {
            console.error('Elementos de upload não encontrados');
            return;
        }

        // Drag and drop functionality
        uploadArea.addEventListener('dragover', (e) => {
            e.preventDefault();
            uploadArea.classList.add('dragover');
        });

        uploadArea.addEventListener('dragleave', () => {
            uploadArea.classList.remove('dragover');
        });

        uploadArea.addEventListener('drop', (e) => {
            e.preventDefault();
            uploadArea.classList.remove('dragover');
            const files = e.dataTransfer.files;
            if (files.length > 0) {
                this.handleFileUpload(files[0]);
            }
        });

        // File input change
        fileInput.addEventListener('change', (e) => {
            if (e.target.files.length > 0) {
                this.handleFileUpload(e.target.files[0]);
            }
        });

        // Download buttons
        const downloadBest = document.getElementById('downloadBest');
        const downloadAllSets = document.getElementById('downloadAllSets');
        
        if (downloadBest) {
            downloadBest.addEventListener('click', () => {
                if (this.bestSetups.length > 0) {
                    this.downloadSetFile(this.bestSetups[0], 'best_setup');
                }
            });
        }
        
        if (downloadAllSets) {
            downloadAllSets.addEventListener('click', () => {
                this.downloadAllSets();
            });
        }
    }

    async handleFileUpload(file) {
        // Validações de segurança
        if (!file.name.toLowerCase().endsWith('.xml')) {
            alert('❌ Por favor, selecione um arquivo XML válido.');
            return;
        }

        // Verificar tamanho do arquivo (máximo 50MB)
        const maxSize = 50 * 1024 * 1024; // 50MB
        if (file.size > maxSize) {
            alert('❌ Arquivo muito grande! O tamanho máximo permitido é 50MB.');
            return;
        }

        // Verificar tipo MIME
        if (file.type && !['text/xml', 'application/xml'].includes(file.type)) {
            alert('❌ Tipo de arquivo não permitido. Apenas arquivos XML são aceitos.');
            return;
        }

        try {
            this.showLoading();
            const xmlContent = await this.readFileAsText(file);
            
            // Validação básica de conteúdo XML
            if (!xmlContent.trim().startsWith('<?xml') && !xmlContent.trim().startsWith('<')) {
                throw new Error('Arquivo não parece ser um XML válido');
            }
            
            // Use setTimeout to make parsing non-blocking
            setTimeout(() => {
                try {
                    this.parseXMLData(xmlContent);
                    this.analyzeData();
                    this.updateDashboard();
                    this.createChart();
                    this.updateRanking();
                    this.showDashboard();
                } catch (error) {
                    console.error('Erro ao processar arquivo:', error);
                    alert('❌ Erro ao processar o arquivo XML. Verifique se o formato está correto.');
                    this.hideLoading();
                }
            }, 100);
            
        } catch (error) {
            console.error('Erro ao ler arquivo:', error);
            alert('❌ Erro ao ler o arquivo XML.');
            this.hideLoading();
        }
    }

    readFileAsText(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => resolve(e.target.result);
            reader.onerror = (e) => reject(e);
            reader.readAsText(file);
        });
    }

    parseXMLData(xmlContent) {
        console.log('Iniciando parsing do XML...');
        
        // Sanitização básica para prevenir XXE attacks
        const sanitizedContent = xmlContent
            .replace(/<!DOCTYPE[^>]*>/gi, '') // Remove DOCTYPE declarations
            .replace(/<!ENTITY[^>]*>/gi, '')  // Remove ENTITY declarations
            .replace(/<\?xml-stylesheet[^>]*\?>/gi, ''); // Remove XML stylesheets
        
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(sanitizedContent, 'text/xml');
        
        // Check for parsing errors
        const parserError = xmlDoc.querySelector('parsererror');
        if (parserError) {
            throw new Error('Erro ao analisar XML: ' + (parserError.textContent || 'Formato XML inválido'));
        }
        
        // Extrair timeframe do título
        this.extractTimeframeFromTitle(xmlDoc);
        
        // Verificar se é um arquivo de otimização do MT5
        const rows = xmlDoc.querySelectorAll('Row');
        if (rows.length < 2) {
            throw new Error('Arquivo XML não contém dados de otimização válidos');
        }
        console.log(`Total de linhas encontradas: ${rows.length}`);
        this.data = [];
        
        // Process rows in batches to avoid blocking the UI
        let processedRows = 0;
        const batchSize = 1000;
        
        for (let i = 1; i < rows.length; i++) { // Skip first row (header)
            const cells = rows[i].querySelectorAll('Cell');
            if (cells.length >= 10) {
                // Extract data from each cell
                const cellData = [];
                cells.forEach(cell => {
                    const dataElement = cell.querySelector('Data');
                    if (dataElement) {
                        cellData.push(dataElement.textContent.trim());
                    } else {
                        cellData.push('');
                    }
                });
                
                // Check if it's a valid data row (numeric pass number)
                if (cellData[0] && !isNaN(parseInt(cellData[0]))) {
                    const setup = {
                        pass: parseInt(cellData[0]) || 0,
                        result: parseFloat(cellData[1]) || 0,
                        profit: parseFloat(cellData[2]) || 0,
                        expectedPayoff: parseFloat(cellData[3]) || 0,
                        profitFactor: parseFloat(cellData[4]) || 0,
                        recoveryFactor: parseFloat(cellData[5]) || 0,
                        sharpeRatio: parseFloat(cellData[6]) || 0,
                        custom: parseFloat(cellData[7]) || 0,
                        drawdown: parseFloat(cellData[8]) || 0,
                        trades: parseInt(cellData[9]) || 0,
                        parameters: this.extractParameters(cellData)
                    };
                    
                    // Only include setups with valid data
                    if (setup.profit > 0 && setup.drawdown > 0 && setup.pass > 0) {
                        this.data.push(setup);
                    }
                }
            }
            
            processedRows++;
            // Log progress every 10000 rows
            if (processedRows % 10000 === 0) {
                console.log(`Processadas ${processedRows} linhas, encontrados ${this.data.length} setups válidos`);
            }
        }
        
        console.log(`Parsing concluído: ${this.data.length} setups válidos encontrados`);
        
        if (this.data.length === 0) {
            throw new Error('Nenhum dado válido encontrado no arquivo XML. Verifique se é um arquivo de otimização do MT5.');
        }
    }

    extractTimeframeFromTitle(xmlDoc) {
        try {
            // Procurar pelo título no documento
            const titleElement = xmlDoc.querySelector('DocumentProperties Title');
            if (titleElement) {
                const title = titleElement.textContent;
                console.log('Título encontrado:', title);
                
                // Extrair timeframe do título (ex: "PivoICS GBPUSD,M30 2025.01.01-2025.08.07")
                const timeframeMatch = title.match(/,([MHD]\d+)/i);
                if (timeframeMatch) {
                    this.timeframe = timeframeMatch[1];
                    console.log('Timeframe extraído:', this.timeframe);
                    
                    // Atualizar título da página
                    this.updatePageTitle(title);
                }
                
                // Extrair símbolo
                const symbolMatch = title.match(/(\w+),/);
                if (symbolMatch) {
                    this.symbol = symbolMatch[1];
                    console.log('Símbolo extraído:', this.symbol);
                }
            }
        } catch (error) {
            console.warn('Erro ao extrair timeframe do título:', error);
        }
    }
    
    updatePageTitle(title) {
        try {
            // Atualizar título da página
            document.title = `MT5 Optimizer - ${title}`;
            
            // Atualizar título do gráfico se existir
            const chartTitle = document.querySelector('.chart-title');
            if (chartTitle) {
                chartTitle.textContent = title;
            }
        } catch (error) {
            console.warn('Erro ao atualizar título da página:', error);
        }
    }
    
    updateBestSetupTitle() {
        try {
            const bestSetupTitleElement = document.getElementById('bestSetupTitle');
            if (bestSetupTitleElement && this.timeframe) {
                bestSetupTitleElement.textContent = `Melhor Setup de ${this.timeframe}`;
            }
        } catch (error) {
            console.warn('Erro ao atualizar título do melhor setup:', error);
        }
    }

    extractParameters(cellData) {
        const params = {};
        if (cellData.length > 10) {
            params.lotSize = parseFloat(cellData[10]) || 0;
            params.pivotCalculationType = parseInt(cellData[11]) || 0;
            params.pivotTimeframe = parseInt(cellData[12]) || 0;
            params.useR1 = cellData[13] === 'true' || cellData[13] === '1';
            params.useR2 = cellData[14] === 'true' || cellData[14] === '1';
            params.useR3 = cellData[15] === 'true' || cellData[15] === '1';
            params.useR4 = cellData[16] === 'true' || cellData[16] === '1';
            params.useS1 = cellData[17] === 'true' || cellData[17] === '1';
            params.useS2 = cellData[18] === 'true' || cellData[18] === '1';
            params.useS3 = cellData[19] === 'true' || cellData[19] === '1';
            params.useS4 = cellData[20] === 'true' || cellData[20] === '1';
            params.pivotDistance = parseInt(cellData[21]) || 0;
            params.stopLoss = parseInt(cellData[22]) || 0;
            params.takeProfit = parseInt(cellData[23]) || 0;
            params.useBreakeven = cellData[24] === 'true' || cellData[24] === '1';
            params.breakevenTrigger = parseInt(cellData[25]) || 0;
            params.breakevenBuffer = parseInt(cellData[26]) || 0;
            params.useTrailingStop = cellData[27] === 'true' || cellData[27] === '1';
            params.trailingStart = parseInt(cellData[28]) || 0;
            params.trailingDistance = parseInt(cellData[29]) || 0;
            params.trailingStep = parseInt(cellData[30]) || 0;
        }
        return params;
    }

    analyzeData() {
        // Filtros de qualidade profissional (nível hedge fund)
        const qualityFiltered = this.data.filter(setup => {
            return setup.trades >= 30 &&           // Mínimo 30 trades para significância estatística
                   setup.drawdown <= 25 &&         // Máximo 25% drawdown para preservação de capital
                   setup.profitFactor >= 1.3 &&    // Mínimo 1.3 profit factor para viabilidade
                   setup.profit > 0 &&             // Lucro positivo
                   setup.recoveryFactor > 0;       // Recovery factor válido
        });
        
        console.log(`Filtros de qualidade aplicados: ${qualityFiltered.length} de ${this.data.length} setups aprovados`);
        
        // Calculate advanced score for each qualified setup
        qualityFiltered.forEach(setup => {
            // Normalizar Sharpe Ratio (0-10 scale)
            const normalizedSharpe = Math.max(0, Math.min(10, setup.sharpeRatio * 2));
            
            // Recovery Factor Score (peso 40%)
            const recoveryFactorScore = setup.recoveryFactor * 4;
            
            // Sharpe Ratio Score (peso 25%) - Retorno ajustado ao risco
            const sharpeScore = normalizedSharpe * 2.5;
            
            // Profit/Drawdown ratio (peso 20%)
            const profitDrawdownRatio = (setup.profit / setup.drawdown) * 2;
            
            // Profit Factor Score (peso 10%)
            const profitFactorScore = Math.min(setup.profitFactor, 5) * 1;
            
            // Consistency Bonus (peso 5%) - baseado em trades e win rate estimado
            const tradesReliability = Math.min(setup.trades / 100, 1);
            const expectedPayoffBonus = setup.expectedPayoff > 0 ? 0.5 : 0;
            const consistencyBonus = (tradesReliability + expectedPayoffBonus) * 0.5;
            
            // Score final profissional
            setup.score = recoveryFactorScore + sharpeScore + profitDrawdownRatio + profitFactorScore + consistencyBonus;
            
            // Métricas individuais para análise detalhada
            setup.recoveryScore = recoveryFactorScore;
            setup.sharpeScore = sharpeScore;
            setup.profitDrawdownScore = profitDrawdownRatio;
            setup.consistencyScore = consistencyBonus;
            setup.qualityRating = this.calculateQualityRating(setup);
        });
        
        // Atualizar dados filtrados
        this.data = qualityFiltered;
        
        if (this.data.length === 0) {
            throw new Error('Nenhum setup atende aos critérios de qualidade profissional. Considere relaxar os filtros.');
        }

        // Sort by professional criteria
        this.bestSetups = [...this.data]
            .sort((a, b) => {
                // Primeiro: Recovery Factor (diferença significativa)
                if (Math.abs(a.recoveryFactor - b.recoveryFactor) > 0.15) {
                    return b.recoveryFactor - a.recoveryFactor;
                }
                // Segundo: Sharpe Ratio (retorno ajustado ao risco)
                if (Math.abs(a.sharpeRatio - b.sharpeRatio) > 0.1) {
                    return b.sharpeRatio - a.sharpeRatio;
                }
                // Terceiro: Score total
                return b.score - a.score;
            })
            .slice(0, 20);
    }
    
    calculateQualityRating(setup) {
        let rating = 0;
        
        // Recovery Factor rating
        if (setup.recoveryFactor >= 3) rating += 25;
        else if (setup.recoveryFactor >= 2) rating += 20;
        else if (setup.recoveryFactor >= 1.5) rating += 15;
        else rating += 10;
        
        // Sharpe Ratio rating
        if (setup.sharpeRatio >= 2) rating += 25;
        else if (setup.sharpeRatio >= 1.5) rating += 20;
        else if (setup.sharpeRatio >= 1) rating += 15;
        else rating += 10;
        
        // Drawdown rating (inverso - menor é melhor)
        if (setup.drawdown <= 5) rating += 25;
        else if (setup.drawdown <= 10) rating += 20;
        else if (setup.drawdown <= 15) rating += 15;
        else rating += 10;
        
        // Profit Factor rating
        if (setup.profitFactor >= 2.5) rating += 25;
        else if (setup.profitFactor >= 2) rating += 20;
        else if (setup.profitFactor >= 1.5) rating += 15;
        else rating += 10;
        
        return Math.min(100, rating); // Cap at 100%
    }

    updateDashboard() {
        if (!this.bestSetups || this.bestSetups.length === 0) {
            throw new Error('Nenhum setup válido encontrado para exibir no dashboard.');
        }
        
        // Atualizar título do melhor setup com timeframe
        this.updateBestSetupTitle();
        
        const bestSetup = this.bestSetups[0];
        const minDrawdown = Math.min(...this.data.map(d => d.drawdown));
        const maxProfit = Math.max(...this.data.map(d => d.profit));
        const maxRecoveryFactor = Math.max(...this.data.map(d => d.recoveryFactor));
        const maxSharpeRatio = Math.max(...this.data.map(d => d.sharpeRatio));
        const avgQualityRating = this.data.reduce((sum, d) => sum + d.qualityRating, 0) / this.data.length;

        const bestProfitElement = document.getElementById('bestProfit');
        const bestDrawdownElement = document.getElementById('bestDrawdown');
        const totalTestsElement = document.getElementById('totalTests');
        const minDrawdownElement = document.getElementById('minDrawdown');
        const maxProfitElement = document.getElementById('maxProfit');
        
        if (bestProfitElement) {
            bestProfitElement.innerHTML = `
                <div>💰 $${bestSetup.profit.toLocaleString('pt-BR', {minimumFractionDigits: 2})}</div>
                <div style="font-size: 0.75em; color: #28a745; margin-top: 2px;">🔄 RF: ${bestSetup.recoveryFactor.toFixed(2)} | 📊 Sharpe: ${bestSetup.sharpeRatio.toFixed(2)}</div>
                <div style="font-size: 0.7em; color: #6c757d; margin-top: 2px;">⭐ Qualidade: ${bestSetup.qualityRating.toFixed(0)}%</div>
            `;
        }
        if (bestDrawdownElement) {
            bestDrawdownElement.innerHTML = `
                <div>📉 ${bestSetup.drawdown.toFixed(2)}%</div>
                <div style="font-size: 0.8em; color: #dc3545; margin-top: 4px;">🛡️ Máx permitido: 25%</div>
            `;
        }
        if (totalTestsElement) {
            totalTestsElement.innerHTML = `
                <div>${this.data.length.toLocaleString('pt-BR')} aprovados</div>
                <div style="font-size: 0.8em; color: #6c757d; margin-top: 4px;">✅ Filtros profissionais</div>
            `;
        }
        if (minDrawdownElement) {
            minDrawdownElement.innerHTML = `
                <div>${minDrawdown.toFixed(2)}%</div>
                <div style="font-size: 0.8em; color: #28a745; margin-top: 4px;">🎯 Menor risco</div>
            `;
        }
        if (maxProfitElement) {
            maxProfitElement.innerHTML = `
                <div>$${maxProfit.toLocaleString('pt-BR', {minimumFractionDigits: 2})}</div>
                <div style="font-size: 0.75em; color: #17a2b8; margin-top: 2px;">🏆 RF: ${maxRecoveryFactor.toFixed(2)} | 📈 Sharpe: ${maxSharpeRatio.toFixed(2)}</div>
                <div style="font-size: 0.7em; color: #6c757d; margin-top: 2px;">📊 Qualidade Média: ${avgQualityRating.toFixed(0)}%</div>
            `;
        }
    }

    createChart() {
        const chartElement = document.getElementById('scatterChart');
        if (!chartElement) {
            console.error('Elemento canvas não encontrado');
            return;
        }
        
        const ctx = chartElement.getContext('2d');
        if (!ctx) {
            console.error('Não foi possível obter o contexto 2D do canvas');
            return;
        }
        
        // Destroy existing chart if it exists
        if (window.myChart) {
            window.myChart.destroy();
        }

        const chartData = this.data.map(setup => ({
            x: setup.drawdown,
            y: setup.profit,
            pass: setup.pass,
            score: setup.score
        }));

        window.myChart = new Chart(ctx, {
            type: 'scatter',
            data: {
                datasets: [{
                    label: 'Setups',
                    data: chartData,
                    backgroundColor: (context) => {
                        const score = context.parsed.score || 0;
                        if (score > 5000) return 'rgba(255, 215, 0, 0.8)';
                        if (score > 3000) return 'rgba(40, 167, 69, 0.8)';
                        if (score > 1000) return 'rgba(23, 162, 184, 0.8)';
                        return 'rgba(108, 117, 125, 0.6)';
                    },
                    borderColor: 'rgba(102, 126, 234, 1)',
                    borderWidth: 2,
                    pointRadius: 6,
                    pointHoverRadius: 8
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    title: {
                        display: true,
                        text: this.timeframe && this.symbol ? 
                            `Análise ${this.symbol} ${this.timeframe} - Recovery Factor Prioritário` : 
                            'Análise Otimizada: Recovery Factor Prioritário',
                        font: { size: 16 }
                    },
                    tooltip: {
                        callbacks: {
                            label: (context) => {
                                const point = context.raw;
                                const setup = this.data.find(s => s.pass === point.pass);
                                if (!setup) return [`Pass: ${point.pass}`, 'Dados não encontrados'];
                                
                                return [
                                    `🎯 Pass: ${point.pass}`,
                                    `🔄 Recovery Factor: ${setup.recoveryFactor.toFixed(2)}`,
                                    `📊 Sharpe Ratio: ${setup.sharpeRatio.toFixed(2)}`,
                                    `💰 Lucro: $${context.parsed.y.toLocaleString('pt-BR', {minimumFractionDigits: 2})}`,
                                    `📉 Drawdown: ${context.parsed.x.toFixed(2)}%`,
                                    `📈 Profit Factor: ${setup.profitFactor.toFixed(2)}`,
                                    `🔢 Trades: ${setup.trades}`,
                                    `⭐ Qualidade: ${setup.qualityRating.toFixed(0)}%`,
                                    `🏆 Score Final: ${point.score.toFixed(2)}`
                                ];
                            }
                        }
                    }
                },
                scales: {
                    x: {
                        title: {
                            display: true,
                            text: 'Drawdown (%)'
                        },
                        grid: {
                            color: 'rgba(0, 0, 0, 0.1)'
                        }
                    },
                    y: {
                        title: {
                            display: true,
                            text: 'Lucro ($)'
                        },
                        grid: {
                            color: 'rgba(0, 0, 0, 0.1)'
                        }
                    }
                }
            }
        });
    }

    updateRanking() {
        const tbody = document.getElementById('rankingBody');
        if (!tbody) {
            console.error('Elemento rankingBody não encontrado');
            return;
        }
        tbody.innerHTML = '';

        this.bestSetups.forEach((setup, index) => {
            const row = document.createElement('tr');
            
            const rankClass = index === 0 ? 'gold' : index === 1 ? 'silver' : index === 2 ? 'bronze' : '';
            const drawdownClass = setup.drawdown < 10 ? 'drawdown-low' : setup.drawdown < 20 ? 'drawdown-medium' : 'drawdown-high';
            const scoreClass = setup.score > 5000 ? 'score-excellent' : setup.score > 3000 ? 'score-good' : 'score-average';
            const sharpeClass = setup.sharpeRatio >= 1.5 ? 'text-success' : setup.sharpeRatio >= 1 ? 'text-warning' : 'text-danger';
            const qualityClass = setup.qualityRating >= 80 ? 'text-success' : setup.qualityRating >= 60 ? 'text-warning' : 'text-danger';
            
            row.innerHTML = `
                <td><span class="rank-badge ${rankClass}">${index + 1}</span></td>
                <td>${setup.pass}</td>
                <td style="font-weight: bold; color: #28a745;">${setup.recoveryFactor.toFixed(2)}</td>
                <td class="${sharpeClass}" style="font-weight: bold;">${setup.sharpeRatio.toFixed(2)}</td>
                <td class="profit-positive">$${setup.profit.toLocaleString('pt-BR', {minimumFractionDigits: 2})}</td>
                <td class="${drawdownClass}">${setup.drawdown.toFixed(2)}%</td>
                <td>${setup.profitFactor.toFixed(2)}</td>
                <td>${setup.trades}</td>
                <td class="${qualityClass}" style="font-weight: bold;">${setup.qualityRating.toFixed(0)}%</td>
                <td><span class="${scoreClass}">${setup.score.toFixed(0)}</span></td>
                <td>
                    <button class="btn-download" onclick="analyzer.downloadSetFile(analyzer.bestSetups[${index}], 'setup_${index + 1}')">
                        <i class="fas fa-download"></i> SET
                    </button>
                </td>
            `;
            
            tbody.appendChild(row);
        });
    }

    downloadSetFile(setup, filename) {
        const setContent = this.generateSetContent(setup);
        const blob = new Blob([setContent], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = `${filename}.set`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    generateSetContent(setup) {
        const params = setup.parameters;
        return `; MT5 Optimizer Best Setup - Pass ${setup.pass}
; Profit: $${setup.profit.toFixed(2)} | Drawdown: ${setup.drawdown.toFixed(2)}%
; Generated by MT5 Optimizer Analyzer

LotSize=${params.lotSize || 1.0}
PivotCalculationType=${params.pivotCalculationType || 0}
PivotTimeframe=${params.pivotTimeframe || 240}
UseR1=${params.useR1 ? 'true' : 'false'}
UseR2=${params.useR2 ? 'true' : 'false'}
UseR3=${params.useR3 ? 'true' : 'false'}
UseR4=${params.useR4 ? 'true' : 'false'}
UseS1=${params.useS1 ? 'true' : 'false'}
UseS2=${params.useS2 ? 'true' : 'false'}
UseS3=${params.useS3 ? 'true' : 'false'}
UseS4=${params.useS4 ? 'true' : 'false'}
PivotDistance=${params.pivotDistance || 0}
StopLoss=${params.stopLoss || 0}
TakeProfit=${params.takeProfit || 0}
UseBreakeven=${params.useBreakeven ? 'true' : 'false'}
BreakevenTrigger=${params.breakevenTrigger || 0}
BreakevenBuffer=${params.breakevenBuffer || 0}
UseTrailingStop=${params.useTrailingStop ? 'true' : 'false'}
TrailingStart=${params.trailingStart || 0}
TrailingDistance=${params.trailingDistance || 0}
TrailingStep=${params.trailingStep || 0}`;
    }

    downloadAllSets() {
        this.bestSetups.forEach((setup, index) => {
            setTimeout(() => {
                this.downloadSetFile(setup, `top_${index + 1}_setup`);
            }, index * 100); // Small delay between downloads
        });
    }

    showLoading() {
        const dashboard = document.getElementById('dashboard');
        if (dashboard) {
            // Create loading overlay instead of replacing content
            const loadingOverlay = document.createElement('div');
            loadingOverlay.id = 'loadingOverlay';
            loadingOverlay.className = 'loading-overlay';
            loadingOverlay.innerHTML = '<div class="loading"><i class="fas fa-spinner fa-spin"></i>Processando arquivo XML...</div>';
            
            // Add overlay styles
            loadingOverlay.style.cssText = `
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(255, 255, 255, 0.9);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 1000;
                font-size: 18px;
                color: #333;
            `;
            
            dashboard.style.position = 'relative';
            dashboard.style.display = 'block';
            dashboard.appendChild(loadingOverlay);
        } else {
            console.error('Elemento dashboard não encontrado para mostrar loading');
        }
    }

    hideLoading() {
        const loadingOverlay = document.getElementById('loadingOverlay');
        if (loadingOverlay) {
            loadingOverlay.remove();
        }
    }

    showDashboard() {
        const dashboard = document.getElementById('dashboard');
        if (dashboard) {
            // Remove loading overlay if it exists
            this.hideLoading();
            dashboard.style.display = 'block';
        } else {
            console.error('Elemento dashboard não encontrado');
        }
    }
}

// Função para validar email
function isValidEmail(email) {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email) && email.length <= 254;
}

// Função para sanitizar texto
function sanitizeText(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Função para escapar HTML
function escapeHtml(text) {
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, function(m) { return map[m]; });
}

// Initialize the analyzer
const analyzer = new MT5OptimizerAnalyzer();