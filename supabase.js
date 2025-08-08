// Configuração do Supabase com fallback para desenvolvimento
const supabaseUrl = (typeof process !== 'undefined' && process.env?.VITE_SUPABASE_URL) || 'https://jhojdgoksfkfsxbezoqn.supabase.co';
const supabaseKey = (typeof process !== 'undefined' && process.env?.VITE_SUPABASE_ANON_KEY) || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Impob2pkZ29rc2ZrZnN4YmV6b3FuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ2NTAyMTUsImV4cCI6MjA3MDIyNjIxNX0.npJnIsfL4Aknd-Jw6jbVu1vw7pdnBWlv_VbWOMNSuJ4';

// Validação das configurações
if (!supabaseUrl || !supabaseKey) {
    console.error('❌ Configurações do Supabase não encontradas!');
    throw new Error('Configurações do Supabase são obrigatórias');
}

// Validação básica da URL
if (!supabaseUrl.startsWith('https://') || !supabaseUrl.includes('.supabase.co')) {
    console.error('❌ URL do Supabase inválida!');
    throw new Error('URL do Supabase deve ser uma URL válida do Supabase');
}

// Criação do cliente Supabase
try {
    window.supabase = window.supabase.createClient(supabaseUrl, supabaseKey, {
        auth: {
            autoRefreshToken: true,
            persistSession: true,
            detectSessionInUrl: true
        }
    });
    console.log('✅ Cliente Supabase inicializado com sucesso');
} catch (error) {
    console.error('❌ Erro ao inicializar cliente Supabase:', error);
    throw error;
}