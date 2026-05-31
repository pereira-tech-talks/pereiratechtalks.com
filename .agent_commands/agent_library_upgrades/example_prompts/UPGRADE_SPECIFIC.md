# Upgrade Specific Packages

## Prompt Template

```
Upgrade the following packages: [package1, package2, package3, ...] following `.agent_commands/agent_library_upgrades/GUIDE.md`.

Process:
1. Check current versions of specified packages in `package.json`
2. Run `ncu --filter "package1 package2 package3"` to check if upgrades are available for these packages
3. For each package:
   - If upgrade available: Update to latest version in `package.json`
   - If no upgrade: Report that package is already at latest version
   - If major upgrade: Ask for approval before proceeding
4. Execute `pnpm install` to update lock file and install packages
5. If any package fails, rollback that package and retry (max 3 attempts)
6. Run validation (`codecheck`) after successful upgrade
7. Generate a report listing:
   - Successfully upgraded packages (old → new versions)
   - Packages already at latest version
   - Failed packages with error details (if any)

Expected outcome:
- Only specified packages upgraded
- Comprehensive report of results
- All validation checks passing
```

---

## Example Usage

### Example 1: Upgrade Single Package

```
Upgrade the following package: stripe following `.agent_commands/agent_library_upgrades/GUIDE.md`.
```

### Example 2: Upgrade Multiple Packages

```
Upgrade the following packages: axios, typescript, eslint following `.agent_commands/agent_library_upgrades/GUIDE.md`.
```

### Example 3: Upgrade with Approval for Major

```
Upgrade the following packages: webpack, serverless following `.agent_commands/agent_library_upgrades/GUIDE.md`. If any have major upgrades, ask for approval before proceeding.
```

---

## What This Does

This prompt will:

1. **Check** current versions of specified packages
2. **Discover** available upgrades for those packages only
3. **Apply** upgrades (with approval for major versions)
4. **Execute** the upgrade process safely
5. **Handle errors** with automatic rollback
6. **Validate** the results
7. **Report** everything comprehensively

---

## When to Use

- ✅ **Targeted updates** - Update specific packages for bug fixes or features
- ✅ **Security patches** - Update packages with known vulnerabilities
- ✅ **Feature requirements** - Update packages needed for new features
- ✅ **Dependency conflicts** - Update specific packages to resolve conflicts

---

## Expected Output

### Upgrade Plan

```
## Upgrade Plan for Specific Packages

### Packages Requested
- webpack: 5.90.0 → 6.0.0 (major - requires approval)
- axios: 1.6.0 → 1.6.2 (minor)
- typescript: 5.3.3 → 5.4.0 (minor)

### Packages Already at Latest
- eslint: 8.56.0 (already latest)
```

### Success Report

```
# Library Upgrade Success Report (Specific Packages)

## Summary
- Packages requested: 3
- Successfully upgraded: 2
- Already at latest: 1
- Failed: 0

## Upgraded Packages
- axios: 1.6.0 → 1.6.2 ✅
- typescript: 5.3.3 → 5.4.0 ✅

## Already at Latest
- eslint: 8.56.0 (no upgrade available)

## Validation Results
✅ All checks passed
```

---

## Benefits

- ✅ **Precise control** - Upgrade only what you need
- ✅ **Focused updates** - Avoid unnecessary changes
- ✅ **Faster execution** - Only process specified packages
- ✅ **Targeted fixes** - Update packages for specific reasons

---

## Customization

**Upgrade to specific version:**

```
Upgrade webpack to version 6.0.0 (even if newer version available).
```

**Upgrade all packages in a group:**

```
Upgrade all packages in devDependencies only.
```

**Exclude from upgrade:**

```
Upgrade axios and typescript, but do not upgrade webpack.
```

**Force major upgrade:**

```
Upgrade webpack to latest version, including major upgrades, without asking for approval.
```
