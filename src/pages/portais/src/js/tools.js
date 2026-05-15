/**
 * ═══════════════════════════════════════════════════════
 *  ROKAIN PORTAIS — REGISTRY DE FERRAMENTAS
 *  tools.js
 *
 *  ✅ Para adicionar uma nova ferramenta:
 *     1. Copie um objeto do array abaixo
 *     2. Preencha os campos
 *     3. Coloque os arquivos da ferramenta em:
 *        /src/pages/portais/pages/<slug>/index.html
 *     4. Salve — pronto!
 *
 *  Campos obrigatórios: id, name, slug, description, category, icon, tags
 *  Campos opcionais:    url (se for externo), featured, new
 * ═══════════════════════════════════════════════════════
 */

window.ROKAIN_TOOLS = [

  // ────────────────────────────────────────────
  //  UTILITÁRIOS
  // ────────────────────────────────────────────
  {
    id:          "mytime",
    name:        "MyTime",
    slug:        "mytime",              // URL: /portais/mytime
    description: "Controle de jornada de trabalho com registro de ponto e relatórios.",
    category:    "Middleware",
    icon:        "⏱️",
    tags:        ["jornada", "controle", "tempo", "ponto"],
    featured:    false,
    new:         false,
    // url:      "https://externo.com"  // descomente para link externo
  },
  {
    id:          "order",
    name:        "Order",
    slug:        "order",
    description: "Tools para organização e gerenciamento de arquivos BAT.",
    category:    "Middleware",
    icon:        "📁",
    tags:        ["bat", "arquivos", "organização"],
    featured:    false,
    new:         false,
  },
  {
    id:          "springly",       // ID único, sem espaços
    name:        "Springly",      // Nome exibido no card
    slug:        "springly",       // URL: /portais/minhaferramenta
    description: "Criador de arquivos de configuração para aplicações Java Spring Boot.", // Máximo 100 caracteres
    category:    "Utilitários",           // Aparece no filtro
    icon:        "🔧",                    // Emoji ou SVG inline
    tags:        ["java", "configuração"],        // Para busca
    new:         false,                    // Badge "novo" no card
  },

  // ────────────────────────────────────────────
  //  EXEMPLOS — remova quando quiser
  // ────────────────────────────────────────────
  // {
  //   id:          "conversor",
  //   name:        "Conversor",
  //   slug:        "conversor",
  //   description: "Converta unidades de medida, moedas e formatos.",
  //   category:    "Utilitários",
  //   icon:        "🔄",
  //   tags:        ["converter", "unidades", "moeda"],
  // },

];
