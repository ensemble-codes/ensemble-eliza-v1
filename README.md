# Ensemble Eliza v1

A multi-agent system built on elizaOS, demonstrating sophisticated agent coordination patterns and plugin integration for AI-powered applications.

## Overview

Ensemble Eliza v1 is an elizaOS-based project that implements a multi-agent system with specialized agents working in coordination. It serves as both a practical implementation and a foundation for building sophisticated AI agent ecosystems.

### Key Features

- 🤖 **Multi-Agent Orchestration**: Coordinated system with orchestrator and specialized agents
- 🔌 **Rich Plugin Integration**: Leverages elizaOS plugin ecosystem (OpenAI, Anthropic, SQL, XMTP, and more)
- 📏 **TypeScript-First**: Full type safety and modern development experience
- 🧪 **Comprehensive Testing**: Complete test suite with coverage reporting
- 🏗️ **Production Ready**: Built with deployment and maintainability in mind
- 📚 **Knowledge Management**: Structured approach to agent knowledge and context

## Architecture

### Agent Coordination Pattern
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

### Project Structure
```
src/
├── index.ts           # Project entry point and agent registration
├── plugin.ts          # Custom plugin definitions and integrations
├── tests.ts           # Test implementations
├── agents/            # Agent implementations
│   ├── orchestrator/  # Central coordination agent
│   └── onii/         # Specialized agent
└── knowledge/        # Knowledge base and context files
```

## Quick Start

### Prerequisites

- Node.js 18+ (LTS recommended)
- pnpm package manager
- Git for version control

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd ensemble-eliza-v1
```

2. Install dependencies:
```bash
pnpm install
```

3. Set up environment variables (create `.env` file):
```bash
# Add your API keys and configuration
OPENAI_API_KEY=your_openai_key
ANTHROPIC_API_KEY=your_anthropic_key
# ... other environment variables as needed
```

### Development

Start the development server:
```bash
pnpm dev
```

Run tests:
```bash
pnpm test
```

Build for production:
```bash
pnpm build
```

## Usage

### Starting the Agent System

```bash
# Start all agents
pnpm start

# Development mode with hot reload
pnpm dev
```

### Available Commands

```bash
pnpm start         # Start the elizaOS project
pnpm dev           # Development mode with hot reload
pnpm build         # Production build
pnpm test          # Run tests once
pnpm test:watch    # Run tests in watch mode
pnpm test:coverage # Run tests with coverage report
pnpm lint          # Format code with prettier
pnpm deploy        # Deploy using elizaOS deployment
```

## Agent System

### Orchestrator Agent
The central coordination agent that manages communication and coordination between other agents in the system.

**Responsibilities:**
- Agent coordination and message routing
- System state management
- External interface management
- Plugin coordination

### Onii Agent
A specialized agent with specific domain responsibilities.

**Responsibilities:**
- Domain-specific task execution
- Specialized knowledge processing
- Coordinated response generation

## Plugin Integration

The system leverages the rich elizaOS plugin ecosystem:

- **@elizaos/plugin-openai**: OpenAI API integration
- **@elizaos/plugin-anthropic**: Anthropic API integration
- **@elizaos/plugin-local-ai**: Local AI model support
- **@elizaos/plugin-sql**: Database integration
- **@elizaos/plugin-xmtp**: XMTP messaging protocol
- **@elizaos/plugin-bootstrap**: Core bootstrap functionality
- **@fleek-platform/eliza-plugin-mcp**: Model Context Protocol integration

### Adding New Plugins

1. Install the plugin:
```bash
pnpm add @elizaos/plugin-new-feature
```

2. Add to plugin configuration in `src/plugin.ts`:
```typescript
import { newFeaturePlugin } from "@elizaos/plugin-new-feature";

// Add to plugins array
const plugins = [
  // ... existing plugins
  newFeaturePlugin,
];
```

## Development Guide

### Adding New Agents

1. Create a new directory under `src/agents/`:
```bash
mkdir src/agents/new-agent
```

2. Create the agent configuration in `src/agents/new-agent/index.ts`:
```typescript
import type { Agent } from "@elizaos/core";

const newAgent: Agent = {
  name: "NewAgent",
  // ... agent configuration
};

export default newAgent;
```

3. Register the agent in `src/index.ts`:
```typescript
import newAgent from "./agents/new-agent";

const project: Project = {
  agents: [orchestatorAgent, oniiAgent, newAgent],
};
```

### Knowledge Management

Knowledge is organized in the `src/knowledge/` directory:

```
knowledge/
├── shared/           # Cross-agent knowledge
├── orchestrator/     # Orchestrator-specific context
└── onii/            # Onii agent domain knowledge
```

Add new knowledge files in the appropriate subdirectory and reference them in your agent configurations.

### Testing

The project uses Vitest for comprehensive testing:

```bash
# Run all tests
pnpm test

# Watch mode for development
pnpm test:watch

# Generate coverage report
pnpm test:coverage
```

Write tests in the `__tests__/` directory or co-locate them with your source files using the `.test.ts` suffix.

## Technology Stack

- **Framework**: elizaOS v1.0.0-beta.32+
- **Language**: TypeScript
- **Runtime**: Node.js (ESM modules)
- **Build System**: tsup
- **Testing**: Vitest with coverage
- **Package Manager**: pnpm
- **Code Formatting**: Prettier

## Contributing

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes following the project patterns
4. Add tests for new functionality
5. Run the test suite: `pnpm test`
6. Format your code: `pnpm lint`
7. Commit your changes: `git commit -m 'Add amazing feature'`
8. Push to the branch: `git push origin feature/amazing-feature`
9. Open a Pull Request

### Development Standards

- TypeScript-first development with strict type checking
- Comprehensive test coverage required
- Follow elizaOS architectural patterns
- Maintain Memory Bank documentation for significant changes
- Code must be formatted with Prettier

## Memory Bank

This project uses a Memory Bank system for context preservation and documentation. The Memory Bank includes:

- **Project Brief**: Core requirements and goals
- **Product Context**: Problem statement and vision
- **Technical Context**: Technology stack and setup
- **System Patterns**: Architecture and design decisions
- **Active Context**: Current work focus and decisions
- **Progress**: Status tracking and completion indicators

When making significant changes, update the relevant Memory Bank files in the `memory-bank/` directory.

## License

[Add your license here]

## Support

For questions and support:
- Check the elizaOS documentation
- Review the Memory Bank for project context
- Open an issue for bugs or feature requests

## Acknowledgments

Built with [elizaOS](https://github.com/elizaOS/eliza) - the AI agent framework.
