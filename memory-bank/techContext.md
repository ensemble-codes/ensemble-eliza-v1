# Technical Context: Ensemble Eliza v1

## Technology Stack

### Core Framework
- **elizaOS**: v1.0.0-beta.32+ - The foundational AI agent framework
- **TypeScript**: Primary development language with full type safety
- **Node.js**: Runtime environment (ESM modules)

### Build & Development Tools
- **tsup**: Fast TypeScript bundler for production builds
- **pnpm**: Package manager (faster than npm, more reliable than yarn)
- **tsx**: TypeScript execution for development
- **prettier**: Code formatting
- **vitest**: Testing framework with coverage support

### elizaOS Plugins
- **@elizaos/plugin-openai**: OpenAI API integration
- **@elizaos/plugin-anthropic**: Anthropic API integration  
- **@elizaos/plugin-local-ai**: Local AI model support
- **@elizaos/plugin-sql**: Database integration
- **@elizaos/plugin-xmtp**: XMTP messaging protocol
- **@elizaos/plugin-bootstrap**: Core bootstrap functionality
- **@fleek-platform/eliza-plugin-mcp**: Model Context Protocol integration

### Additional Dependencies
- **zod**: Runtime type validation and schema definition
- **rss-parser**: RSS feed parsing capabilities

## Development Setup

### Prerequisites
- Node.js 18+ (LTS recommended)
- pnpm package manager
- Git for version control

### Environment Configuration
- Project uses ESM modules (`"type": "module"` in package.json)
- TypeScript configuration includes both build and development settings
- Vitest configured for comprehensive testing

### Available Scripts
```bash
pnpm start        # Start the elizaOS project
pnpm dev          # Development mode with hot reload
pnpm build        # Production build
pnpm test         # Run tests once
pnpm test:watch   # Run tests in watch mode
pnpm test:coverage # Run tests with coverage report
pnpm lint         # Format code with prettier
pnpm deploy       # Deploy using elizaOS deployment
```

## Architecture Patterns

### Project Structure
```
src/
├── index.ts           # Project entry point and agent registration
├── plugin.ts          # Custom plugin definitions and integrations
├── tests.ts           # Test implementations
├── agents/            # Agent implementations
│   ├── orchestrator/  # Orchestrator agent
│   └── onii/         # Onii agent  
└── knowledge/        # Knowledge base and context files
```

### Agent Pattern
- Each agent lives in its own directory under `src/agents/`
- Agents are registered in the main project configuration
- Follow elizaOS agent architecture patterns

### Plugin Integration
- Custom plugins defined in `plugin.ts`
- Leverage existing elizaOS plugin ecosystem
- Modular approach for extensibility

## Technical Constraints

### elizaOS Framework
- Must follow elizaOS architectural patterns
- Plugin compatibility requirements
- Version compatibility with beta releases

### Development Standards
- TypeScript-first development
- ESM module system
- Comprehensive testing required
- Code formatting with prettier

### Performance Considerations
- Bundle size optimization with tsup
- Efficient agent coordination patterns
- Resource management for multi-agent scenarios

## Deployment & Production

### Build Process
- TypeScript compilation with full type checking
- Bundle optimization for production
- Source map generation for debugging

### Testing Strategy
- Unit tests for individual components
- Integration tests for agent coordination
- Coverage reporting for quality assurance

### Version Management
- Currently in beta (v1.0.0-beta.30)
- Follows semver conventions
- Git integration for version tracking 