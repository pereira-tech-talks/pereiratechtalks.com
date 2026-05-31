# Upgrade Minor Versions Only

## Prompt

```
Upgrade only minor and patch versions of all project dependencies following `.agent_commands/agent_library_upgrades/GUIDE.md`. Skip all major upgrades.

Process:
1. Run `ncu` to discover available upgrades
2. Filter to only minor/patch upgrades (exclude major version bumps)
3. Update `package.json` with new versions using `ncu -u --target minor`
4. Execute `pnpm install` to update lock file and install packages
5. If any package fails, rollback that package and retry (max 3 attempts)
6. Run validation (`codecheck`) after successful upgrade
7. Generate a report listing:
   - All successfully upgraded packages (old → new versions)
   - Any failed packages with error details
   - List of major upgrades that were skipped (for reference)

Expected outcome:
- Only minor/patch upgrades applied
- Major upgrades skipped (listed in report for future consideration)
- Comprehensive report of changes
- All validation checks passing
```

---

## What This Does

This prompt will:

1. **Discover** all available package updates
2. **Filter** to only minor/patch upgrades (exclude major)
3. **Apply** minor upgrades automatically
4. **Skip** major upgrades (but list them in report)
5. **Execute** the upgrade process safely
6. **Handle errors** with automatic rollback
7. **Validate** the results
8. **Report** everything comprehensively

---

## When to Use

- ✅ **Regular maintenance** - Safe, incremental updates
- ✅ **Before major upgrades** - Update minor versions first, then handle major separately
- ✅ **Stability priority** - When you want to avoid breaking changes
- ✅ **Quick updates** - Fast, low-risk dependency updates

---

## Expected Output

### Upgrade Plan

```
## Upgrade Plan

### Minor Upgrades (Will Apply)
- package1: 1.2.3 → 1.2.4 (patch)
- package2: 2.0.0 → 2.1.0 (minor)

### Major Upgrades (Skipped)
- package3: 3.0.0 → 4.0.0 (major - skipped per request)
```

### Success Report

```
# Library Upgrade Success Report (Minor Only)

## Summary
- Minor upgrades applied: 5
- Major upgrades skipped: 2

## Upgraded Packages
[detailed list with versions]

## Skipped Major Upgrades (for reference)
- package3: 3.0.0 → 4.0.0 (requires manual review)
- package4: 2.0.0 → 3.0.0 (requires manual review)

## Validation Results
✅ All checks passed
```

---

## Benefits

- ✅ **Lower risk** - Minor upgrades rarely have breaking changes
- ✅ **Faster execution** - No need to wait for major upgrade approval
- ✅ **Incremental** - Update minor versions regularly, handle major separately
- ✅ **Safe** - Automatic rollback on failures

---

## Customization

**Include specific major upgrades:**

```
... but also upgrade package-name if it has a major upgrade available.
```

**Exclude specific packages:**

```
... but exclude package-name1 and package-name2 from upgrades.
```

**Only upgrade dev dependencies:**

```
... but only upgrade packages in devDependencies (not dependencies).
```
