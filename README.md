# Portais — Central de Aplicações (HTML + CSS + JS)

Este pacote cria um **dashboard moderno** para organizar várias aplicações locais (em `./pages/*`).

## ✅ Estrutura

```
portais/
  index.html
  src/
    css/
      main.css
      pages.css
    js/
      utils.js
      storage.js
      main.js
    img/
      logo.svg
    vendor/
      fontawesome/
        (coloque aqui o Font Awesome offline, se quiser)
  pages/
    financeiro/
      index.html
    rh/
      index.html
    crm/
      index.html
```

## ▶️ Como usar

1. Abra `portais/index.html` no navegador.
2. Edite a lista de apps no próprio `index.html` dentro do bloco `<script type="application/json" id="appsData">`.

## ⭐ Favoritos / Tema
- Favoritos e tema ficam salvos no `localStorage` (no seu navegador).

## 🧩 Como adicionar uma nova aplicação

1. Crie a pasta da app:

```
pages/minhaapp/index.html
```

2. Adicione um item no JSON em `index.html`:

```json
{
  "id": "minhaapp",
  "name": "Minha App",
  "description": "Descrição da aplicação.",
  "category": "TI",
  "tags": ["tag1", "tag2"],
  "faIcon": "fa-solid fa-laptop-code",
  "url": "./pages/minhaapp/index.html"
}
```

## 🎨 Font Awesome: CDN x OFFLINE

### Opção A) CDN (padrão)
Já está habilitado no `index.html` via:

```html
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css" />
```

> Precisa de internet.

### Opção B) OFFLINE (100% local)
1. Baixe o Font Awesome Free e copie a pasta `css/` e `webfonts/` para:

```
src/vendor/fontawesome/
  css/
  webfonts/
```

2. No `index.html`, comente o CDN e descomente o link OFFLINE:

```html
<!-- <link rel="stylesheet" href="https://.../all.min.css" /> -->
<link rel="stylesheet" href="./src/vendor/fontawesome/css/all.min.css" />
```

Pronto — sem depender de internet.

## ✅ Set padrão de ícones (sugestões)

Você pode usar **por app** (`faIcon`) ou deixar vazio que o portal aplica um **padrão por categoria**.

### Por categoria (padrão no JS)
- Gestão: `fa-solid fa-briefcase`
- Pessoas (RH): `fa-solid fa-people-group`
- Comercial/CRM: `fa-solid fa-chart-line`
- Operações: `fa-solid fa-gears`
- TI: `fa-solid fa-laptop-code`
- Projetos: `fa-solid fa-diagram-project`
- Qualidade: `fa-solid fa-shield-check`
- Logística: `fa-solid fa-truck-fast`
- Jurídico: `fa-solid fa-scale-balanced`
- Financeiro: `fa-solid fa-sack-dollar`
- Administração: `fa-solid fa-building`
- Relatórios: `fa-solid fa-file-lines`
- Suporte: `fa-solid fa-headset`

### Ícones por tipo de app
- Dashboards: `fa-solid fa-gauge`
- Cadastros: `fa-solid fa-id-card`
- Documentos: `fa-solid fa-folder-tree`
- Automação: `fa-solid fa-bolt`
- Monitoramento: `fa-solid fa-eye`
- Integrações: `fa-solid fa-plug-circle-bolt`

---

Se você quiser, eu posso também:
- criar um `apps.json` separado (e instruir Live Server),
- adicionar “cards por seção” (categoria com header),
- adicionar “status” (beta/produção/legado) e cores.
