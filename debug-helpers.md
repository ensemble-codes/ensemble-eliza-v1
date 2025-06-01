# Debug Guide: Ensemble Eliza v1

## Quick Start Debugging

### 🚀 Primary Debug Method (Recommended)
1. **Press `F5`** or use **Command Palette → Debug: Start Debugging**
2. **Select "🚀 Debug elizaOS App"** for normal debugging
3. **Set breakpoints** in your agent files (`src/agents/orchestrator/index.ts`, `src/agents/onii/index.ts`)
4. **Watch variables** in the Debug Console

### 🔧 Development Mode Debugging  
- Use **"🔧 Debug elizaOS Dev Mode"** for hot-reload debugging
- This provides enhanced logging and automatic restarts

## Debug Configurations Available

### Core Debugging
- **🚀 Debug elizaOS App**: Standard app debugging
- **🔧 Debug elizaOS Dev Mode**: Development with hot-reload
- **🧪 Debug Tests**: Debug your Vitest test suite
- **💾 Attach to Running elizaOS**: Attach to already running process

### Agent-Specific Debugging
- **👥 Debug Agent Orchestrator**: Focus on orchestrator agent logs
- **🎯 Debug Onii Agent**: Focus on onii agent behavior  
- **🔌 Debug Plugin Issues**: Troubleshoot plugin-related problems

### Compound Debugging
- **🔥 Debug All Components**: Run app and tests simultaneously

## Debugging Strategies

### 1. Agent Communication Issues
```typescript
// Add breakpoints in agent files to trace communication
// Example: src/agents/orchestrator/index.ts
console.log('Orchestrator received message:', message);
debugger; // Browser will pause here
```

### 2. Plugin Loading Problems
Use **"🔌 Debug Plugin Issues"** configuration which enables:
- `DEBUG=*plugin*,*elizaos*`
- `PLUGIN_DEBUG=true`

### 3. elizaOS Framework Issues
Check the debug output patterns:
- `*eliza*` - Core elizaOS framework logs
- `*agent*` - Agent-specific logs
- `*orchestrator*` - Orchestrator communication
- `*plugin*` - Plugin loading and execution

### 4. Multi-Agent Coordination
Set breakpoints in:
- `src/index.ts` - Agent registration
- `src/agents/orchestrator/index.ts` - Central coordination
- `src/agents/onii/index.ts` - Specialized agent behavior

## Environment Variables for Debugging

### Default Debug Variables (Set Automatically)
```bash
NODE_ENV=development
DEBUG=*eliza*
LOG_LEVEL=debug
```

### Custom Debug Variables
```bash
# Focus on specific agents
FOCUS_AGENT=orchestrator
FOCUS_AGENT=onii

# Plugin debugging
PLUGIN_DEBUG=true

# elizaOS specific debugging  
ELIZA_DEBUG=true
```

## Manual Debugging Commands

### Terminal Debugging
```bash
# Debug with full elizaOS logs
DEBUG=*eliza* pnpm dev

# Debug specific agents
DEBUG=*orchestrator*,*onii* pnpm start

# Debug plugins
DEBUG=*plugin* pnpm start

# Debug with Node.js inspector
node --inspect-brk node_modules/@elizaos/cli/dist/index.js start
```

### Attach to Process Debugging
1. Start your app with inspector:
   ```bash
   node --inspect=9229 node_modules/@elizaos/cli/dist/index.js start
   ```
2. Use **"💾 Attach to Running elizaOS"** configuration

## Debugging Specific Scenarios

### Agent Registration Issues
**Breakpoint locations:**
- `src/index.ts:6` - Project configuration
- Agent `index.ts` files - Individual agent exports

**Common issues:**
- Missing agent exports
- Configuration object structure
- elizaOS compatibility

### Plugin Loading Failures
**Environment:** Use **"🔌 Debug Plugin Issues"**
**Check files:**
- `src/plugin.ts` - Custom plugin definitions
- `package.json` - Plugin dependencies (note the pnpm overrides)

**Common issues:**
- Version mismatches (beta.32 vs beta.33)
- XMTP plugin override in pnpm
- Plugin initialization order

### Message Passing Between Agents
**Debug approach:**
1. Set breakpoints in both agents
2. Use **"🔥 Debug All Components"** 
3. Watch message flow in Debug Console

**Key files:**
- Agent communication handlers
- elizaOS core message system

### Test Failures
**Configuration:** **"🧪 Debug Tests"**
**File:** `src/tests.ts`
**Strategy:**
- Set breakpoints in test cases
- Use `console.log` for test data inspection
- Check test environment setup

## Advanced Debugging

### Source Maps
- Enabled automatically in all configurations
- TypeScript debugging works seamlessly
- Set breakpoints directly in `.ts` files

### Console Debugging
All configurations output to **Integrated Terminal** for better log visibility

### Performance Debugging
```typescript
// Add performance markers in your agents
console.time('agent-processing');
// ... agent logic
console.timeEnd('agent-processing');
```

### Memory Debugging
```bash
# Run with memory debugging
node --inspect --max-old-space-size=4096 node_modules/@elizaos/cli/dist/index.js start
```

## Troubleshooting

### Debug Configuration Not Working?
1. **Check VSCode Extensions**: Ensure "Node.js debug" extension is installed
2. **Verify Project Type**: Confirm `package.json` has `"type": "module"`
3. **Check File Paths**: Ensure all paths in launch.json are correct

### Breakpoints Not Hitting?
1. **Source Maps**: Verify `tsconfig.json` includes `"sourceMap": true`
2. **Build Process**: Run `pnpm build` to ensure source maps are current
3. **File Locations**: Ensure breakpoints are in actual execution paths

### elizaOS Specific Issues?
1. **Check elizaOS Version**: Ensure compatibility with v1.0.0-beta.32+
2. **Plugin Conflicts**: Review pnpm overrides in package.json
3. **Agent Structure**: Verify agent exports match elizaOS patterns

### Environment Issues?
1. **Node Version**: Ensure Node.js 18+ is installed
2. **pnpm**: Use pnpm instead of npm/yarn (check pnpm overrides)
3. **Environment Variables**: Check if custom env vars conflict

## Debug Output Examples

### Successful Agent Start
```
[eliza] Loading agents...
[orchestrator] Agent initialized
[onii] Agent initialized
[eliza] All agents ready
```

### Plugin Loading Success
```
[plugin] Loading @elizaos/plugin-openai
[plugin] Loading @elizaos/plugin-anthropic
[plugin] All plugins loaded successfully
```

### Agent Communication
```
[orchestrator] Received message from onii
[orchestrator] Processing coordination request
[onii] Response received from orchestrator
```

Happy debugging! 🐛✨ 