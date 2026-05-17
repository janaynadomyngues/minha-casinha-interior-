const MONTHS = ["Janeiro","Fevereiro","Março","Abril","Maio","Junho","Julho","Agosto","Setembro","Outubro","Novembro","Dezembro"];
const DAYS = ["Domingo","Segunda-feira","Terça-feira","Quarta-feira","Quinta-feira","Sexta-feira","Sábado"];
const TEMAS = [
  "Identidade em Deus","Propósito","Cura interior","Fé que avança",
  "Graça e recomeço","Força na fraqueza","Presença de Deus",
  "Sonhos e espera","Coragem","Paz que transcende",
  "Amor próprio em Cristo","Renovação da mente","Obediência","Florescer"
];

export function getTema(date) {
  const start = new Date(date.getFullYear(), 0, 1);
  const week = Math.floor((date - start) / (7*24*60*60*1000));
  return TEMAS[week % TEMAS.length];
}

export async function gerarDevocional(date) {
  const dayName = DAYS[date.getDay()];
  const dateStr = `${dayName}, ${date.getDate()} de ${MONTHS[date.getMonth()]} de ${date.getFullYear()}`;
  const tema = getTema(date);

  const prompt = `Você é uma voz devocional feminina, carinhosa e ungida, que escreve para mulheres brasileiras que buscam fé, identidade e propósito.
Seu tom é acolhedor e ativador — como @minhacasinhainterior: carinhoso, nunca pesado, mas que desperta e transforma.
Sempre chame a leitora de "florzinha".
Hoje é ${dateStr}. Tema: "${tema}".
Escreva um devocional em 5 páginas, cada uma com 2 blocos de conteúdo.
Responda APENAS em JSON válido, sem markdown, sem texto fora do JSON:
{
  "palavra": "palavra impactante (1-2 palavras)",
  "tema": "${tema}",
  "referencia": "Livro capítulo:versículo",
  "versiculo": "texto completo do versículo",
  "frase_central": "frase forte de 1-2 linhas — a tese do devocional",
  "reflexao": "reflexão de 3-4 frases acolhedoras que falam direto com ela sobre o que sente",
  "pergunta": "uma pergunta confrontadora e poderosa de 1-2 linhas",
  "verdade": "3-4 frases revelando o que a Palavra diz sobre ela nesse tema",
  "virada": "2-3 frases que mudam a perspectiva — o momento chave do devocional",
  "aplicacao": ["ação prática 1", "ação prática 2", "ação prática 3"],
  "climax": "declaração final poderosa de 1-2 frases",
  "oracao": "oração curta, direta e com autoridade — 2-3 frases"
}`;

  const res = await fetch('/api/devo', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt }),
  });

  if (!res.ok) throw new Error('Erro ao buscar devocional');
  return await res.json();
}
