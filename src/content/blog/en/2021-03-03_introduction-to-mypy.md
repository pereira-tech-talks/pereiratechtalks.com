---
title: "Introduction to MyPy"
description: "Why we adopted type checking at DailyBot — from untyped Python chaos to catching bugs before runtime, reducing cognitive load, and shipping with confidence."
pubDate: "2021-03-03"
heroImage: "/images/blog/posts/introduction-to-mypy/hero.webp"
heroLayout: "side-by-side"
tags: ["talks", "tech", "python"]
keywords: ["MyPy Python type checking", "Python type hints tutorial", "DailyBot MyPy adoption", "type checking Python codebase", "attrs Python type safety", "Python static type analysis", "MyPy catching bugs before runtime"]
---

I gave an internal talk at DailyBot in early 2021 about **MyPy** and type checking in Python. At the time, our Python codebase was growing fast — new integrations, new features, new engineers joining the team — and we were starting to feel the pain of working without types.

Function signatures were ambiguous. Return values were a mystery. You'd pass a `dict` when the function expected a list, and you wouldn't know until runtime. Tests caught some of this, but not everything. And honestly, writing unit tests just to verify that a function returns a string felt like a waste of time.

MyPy changed that. Not overnight, but gradually. We started adding type hints to critical paths, and the feedback was immediate. Bugs caught at development time. Clearer function contracts. Less time spent digging through code to understand what a function actually does.

This talk was about sharing what we learned and convincing the team that types were worth the effort.

---

## Why We Needed Type Checking at DailyBot

DailyBot integrates with Slack, Microsoft Teams, Google Chat, and a bunch of other platforms. Each integration has its own data structures, webhook payloads, API response formats. When you're juggling that much external data, it's very easy for things to break in subtle ways.

Here's what we were dealing with:

**Ambiguous function signatures.** You'd look at a function like this:

```python
def process_message(data, user, channel):
    # What are these types? dict? str? object? who knows.
    pass
```

To understand what `data` is, you'd have to read the function body, trace back to the caller, maybe check the logs. It was slow and error-prone.

**Runtime type errors.** You'd pass a `None` where a `str` was expected, or a `list` where a `dict` was needed. The code would crash in production. Not ideal.

**Cognitive load.** Every time you touched a function, you had to build a mental model of what types it expected and returned. That's exhausting when you're working on a large codebase.

**Trivial unit tests.** We had tests that literally just checked: "does this function return a dict?" Those tests provided value, but they felt wasteful. The type system should enforce that, not the test suite.

---

## What MyPy Gave Us

MyPy is a static type checker for Python. You add type hints to your code, run MyPy, and it tells you about type mismatches, missing return values, incorrect function calls — all before you run the code.

Here's what changed after we started using it:

### 1. Less Cognitive Load

When function signatures are clearly typed, you don't have to guess. You just read the signature and you know exactly what goes in and what comes out.

Before:
```python
def fetch_user_data(user_id, include_metadata):
    # ???
    pass
```

After:
```python
def fetch_user_data(user_id: str, include_metadata: bool) -> dict[str, Any]:
    # Crystal clear.
    pass
```

The second version is self-documenting. No ambiguity.

### 2. Catch Mistakes Early

Type checking surfaces bugs during development, not in production.

Example: we had a function that was supposed to return a list of user IDs (`list[str]`), but in one edge case it returned `None`. Without MyPy, that code would ship and crash when someone iterated over it. With MyPy, it failed the type check immediately:

```
error: Incompatible return value type (got "None", expected "list[str]")
```

Fixed before it ever hit staging.

### 3. Data Validation with attrs

We started using **[attrs](https://pypi.org/project/attrs/)** (now evolved into `attrs` + `cattrs`) to define typed data classes with runtime validation. This worked beautifully with MyPy.

Example:
```python
from attrs import define

@define
class SlackMessage:
    user_id: str
    channel_id: str
    text: str
    timestamp: float
```

Now every Slack message payload gets validated at runtime *and* type-checked at development time. If someone tries to pass an `int` as `user_id`, MyPy catches it. If the Slack API sends a malformed payload, attrs catches it.

(We also experimented with **[Pydantic](https://docs.pydantic.dev/)**, which is another great option for data validation + types.)

### 4. Eliminate Trivial Tests

Before MyPy, we had tests like this:

```python
def test_process_message_returns_dict():
    result = process_message(...)
    assert isinstance(result, dict)
```

After adding type hints, that test became redundant. MyPy enforces the return type. We deleted dozens of these trivial tests and focused our test suite on behavior, not types.

---

## What Types Can You Use?

Python's type system is surprisingly rich once you dig into it.

**Basic types:**
```python
int, str, float, bool, dict, list, set, tuple
```

**Advanced typing (Python 3.5+):**
```python
from typing import Any, Callable, Union, Optional, TypeVar, Generic
from typing import Dict, List, Tuple, Set, MutableMapping, NamedTuple
```

**Generics:**
```python
def get_first_item(items: list[str]) -> str:
    return items[0]
```

**Optional (nullable):**
```python
def find_user(user_id: str) -> Optional[User]:
    # Can return a User or None
    pass
```

**Union (multiple possible types):**
```python
def parse_id(value: Union[str, int]) -> int:
    return int(value)
```

**Callable (function types):**
```python
def apply_transform(data: dict, transform: Callable[[dict], dict]) -> dict:
    return transform(data)
```

The more we used these, the clearer our code became.

---

## Integrating MyPy Into Our Workflow

Adding types to an existing codebase is a process. You can't just flip a switch. Here's how we rolled it out:

### Step 1: Install MyPy

```bash
pip install mypy
```

### Step 2: Run MyPy on a Small Module

Start small. Pick one module, add type hints, run MyPy, fix errors. Don't try to type the entire codebase at once.

```bash
mypy src/integrations/slack.py
```

### Step 3: Configure MyPy

We created a `mypy.ini` config to control strictness. Initially we set it to lenient (allow `Any`, ignore missing imports) and gradually tightened it.

```ini
[mypy]
python_version = 3.9
warn_return_any = True
warn_unused_configs = True
disallow_untyped_defs = False  # Start lenient, tighten later
```

### Step 4: Add MyPy to CI

Once we had a few modules typed, we added MyPy to our continuous integration pipeline. Every pull request runs MyPy. If types don't check, the build fails.

```yaml
# In CI config
- name: Run MyPy
  run: mypy src/
```

### Step 5: Incremental Adoption

We didn't force everyone to type everything immediately. We set a policy: **new code must be typed**. Existing code gets typed when you touch it. Over time, coverage grew naturally.

---

## Real-World Example: Slack Integration

Here's a simplified version of how we typed one of our Slack message handlers.

**Before (no types):**
```python
def handle_slash_command(payload):
    user_id = payload['user_id']
    command = payload['command']
    text = payload.get('text', '')
    response = process_command(command, text, user_id)
    return response
```

Lots of questions: What's in `payload`? What does `process_command` return? Can `user_id` be None?

**After (typed):**
```python
from typing import Any

def handle_slash_command(payload: dict[str, Any]) -> dict[str, str]:
    user_id: str = payload['user_id']
    command: str = payload['command']
    text: str = payload.get('text', '')
    response: dict[str, str] = process_command(command, text, user_id)
    return response
```

Now it's explicit. `payload` is a dict, `response` is a dict with string keys and values, and `user_id` is a string. MyPy verifies all of it.

Even better with attrs:
```python
from attrs import define

@define
class SlashCommandPayload:
    user_id: str
    command: str
    text: str = ''

def handle_slash_command(payload: SlashCommandPayload) -> dict[str, str]:
    response = process_command(payload.command, payload.text, payload.user_id)
    return response
```

Now the payload structure is a first-class type. Impossible to mess up.

---

## What I Learned

Type checking isn't about being pedantic. It's about reducing the mental overhead of working in a large codebase. When I can look at a function signature and immediately understand what it does without reading the implementation, that's a huge win.

It's also about catching mistakes before they matter. Finding a type error in CI is way better than finding it in a production error log.

At DailyBot, MyPy became a standard part of our workflow. New engineers loved it because it made onboarding easier — they could explore the codebase without constantly asking "what type is this?" Experienced engineers loved it because it reduced the number of silly bugs that slipped through code review.

If you're working on a Python project of any significant size, I'd recommend giving MyPy a shot. Start small, add types incrementally, and see how it changes your development experience.

Let's keep building.

---

## Resources

- [Slides from the talk](https://slides.com/xergioalex/introduction-to-mypy)
- [MyPy documentation](https://mypy-lang.org/)
- [attrs — Classes Without Boilerplate](https://pypi.org/project/attrs/)
- [Pydantic — Data Validation](https://docs.pydantic.dev/)
- [Python Type Hints (PEP 484)](https://peps.python.org/pep-0484/)
