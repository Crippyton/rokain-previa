# 🚀 Rokain Portais — Guia de Deploy e Uso

## Estrutura de arquivos

```
/var/www/rokain-previa/
└── src/
    └── pages/
        ├── portais/
        │   ├── index.html              ← Portal principal
        │   ├── pages/
        │   │   ├── mytime/
        │   │   │   └── index.html      ← Ferramenta MyTime
        │   │   └── order/
        │   │       └── index.html      ← Ferramenta Order
        │   └── src/
        │       ├── css/
        │       │   └── portais.css     ← Estilos do portal
        │       └── js/
        │           ├── tools.js        ← ✅ REGISTRY (adicione aqui)
        │           └── portais.js      ← Motor do portal
        ├── 404/
        │   └── 404.html
        ├── 403/
        │   └── 403.html
        └── 500/
            └── 500.html

tools-template/
└── index.html                          ← Template para novas ferramentas
```

---

## ✅ Como adicionar uma nova ferramenta

### Passo 1 — Registre no tools.js

Abra `/var/www/rokain-previa/src/pages/portais/src/js/tools.js` e adicione um objeto no array:

```js
{
  id:          "minhaferramenta",       // ID único, sem espaços
  name:        "Minha Ferramenta",      // Nome exibido no card
  slug:        "minhaferramenta",       // URL: /portais/minhaferramenta
  description: "Descrição curta aqui.", // Máximo 100 caracteres
  category:    "Utilitários",           // Aparece no filtro
  icon:        "🔧",                    // Emoji ou SVG inline
  tags:        ["tag1", "tag2"],        // Para busca
  new:         true,                    // Badge "novo" no card
}
```

### Passo 2 — Crie a página da ferramenta

Copie o template:
```bash
cp -r /var/www/rokain-previa/tools-template \
      /var/www/rokain-previa/src/pages/portais/pages/minhaferramenta
```

Edite `/var/www/rokain-previa/src/pages/portais/pages/minhaferramenta/index.html`
substituindo os placeholders e adicionando seu HTML/CSS/JS.

### Passo 3 — Recarregue

Não é necessário reiniciar o nginx. O browser já encontrará a ferramenta via:

```
https://rokain.com.br/portais/minhaferramenta/
```

---

## 🔗 Link externo (ferramenta em outro servidor)

Se a ferramenta estiver em outro domínio, use o campo `url`:

```js
{
  id:   "externo",
  name: "Sistema Externo",
  slug: "externo",      // não precisa criar pasta
  url:  "https://outro.dominio.com.br",
  ...
}
```

---

## 📦 Deploy inicial

```bash
# Copiar arquivos para o servidor
rsync -avz ./src/ root@srv-rokain:/var/www/rokain-previa/src/
rsync -avz ./tools-template/ root@srv-rokain:/var/www/rokain-previa/tools-template/

# Permissões
chown -R www-data:www-data /var/www/rokain-previa/src/pages/portais
chmod -R 755 /var/www/rokain-previa/src/pages/portais

# Testar nginx
nginx -t && systemctl reload nginx
```

---

## 🎨 Personalizar cores

Edite as variáveis CSS em `portais.css`:

```css
:root {
  --accent: #00d4ff;   /* Cor principal (ciano) */
  --green:  #00ff88;   /* Badge "novo" */
  --purple: #7c3aed;   /* Glow de fundo */
}
```

---

## ⌨️ Atalhos do portal

| Tecla     | Ação                            |
|-----------|---------------------------------|
| `/`       | Focar barra de busca            |
| `Esc`     | Limpar busca                    |
| `Enter`   | Abrir primeira ferramenta       |
| `★` no card | Favoritar / desfavoritar     |

Favoritos são salvos no **localStorage** do browser.

---

## 🔧 nginx — configuração necessária

A configuração do nginx já existente (rokain.com.br) cobre o portal. Apenas confirme:

```nginx
# HOME PORTAIS
location = /portais/ {
    rewrite ^ /src/pages/portais/index.html last;
}

# PORTAIS CLEAN URL
location ~ ^/portais/([^/]+)/?$ {
    rewrite ^/portais/([^/]+)/?$ /src/pages/portais/pages/$1/index.html last;
}
```

Nenhuma alteração necessária para adicionar novas ferramentas.

---

Criado por **Rokain** · 2026
