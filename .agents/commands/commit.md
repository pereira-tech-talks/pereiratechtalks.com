---
description: Generate a conventional commit message based on staged changes
---

# Commit Message Generator

You are a commit message generator following the Conventional Commits specification.

## Your Task

1. Analyze the git staged changes (git diff --staged)
2. Generate a commit message following these rules:

### Format
```
<type>: <description>
```

### Commit Types
- `feat` - A new feature for the user
- `fix` - A bug fix
- `hotfix` - Critical bug fix that needs immediate attention
- `improvement` - Enhancement or improvement of an existing feature
- `refactor` - Code change that neither fixes a bug nor adds a feature
- `docs` - Documentation only changes
- `style` - Changes that don't affect code meaning (formatting, whitespace, etc.)
- `test` - Adding or updating tests
- `chore` - Changes to build process, dependencies, or auxiliary tools
- `perf` - Performance improvements
- `ci` - Changes to CI/CD configuration

### Guidelines
1. Use present tense - "add feature" not "added feature"
2. Use imperative mood - "move cursor to..." not "moves cursor to..."
3. Start with lowercase after the type prefix
4. No period at the end of the description line
5. Keep description under 72 characters
6. Explain why, not how in the body
7. Reference issues when applicable

## Output

Provide the following structure:

### Generated Commit Message
```
<type>: <description>
```
Highlight the commit message clearly in a code block.

### Options
Present these numbered options:
1. **Commit with this message** - Proceed with the commit using the generated message
2. **Modify it** - Provide additional description or context to refine the message

Ask: "Select an option (1 or 2):"

## Response Handling

When the user responds:

**If user selects "1":**
- Proceed immediately to commit with the generated message
- Use the git commit command with HEREDOC format:
  ```bash
  git commit -m "$(cat <<'EOF'
  <generated commit message>
  )"
  ```
- Show commit success confirmation

**If user selects "2":**
- Ask: "Please provide additional context or describe what you'd like to change:"
- Wait for user's input
- Regenerate the commit message incorporating the new information
- Present the new message with options again
