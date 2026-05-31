---
description: Review code focusing on critical issues
---

# Code Review

Review files or GitHub PRs for critical issues only.

## Usage

### File Review
Review current file or selected code.

### PR Review
- **Auto-detect**: Reviews PR for current branch targeting `main`
  ```bash
  gh pr list --head $(git branch --show-current) --base main
  ```
- **Direct**: `/code-review 123`
- **List**: Shows open PRs if none found
  ```bash
  gh pr list --base main
  ```

**PR Commands:**
```bash
gh pr view <number> --json title,body,files
gh pr diff <number>
```

## Critical Focus Areas (Priority Order)

### 1. **Security** 🔴
- SQL injection, XSS, CSRF vulnerabilities
- Hardcoded secrets/credentials
- Authentication/authorization bypasses
- Unsafe deserialization
- Missing input validation/sanitization
- Exposed sensitive data

### 2. **Potential Bugs** 🟠
- Null/undefined reference errors
- Race conditions
- Memory leaks
- Infinite loops
- Off-by-one errors
- Unhandled exceptions
- Missing error handling

### 3. **Performance** 🟡
- N+1 database queries
- Missing database indexes
- Inefficient algorithms (O(n²) when O(n) possible)
- Memory-intensive operations
- Blocking I/O in critical paths
- Missing caching for expensive operations

### 4. **Code Quality** 🟢
- Critical logic errors
- Duplicate code (DRY violations)
- Dead/unreachable code
- Missing critical validations
- Inconsistent error handling

## Output Format

```markdown
## Review: {file/PR title}

### 🔴 Security Issues
- [Issue] - file:line
  Fix: [specific solution]

### 🟠 Bugs
- [Issue] - file:line
  Fix: [specific solution]

### 🟡 Performance
- [Issue] - file:line
  Fix: [specific solution]

### 🟢 Code Quality
- [Issue] - file:line
  Fix: [specific solution]
```

## Rules

1. **Report ONLY critical issues** - skip nitpicks
2. **Be actionable** - every issue needs clear fix
3. **Include location** - file:line for all issues
4. **Prioritize** - security > bugs > performance > quality
5. **No praise** - only problems and solutions

## Post-Review Actions

### If No Issues Found ✅

When review finds **no critical issues** (no security, bugs, performance, or code quality issues):

**"No critical issues detected! Approve this PR?"**

If yes, approve the PR:
```bash
gh pr review <number> --approve -b "✅ Code review passed - no critical issues detected"
```

---

### If Issues Found

After review, present both options:

### Option 1: Post to PR (for code review)
**"Post these issues to PR?"**

If yes:
1. Show numbered list of all issues
2. User selects: "1,3,5" or "all"
3. Confirm selected issues
4. Post review comments using one of these methods:

#### Method A: General PR Comment
For summary or multiple issues:
```bash
gh pr review <number> --comment -b "Review comments..."
```

#### Method B: File-Specific Line Comments (Recommended)
For precise feedback on specific code locations:

```bash
# Post inline comment at specific line
gh api repos/:owner/:repo/pulls/<PR_NUMBER>/comments \
  -f body="🔴 Security: SQL injection vulnerability. Use parameterized queries." \
  -f commit_id="<COMMIT_SHA>" \
  -f path="app/views.py" \
  -f line=42

# Multiple comments in one review
gh api repos/:owner/:repo/pulls/<PR_NUMBER>/reviews \
  -f body="Code review findings" \
  -f event="COMMENT" \
  -f comments[0][path]="app/views.py" \
  -f comments[0][line]=42 \
  -f comments[0][body]="🔴 Security issue here"
```

**Get required values:**
```bash
# Get owner/repo
gh repo view --json owner,name

# Get latest commit SHA from PR
gh pr view <number> --json commits --jq '.commits[-1].oid'
```

**Workflow for file-specific comments:**
1. Extract owner/repo from `gh repo view`
2. Get commit SHA from `gh pr view`
3. For each issue, post individual comment at file:line
4. Optionally post summary comment after all inline comments

**Comment format (for inline comments):**
```
🔴 **Security**: [Brief issue]

[Detailed explanation]

**Fix:** [Specific solution]
```

### Option 2: Fix Locally (for own PR)
**"Fix these issues?"**

If yes:
1. List fixable issues (numbered)
2. User selects: "1,3" or "all"
3. Explain changes before applying
4. Confirm, then fix
5. Report: ✅ Fixed / ❌ Failed

**Fixable:** Security patches, bug fixes, validation additions, query optimizations
**Not Fixable:** Architecture changes, new features, unclear requirements

## Review Mode Detection

**Reviewing teammate's PR:**
- Offer "Post to PR" first (primary action)
- Then offer "Fix locally" (if you can push to their branch)

**Reviewing own PR:**
- Offer both equally
- User chooses based on preference
