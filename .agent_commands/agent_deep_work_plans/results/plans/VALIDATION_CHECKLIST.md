# Validation Checklist - Common Validation Commands

This file contains **standard validation commands** that deep work plans can reference.

Use these validations to ensure code quality, functionality, and adherence to project standards.

---

## Quick Reference

| Category         | Command                                                   | When to Use                       |
| ---------------- | --------------------------------------------------------- | --------------------------------- |
| **Full Check**   | `codecheck`                                               | After any Python code changes     |
| **Code Format**  | `black app/ config/`                                      | Before committing Python code     |
| **Type Check**   | `mypy app --show-error-codes --junit-xml mypy_result.xml` | After adding/modifying type hints |
| **Tests**        | `pytest app/tests/ -v --disable-warnings --nomigrations`  | After logic changes               |
| **Coverage**     | `coverage report --show-missing`                          | To check test coverage            |
| **Django Check** | `python manage.py check`                                  | After model/settings changes      |
| **Migrations**   | `python manage.py makemigrations --check --dry-run`       | After model changes               |
| **CSS Build**    | `build_static`                                            | After CSS/Tailwind changes        |
| **Manual Test**  | Browser testing                                           | After UI/frontend changes         |

---

## 1. Python Code Quality

### Full Validation Workflow

**When:** After ANY Python code changes (models, views, services, etc.)

**Command:**

```bash
codecheck
```

**What it does:**

- ✅ Formats code with `black`
- ✅ Type checking with `mypy`
- ✅ Runs all tests with `pytest`
- ✅ Checks coverage (minimum 50%)

**Must pass:** ✅ YES (mandatory)

**Alternative (skip linting, only run tests):**

```bash
codecheck -p
```

**Alternative (skip tests, only run linting):**

```bash
codecheck -f
```

---

### Code Formatting

**When:** Before committing Python code (or if `codecheck` fails formatting)

**Command:**

```bash
black app/ config/
```

**What it does:** Auto-formats Python code to Black standards

**Must pass:** ✅ YES

---

### Type Checking

**When:** After adding/modifying type hints or if you suspect type errors

**Commands:**

```bash
# Mypy type checking
mypy app --show-error-codes --junit-xml mypy_result.xml
```

**What it does:** Validates type hints and catches type-related bugs

**Must pass:** ✅ YES (both should pass)

---

### Testing

**When:** After changing business logic, models, services, or APIs

**Commands:**

```bash
# Run all tests
pytest app/tests/ -v --disable-warnings --nomigrations

# Run specific test file
pytest app/myapp/tests/service_test.py -v

# Run specific test
pytest app/myapp/tests/service_test.py::TestMyService::test_my_function -v
```

**What it does:** Runs test suite to verify functionality

**Must pass:** ✅ YES (all tests must pass)

---

### Test Coverage

**When:** After writing new tests or to verify coverage thresholds

**Commands:**

```bash
# Run tests with coverage
coverage run -m pytest -v --disable-warnings --nomigrations

# Show coverage report
coverage report --show-missing

# Check minimum threshold (50%)
coverage report --format=total --fail-under=50
```

**What it does:** Measures test coverage and identifies untested code

**Must pass:** ✅ YES (minimum 50% overall, 60%+ for new features)

---

## 2. Django-Specific Validations

### Django System Check

**When:** After changing models, settings, or configurations

**Command:**

```bash
python manage.py check
```

**What it does:** Runs Django's built-in system checks (models, URLs, settings)

**Must pass:** ✅ YES

---

### Migration Check

**When:** After modifying model fields or relationships

**Commands:**

```bash
# Check for pending migrations
python manage.py makemigrations --check --dry-run

# Create migrations (if needed)
makemigrations

# Run migrations
migrate
```

**What it does:** Ensures database schema matches models

**Must pass:** ✅ YES (no pending migrations before marking task complete)

---

## 3. Frontend Validations

### CSS Build Process

**When:** After modifying `app/static/css/src/input.css` or Tailwind configuration

**Commands:**

```bash
# Shortcut (recommended)
build_static

# Manual process
cd app/static && pnpm run build:css          # Build CSS
python manage.py collectstatic --noinput   # Collect static files
```

**What it does:** Compiles Tailwind CSS and collects static files

**Must pass:** ✅ YES

**After running:**

1. Update CSS version in `app/templates/base.html`: `?v=X` → `?v=X+1`
2. Hard refresh browser: `Ctrl + Shift + R`

---

### Manual Browser Testing

**When:** After UI changes, component additions, or frontend logic

**Steps:**

```bash
# 1. Start Django server
start_django

# 2. Open browser
# Navigate to: http://localhost:8600

# 3. Test functionality
# - Verify visual appearance
# - Test interactions (clicks, forms, etc.)
# - Test in both light and dark modes (if applicable)
# - Test responsive design (mobile, tablet, desktop)

# 4. Check browser console
# - No JavaScript errors
# - No 404s for assets
```

**Must pass:** ✅ YES (no visual bugs, no console errors, functionality works)

---

### HTMX/Alpine.js Interactivity

**When:** After adding dynamic components with HTMX or Alpine.js

**Testing:**

1. Verify component renders
2. Test interactions (click, input, etc.)
3. Check HTMX swaps work correctly
4. Verify Alpine.js reactivity (x-data, x-model, etc.)
5. Open DevTools Network tab → Verify HTMX requests succeed

**Must pass:** ✅ YES (all interactions work, no console errors)

---

## 4. Integration Validations

### Email Testing (Local)

**When:** After implementing email functionality

**Commands:**

```bash
# Start Django server with console email backend
start_django

# Trigger email (via app or Django shell)
python manage.py shell
```

**What to verify:**

- ✅ Email renders correctly (check console output)
- ✅ All variables populated
- ✅ Links work
- ✅ Subject line correct

---

### Celery Task Testing

**When:** After creating/modifying async tasks

**Commands:**

```bash
# Start Celery worker
start_celery_monitor

# Trigger task (via app or shell)
# Check Celery logs for execution
```

**What to verify:**

- ✅ Task executes without errors
- ✅ Expected side effects occur
- ✅ Error handling works

---

## 5. Accessibility Validations

### Lighthouse Audit

**When:** After significant UI changes or before deploying

**Steps:**

1. Open Chrome DevTools (F12)
2. Navigate to "Lighthouse" tab
3. Select categories: Performance, Accessibility, Best Practices
4. Run audit

**Must pass:**

- ✅ Accessibility: 90+ (minimum)
- ✅ No critical accessibility violations

---

### Keyboard Navigation

**When:** After adding interactive components

**Testing:**

1. Navigate using only keyboard (Tab, Shift+Tab, Enter, Space, Arrow keys)
2. Verify all interactive elements are reachable
3. Verify focus indicators are visible
4. Verify logical tab order

**Must pass:** ✅ YES (all elements keyboard accessible)

---

## 6. Documentation Validations

### Documentation Completeness

**When:** After completing a feature or significant refactor

**Checklist:**

- [ ] Updated relevant README files
- [ ] Added/updated docstrings for new functions/classes
- [ ] Updated ARCHITECTURE.md if patterns changed
- [ ] Updated API_REFERENCE.md if API endpoints changed
- [ ] Updated CLAUDE.md if new standards introduced
- [ ] All documentation in English

**Must pass:** ✅ YES (all relevant docs updated)

---

## 7. Git & Commit Validations

### Pre-Commit Checklist

**Before committing:**

```bash
# 1. Run full validation
codecheck

# 2. Check git status
git status

# 3. Review changes
git diff

# 4. Stage changes
git add .

# 5. Commit with proper format
git commit -m "type(scope): description"
```

**Commit message format:**

```
feat(ui): add dark mode toggle

- Created toggle component in navbar
- Added theme persistence with localStorage
- Tested in light and dark modes

Task: .agent_commands/agent_deep_work_plans/results/plans/PLAN_example/1.task_title.md
```

---

## 8. Task-Specific Validations

### For Model Changes

```bash
✅ python manage.py check
✅ python manage.py makemigrations --check --dry-run
✅ codecheck
✅ Coverage check (test new model fields/methods)
```

### For API Endpoint Changes

```bash
✅ codecheck
✅ Manual API testing (Postman/curl or browser)
✅ Check authentication works
✅ Check permissions work
✅ Verify response format
✅ Update docs/API_REFERENCE.md
```

### For UI Component Changes

```bash
✅ build_static
✅ Manual browser testing (all breakpoints)
✅ Test in light and dark modes
✅ Keyboard navigation check
✅ Lighthouse audit (accessibility)
✅ Hard refresh browser (Ctrl+Shift+R)
```

### For Service Layer Changes

```bash
✅ codecheck
✅ pytest app/myapp/tests/services/ -v
✅ Coverage report (90%+ for services)
✅ Integration tests (if external dependencies)
```

### For Documentation Changes

```bash
✅ Spell check (manual review)
✅ Verify all links work
✅ Verify code examples are accurate
✅ Ensure English only
✅ Check formatting renders correctly (markdown)
```

---

## 9. Common Validation Patterns

### Pattern 1: Backend Feature (Model + Service + API)

```bash
# Step 1: Format and type check
black app/ config/
mypy app --show-error-codes --junit-xml mypy_result.xml

# Step 2: Run Django checks
python manage.py check
python manage.py makemigrations --check --dry-run

# Step 3: Run tests with coverage
coverage run -m pytest -v --disable-warnings --nomigrations
coverage report --show-missing --fail-under=80

# Step 4: Manual API testing
start_django
# Test endpoints with Postman/curl

# Step 5: Update docs
# Edit docs/ARCHITECTURE.md, docs/API_REFERENCE.md
```

### Pattern 2: Frontend Feature (UI Component)

```bash
# Step 1: Build CSS (if modified)
build_static

# Step 2: Start server
start_django

# Step 3: Manual testing
# Open http://localhost:8600
# Test component in browser
# Test light/dark modes
# Test responsive breakpoints
# Check browser console (no errors)

# Step 4: Accessibility check
# Run Lighthouse audit
# Test keyboard navigation

# Step 5: Hard refresh
# Ctrl + Shift + R (to clear cache)
```

### Pattern 3: Documentation Update

```bash
# Step 1: Review changes
# Read through updated docs
# Verify all code examples accurate

# Step 2: Check links
# Verify all cross-references work

# Step 3: Check formatting
# Ensure markdown renders correctly

# Step 4: Language check
# Verify English only, no other languages
```

---

## 10. Troubleshooting Validations

### If `codecheck` fails:

```bash
# Check which step failed
codecheck

# Run individual steps
black app/ config/              # Fix formatting
mypy app --show-error-codes --junit-xml mypy_result.xml  # Fix type errors
pytest app/tests/ -v            # Fix test failures
```

### If tests fail:

```bash
# Run specific failing test with verbose output
pytest path/to/test_file.py::TestClass::test_method -vv

# Check test logs
# Read assertion errors
# Fix code or test
# Re-run
```

### If coverage is too low:

```bash
# Find untested code
coverage report --show-missing

# Write tests for missing lines
# Re-run coverage
coverage run -m pytest -v --disable-warnings --nomigrations
coverage report
```

### If CSS changes don't appear:

```bash
# Rebuild CSS
build_static

# Update CSS version in base.html
# Change ?v=X to ?v=X+1

# Hard refresh browser
# Ctrl + Shift + R (Chrome/Firefox)
# Cmd + Shift + R (Mac)

# Clear browser cache if needed
```

---

## Best Practices

### ✅ DO:

- Run validations **before** marking task complete
- Run **all relevant validations** for the type of change
- Fix issues **immediately** (don't skip or postpone)
- Document validation results in task completion logs
- Re-run validations after fixes

### ❌ DON'T:

- Skip validations "to save time" (causes problems later)
- Mark tasks complete if validations fail
- Commit code that doesn't pass `codecheck`
- Ignore test failures or coverage drops
- Deploy without running validations

---

**This checklist is a reference for common validation patterns. Individual tasks may have additional specific validations.**

**When in doubt, run the full validation: `codecheck` for Python, `build_static` + manual testing for frontend.**
