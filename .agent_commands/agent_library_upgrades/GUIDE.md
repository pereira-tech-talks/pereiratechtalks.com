# Guide: Agent Library Upgrades

## Overview

This guide provides **step-by-step instructions** for AI agents to execute library upgrades following the Agent Library Upgrades system.

**When to use:** When you need to upgrade project dependencies (npm packages).

**Tools used:**

- `ncu` (npm-check-updates) - Check for available updates
- `pnpm install` - Install updated packages

---

## Execution Flow

### Phase 1: Discovery

**Step 1.1: Check for Available Upgrades**

Execute:

```bash
ncu
```

**Expected Output Format:**

```
astro                      ^5.16.0   →  ^5.17.0
svelte                     ^5.48.0   →  ^5.49.0
typescript                 ^5.9.3    →  ^5.10.0
@biomejs/biome            ^2.3.11   →  ^2.4.0
```

**Alternative (JSON format for machine parsing):**

```bash
ncu --format json
```

**Example JSON Output:**

```json
{
  "astro": "^5.17.0",
  "svelte": "^5.49.0",
  "typescript": "^5.10.0",
  "@biomejs/biome": "^2.4.0"
}
```

**Step 1.2: Parse and Categorize Upgrades**

For each package in the output:

1. **Extract:**
   - Package name
   - Current version (from package.json)
   - Target version (from ncu output)

2. **Categorize by semver:**
   - **Patch Upgrade:** X.Y.Z → X.Y.Z+1 (bug fixes only)
   - **Minor Upgrade:** X.Y.Z → X.Y+1.0 (new features, backward compatible)
   - **Major Upgrade:** X.Y.Z → X+1.0.0 (breaking changes possible)

3. **Create Lists:**
   - `patch_upgrades = []` - Packages with patch updates (safest)
   - `minor_upgrades = []` - Packages with minor updates (safe)
   - `major_upgrades = []` - Packages with major version bumps (⚠️ review needed)

**Version Comparison Logic:**

```javascript
// Parse version: "5.3.3" → [5, 3, 3]
const [majorCurrent, minorCurrent, patchCurrent] = current.split('.').map(Number)
const [majorNew, minorNew, patchNew] = target.split('.').map(Number)

if (majorNew > majorCurrent) {
  // Major upgrade - breaking changes possible
  major_upgrades.push(package)
} else if (minorNew > minorCurrent) {
  // Minor upgrade - new features, backward compatible
  minor_upgrades.push(package)
} else if (patchNew > patchCurrent) {
  // Patch upgrade - bug fixes only
  patch_upgrades.push(package)
}
```

---

### Phase 2: Planning

**Step 2.1: Create Upgrade Plan**

Document the upgrade plan with categorization:

```markdown
## Upgrade Plan

### Patch Upgrades (Safest - Bug Fixes Only)

- @astrojs/mdx: 4.3.12 → 4.3.13
- tailwindcss: 4.1.17 → 4.1.18

### Minor Upgrades (Safe - New Features, Backward Compatible)

- astro: 5.16.0 → 5.17.0
- svelte: 5.48.0 → 5.49.0
- @biomejs/biome: 2.3.10 → 2.3.11

### Major Upgrades (⚠️ May Have Breaking Changes)

- typescript: 5.9.3 → 6.0.0
```

**Step 2.2: Request User Approval for Major Upgrades**

If `major_upgrades` list is not empty:

**Present to user:**

```
⚠️ Major Upgrades Detected

The following packages have major version updates available:
• webpack: 5.90.0 → 6.0.0

Major upgrades may include breaking changes. What would you like to do?

1. Include all major upgrades in this session
2. Review and select major upgrades individually
3. Skip all major upgrades (only upgrade patch + minor)
4. Cancel entire upgrade process

Enter option (1-4):
```

**Wait for user response before proceeding.**

---

### Phase 3: Execution

**Step 3.1: Backup Current State**

**CRITICAL:** Before making any changes, ensure current state is committed or backed up.

```bash
# Check git status
git status

# If there are uncommitted changes, inform user:
# "⚠️ Uncommitted changes detected. Please commit or stash before proceeding."
```

**Recommendation:**

- Suggest creating a backup commit before upgrades
- Or at minimum, ensure working directory is clean

**Step 3.2: Update package.json with ncu**

Based on upgrade plan, use appropriate ncu command:

**For patch upgrades only:**

```bash
ncu -u --target patch
```

**For minor upgrades (includes patch):**

```bash
ncu -u --target minor
```

**For all upgrades (includes major):**

```bash
ncu -u --target latest
```

**For specific packages:**

```bash
ncu -u --filter "typescript eslint"
```

**What this does:**

- Updates version numbers in `package.json`
- Does NOT install packages yet
- Preserves package.json formatting

**Step 3.3: Install Updated Packages**

Run pnpm install to apply the changes:

```bash
pnpm install
```

**What this command does:**

1. Reads updated `package.json`
2. Resolves dependencies
3. Updates `pnpm-lock.yaml` automatically
4. Installs/updates packages in `node_modules/`
5. Checks for peer dependency conflicts

**Expected Success Output:**

```
added 5 packages, removed 2 packages, changed 15 packages, and audited 1234 packages

found 0 vulnerabilities
```

**Watch for warnings:**

- Peer dependency warnings
- Deprecated package warnings
- Security vulnerabilities

---

### Phase 4: Validation

**Step 4.1: Check Installation Success**

**If `pnpm install` succeeds:**

- ✅ Proceed to Step 4.2 (Run Tests)

**If `pnpm install` fails:**

- ❌ Proceed to Phase 5 (Error Handling)

**Step 4.2: Run Tests and Code Quality Checks**

Run comprehensive validation:

```bash
# Preferred: run the project-wide validation wrapper
codecheck

# Fallback when codecheck is unavailable
pnpm run biome:check       # Check linting and formatting
pnpm run astro:check       # TypeScript checking
pnpm run build             # Verify production build works
```

**Important:** `codecheck` must be attempted first after upgrades. If it fails, fix issues and rerun `codecheck` (or the fallback checks above if `codecheck` is unavailable).

**Success Criteria:**

- ✅ Biome checks pass (no linting/formatting errors)
- ✅ TypeScript checks pass (`astro:check`)
- ✅ Build succeeds (`pnpm run build`)
- ✅ No runtime errors

**Note:** Testing is not configured in this project. When tests are added, include `pnpm run test` in validation.

**Step 4.3: Verify Functionality**

**Quick smoke test:**

```bash
# Start development server
pnpm run dev

# Open http://localhost:8888
# Navigate to key pages (home, blog, about)
# Verify no console errors
```

---

### Phase 5: Error Handling

**Error Scenario 1: pnpm install fails with dependency conflict**

**Example Error:**

```
npm ERR! ERESOLVE unable to resolve dependency tree
npm ERR! Found: typescript@6.0.0
npm ERR! Could not resolve dependency:
npm ERR! peer typescript@"^5.0.0" from @typescript-eslint/parser@6.0.0
```

**Resolution Steps:**

1. **Identify conflicting package:**
   - In example: `typescript@6.0.0` conflicts with `@typescript-eslint/parser`

2. **Rollback problematic package:**

   ```bash
   # Revert package.json changes
   git checkout package.json

   # Or manually revert specific package version
   pnpm install typescript@5.4.0
   ```

3. **Try alternative:**
   - Upgrade the dependent package too: `ncu -u --filter "typescript @typescript-eslint"`
   - Or use `pnpm install` (not recommended)

4. **Document in failure report**

**Error Scenario 2: Tests fail after upgrade**

**Resolution Steps:**

1. **Identify which package caused failure:**

   ```bash
   # Rollback all changes
   git checkout package.json pnpm-lock.yaml
   pnpm install

   # Upgrade packages one by one to isolate issue
   ncu -u --filter "typescript"
   pnpm install
   pnpm run test  # Does this fail?
   ```

2. **Check package changelog for breaking changes:**
   - Visit package's GitHub releases
   - Look for BREAKING CHANGES section
   - Check migration guide

3. **Options:**
   - Fix code to work with new version
   - Rollback that specific package
   - Document and skip for now

**Error Scenario 3: Peer dependency warnings**

**Example Warning:**

```
npm WARN ERESOLVE overriding peer dependency
npm WARN While resolving: eslint-config-prettier@9.1.0
npm WARN Found: eslint@8.56.0
npm WARN peer eslint@">=7.0.0" from eslint-config-prettier@9.1.0
```

**Resolution:**

- If just a warning (not error): usually safe to proceed
- Check if packages are compatible versions
- If critical: upgrade both packages together

**Error Scenario 4: Security vulnerabilities detected**

**Example:**

```
found 3 vulnerabilities (1 moderate, 2 high)
  run `npm audit fix` to fix them
```

**Resolution Steps:**

```bash
# Review vulnerabilities
npm audit

# Try automatic fix
npm audit fix

# If some can't be auto-fixed
npm audit fix --force  # ⚠️ May install breaking changes
```

---

### Phase 6: Reporting

**Step 6.1: Generate Upgrade Report**

Create comprehensive report:

```markdown
# Library Upgrade Report

**Date:** 2026-01-26
**Duration:** 15 minutes

## Summary

- ✅ Successfully upgraded: 12 packages
- ❌ Failed: 1 package
- ⚠️ Skipped: 2 packages (user decision)

## Successfully Upgraded

### Patch Upgrades

• @astrojs/mdx: 4.3.12 → 4.3.13
• tailwindcss: 4.1.17 → 4.1.18

### Minor Upgrades

• astro: 5.16.0 → 5.17.0
• svelte: 5.48.0 → 5.49.0
• @biomejs/biome: 2.3.10 → 2.3.11
• @astrojs/sitemap: 3.6.0 → 3.7.0

### Major Upgrades

• (none in this session)

## Failed Upgrades

• (none)

## Skipped (User Decision)

• typescript: 5.9.3 → 6.0.0 (major - user chose to skip)

## Validation Results

✅ Biome: No linting/formatting errors
✅ TypeScript: astro:check passed
✅ Build: Production build successful

## Files Changed

- package.json
- pnpm-lock.yaml

## Recommendations

1. Consider upgrading TypeScript to 6.0 when Astro officially supports it
2. Review Astro release notes for any breaking changes
3. Monitor Svelte 5 runes API for any deprecations

## Next Steps

- [ ] Commit changes: `git add package.json pnpm-lock.yaml && git commit -m "chore(deps): upgrade 12 packages"`
- [ ] Deploy to dev environment for testing
- [ ] Monitor for issues
```

**Step 6.2: Ask User About Committing**

```
Upgrade complete! Would you like to commit these changes?

1. Yes, commit now
2. No, I'll commit later

Enter option (1-2):
```

**If user selects "Yes":**

```bash
git add package.json pnpm-lock.yaml
git commit -m "chore(deps): upgrade 12 packages (patch + minor)"
```

---

## Best Practices

### Before Upgrading

- ✅ Commit or stash uncommitted changes
- ✅ Create a backup branch if upgrading many packages
- ✅ Review changelogs for major upgrades
- ✅ Ensure CI/CD is passing

### During Upgrading

- ✅ Upgrade patch + minor first, major separately
- ✅ Upgrade related packages together (e.g., typescript + @typescript-eslint)
- ✅ Test after each batch of upgrades
- ✅ Document any issues encountered

### After Upgrading

- ✅ Run full test suite
- ✅ Run `codecheck` first (or fallback checks if unavailable)
- ✅ Check for peer dependency warnings
- ✅ Run application locally and test critical paths
- ✅ Commit with descriptive message
- ✅ Deploy to dev/staging before production

### Error Prevention

- ❌ Don't upgrade all packages at once (hard to isolate issues)
- ❌ Don't ignore peer dependency warnings
- ❌ Don't skip testing
- ❌ Don't commit if tests are failing
- ❌ Don't force upgrades with conflicts

---

## Troubleshooting

### "Cannot find module" after upgrade

**Cause:** Package was upgraded but types are outdated

**Solution:**

```bash
# Clear node_modules and reinstall
rm -rf node_modules pnpm-lock.yaml
pnpm install
```

### Biome errors after TypeScript upgrade

**Cause:** Biome may need to be updated to support new TypeScript features

**Solution:**

```bash
# Upgrade Biome alongside TypeScript
ncu -u --filter "typescript @biomejs/biome"
pnpm install
```

### Tests timeout after upgrade

**Cause:** Package behavior changed, tests need adjustment

**Solution:**

- Review package changelog
- Update test timeouts if needed
- Check for async/await changes

---

## Quick Reference Commands

```bash
# Check for updates
ncu

# Check specific packages
ncu --filter "typescript eslint"

# Upgrade patch only
ncu -u --target patch && pnpm install

# Upgrade minor (includes patch)
ncu -u --target minor && pnpm install

# Upgrade all (includes major)
ncu -u --target latest && pnpm install

# Upgrade specific packages
ncu -u --filter "typescript eslint" && pnpm install

# Validation
codecheck                     # Preferred project-wide validation
pnpm run biome:check       # Lint and format check
pnpm run astro:check       # TypeScript checking
pnpm run build             # Production build

# Rollback
git checkout package.json pnpm-lock.yaml
pnpm install
```

---

## Related Documentation

- [npm-check-updates documentation](https://github.com/raineorshine/npm-check-updates)
- [Semantic Versioning (semver)](https://semver.org/)
- [pnpm install documentation](https://docs.npmjs.com/cli/v10/commands/npm-install)
- [Project Standards](../../docs/STANDARDS.md)
- [Development Commands](../../docs/DEVELOPMENT_COMMANDS.md)
