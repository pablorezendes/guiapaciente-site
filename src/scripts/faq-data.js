/* =========================================================
   GUIA DO PACIENTE — HSFA 2024
   Base de conhecimento — FAQ / Chatbot
   ========================================================= */

const FAQ_DATA = {
  'pt': [
    {
      category: 'Internação',
      icon: '🏥',
      questions: [
        {
          q: 'Quais documentos preciso para internação?',
          a: 'Você precisa apresentar RG, CNH e CPF originais. Em caso de menor de idade, é necessário Certidão de Nascimento + documento dos responsáveis. Se possuir plano de saúde, leve a carteirinha original e a autorização de internação.',
          keywords: ['documento','documentos','rg','cnh','cpf','identidade','menor','crianca','criança']
        },
        {
          q: 'O hospital aceita meu plano de saúde?',
          a: 'O HSFA atende diversos convênios, incluindo IPASGO, UNIMED, SELECT, SulAmérica, Amil, Iamesc, Bradesco entre outros. Recomendamos confirmar antecipadamente com seu convênio sobre a abrangência e limitações do seu plano antes da internação.',
          keywords: ['convenio','convênio','plano','saude','saúde','ipasgo','unimed','particular']
        },
        {
          q: 'Quem pode ser meu responsável financeiro?',
          a: 'O responsável financeiro deve ser um responsável legal que assume decisões e despesas médico-hospitalares oriundas do atendimento. Ele também precisa apresentar documentos originais e assinar o contrato de prestação de serviço.',
          keywords: ['responsavel','responsável','financeiro','contrato','legal']
        }
      ]
    },
    {
      category: 'Acomodações',
      icon: '🛏️',
      questions: [
        {
          q: 'Posso ter acompanhante durante a internação?',
          a: 'Sim, mas as regras variam: no apartamento é permitido 1 acompanhante 24h. Na enfermaria, apenas em casos específicos (idosos, crianças, pós-operatórios, necessidades especiais). Na UTI Humanizada, 1 acompanhante 24h mediante taxa. Na UTI tradicional, visitas de 2 pessoas a partir das 11h por 30 minutos.',
          keywords: ['acompanhante','companhia','familiar','24h','apartamento','enfermaria','uti']
        },
        {
          q: 'Quais os horários de visita?',
          a: 'Apartamento: 08h às 18h, 2 visitantes por vez. Enfermaria: 1 visitante por período (manhã 10h–10h30 ou tarde 15h–15h30). UTI: 2 visitantes a partir das 11h, por 30 minutos. Visita religiosa: 15h, duração máxima de 15 minutos.',
          keywords: ['visita','visitante','horario','horário','manha','manhã','tarde','religiosa']
        },
        {
          q: 'O que não posso levar para o quarto?',
          a: 'Não é permitida a entrada de: travesseiros, flores, ventilador, secador de cabelo, aparelhos eletrônicos pessoais (em UTI), comidas ou bebidas externas, ou qualquer fonte de transmissão de microorganismos. O hospital também não oferece enxoval para acompanhantes.',
          keywords: ['levar','proibido','travesseiro','flores','comida','eletrônico','eletronico']
        },
        {
          q: 'Como funciona a UTI Humanizada?',
          a: 'A UTI Humanizada é um leito individualizado com TV e poltrona reclinável, permitindo a permanência de 1 acompanhante durante 24h. Essa comodidade está disponível mediante pagamento de taxa. Informe-se na tesouraria.',
          keywords: ['uti','humanizada','poltrona','taxa','24h']
        }
      ]
    },
    {
      category: 'Cirurgia',
      icon: '⚕️',
      questions: [
        {
          q: 'Preciso parar de fumar antes da cirurgia?',
          a: 'Sim, recomendamos parar de fumar por pelo menos 4 semanas antes da cirurgia, pois reduz o risco de problemas respiratórios durante e após o procedimento. Converse com seu médico para introdução de tratamento profilático se necessário (goma ou patch de nicotina).',
          keywords: ['fumar','cigarro','tabaco','nicotina','fumante']
        },
        {
          q: 'Posso beber álcool antes da cirurgia?',
          a: 'O uso regular de bebidas alcoólicas pode comprometer o resultado da cirurgia e aumentar riscos de sangramento, infecções e problemas cardíacos. Tente parar quando a cirurgia for planejada e seja honesto com seu médico sobre seu consumo.',
          keywords: ['alcool','álcool','bebida','alcoolica','alcoólica']
        },
        {
          q: 'O que devo levar ao hospital?',
          a: 'Leve: pijama e roupa confortável, calçado fechado tipo tênis ou meia antiderrapante, documento original com foto, carteirinha do convênio, lista de medicações de uso contínuo, exames pré-operatórios (se não realizados no hospital). Evite trazer joias, relógios e objetos de valor.',
          keywords: ['levar','trazer','pijama','calcado','calçado','enxoval']
        },
        {
          q: 'Posso usar maquiagem ou esmalte no dia da cirurgia?',
          a: 'Não. No dia da cirurgia, não use loção hidratante, perfume, maquiagem e evite esmaltes de cores escuras. Cabelos devem estar limpos e secos. Também é necessário remover cílios, unhas e apliques postiços.',
          keywords: ['maquiagem','esmalte','perfume','hidratante','postico','postiço','unha','cilio','cílio']
        }
      ]
    },
    {
      category: 'Equipe',
      icon: '👨‍⚕️',
      questions: [
        {
          q: 'Como aciono a enfermagem?',
          a: 'Use a campainha à beira-leito para acionamento imediato. Os técnicos de enfermagem são os primeiros a atender. Caso precise da Gerente de Enfermagem, ligue para o ramal 8050. Em casos extremos, o Médico Assistente e Administrador também podem ser acionados.',
          keywords: ['enfermagem','enfermeiro','ramal','campainha','tecnico','técnico']
        },
        {
          q: 'A fisioterapia é cobrada à parte?',
          a: 'Os atendimentos cobertos pelos convênios são: 3x ao dia em UTI e 1x ao dia na Unidade de Internação. Atendimentos adicionais (segundo ou terceiro na enfermaria) são particulares e devem ser pagos previamente na tesouraria. Não é permitido fisioterapeuta externo.',
          keywords: ['fisioterapia','fisio','atendimento','particular']
        },
        {
          q: 'O hospital tem odontólogo?',
          a: 'Sim, o HSFA conta com odontologia hospitalar de segunda a sábado. Em UTI, o cirurgião-dentista faz o primeiro atendimento para avaliar alterações bucais. O serviço é particular — os planos de saúde não cobrem, mas o hospital emite relatório para o paciente solicitar reembolso.',
          keywords: ['odonto','dentista','dente','boca','odontologia']
        }
      ]
    },
    {
      category: 'Pagamento',
      icon: '💳',
      questions: [
        {
          q: 'Como pago a conta hospitalar?',
          a: 'O pagamento pode ser feito no caixa no térreo: segunda a sexta das 07h às 17h, sábado das 08h às 12h. Em outros horários, na recepção do Pronto Socorro. Pagamentos parciais são solicitados a cada 3 dias, e o saldo é quitado no momento da alta.',
          keywords: ['pagamento','pagar','conta','caixa','tesouraria','horario','horário']
        },
        {
          q: 'O hospital faz ligações cobrando?',
          a: 'NÃO. O Hospital São Francisco de Assis nunca faz ligações solicitando dinheiro ou pagamentos. Todo acerto é feito pessoalmente na tesouraria ou no caixa. Se receber uma ligação suspeita, entre em contato com a tesouraria pelo (62) 3221-8049.',
          keywords: ['fraude','golpe','ligacao','ligação','telefone','cobranca','cobrança']
        },
        {
          q: 'Quais despesas não são cobertas pelo convênio?',
          a: 'As despesas não cobertas pelo plano de saúde são cobradas diretamente do paciente ou do responsável financeiro. Isso pode incluir acomodações superiores, atendimentos extras de fisioterapia, odontologia, refeições de acompanhantes, entre outros. Consulte previamente seu convênio.',
          keywords: ['cobertura','despesa','particular','convenio','convênio']
        }
      ]
    },
    {
      category: 'Alta',
      icon: '🚪',
      questions: [
        {
          q: 'Que horas é a alta hospitalar?',
          a: 'A alta hospitalar geralmente ocorre até as 12h. Após a alta médica, você tem até 1 hora para organizar sua saída do quarto. Permanência após esse horário implica em cobrança de uma nova diária como particular. Em caso de dúvida, acione a hotelaria pelo ramal 8035.',
          keywords: ['alta','sair','saida','saída','horario','horário','diaria','diária']
        },
        {
          q: 'Como retiro meus exames?',
          a: 'Os exames realizados podem ser requisitados na recepção de exames. Caso os resultados ainda não estejam disponíveis no momento da alta, podem ser retirados posteriormente.',
          keywords: ['exame','resultado','retirar','recepcao','recepção']
        },
        {
          q: 'Esqueci algo no hospital, e agora?',
          a: 'Objetos esquecidos após a alta são encaminhados à equipe de hotelaria, que os guarda por 30 dias. Após esse prazo, são descartados ou doados. Entre em contato com a hotelaria pelo ramal 8035 para verificar.',
          keywords: ['esqueci','perdi','achados','perdidos','hotelaria','objeto']
        }
      ]
    },
    {
      category: 'Alimentação',
      icon: '🍽️',
      questions: [
        {
          q: 'Quais os horários e preços das refeições?',
          a: 'Café da manhã (07h–08h): R$ 7. Almoço (11h–12h30): R$ 15. Lanche da tarde (15h–15h30): R$ 7. Jantar (17h–18h): R$ 10. Ceia (21h–22h): R$ 7. Os preços referem-se a refeições para acompanhantes — as do paciente seguem prescrição médica.',
          keywords: ['refeicao','refeição','comida','almoco','almoço','jantar','cafe','café','preco','preço']
        },
        {
          q: 'Posso trazer comida de fora?',
          a: 'Por medida de segurança, não é permitida a entrada de alimentos no hospital. Exceções devem ser tratadas exclusivamente com a nutricionista. Refeições trazidas para acompanhantes devem ser consumidas no refeitório do subsolo. Não é permitida a entrada de entregadores.',
          keywords: ['comida','externa','trazer','delivery','entregador','refeitorio','refeitório']
        },
        {
          q: 'Tenho restrição alimentar, o que faço?',
          a: 'Comunique a enfermagem para que o setor de nutrição seja acionado. A equipe de nutricionistas elaborará uma dieta balanceada conforme sua prescrição médica e restrições.',
          keywords: ['restricao','restrição','dieta','alergia','intolerancia','intolerância','diabetico','diabético']
        }
      ]
    }
  ],

  'en': [
    {
      category: 'Admission',
      icon: '🏥',
      questions: [
        {
          q: 'What documents do I need for admission?',
          a: 'You need to present original ID, driver license, and tax ID. For minors, a birth certificate plus guardians\' documents is required. If you have health insurance, bring the original card and admission authorization.',
          keywords: ['document','documents','id','passport','minor','child']
        },
        {
          q: 'Does the hospital accept my health insurance?',
          a: 'HSFA accepts several insurance plans including IPASGO, UNIMED, SELECT, SulAmérica, Amil, Iamesc, Bradesco and others. We recommend confirming coverage and limitations with your insurance company before admission.',
          keywords: ['insurance','health','coverage','plan']
        }
      ]
    },
    {
      category: 'Accommodations',
      icon: '🛏️',
      questions: [
        {
          q: 'Can I have a companion during hospitalization?',
          a: 'Yes, but rules vary: in private rooms, 1 companion is allowed 24h. In wards, only in specific cases (elderly, children, post-op, special needs). In the Humanized ICU, 1 companion 24h with a fee. In the regular ICU, 2 visitors from 11am for 30 minutes.',
          keywords: ['companion','family','24h','room','ward','icu']
        },
        {
          q: 'What are the visiting hours?',
          a: 'Private room: 8am to 6pm, 2 visitors at a time. Ward: 1 visitor per period (morning 10:00–10:30am or afternoon 3:00–3:30pm). ICU: 2 visitors from 11am for 30 minutes. Religious visits: 3pm, maximum 15 minutes.',
          keywords: ['visit','visitor','hours','time','morning','afternoon']
        }
      ]
    },
    {
      category: 'Surgery',
      icon: '⚕️',
      questions: [
        {
          q: 'Should I stop smoking before surgery?',
          a: 'Yes, we recommend stopping smoking for at least 4 weeks before surgery, as it reduces respiratory risks during and after the procedure. Talk to your doctor about prophylactic treatment if needed (nicotine gum or patch).',
          keywords: ['smoke','smoking','tobacco','nicotine']
        },
        {
          q: 'What should I bring to the hospital?',
          a: 'Bring: pajamas and comfortable clothes, closed shoes (sneakers) or non-slip socks, photo ID, insurance card, list of regular medications, pre-op exams (if not done at the hospital). Avoid bringing jewelry, watches and valuables.',
          keywords: ['bring','clothes','pajamas','shoes']
        }
      ]
    },
    {
      category: 'Payment',
      icon: '💳',
      questions: [
        {
          q: 'How do I pay the hospital bill?',
          a: 'Payment can be made at the cashier on the ground floor: Mon–Fri 7am to 5pm, Saturday 8am to noon. Other times, at the ER reception. Partial payments are requested every 3 days, and the balance is settled at discharge.',
          keywords: ['payment','pay','bill','cashier']
        },
        {
          q: 'Does the hospital call asking for money?',
          a: 'NO. Hospital São Francisco de Assis never calls asking for money or payments. All transactions are made in person at the treasury or cashier. If you receive a suspicious call, contact treasury at +55 (62) 3221-8049.',
          keywords: ['fraud','scam','call','phone']
        }
      ]
    },
    {
      category: 'Discharge',
      icon: '🚪',
      questions: [
        {
          q: 'When does discharge happen?',
          a: 'Discharge usually happens by noon. After medical discharge, you have up to 1 hour to organize your departure. Staying after that implies a new daily charge as a private patient. For questions, dial hospitality at extension 8035.',
          keywords: ['discharge','leave','time','noon']
        }
      ]
    }
  ],

  'es': [
    {
      category: 'Internación',
      icon: '🏥',
      questions: [
        {
          q: '¿Qué documentos necesito para la internación?',
          a: 'Debe presentar documentos de identidad originales. En caso de menor de edad, partida de nacimiento + documento de los responsables. Si tiene seguro médico, lleve la tarjeta original y la autorización de internación.',
          keywords: ['documento','documentos','identidad','menor','niño','nino']
        },
        {
          q: '¿El hospital acepta mi seguro médico?',
          a: 'El HSFA atiende diversos seguros, incluyendo IPASGO, UNIMED, SELECT, SulAmérica, Amil, Iamesc, Bradesco entre otros. Recomendamos confirmar previamente con su seguro sobre cobertura y limitaciones antes de la internación.',
          keywords: ['seguro','plan','cobertura']
        }
      ]
    },
    {
      category: 'Alojamientos',
      icon: '🛏️',
      questions: [
        {
          q: '¿Puedo tener acompañante durante la internación?',
          a: 'Sí, pero las reglas varían: en habitación privada se permite 1 acompañante 24h. En sala común, solo en casos específicos (mayores, niños, postoperatorios, necesidades especiales). En UCI Humanizada, 1 acompañante 24h con tasa. En UCI tradicional, 2 visitantes desde las 11h por 30 minutos.',
          keywords: ['acompañante','acompanante','familia','24h']
        },
        {
          q: '¿Cuáles son los horarios de visita?',
          a: 'Habitación: 08h a 18h, 2 visitantes por vez. Sala común: 1 visitante por período (mañana 10h–10h30 o tarde 15h–15h30). UCI: 2 visitantes desde las 11h, por 30 minutos. Visita religiosa: 15h, duración máxima de 15 minutos.',
          keywords: ['visita','visitante','horario','mañana','tarde']
        }
      ]
    },
    {
      category: 'Cirugía',
      icon: '⚕️',
      questions: [
        {
          q: '¿Debo dejar de fumar antes de la cirugía?',
          a: 'Sí, recomendamos dejar de fumar por al menos 4 semanas antes de la cirugía, pues reduce el riesgo de problemas respiratorios durante y después del procedimiento. Hable con su médico sobre tratamiento profiláctico si es necesario.',
          keywords: ['fumar','tabaco','nicotina']
        },
        {
          q: '¿Qué debo llevar al hospital?',
          a: 'Lleve: pijama y ropa cómoda, calzado cerrado tipo zapatillas o calcetines antideslizantes, documento original con foto, tarjeta del seguro, lista de medicamentos de uso continuo, exámenes preoperatorios. Evite traer joyas, relojes y objetos de valor.',
          keywords: ['llevar','ropa','pijama','calzado']
        }
      ]
    },
    {
      category: 'Pago',
      icon: '💳',
      questions: [
        {
          q: '¿Cómo pago la cuenta hospitalaria?',
          a: 'El pago se hace en la caja en planta baja: lunes a viernes de 07h a 17h, sábado de 08h a 12h. En otros horarios, en la recepción de Urgencias. Pagos parciales son solicitados cada 3 días, y el saldo se paga al momento del alta.',
          keywords: ['pago','pagar','cuenta','caja']
        },
        {
          q: '¿El hospital llama pidiendo dinero?',
          a: 'NO. El Hospital São Francisco de Assis nunca llama pidiendo dinero o pagos. Todo trámite se hace personalmente en tesorería o caja. Si recibe una llamada sospechosa, contacte con la tesorería al +55 (62) 3221-8049.',
          keywords: ['fraude','estafa','llamada','teléfono','telefono']
        }
      ]
    }
  ]
};

window.FAQ_DATA = FAQ_DATA;
