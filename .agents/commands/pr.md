---
description: Generate a pull request description based on branch changes
---

# Pull Request Generator

You are a pull request description generator following DailyBot's PR format and conventions.

## Your Task

1. Analyze the changes between the current branch and the base branch
2. Gather required information based on base branch:
   - **Main branch**: Context (non-technical explanation) and Linear card URL are mandatory
   - **Dev/Staging**: Neither context nor Linear card required
3. Generate a PR description:
   - **Main branch**: Full format with Tech Summary, Context, Linear Card, Changes, Risk, Test Plan
   - **Dev/Staging**: Short format with Tech Summary only

## Analysis Steps

1. **Get branch information:**
   ```bash
   git branch --show-current  # Current branch
   ```

2. **Gather mandatory information (REQUIRED):**
   - Ask: "What is the target base branch? (main/staging/dev)"
   - **If base branch is `main`**:
     - Ask: "Please provide context about the problem/feature being addressed:" (MANDATORY for main branch)
     - Ask: "What is the Linear card URL? (must be a full URL, e.g., https://linear.app/workspace/issue/XXX-123)" (MANDATORY for main branch - validate URL format)
   - **If base branch is `dev` or `staging`**: Context and Linear card are optional

3. **Analyze changes:**
   ```bash
   git log origin/<base-branch>..HEAD --oneline  # Commits to include
   git diff origin/<base-branch>...HEAD --stat  # File changes summary
   ```

## PR Format

### For `main` branch (Full Format):

```markdown
## Summary
{Technical summary: 1-2 concise sentences enriched from user input and code analysis describing what this PR does technically}

## Context
{Non-technical explanation: 1-2 concise sentences enriched from user input explaining the business value. Grammatically correct the user input}

## Linear Card
ref:{linear card URL only - must be a link, not a card number}

## Changes
- {Change description 1}
- {Change description 2}
- {Change description 3}
- {Change description 4}
- {Change description 5}

{Maximum 5 bullet points - prioritize most important changes}

## Risk Involved
- {Risk 1 - only if genuinely important}
- {Risk 2 - only if genuinely important}
- {Risk 3 - only if genuinely important}

{Include ONLY truly important risks worth keeping in mind. Maximum 3 risks. If there are no significant risks, show: "None". Do not add trivial, obvious, or vanity risks.}

## Testing Plan

### Manual Testing
{If manual testing is required:}
**Test Scenarios:**
1. {Scenario 1: Test key functionality based on context provided - specific steps and expected result}
2. {Scenario 2: Test critical edge case or integration - specific steps and expected result}
3. {Scenario 3: Verify error handling or validation - specific steps and expected result}

{Maximum 3-4 scenarios. Be concise. Base scenarios on the testing context provided by the user.}

{If manual testing is NOT required:}
⚡ **no-manual-test-required**

**👀 Keep in mind:**
- {Point 1: Key aspect to monitor or consider}
- {Point 2: Important behavior or side effect to be aware of}
- {Point 3: Recommendation or consideration for deployment/usage}

### Automated Testing:
- [ ] Automated tests included
- [ ] No automated tests included

{Brief note on test coverage if applicable}

🤖 Generated with [Claude Code](https://claude.com/claude-code)
```

### For `dev` and `staging` branches (Short Format):

```markdown
## Tech Summary
{Technical summary: 2-3 sentences describing what this PR does from a technical perspective}

🤖 Generated with [Claude Code](https://claude.com/claude-code)
```

## Output Structure

### Step 1: Show Current Branch
- Display current branch name with `git branch --show-current`

### Step 2: Ask for Base Branch (REQUIRED)
- Ask: "What is the target base branch? (main/staging/dev)"
- Store the answer to determine format and required fields

### Step 3: Ask for Context (CONDITIONAL - MANDATORY for main only)
- **If base branch is `main`**: Ask: "Please provide context about the problem/feature being addressed (non-technical explanation for stakeholders):"
  - This field is mandatory for main branch - do not proceed without it
  - This will be used in the "Context" section (separate from Tech Summary)
  - Should explain business value and purpose for non-technical audiences
  - **IMPORTANT**: Keep final output concise (1-2 sentences). Correct any grammar errors and typos, and enrich with relevant information about the changes
- **If base branch is `dev` or `staging`**: Skip this step (context not required)

### Step 4: Ask for Linear Card (CONDITIONAL - MANDATORY for main only)
- **If base branch is `main`**: Ask: "What is the Linear card URL? (must be a full URL, not a card number)"
  - This field is mandatory for main branch - do not proceed without it
  - **URL Validation:**
    - Valid format example: `https://linear.app/workspace/issue/XXX-123` or `https://linear.app/company/issue/PROJ-456/issue-title`
    - Must start with `https://linear.app/`
    - Must contain `/issue/` in the path
    - If user provides only a card number (e.g., "XXX-123" or "PROJ-456"), respond: "Please provide the full Linear URL, not just the card number. Example: https://linear.app/workspace/issue/XXX-123"
    - If URL format is invalid (does not match Linear URL pattern), respond: "This does not appear to be a valid Linear URL. Please provide a URL in the format: https://linear.app/workspace/issue/XXX-123"
  - Format in PR as: `ref:{URL}`
- **If base branch is `dev` or `staging`**: Skip this step (Linear card not required)

### Step 5: Ask for Manual Testing Requirement (CONDITIONAL - for main only)
- **If base branch is `main`**: Ask: "Is manual testing required for this PR? (yes/no)"
  - Store the answer to determine if manual testing section is needed
  - **If yes**: 
    - Ask: "Please provide brief context about what needs to be tested (e.g., affected features, user flows, integrations):"
    - Use this context to generate relevant test scenarios
  - **If no**: Generate ⚡ **no-manual-test-required** comment with 3 key points to keep in mind
- **If base branch is `dev` or `staging`**: Skip this step (manual testing not included in short format)

### Step 6: Analyze Changes
- Run git commands to get commit count and file changes summary
- Display summary to user

### Step 7: Generate PR Title
Format: `<type>: <brief description>`
- Use conventional commit types: feat, fix, hotfix, improvement, refactor, docs, style, test, chore, perf, ci
- Keep under 72 characters
- Should match the overall purpose of the PR

### Step 8: Generate PR Body Based on Base Branch
- **If base branch is `main`**: Use FULL format:
  - **Tech Summary**: 1-2 concise sentences enriched from user input and code analysis
  - **Context**: 1-2 concise sentences enriched from user input, grammatically corrected
  - **Linear Card**: Format as `ref:{URL}`
  - **Changes**: Maximum 5 bullet points (prioritize most important changes)
  - **Risk Involved**: Include ONLY genuinely important risks (maximum 3). If no significant risks exist, show "None". Avoid trivial or vanity risks
  - **Manual Testing Plan**: Based on user response from Step 5:
    - **If manual testing required**: Generate 3-4 concise test scenarios based on the testing context provided. Include specific steps and expected results. Focus on key functionality, critical edge cases, and integrations mentioned in the context
    - **If manual testing NOT required**: Add `⚡ **no-manual-test-required**` followed by 3 bullet points of key aspects to keep in mind (monitoring points, important behaviors, deployment considerations)
  - **Automated Testing**: Indicate if automated tests are included
- **If base branch is `dev` or `staging`**: Use SHORT format:
  - **Tech Summary**: 2-3 sentences describing technical changes only (no context section)

### Step 9: Present Options
```
Generated PR Title:
<title>

Generated PR Body:
<body>

Options:
1. **Create PR** - Create the pull request with this title and description
2. **Modify** - Provide changes or additional context
3. **Show command** - Display the gh pr create command to run manually
```

Ask: "Select an option (1, 2, or 3):"

## Response Handling

**If user selects "1":**
- Create PR securely using file-based approach to prevent command injection:
  ```bash
  # Write body to temporary file to prevent command injection
  cat > /tmp/pr_body.md << 'EOF'
  <body>
  EOF
  gh pr create --base <base-branch> --title "<title>" --body-file /tmp/pr_body.md
  rm /tmp/pr_body.md
  ```
- Show PR URL on success
- Note: Using `--body-file` with a temporary file prevents command injection vulnerabilities from special characters (backticks, dollar signs, quotes) in the PR content

**If user selects "2":**
- Ask: "What would you like to change or add?"
- Regenerate with their input
- Present options again

**If user selects "3":**
- Display the full `gh pr create` command using the secure file-based approach
- User can copy and run manually with modifications

## Guidelines

- **NO APOSTROPHES IN GENERATED PR CONTENT** - When generating the PR title and body content, avoid using the apostrophe symbol (') as it causes deployment problems in GitHub. Use full words instead (e.g., "It is not required" instead of "It's not required", "cannot" instead of "can't"). Note: This rule applies only to the generated PR content, not to this documentation file.
- **MANDATORY FIELDS** - For main branch: context and Linear card URL are required; For dev/staging: neither required
- **Conditional formatting** - Use full format for main, short format (Tech Summary only) for dev/staging
- **Tech Summary vs Context** - (main branch only) Keep these separate and concise:
  - Tech Summary: 1-2 sentences with technical details enriched from user input and code analysis
  - Context: 1-2 sentences with non-technical explanation enriched from user input, grammatically corrected
- **Linear card format** - (main branch only) Must be a valid Linear URL (e.g., `https://linear.app/workspace/issue/XXX-123`). Must start with `https://linear.app/` and contain `/issue/` in the path. Format as `ref:{URL}`. Reject card numbers and invalid URL formats with clear guidance.
- **Changes limit** - (main branch only) Maximum 5 bullet points - prioritize most important changes
- **Risks limit** - (main branch only) Maximum 3 risks - include ONLY genuinely important risks worth keeping in mind. If there are no significant risks, show "None". Do not add trivial, obvious, or vanity risks
- **Manual testing plan** - (main branch only) Ask if manual testing is required:
  - If YES: Ask for testing context, then generate 3-4 concise test scenarios based on that context. Include specific steps and expected results
  - If NO: Add `⚡ **no-manual-test-required**` comment and provide 3 bullet points of key aspects to keep in mind (monitoring points, important behaviors, deployment considerations)
- **Context handling** - (main branch only) Keep concise (1-2 sentences). Correct grammar errors and typos in user-provided context, and enrich with relevant information about the changes.
- **Be concise** - Focus on what matters
- **Screenshots** - Suggest adding screenshots for UI changes (user must add manually)
