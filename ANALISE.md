# Documentação Técnica - FormBoost

## 1. Análise Inicial do Desafio

### 1.1 Visão Geral do Projeto
O FormBoost é uma plataforma para criação e gerenciamento de formulários inteligentes com campos calculados e validações complexas. O sistema foi desenvolvido com arquitetura full-stack(API e WEB).

### 1.1.0 Sumário Executivo

#### 1.1.1 Principais Decisões Técnicas
- **[Migração Next.js → Vite](#121-migração-do-nextjs-para-vite):** Substituição por questões de cookies e performance
- **[Autenticação HttpOnly](#122-autenticação-via-cookies-httponly):** Implementação atual e limitações identificadas
- **[Engine de Dependências](#41-engine-de-validação-de-dependências):** Validação O(V+E) para campos calculados
- **[Cache Inteligente](#43-cache-inteligente):** Cache Aside Pattern com TTL diferenciado
- **[Tratamento de Erros](#42-tratamento-de-erros-de-validação):** Solução para conflito ZodError vs FastifyError

#### 1.1.2 Arquitetura e Padrões
- **[Padrões Arquiteturais](#131-padrões-arquiteturais):** Repository, Service, Controller layers
- **[Separação de Responsabilidades](#32-separação-de-responsabilidades):** Backend e Frontend
- **[Gestão de Estado](#33-gestão-de-estado):** Stateless backend, React Query frontend

#### 1.1.3 Tecnologias e Justificativas
- **[Backend - Fastify + TypeScript](#21-backend---fastify--typescript):** Performance e type safety
- **[Frontend - React + Vite](#22-frontend---react--vite):** HMR rápido e build otimizado
- **[Banco - PostgreSQL + Prisma](#23-banco-de-dados---postgresql--prisma):** ACID compliance e type safety
- **[Cache - Redis](#24-cache---redis):** Cache distribuído com invalidação inteligente

#### 1.1.4 Entregas e Limitações
- **[Entregas Parciais](#7-considerações-sobre-entregas-parciais):** Funcionalidades implementadas vs não implementadas
- **[Diferenciais Técnicos](#72-diferenciais-técnicos-implementados):** Docker, validação robusta, documentação
- **[Trade-offs](#6-avaliação-de-trade-offs):** Simplicidade vs Complexidade, Performance vs Manutenibilidade

#### 1.1.5 Melhorias e Evolução
- **[Possíveis Melhorias](#5-possíveis-melhorias-e-otimizações):** Segurança, performance, monitoramento
- **[Próximos Passos](#81-próximos-passos):** Roadmap de implementações futuras
- **[Lições Aprendidas](#82-lições-aprendidas):** Insights do desenvolvimento


### 1.2 Principais Decisões Arquiteturais

#### 1.2.1 Migração do Next.js para Vite
**Decisão:** Substituição do Next.js por Vite + React Router
**Justificativa:**
- **Problemas com cookies:** O Next.js apresentava limitações na manipulação de cookies entre server e client actions
- **Interações 100% client-side:** Como todas as interações são do usuário, não havia necessidade das funcionalidades server-side do Next.js
- **Performance:** Vite oferece melhor performance para aplicações SPA
- **Simplicidade:** Redução da complexidade desnecessária

**Riscos Assumidos:**
- Perda de funcionalidades SSR/SSG (não utilizadas)
- A falta de file-based-routing
- Gestão manual de autenticação no client-side

#### 1.2.2 Autenticação via Cookies HttpOnly
**Implementação Atual:**
- Cookies HttpOnly para segurança
- Interceptor no layout para tratamento de 401
- Middleware de autenticação no backend

**Limitações Identificadas:**
- Impossibilidade de acessar cookies no frontend para middleware robusto
- Dependência de interceptors para tratamento de erros

**Melhorias Futuras:**
- Migração para biblioteca de autenticação dedicada
- Implementação de refresh tokens
- Middleware mais robusto no frontend

### 1.3 Estratégias Adotadas

#### 1.3.1 Padrões Arquiteturais
- **Repository Pattern:** Para abstração da camada de dados
- **Service Layer:** Para lógica de negócio
- **Controller Layer:** Para tratamento de requisições HTTP
- **SOLID**:** Parcialmente, não foi implementado a inversão de dependência

#### 1.3.2 Segurança
- Validação de entrada com Zod
- Sanitização de dados
- Autenticação via JWT
- Cookies HttpOnly
- CORS configurado

## 2. Justificativas de Escolhas Técnicas

### 2.1 Backend - Fastify + TypeScript

#### 2.1.1 Fastify como Framework
**Vantagens:**
- Performance superior ao Express, e menos opinado do que o NestJS (Outra possibilidade)
- TypeScript nativo
- Validação integrada com Zod (fastify-type-provider-zod)
- Plugin system robusto
- Menor overhead

#### 2.1.2 Fastify-Type-Provider-Zod
**Benefícios:**
- Type safety end-to-end
- Validação automática de request/response
- Documentação automática de schemas
- Integração perfeita com TypeScript

### 2.2 Frontend - React + Vite

#### 2.2.1 Vite como Build Tool
**Vantagens:**
- HMR extremamente rápido
- Build otimizado
- Suporte nativo a TypeScript
- Plugin ecosystem rico

#### 2.2.2 React Query (TanStack Query)
**Justificativa:**
- Cache inteligente
- Sincronização automática
- Gerenciamento de estado server
- Otimistic updates

**Problemas:**
- No `/forms`, houve uma contorno de solução, pois o back estava jogando a request para o redis, e a request do front estava utilizando o cache automático, então foi necessário sempre invalidar em algumas partes a queryKey? ['forms']


### 2.3 Banco de Dados - PostgreSQL + Prisma

#### 2.3.1 PostgreSQL
**Vantagens:**
- ACID compliance
- Suporte a JSON
- Performance para consultas complexas
- Maturidade e estabilidade

#### 2.3.2 Prisma ORM
**Benefícios:**
- Type safety
- Migrations automáticas
- Query builder intuitivo
- Integração perfeita com TypeScript (O schema do prisma, cria tipagem para as relações entre as entidades)

### 2.4 Cache - Redis

#### 2.4.1 Cache Aside Pattern
**Implementação:**
```typescript
// TTL Inteligente
- Consultas com filtros específicos: 2.5 minutos
- Listagens gerais (ativos): 10 minutos  
- Listagens com inativos: 5 minutos

// Critérios de Invalidação
- form_created: Invalida listagens e incrementa contador
- form_updated: Invalida cache específico do formulário
- form_deleted: Invalida todo o cache de formulários
- Após 10 formulários criados: invalida todo o cache
```

## 3. Raciocínio de Arquitetura

### 3.1 Estrutura de Camadas

```
┌─────────────────┐
│   Controllers   │ ← Tratamento de HTTP
├─────────────────┤
│    Services     │ ← Lógica de Negócio
├─────────────────┤
│  Repositories   │ ← Acesso a Dados
├─────────────────┤
│   Database      │ ← PostgreSQL
└─────────────────┘
```

### 3.2 Separação de Responsabilidades

#### 3.2.1 Backend
- **Controllers:** Validação de entrada, tratamento de resposta
- **Services:** Regras de negócio, validações complexas
- **Repositories:** Abstração do banco de dados
- **Schemas:** Definição de tipos e validações

#### 3.2.2 Frontend
- **Pages:** Componentes de página
- **Components:** Componentes reutilizáveis
- **Hooks:** Lógica reutilizável
- **HTTP:** Requisições para API

### 3.3 Gestão de Estado

#### 3.3.1 Backend
- Estado stateless
- Cache distribuído com Redis
- Sessões via JWT

#### 3.3.2 Frontend
- React Query para cache server state
- Local state para UI state
- Context para tema e autenticação

## 4. Pontos Críticos do Sistema

### 4.1 Engine de Validação de Dependências

#### 4.1.1 Complexidade Algorítmica
**Análise de Complexidade:**
- **Temporal:** O(V + E)
- **Espacial:** O(V)
- **V:** número de vértices (campos)
- **E:** número de arestas (dependências)

**Justificativa O(V + E):**
- Cada vértice é visitado no máximo uma vez
- Cada aresta é percorrida no máximo uma vez

**Observação:**
- Inicialmente a lógica era fazer um Flat em todas as sub-dependencias e ir procurando com .includes()

#### 4.1.2 Implementação
```typescript
static validateDependencies(fields: Array<{ id: string; dependencies?: string[] }>) {
  const graph = new Map<string, string[]>();
  const visited = new Set<string>();
  const recStack = new Set<string>();

  // Construção do grafo: O(V + E)
  fields.forEach((field) => {
    if (field.dependencies) {
      graph.set(field.id, field.dependencies);
    }
  });

  // DFS para detecção de ciclos: O(V + E)
  const hasCycle = (node: string): boolean => {
    if (recStack.has(node)) return true;
    if (visited.has(node)) return false;

    visited.add(node);
    recStack.add(node);

    const neighbors = graph.get(node) || [];
    for (const neighbor of neighbors) {
      if (hasCycle(neighbor)) return true;
    }

    recStack.delete(node);
    return false;
  };

  // Verificação de todos os nós: O(V)
  for (const node of graph.keys()) {
    if (hasCycle(node)) {
      return { isValid: false, error: `Circular dependency detected` };
    }
  }

  return { isValid: true };
}
```

### 4.2 Tratamento de Erros de Validação

#### 4.2.1 Problema Identificado
**Fluxo Problemático:**
1. Cliente envia dados inválidos
2. Zod detecta erro de validação
3. fastify-type-provider-zod intercepta
4. Converte para FastifyError (não ZodError)
5. Error handler recebe FastifyError
6. Condição instanceof ZodError falha
7. Cai no "Internal Server Error"

#### 4.2.2 Solução Implementada
```typescript
export async function errorHandler(error: Error, request: FastifyRequest, reply: FastifyReply) {
  if (error instanceof ZodError) {
    return reply.status(400).send({
      error: 'VALIDATION_ERROR',
      message: 'Validation error',
      issues: error.format(),
    });
  }

  if ((error as any).statusCode === 400 && (error as any).code === 'FST_ERR_VALIDATION') {
    return reply.status(400).send({
      error: 'VALIDATION_ERROR',
      message: 'Validation error',
      issues: (error as any).validation?.map((issue: any) => ({
        field: issue.instancePath,
        message: issue.message,
        code: issue.keyword,
      })) || [],
    });
  }
}
```

**Conclusão:**
- **ZodError:** Para erros lançados manualmente nos services
- **FST_ERR_VALIDATION:** Para erros de validação automática do Fastify

### 4.3 Cache Inteligente

#### 4.3.1 Estratégia de Cache
**Cache Aside Pattern implementado:**
- Verificação de cache antes da consulta ao banco
- Invalidação baseada em eventos
- TTL diferenciado por tipo de consulta
- Contador de formulários criados para invalidação em massa

#### 4.3.2 Configurações de TTL
```typescript
private getTTLForQuery(query: ListFormsQuery): number {
  const ttl = this.config.ttl || this.DEFAULT_TTL;
  
  if (query.name || query.schema_version) {
    return ttl / 2; // 2.5 minutos para consultas específicas
  }

  if (!query.include_inactives) {
    return ttl * 2; // 10 minutos para listagens ativas
  }

  return ttl; // 5 minutos para listagens com inativos
}
```

## 5. Possíveis Melhorias e Otimizações

### 5.1 Segurança

#### 5.1.1 Autenticação
- **Implementar refresh tokens**
- **Rate limiting por endpoint**
- **Audit logs para ações críticas**
- **Validação de entrada mais rigorosa**

#### 5.1.2 Validação
- **Sanitização mais robusta**
- **Validação de tamanho de upload**
- **Proteção contra XSS avançada**

### 5.2 Performance

#### 5.2.1 Backend
- **Implementar connection pooling**
- **Otimizar queries complexas**
- **Implementar paginação eficiente**
- **Cache de queries frequentes**

#### 5.2.2 Frontend
- **Code splitting por rota**
- **Lazy loading de componentes**
- **Otimização de bundle**
- **Service Worker para cache**

### 5.3 Monitoramento

#### 5.3.1 Observabilidade
- **Logs estruturados**
- **Métricas de performance**
- **Alertas automáticos**
- **Tracing distribuído**

### 5.4 Testes

#### 5.4.1 Cobertura
- **Testes de integração**
- **Testes E2E**
- **Testes de performance**
- **Testes de segurança**

## 6. Avaliação de Trade-offs

### 6.1 Simplicidade vs Complexidade

#### 6.1.1 Fator Simplicidade
- **Uso do Prisma:** Simplifica ORM, mas adiciona dependência
- **Cache Aside:** Simples de implementar, mas pode causar inconsistências
- **Cookies HttpOnly:** Seguro, mas limita flexibilidade

#### 6.1.2 Fator Complexidade
- **Cache inteligente:** Complexa, mas melhora performance

### 6.2 Performance vs Manutenibilidade

#### 6.2.1 Performance
- **Cache Redis:** Melhora performance, mas adiciona complexidade
- **Validação em camadas:** Reduz processamento, mas duplica código
- **Queries otimizadas:** Melhora performance, mas pode ser menos legível

#### 6.2.2 Manutenibilidade
- **TypeScript:** Adiciona overhead, mas melhora manutenibilidade
- **Padrões arquiteturais:** Adicionam boilerplate, mas facilitam manutenção
- **Testes:** Consomem tempo, mas reduzem bugs

### 6.3 Recursos

#### 6.3.1 Pontos para Escalabilidade que geram Complexidade
- **Microserviços:** Escalável, mas complexo
- **Banco distribuído:** Escalável, mas custoso
- **Cache distribuído:** Escalável, mas adiciona latência

#### 6.3.2 Recursos
- **Monolito:** Menos recursos, mas menos escalável
- **Banco único:** Menos recursos, mas pode ser gargalo
- **Cache local:** Menos recursos, mas não compartilhado

## 7. Considerações sobre Entregas Parciais

### 7.1 Frontend - Interface Responsiva

#### 7.1.1 Funcionalidades Implementadas
- ✅ Listagem de formulários
- ✅ Paginação Completa + Filtros
- ✅ Visualização de detalhes do formulário
- ✅ Sistema de autenticação
- ✅ Interface responsiva

#### 7.1.2 Funcionalidades Não Implementadas
- ❌ Engine de criação de formulários (comentada)
- ❌ Editor visual de campos
- ❌ Preview em tempo real

#### 7.1.3 Justificativa
**Volume de Interações:** A engine de criação de formulários requer interações complexas do usuário, incluindo:
- Drag and drop de campos
- Configuração de validações
- Definição de dependências
- Preview em tempo real
- Validação de fórmulas

**Risco de Prazo:** Implementação completa seria muito arriscada considerando o prazo disponível.

<div style="position: relative; padding-bottom: 56.25%; height: 0;"><iframe id="js_video_iframe" src="https://jumpshare.com/embed/UXyV5h30EVF031KczmGf" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen style="position: absolute; top: 0; left: 0; width: 100%; height: 100%;"></iframe></div>

### 7.2 Diferenciais Técnicos Implementados

#### 7.2.1 ✅ Docker Containerizado
- **Dockerfile + docker-compose.yml** para ambiente isolado
- **Orquestração completa** da aplicação
- **Containerização** tanto do frontend quanto do backend

#### 7.2.2 ✅ Validação Robusta
- **Validação de schemas** com Zod
- **Validação de dependências** com complexidade O(V+E)

#### 7.2.3 ✅ Cache Inteligente
- **Cache Aside Pattern** na rota de formulários
- **TTL diferenciado** por tipo de consulta
- **Invalidação baseada em eventos**

#### 7.2.4 ✅ RESTful + Documentação
- **API bem estruturada** com versionamento (/v1/forms)
- **Documentação rica** com Zod
- **Schemas documentados** de cada rota
- **Rota /docs** com documentação interativa

#### 7.2.5 ✅ Variáveis de Ambiente
- **Externalização de configs** (.env)
- **Validação de schema** no startup
- **Tipagem forte** para variáveis de ambiente

#### 7.2.6 ✅ Migrations Estruturadas
- **Versionamento de banco** com Prisma
- **Evolução controlada** do schema

#### 7.2.7 ✅ Testes
- **Testes unitários** com Vitest
- **Vitest UI** para visualização de grafos de dependência

## 8. Conclusões e Recomendações

### 8.1 Próximos Passos
1. **Implementar refresh tokens**
2. **Completar engine de criação de formulários**
3. **Adicionar testes E2E**
4. **Implementar monitoramento**
5. **Otimizar performance**

### 8.2 Lições Aprendidas
**Estimativas de prazo**: Inicialmente, não foram estipulados prazos e nem organização. O fato de ter que solucionar um problema, necessitou de um mapeamento de task durante a solução de todo o projeto. Como mencionado no início, um dos pontos que desperdiçaram um fração de tempo, foi diretamente proporcional a questões de organização, em estipular o que fazer, quais impedimentos surgiriam e as melhores escolhas.


