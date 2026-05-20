# Prompts para gerar as imagens do Guia do Paciente HSFA

Este arquivo reúne **prompts prontos** para gerar todas as imagens do site usando o **ChatGPT** (gerador de imagens DALL·E 3).

## Como usar

1. Abra o ChatGPT e cole o **prompt** do slot desejado.
2. Baixe a imagem gerada (clique com o botão direito → salvar).
3. Acesse o painel **`/admin`** do site, encontre o slot correspondente e clique em **Enviar**.
4. A imagem aparece no site na hora.

> As imagens usam `object-fit: cover` no site — o que importa é a **proporção** (retrato / paisagem / quadrada), não o tamanho exato em pixels. Gere no tamanho do ChatGPT mais próximo e está ótimo.

## Tamanhos do ChatGPT (DALL·E 3)

| Proporção | Peça ao ChatGPT | Usar nos slots |
| --------- | --------------- | -------------- |
| Paisagem  | `1792 × 1024`   | recepção, enfermaria, UTI, etc. (1400×900) e hero-bg (1920×1080) |
| Retrato   | `1024 × 1792`   | capa do hero (900×1200) |
| Quadrada  | `1024 × 1024`   | avatares da equipe (800×800) e selo (400×400) |

## Identidade visual (vale para todas as imagens)

Para manter tudo consistente, todas as fotos devem seguir este estilo. Já está embutido em cada prompt, mas se quiser reforçar, acrescente:

> *Fotografia realista e profissional, hospital brasileiro moderno, iluminação natural suave e clara, ambiente limpo e organizado, paleta de cores em branco e verde-azulado (teal, tom #01717B), atmosfera acolhedora e humanizada, alta qualidade, sem texto, sem marcas d'água, sem logotipos.*

---

# 1. Marca — NÃO gerar com IA

Estes dois são **marcas oficiais** e não devem ser gerados por IA (seria uma marca falsa).

### Logo HSFA
- **Arquivo:** `public/img/logo.png`
- **Onde aparece:** cabeçalho do site
- **O que fazer:** use o arquivo oficial da marca do Hospital São Francisco de Assis (o `logo.png` já está aplicado).

### Selo ONA
- **Arquivo:** `public/img/selo-ona.png`
- **Onde aparece:** card de acreditação na capa do hero
- **O que fazer:** use o selo oficial **ONA — Acreditado com Excelência (Nível 3)** fornecido pela própria ONA (o `Selo.png` já está aplicado).

---

# 2. Hero

### Fundo do Hero *(opcional)*
- **Arquivo:** `public/img/hero-bg.jpg` · **Proporção:** paisagem (1920×1080)
- **Onde aparece:** atualmente o fundo do hero é feito por CSS (gradiente). Este slot existe no admin caso queira trocar por uma imagem no futuro.

```
Imagem de fundo abstrata e suave para um site de hospital. Formas
orgânicas e fluidas em tons de verde-azulado (teal) e branco, com
leve textura de gradiente e pontos de luz difusos. Estilo minimalista,
moderno e clean, sem pessoas e sem objetos. Bem clara para permitir
texto por cima. Proporção paisagem 1792×1024, sem texto.
```

### Capa do Hero
- **Arquivo:** `public/img/hero-capa.jpg` · **Proporção:** retrato (900×1200)
- **Onde aparece:** o card 3D em destaque no topo do site

```
Fotografia vertical realista e de alta qualidade para a capa de um
guia do paciente. Uma enfermeira brasileira sorridente e acolhedora,
de uniforme hospitalar moderno em tom verde-azulado (teal), recebendo
com gentileza um paciente em um corredor amplo, claro e bem iluminado
de um hospital moderno. Paredes brancas com detalhes em teal,
iluminação natural suave, ambiente limpo, sensação de cuidado
humanizado, confiança e bem-estar. Composição vertical, foco nítido
nas pessoas e fundo levemente desfocado. Proporção retrato 1024×1792,
sem texto.
```

---

# 3. Acomodações

### Recepção
- **Arquivo:** `public/img/recepcao.jpg` · **Proporção:** paisagem (1400×900)
- **Onde aparece:** aba "Enfermaria" da seção Acomodações

```
Fotografia realista da recepção de um hospital brasileiro moderno.
Balcão de atendimento amplo e limpo, profissionais de uniforme em
tom verde-azulado (teal) atendendo com simpatia, área de espera
confortável com poltronas claras, plantas decorativas, piso polido
e muita luz natural vinda de grandes janelas. Ambiente acolhedor,
organizado e profissional. Paleta branca e teal. Proporção paisagem
1792×1024, sem texto, sem logotipos.
```

### Enfermaria
- **Arquivo:** `public/img/enfermaria.jpg` · **Proporção:** paisagem (1400×900)

```
Fotografia realista de uma enfermaria coletiva em um hospital
brasileiro moderno. Camas hospitalares organizadas e bem espaçadas,
roupa de cama branca impecável, cortinas de privacidade em tom
verde-azulado claro, equipamentos médicos discretos, piso limpo e
iluminação clara e suave. Ambiente arrumado, higiênico e tranquilo.
Sem pacientes no quadro. Paleta branca e teal. Proporção paisagem
1792×1024, sem texto.
```

### Apartamento
- **Arquivo:** `public/img/apartamento.jpg` · **Proporção:** paisagem (1400×900)

```
Fotografia realista de um apartamento hospitalar privativo e
confortável em um hospital brasileiro moderno. Uma cama hospitalar
bem arrumada com roupa de cama branca, uma poltrona reclinável para
o acompanhante, uma TV na parede, mesa de apoio, janela ampla com
luz natural e decoração sóbria em tons de branco e verde-azulado
(teal). Ambiente aconchegante, limpo e silencioso, parecido com um
quarto de hotel. Proporção paisagem 1792×1024, sem texto.
```

### UTI
- **Arquivo:** `public/img/uti.jpg` · **Proporção:** paisagem (1400×900)

```
Fotografia realista de uma Unidade de Terapia Intensiva (UTI) em um
hospital brasileiro moderno. Leito de UTI com equipamentos de
monitoramento avançados, monitores com sinais vitais, ventilador,
iluminação técnica clara, ambiente extremamente limpo e organizado,
tecnologia de ponta. Paredes claras com detalhes em verde-azulado
(teal). Atmosfera de alta complexidade, segurança e profissionalismo.
Sem pacientes no quadro. Proporção paisagem 1792×1024, sem texto.
```

### UTI Humanizada
- **Arquivo:** `public/img/uti-humanizada.jpg` · **Proporção:** paisagem (1400×900)

```
Fotografia realista de uma UTI humanizada em um hospital brasileiro
moderno. Leito individualizado com equipamentos de monitoramento, ao
lado uma poltrona reclinável confortável para o acompanhante e uma
TV. Iluminação suave e acolhedora, luz natural entrando por uma
janela, plantas discretas, cores quentes combinadas com tons de
verde-azulado (teal). Ambiente que une cuidado intensivo com conforto
e bem-estar. Sem pacientes no quadro. Proporção paisagem 1792×1024,
sem texto.
```

### Centro Cirúrgico
- **Arquivo:** `public/img/centro-cirurgico.jpg` · **Proporção:** paisagem (1400×900)

```
Fotografia realista de uma sala de centro cirúrgico em um hospital
brasileiro moderno. Mesa cirúrgica central, foco cirúrgico (luz)
acima, equipamentos e monitores de alta tecnologia, ambiente
extremamente limpo e estéril, paredes claras, iluminação intensa e
uniforme, detalhes em verde-azulado (teal). Atmosfera de precisão,
tecnologia e segurança. Sem pessoas no quadro. Proporção paisagem
1792×1024, sem texto.
```

### Refeitório
- **Arquivo:** `public/img/refeitorio.jpg` · **Proporção:** paisagem (1400×900)

```
Fotografia realista de um refeitório limpo e moderno em um hospital
brasileiro. Mesas e cadeiras organizadas, ambiente claro e arejado,
balcão de servir ao fundo, plantas decorativas, iluminação agradável
e luz natural. Decoração simples em tons de branco e verde-azulado
(teal). Atmosfera acolhedora e higiênica. Sem pessoas no quadro.
Proporção paisagem 1792×1024, sem texto.
```

### Plantão 24h
- **Arquivo:** `public/img/plantao24h.jpg` · **Proporção:** paisagem (1400×900)

```
Fotografia realista da entrada do Pronto Socorro de um hospital
brasileiro moderno, à noite. Fachada iluminada, sinalização de
emergência, cobertura na entrada para ambulâncias, luzes acesas
transmitindo a ideia de atendimento 24 horas. Ambiente bem
iluminado, organizado e acolhedor mesmo à noite. Paleta branca e
verde-azulado (teal). Sensação de prontidão e segurança. Proporção
paisagem 1792×1024, sem texto.
```

---

# 4. Equipe

### Foto institucional da equipe
- **Arquivo:** `public/img/equipe-foto.jpg` · **Proporção:** paisagem (1400×900)
- **Onde aparece:** banner largo no topo da seção "Equipe Multidisciplinar"

```
Fotografia realista de um grupo de profissionais de saúde brasileiros
— médicos, enfermeiros e equipe multidisciplinar — posando juntos,
sorridentes e confiantes, em um corredor claro de um hospital moderno.
Diversidade de gênero e etnia, todos com uniformes hospitalares
profissionais em tons de branco e verde-azulado (teal). Iluminação
natural suave, ambiente limpo e organizado. Atmosfera de equipe unida,
acolhedora e competente. Proporção paisagem 1792×1024, sem texto.
```

> Os 6 itens abaixo são **avatares** — aparecem pequenos e em formato circular nos cards da equipe. Mantenha o rosto centralizado e o enquadramento dos ombros para cima.

### Avatar — Enfermagem
- **Arquivo:** `public/img/equipe-enfermagem.jpg` · **Proporção:** quadrada (800×800)

```
Retrato profissional realista, enquadramento dos ombros para cima,
de uma enfermeira brasileira, sorrindo de forma amigável e confiante,
vestindo um jaleco/uniforme de enfermagem em tom verde-azulado (teal).
Fundo liso em tom teal claro e suave. Iluminação de estúdio uniforme,
rosto centralizado e nítido. Fotorrealista, alta qualidade. Proporção
quadrada 1024×1024, sem texto.
```

### Avatar — Fisioterapia
- **Arquivo:** `public/img/equipe-fisioterapia.jpg` · **Proporção:** quadrada (800×800)

```
Retrato profissional realista, enquadramento dos ombros para cima,
de um fisioterapeuta brasileiro, sorrindo de forma amigável e
confiante, vestindo uniforme hospitalar claro com detalhes em
verde-azulado (teal). Fundo liso em tom teal claro e suave.
Iluminação de estúdio uniforme, rosto centralizado e nítido.
Fotorrealista, alta qualidade. Proporção quadrada 1024×1024,
sem texto.
```

### Avatar — Terapia Ocupacional
- **Arquivo:** `public/img/equipe-to.jpg` · **Proporção:** quadrada (800×800)

```
Retrato profissional realista, enquadramento dos ombros para cima,
de uma terapeuta ocupacional brasileira, sorrindo de forma calorosa e
acolhedora, vestindo uniforme hospitalar claro com detalhes em
verde-azulado (teal). Fundo liso em tom teal claro e suave.
Iluminação de estúdio uniforme, rosto centralizado e nítido.
Fotorrealista, alta qualidade. Proporção quadrada 1024×1024,
sem texto.
```

### Avatar — Odontologia Hospitalar
- **Arquivo:** `public/img/equipe-odonto.jpg` · **Proporção:** quadrada (800×800)

```
Retrato profissional realista, enquadramento dos ombros para cima,
de um dentista brasileiro, sorrindo de forma amigável e confiante,
vestindo jaleco branco de odontologia com detalhes em verde-azulado
(teal). Fundo liso em tom teal claro e suave. Iluminação de estúdio
uniforme, rosto centralizado e nítido. Fotorrealista, alta qualidade.
Proporção quadrada 1024×1024, sem texto.
```

### Avatar — Serviço Social
- **Arquivo:** `public/img/equipe-servicosocial.jpg` · **Proporção:** quadrada (800×800)

```
Retrato profissional realista, enquadramento dos ombros para cima,
de uma assistente social brasileira, sorrindo de forma calorosa e
empática, vestindo roupa profissional sóbria com um crachá. Fundo
liso em tom verde-azulado (teal) claro e suave. Iluminação de
estúdio uniforme, rosto centralizado e nítido. Fotorrealista, alta
qualidade. Proporção quadrada 1024×1024, sem texto.
```

### Avatar — Farmácia Clínica
- **Arquivo:** `public/img/equipe-farmacia.jpg` · **Proporção:** quadrada (800×800)

```
Retrato profissional realista, enquadramento dos ombros para cima,
de um farmacêutico clínico brasileiro, sorrindo de forma amigável e
confiante, vestindo jaleco branco com detalhes em verde-azulado
(teal). Fundo liso em tom teal claro e suave. Iluminação de estúdio
uniforme, rosto centralizado e nítido. Fotorrealista, alta qualidade.
Proporção quadrada 1024×1024, sem texto.
```

---

# Resumo dos slots

| # | Slot | Arquivo | Proporção | Gerar com IA? |
|---|------|---------|-----------|---------------|
| 1 | Logo HSFA | `logo.png` | 240×64 | ❌ marca oficial |
| 2 | Selo ONA | `selo-ona.png` | 400×400 | ❌ marca oficial |
| 3 | Fundo do Hero | `hero-bg.jpg` | 1920×1080 | ⚪ opcional |
| 4 | Capa do Hero | `hero-capa.jpg` | 900×1200 | ✅ |
| 5 | Recepção | `recepcao.jpg` | 1400×900 | ✅ |
| 6 | Enfermaria | `enfermaria.jpg` | 1400×900 | ✅ |
| 7 | Apartamento | `apartamento.jpg` | 1400×900 | ✅ |
| 8 | UTI | `uti.jpg` | 1400×900 | ✅ |
| 9 | UTI Humanizada | `uti-humanizada.jpg` | 1400×900 | ✅ |
| 10 | Centro Cirúrgico | `centro-cirurgico.jpg` | 1400×900 | ✅ |
| 11 | Refeitório | `refeitorio.jpg` | 1400×900 | ✅ |
| 12 | Plantão 24h | `plantao24h.jpg` | 1400×900 | ✅ |
| 13 | Foto da equipe | `equipe-foto.jpg` | 1400×900 | ✅ |
| 14 | Avatar Enfermagem | `equipe-enfermagem.jpg` | 800×800 | ✅ |
| 15 | Avatar Fisioterapia | `equipe-fisioterapia.jpg` | 800×800 | ✅ |
| 16 | Avatar Terapia Ocup. | `equipe-to.jpg` | 800×800 | ✅ |
| 17 | Avatar Odontologia | `equipe-odonto.jpg` | 800×800 | ✅ |
| 18 | Avatar Serviço Social | `equipe-servicosocial.jpg` | 800×800 | ✅ |
| 19 | Avatar Farmácia | `equipe-farmacia.jpg` | 800×800 | ✅ |

---

## Dica importante

Para um hospital, **fotos reais do próprio HSFA** sempre transmitem mais confiança do que imagens geradas por IA. Use os prompts deste arquivo para:

- Preencher slots enquanto não há foto real disponível;
- Criar imagens de apoio/ilustrativas.

Sempre que tiver a foto real do ambiente ou do profissional, prefira-a — e suba pelo painel `/admin`.
