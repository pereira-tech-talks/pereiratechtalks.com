# Upgrade All Packages

## Prompt

```
Upgrade all project dependencies following the system at `.agent_commands/agent_library_upgrades/GUIDE.md`.

Process:
1. Run `ncu` to discover available upgrades
2. Categorize upgrades as minor (patch/minor) or major
3. Prioritize minor upgrades first
4. Ask me for approval before upgrading major versions
5. Update `package.json` with new versions using `ncu -u`
6. Execute `pnpm install` to update lock file and install packages
7. If any package fails, rollback that package and retry (max 3 attempts)
8. Run validation (`codecheck`) after successful upgrade
9. Generate a comprehensive report with:
   - List of successfully upgraded packages (old → new versions)
   - List of failed packages (if any) with error details
   - Recommendations for next steps

Expected outcome:
- All minor upgrades applied automatically
- Major upgrades applied only with my approval
- Comprehensive report of all changes
- All validation checks passing
```

---

## What This Does

This prompt will:

1. **Discover** all available package updates
2. **Categorize** them by upgrade type (minor vs major)
3. **Apply minor upgrades** automatically
4. **Request approval** for major upgrades
5. **Execute** the upgrade process safely
6. **Handle errors** with automatic rollback
7. **Validate** the results
8. **Report** everything comprehensively

---

## When to Use

- ✅ Regular maintenance (monthly/quarterly)
- ✅ Before starting new features (ensure latest dependencies)
- ✅ After security advisories
- ✅ When you want to stay up-to-date

---

## Expected Output

### Upgrade Plan

```
## Upgrade Plan

### Minor Upgrades (Automatic)
- package1: 1.2.3 → 1.2.4
- package2: 2.0.0 → 2.1.0

### Major Upgrades (Requires Approval)
- package3: 3.0.0 → 4.0.0
```

### Success Report

```
# Library Upgrade Success Report

## Summary
- Total packages upgraded: 5
- Minor upgrades: 4
- Major upgrades: 1

## Upgraded Packages
[detailed list with versions]

## Validation Results
✅ All checks passed
```

---

## Customization

**Exclude specific packages:**

```
... but exclude package-name1 and package-name2 from upgrades.
```

**Only upgrade specific groups:**

```
... but only upgrade packages in dependencies (not devDependencies).
```

**Skip validation:**

```
... skip running codecheck after upgrade.
```
