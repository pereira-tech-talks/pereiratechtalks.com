---
description: Document a Lambda function or engine module following the documentation guide
---

# Documentation Generator

You are a documentation generator that creates comprehensive documentation following the project's documentation standards defined in `docs/DOCUMENTATION_GUIDE.md`.

## Your Task

Generate documentation for a Lambda function or engine module following the established patterns.

## Parameters

- `/doc {path}` - Document a module (e.g., `/doc src/functions/botFlow/engine/botEngine`)
- `/doc function {name}` - Document a Lambda function (e.g., `/doc function botFlow`)
- `/doc check {path}` - Check documentation completeness

## Workflow

### Step 1: Analyze the Target

1. Read the target module to understand its structure
2. Identify: classes, methods, factory patterns, platform implementations
3. Check existing documentation
4. Determine documentation needs

### Step 2: Determine What to Create

**For Lambda Functions:**
```
src/functions/{functionName}/
├── README.md                    # REQUIRED - Function overview
└── docs/                        # For complex functions
    └── README.md
```

**For Engine Modules:**
```
src/functions/botFlow/engine/{moduleName}/
├── README.md                    # REQUIRED - Module overview
```

### Step 3: Generate Documentation

**For Function README.md:**
- Function overview and purpose
- Architecture diagram
- Files and structure
- Handler pattern
- Configuration
- Related documentation

**For Engine Module README.md:**
- Module overview
- Architecture (base class → factory → implementations)
- File structure table
- Factory pattern usage
- Platform implementations (Slack, Teams, Discord, etc.)
- Key methods with signatures
- Usage examples
- Related documentation

### Step 4: Report

Show what was created:

```
📚 Documentation Generated: {module_name}

Created files:
✅ README.md

Documentation follows: docs/DOCUMENTATION_GUIDE.md
```

## Documentation Standards

From `docs/DOCUMENTATION_GUIDE.md`:

1. **All documentation MUST be in English**
2. **All code examples MUST have TypeScript types**
3. **Follow project import order:**
   - Node.js native
   - Third-party packages
   - Internal modules
   - Type imports
4. **Use tables for structured data**
5. **Use ASCII diagrams for architecture**
6. **Include runnable examples**

## README.md Template for Engine Modules

```markdown
# {Module Name}

Brief description of the module's purpose.

## Overview

What this module does in the bot flow and why it exists.

## Architecture

```
┌─────────────────────┐
│   Base{Module}      │
│   (Abstract)        │
└──────────┬──────────┘
           │
    ┌──────┴──────┐
    │   Factory   │
    └──────┬──────┘
           │
  ┌────────┼────────┐
  ↓        ↓        ↓
┌─────┐ ┌─────┐ ┌─────┐
│Slack│ │Teams│ │Discord│
└─────┘ └─────┘ └─────┘
```

## Files

| File | Description |
|------|-------------|
| `base{Module}.ts` | Base abstract class |
| `factory.ts` | Factory function |
| `type.d.ts` | Type definitions |
| `factories/` | Platform implementations |

## Factory Pattern

```typescript
import { get{Module} } from './factory'
import { ChatPlatformEType } from 'src/common/type.d/enum'

const module = get{Module}(ChatPlatformEType.SLACK, context)
```

## Platform Implementations

### Slack
Platform-specific details.

### Microsoft Teams
Platform-specific details.

### Discord
Platform-specific details.

## Key Methods

### methodName

```typescript
async methodName(param: ParamType): Promise<ReturnType>
```

**Description:** What the method does.

**Example:**
```typescript
const result = await module.methodName(value)
```

## Usage Example

Complete example of using this module.

## Related Documentation

- [../README.md](../README.md) - Engine overview
- [docs/ARCHITECTURE.md](../../../../docs/ARCHITECTURE.md) - System architecture
```

## Quality Checklist

Before finalizing, verify:

- [ ] README.md has overview and architecture
- [ ] Factory pattern documented
- [ ] Platform implementations listed
- [ ] Key methods documented with types
- [ ] Usage examples included
- [ ] All code examples have types
- [ ] All content is in English
- [ ] Related docs linked

## Example Usage

```
User: /doc src/functions/botFlow/engine/chatInterface
Assistant: [Analyzes module, generates README.md with architecture, 
          factory pattern, platform implementations, methods]

User: /doc function botEventsListener
Assistant: [Analyzes function, generates README.md with overview,
          handler pattern, configuration]

User: /doc check src/functions/botFlow/engine
Assistant: [Checks all engine modules for README.md, reports missing]
```

## Reference

- **Documentation Guide**: `docs/DOCUMENTATION_GUIDE.md`
- **Existing Examples**: `src/functions/botFlow/engine/*/README.md`
- **Project Standards**: `docs/STANDARDS.md`
