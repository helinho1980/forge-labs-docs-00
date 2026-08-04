import { useState } from 'react';
import { BrowserRouter, Routes, Route, Link, useParams } from 'react-router-dom';
import { 
  Stethoscope, Gavel, TrendingUp, Factory, GraduationCap, FlaskConical, Layers,
  ArrowLeft, Brain, Sparkles, Loader2, CheckCircle2, BookOpen, ExternalLink 
} from 'lucide-react';

const workspaces = [
  { id: 'medicine', title: 'Medicine', subtitle: 'IA para Saúde', desc: 'Anamnese, prontuário, SOAP...', badge: '4.200+ médicos', color: 'border-blue-500', iconColor: 'text-blue-500', bgColor: 'bg-blue-50', icon: Stethoscope },
  { id: 'legal', title: 'Legal', subtitle: 'IA Jurídica', desc: 'Análise de contratos, pareceres...', badge: 'Disponível', color: 'border-purple-500', iconColor: 'text-purple-500', bgColor: 'bg-purple-50', icon: Gavel },
  { id: 'finance', title: 'Finance', subtitle: 'IA Financeira', desc: 'DRE, fluxo de caixa, matriz de risco...', badge: 'Disponível', color: 'border-green-500', iconColor: 'text-green-500', bgColor: 'bg-green-50', icon: TrendingUp },
  { id: 'industry', title: 'Industry', subtitle: 'IA Industrial', desc: 'Manutenção, qualidade, KPIs...', badge: 'Disponível', color: 'border-orange-500', iconColor: 'text-orange-500', bgColor: 'bg-orange-50', icon: Factory },
  { id: 'education', title: 'Education', subtitle: 'IA Educacional', desc: 'Planos de aula, quizzes, rubricas...', badge: 'Disponível', color: 'border-cyan-500', iconColor: 'text-cyan-500', bgColor: 'bg-cyan-50', icon: GraduationCap },
  { id: 'research', title: 'Research', subtitle: 'IA Científica (Sci-Hub Integrated)', desc: 'Revisão de literatura, artigos e protocolos...', badge: 'Sci-Hub Ativo', color: 'border-pink-500', iconColor: 'text-pink-500', bgColor: 'bg-pink-50', icon: FlaskConical },
];

function Home() {
  return (
    <div className="min-h-screen bg-gray-50 p-8 text-gray-800">
      <header className="flex justify-between items-center mb-12">
        <div className="flex items-center gap-2 font-black tracking-wider text-slate-900">
          <Layers className="w-6 h-6 text-indigo-600" />
          <span>FORGE LABS</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-right">
            <p className="text-sm font-semibold text-slate-900">Dr. Helena Camargo</p>
            <p className="text-xs text-gray-400">Admin Workspace</p>
          </div>
          <div className="w-10 h-10 bg-indigo-600 rounded-full flex items-center justify-center text-white font-bold shadow-md">DH</div>
        </div>
      </header>
      <div className="mb-10">
        <p className="text-xs uppercase tracking-widest text-gray-400 font-bold">Boa noite,</p>
        <h1 className="text-4xl font-extrabold text-slate-900 mt-1">Dr. Helena</h1>
        <p className="text-gray-500 mt-2">Escolha seu AI Workspace para começar.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {workspaces.map((ws) => {
          const IconComponent = ws.icon;
          return (
            <Link to={`/workspace/${ws.id}`} key={ws.id} className={`bg-white p-6 rounded-2xl border-t-4 ${ws.color} shadow-sm hover:shadow-md transition-all flex flex-col justify-between`}>
              <div>
                <div className="flex justify-between items-start mb-4">
                  <div className={`p-3 rounded-xl ${ws.bgColor} ${ws.iconColor}`}><IconComponent className="w-6 h-6" /></div>
                  <span className="text-xs font-semibold px-2 py-1 bg-gray-100 text-gray-600 rounded-full">{ws.badge}</span>
                </div>
                <h3 className="text-2xl font-bold text-slate-800 mb-1">{ws.title}</h3>
                <p className="text-sm font-bold text-blue-600 mb-2">{ws.subtitle}</p>
                <p className="text-gray-500 text-xs line-clamp-2">{ws.desc}</p>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
function WorkspaceContainer() {
  const { id } = useParams();
  const [textoInjetado, setTextoInjetado] = useState('');
  const [status, setStatus] = useState<'ocioso' | 'analisando' | 'concluido'>('ocioso');
  const [resultado, setResultado] = useState<string | null>(null);
  const [linkSciHub, setLinkSciHub] = useState<string | null>(null);

  const currentWorkspace = workspaces.find(w => w.id === id) || workspaces;
  const IconComponent = currentWorkspace.icon;
  const isResearch = id === 'research';

  const lidarComAnalise = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!textoInjetado.trim()) return;

    setStatus('analisando');
    setResultado('');
    setLinkSciHub(null);

    if (isResearch) {
      setLinkSciHub(`https://sci-hub.ru{textoInjetado.trim()}`);
    }

    try {
      const response = await fetch('/api-ollama/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'llama3',
          prompt: isResearch 
            ? `Você é o assistente científico da Forge Labs. O usuário forneceu o DOI: "${textoInjetado}". Gere um resumo estruturado em português com Objetivo, Metodologia e Resultados.`
            : `Você é o assistente especialista da Forge Labs vertical ${currentWorkspace.title}. Analise o seguinte caso usando o padrão SOAP em português: ${textoInjetado}`,
          stream: false,
        }),
      });

      if (!response.ok) throw new Error('Erro');
      const data = await response.json();
      setResultado(data.response);
      setStatus('concluido');
    } catch (error) {
      console.error(error);
      setResultado('Erro ao processar a requisição com a IA local.');
      setStatus('concluido');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 flex flex-col">
      <header className="bg-white border-b border-gray-200 px-8 py-4 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-4">
          <Link to="/" className="p-2 hover:bg-gray-100 rounded-lg text-gray-500"><ArrowLeft className="w-5 h-5" /></Link>
          <div className="flex items-center gap-2 font-black tracking-wider text-slate-900">
            <Layers className="w-5 h-5 text-indigo-600" />
            <span>FORGE LABS</span>
          </div>
          <span className="text-gray-300">/</span>
          <div className={`flex items-center gap-2 font-bold ${currentWorkspace.iconColor}`}>
            <IconComponent className="w-4 h-4" />
            <span>{currentWorkspace.title}</span>
          </div>
        </div>
      </header>

      <main className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-8 p-8 max-w-7xl w-full mx-auto">
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex flex-col justify-between">
          <div>
            <div className="mb-6">
              <span className={`text-xs font-bold uppercase tracking-widest px-2 py-1 rounded-md ${currentWorkspace.bgColor} ${currentWorkspace.iconColor}`}>{currentWorkspace.subtitle}</span>
              <h2 className="text-2xl font-extrabold text-slate-900 mt-3">{isResearch ? 'Buscador de Artigos Científicos' : 'Análise de IA'}</h2>
              <p className="text-gray-500 text-sm mt-1">{isResearch ? 'Insira o DOI para resgatar via Sci-Hub.' : 'Insira os dados brutos.'}</p>
            </div>
            <form onSubmit={lidarComAnalise} className="space-y-4">
              <textarea
                value={textoInjetado}
                onChange={(e) => setTextoInjetado(e.target.value)}
                placeholder={isResearch ? "Ex: 10.1038/s41586-020-2012-7" : "Insira as notas aqui..."}
                className="w-full h-64 p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none resize-none text-sm text-slate-700 bg-gray-50/50"
                disabled={status === 'analisando'}
              />
              <button type="submit" disabled={status === 'analisando' || !textoInjetado.trim()} className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-300 text-white font-bold py-3.5 px-4 rounded-xl transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer">
                {status === 'analisando' ? 'Processando...' : isResearch ? 'Buscar Artigo' : 'Analisar com IA'}
              </button>
            </form>
          </div>
        </div>

        <div className="bg-slate-900 text-slate-100 p-6 rounded-2xl shadow-lg border border-slate-800 flex flex-col justify-between min-h-[450px]">
          {status === 'ocioso' && (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-8 text-slate-500">
              {isResearch ? <BookOpen className="w-12 h-12 mb-3 stroke-1" /> : <Brain className="w-12 h-12 mb-3 stroke-1" />}
              <p className="font-medium text-sm">Aguardando inserção de dados</p>
            </div>
          )}
          {status === 'analisando' && (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-8 text-indigo-400">
              <Loader2 className="w-12 h-12 mb-3 animate-spin" />
              <p className="font-semibold text-sm text-slate-300">Processando informações...</p>
            </div>
          )}
          {status === 'concluido' && resultado && (
            <div className="flex-1 flex flex-col h-full justify-between">
              <div>
                <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-4">
                  <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm"><CheckCircle2 className="w-4 h-4" /><span>Resultado da IA</span></div>
                </div>
                <div className="bg-slate-950 p-4 rounded-xl font-mono text-xs leading-relaxed overflow-y-auto max-h-[300px] whitespace-pre-line text-slate-300">{resultado}</div>
              </div>
              {linkSciHub && (
                <a href={linkSciHub} target="_blank" rel="noopener noreferrer" className="mt-4 flex items-center justify-center gap-2 text-xs font-bold text-pink-400 bg-pink-950/40 border border-pink-900/50 py-2.5 px-4 rounded-xl hover:bg-pink-900/30 transition-all">
                  <ExternalLink className="w-4 h-4" /><span>Acessar PDF no Sci-Hub</span>
                </a>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/workspace/:id" element={<WorkspaceContainer />} />
      </Routes>
    </BrowserRouter>
  );
}
