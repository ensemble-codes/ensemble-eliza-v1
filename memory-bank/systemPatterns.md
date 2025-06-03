# System Patterns: Ensemble Eliza v1

## Architecture Overview

### Multi-Agent Coordination Pattern
The system implements a hub-and-spoke model where the Orchestrator agent serves as the central coordinator for all other agents:

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   External      │    │   Orchestrator  │    │     Plugin      │
│   Interfaces    │◄──►│     Agent       │◄──►│   Ecosystem     │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                                │
                                ▼
                       ┌─────────────────┐
                       │   Onii Agent    │
                       │   (Specialist)  │
                       └─────────────────┘
```

### Component Relationships

#### Project Entry Point (`src/index.ts`)
- **Pattern**: Registry Pattern
- **Responsibility**: Agent registration and project configuration
- **Key Principle**: Single source of truth for agent definitions

#### Agent Architecture (`src/agents/`)
- **Pattern**: Agent-per-Directory
- **Structure**: Each agent maintains its own configuration, behaviors, and context
- **Communication**: Through elizaOS message passing and coordination layer

#### Plugin Integration (`src/plugin.ts`)
- **Pattern**: Plugin Aggregation
- **Responsibility**: Custom plugin definitions and third-party integrations
- **Extensibility**: Modular plugin loading and configuration

## Design Patterns in Use

### 1. Agent Factory Pattern
Each agent directory contains its own configuration and instantiation logic:
```typescript
// Pattern: Agent as exportable configuration
export default {
  name: "agentName",
  clients: [...],
  plugins: [...],
  // ... agent configuration
}
```

### 2. Plugin Composition Pattern
Plugins are composed and configured centrally but used distributed across agents:
```typescript
// Pattern: Plugin registry with agent-specific application
const plugins = [
  bootstrapPlugin,
  nodePlugin,
  customPlugin,
  // ... extensible plugin list
]
```

### 3. Knowledge Segregation Pattern
Knowledge and context are organized by domain and agent responsibility:
```
knowledge/
├── shared/           # Cross-agent knowledge
├── orchestrator/     # Orchestrator-specific context
└── onii/            # Onii agent domain knowledge
```

### 4. Testing Strategy Pattern
- **Unit Tests**: Component isolation and behavior verification
- **Integration Tests**: Agent coordination and plugin interaction
- **Coverage-Driven**: Comprehensive test coverage requirements

## Key Technical Decisions

### 1. TypeScript-First Architecture
- **Decision**: Full TypeScript implementation with strict typing
- **Rationale**: Type safety, better IDE support, easier refactoring
- **Impact**: Reduced runtime errors, improved developer experience

### 2. ESM Module System
- **Decision**: Native ES modules over CommonJS
- **Rationale**: Modern JavaScript standards, better tree-shaking
- **Impact**: Future-proof codebase, improved build performance

### 3. elizaOS Plugin Ecosystem Integration
- **Decision**: Leverage existing elizaOS plugins vs. custom implementations
- **Rationale**: Community ecosystem, maintained integrations, faster development
- **Impact**: Rich functionality out-of-the-box, dependency on elizaOS evolution

### 4. Multi-Agent Coordination Strategy
- **Decision**: Orchestrator pattern vs. peer-to-peer agent communication
- **Rationale**: Clearer coordination, easier debugging, centralized control
- **Impact**: Scalable coordination, single point of control/failure

## System Boundaries

### Internal Components
- Agent implementations and configurations
- Custom plugin definitions
- Knowledge base and context management
- Testing and build infrastructure

### External Dependencies
- elizaOS framework and plugin ecosystem
- AI model providers (OpenAI, Anthropic, Local AI)
- Communication protocols (XMTP)
- Database systems (via SQL plugin)

### Extension Points
- New agent addition via agent directory pattern
- Plugin integration through plugin composition
- Knowledge base expansion through knowledge directory structure
- Test coverage extension through vitest framework

## Scalability Patterns

### Horizontal Agent Scaling
- **Pattern**: Agent directory structure supports unlimited agent addition
- **Implementation**: Each new agent gets its own directory and configuration
- **Coordination**: Orchestrator pattern scales through message routing

### Plugin Extensibility
- **Pattern**: Plugin composition allows functionality extension
- **Implementation**: New plugins added to central registry
- **Integration**: elizaOS plugin interface ensures compatibility

### Knowledge Management Scaling
- **Pattern**: Directory-based knowledge segregation
- **Implementation**: Domain-specific knowledge organization
- **Access**: Agents access relevant knowledge through structured paths

## Error Handling and Resilience

### Agent Failure Isolation
- **Pattern**: Agent independence with graceful degradation
- **Implementation**: Each agent handles its own error states
- **Recovery**: Orchestrator manages agent restart and coordination recovery

### Plugin Failure Management
- **Pattern**: Plugin isolation with fallback strategies
- **Implementation**: Plugin-specific error handling
- **Continuity**: Core functionality continues with reduced capabilities

### System Monitoring
- **Pattern**: Comprehensive logging and debugging capabilities
- **Implementation**: elizaOS logging integration
- **Observability**: Clear insight into agent behaviors and system state 