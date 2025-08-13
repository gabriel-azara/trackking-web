export const UNITS: { value: string; label: string; category: string }[] = [
  { value: "times", label: "Vezes", category: "Quantidade" },
  { value: "min", label: "Minutos", category: "Tempo" },
  { value: "hours", label: "Horas", category: "Tempo" },
  { value: "pages", label: "Páginas", category: "Leitura" },
  { value: "km", label: "Quilômetros", category: "Distância" },
  { value: "m", label: "Metros", category: "Distância" },
  { value: "steps", label: "Passos", category: "Atividade" },
  { value: "ml", label: "Mililitros", category: "Volume" },
  { value: "L", label: "Litros", category: "Volume" },
  { value: "kg", label: "Quilogramas", category: "Peso" },
  { value: "g", label: "Gramas", category: "Peso" },
  { value: "%", label: "Porcentagem", category: "Progresso" },
  { value: "pomodoros", label: "Pomodoros", category: "Produtividade" },
  { value: "money", label: "Dinheiro (R$)", category: "Financeiro" },
]

export const COLORS = [
  { name: "Violeta", value: "violet-500", hex: "#8b5cf6" },
  { name: "Azul", value: "blue-500", hex: "#3b82f6" },
  { name: "Verde", value: "green-500", hex: "#10b981" },
  { name: "Amarelo", value: "yellow-500", hex: "#f59e0b" },
  { name: "Vermelho", value: "red-500", hex: "#ef4444" },
  { name: "Rosa", value: "pink-500", hex: "#ec4899" },
  { name: "Índigo", value: "indigo-500", hex: "#6366f1" },
  { name: "Ciano", value: "cyan-500", hex: "#06b6d4" },
  { name: "Laranja", value: "orange-500", hex: "#f97316" },
  { name: "Esmeralda", value: "emerald-500", hex: "#10b981" },
  { name: "Roxo", value: "purple-500", hex: "#a855f7" },
  { name: "Teal", value: "teal-500", hex: "#14b8a6" },
]

export const ICONS = [
  // Hábitos gerais
  { name: "target", label: "Alvo", category: "Geral" },
  { name: "check-circle", label: "Concluído", category: "Geral" },
  { name: "star", label: "Estrela", category: "Geral" },
  { name: "heart", label: "Coração", category: "Saúde" },

  // Saúde e fitness
  { name: "activity", label: "Atividade", category: "Saúde" },
  { name: "dumbbell", label: "Exercício", category: "Saúde" },
  { name: "footprints", label: "Caminhada", category: "Saúde" },
  { name: "droplets", label: "Água", category: "Saúde" },
  { name: "apple", label: "Alimentação", category: "Saúde" },
  { name: "moon", label: "Sono", category: "Saúde" },

  // Produtividade
  { name: "book-open", label: "Leitura", category: "Produtividade" },
  { name: "pen-tool", label: "Escrita", category: "Produtividade" },
  { name: "laptop", label: "Trabalho", category: "Produtividade" },
  { name: "clock", label: "Tempo", category: "Produtividade" },
  { name: "brain", label: "Aprendizado", category: "Produtividade" },

  // Financeiro
  { name: "dollar-sign", label: "Dinheiro", category: "Financeiro" },
  { name: "piggy-bank", label: "Economia", category: "Financeiro" },
  { name: "trending-up", label: "Investimento", category: "Financeiro" },

  // Relacionamentos
  { name: "users", label: "Família", category: "Relacionamentos" },
  { name: "phone", label: "Contato", category: "Relacionamentos" },
  { name: "message-circle", label: "Conversa", category: "Relacionamentos" },

  // Hobbies
  { name: "music", label: "Música", category: "Hobbies" },
  { name: "camera", label: "Fotografia", category: "Hobbies" },
  { name: "palette", label: "Arte", category: "Hobbies" },
  { name: "gamepad-2", label: "Jogos", category: "Hobbies" },
]

export const PRIORITIES = [
  { value: "low", label: "Baixa", color: "green" },
  { value: "medium", label: "Média", color: "yellow" },
  { value: "high", label: "Alta", color: "red" },
]

export const TASK_STATUSES = [
  { value: "todo", label: "A Fazer", color: "gray" },
  { value: "doing", label: "Fazendo", color: "blue" },
  { value: "done", label: "Concluído", color: "green" },
]
