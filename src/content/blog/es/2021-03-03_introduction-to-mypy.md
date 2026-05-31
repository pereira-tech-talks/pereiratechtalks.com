---
title: "Introducción a MyPy"
description: "Por qué adoptamos type checking en DailyBot — del caos de Python sin tipos a detectar bugs antes de runtime, reducir carga cognitiva y shipear con confianza."
pubDate: "2021-03-03"
heroImage: "/images/blog/posts/introduction-to-mypy/hero.webp"
heroLayout: "side-by-side"
tags: ["talks", "tech", "python"]
keywords: ["introducción a MyPy", "type checking en Python", "tipos estáticos en Python con MyPy", "por qué usar type hints en Python", "detectar bugs en Python con tipos", "MyPy para equipos de desarrollo", "Python tipado vs no tipado"]
---

Di una charla interna en DailyBot a principios de 2021 sobre **MyPy** y type checking en Python. En ese momento, nuestro codebase de Python estaba creciendo rápido — nuevas integraciones, nuevas features, nuevos ingenieros uniéndose al equipo — y empezábamos a sentir el dolor de trabajar sin tipos.

Las firmas de funciones eran ambiguas. Los valores de retorno eran un misterio. Pasabas un `dict` cuando la función esperaba una lista, y no te enterabas hasta runtime. Los tests detectaban algo de esto, pero no todo. Y honestamente, escribir unit tests solo para verificar que una función devuelve un string se sentía como pérdida de tiempo.

MyPy cambió eso. No de la noche a la mañana, pero gradualmente. Empezamos a agregar type hints a las rutas críticas, y el feedback fue inmediato. Bugs detectados en tiempo de desarrollo. Contratos de funciones más claros. Menos tiempo cavando en el código para entender qué hace realmente una función.

Esta charla fue sobre compartir lo que aprendimos y convencer al equipo de que los tipos valían la pena.

---

## Por qué necesitábamos type checking en DailyBot

DailyBot se integra con Slack, Microsoft Teams, Google Chat y un montón de otras plataformas. Cada integración tiene sus propias estructuras de datos, payloads de webhooks, formatos de respuesta de API. Cuando estás malabarando tanta data externa, es muy fácil que las cosas se rompan de formas sutiles.

Esto era con lo que lidiábamos:

**Firmas de función ambiguas.** Mirabas una función como esta:

```python
def process_message(data, user, channel):
    # ¿Qué son estos tipos? ¿dict? ¿str? ¿object? quién sabe.
    pass
```

Para entender qué es `data`, tenías que leer el cuerpo de la función, rastrear hasta el caller, tal vez revisar los logs. Era lento y propenso a errores.

**Errores de tipo en runtime.** Pasabas un `None` donde se esperaba un `str`, o una `list` donde se necesitaba un `dict`. El código crasheaba en producción. Nada ideal.

**Carga cognitiva.** Cada vez que tocabas una función, tenías que construir un modelo mental de qué tipos esperaba y retornaba. Eso es agotador cuando trabajas en un codebase grande.

**Unit tests triviales.** Teníamos tests que literalmente solo verificaban: "¿esta función retorna un dict?" Esos tests aportaban valor, pero se sentían desperdiciados. El sistema de tipos debería forzar eso, no la suite de tests.

---

## Qué nos dio MyPy

MyPy es un type checker estático para Python. Agregas type hints a tu código, corres MyPy, y te dice sobre desajustes de tipos, valores de retorno faltantes, llamadas de función incorrectas — todo antes de que corras el código.

Esto cambió después de que empezamos a usarlo:

### 1. Menos Carga Cognitiva

Cuando las firmas de funciones están claramente tipadas, no tienes que adivinar. Solo lees la firma y sabes exactamente qué entra y qué sale.

Antes:
```python
def fetch_user_data(user_id, include_metadata):
    # ???
    pass
```

Después:
```python
def fetch_user_data(user_id: str, include_metadata: bool) -> dict[str, Any]:
    # Clarísimo.
    pass
```

La segunda versión es auto-documentada. Sin ambigüedad.

### 2. Detectar Errores Temprano

El type checking saca a la superficie bugs durante desarrollo, no en producción.

Ejemplo: teníamos una función que se suponía retornaba una lista de IDs de usuario (`list[str]`), pero en un edge case retornaba `None`. Sin MyPy, ese código se shipeaba y crasheaba cuando alguien iteraba sobre él. Con MyPy, fallaba el type check inmediatamente:

```
error: Incompatible return value type (got "None", expected "list[str]")
```

Arreglado antes de que llegara a staging.

### 3. Validación de Data con attrs

Empezamos a usar **[attrs](https://pypi.org/project/attrs/)** (ahora evolucionado en `attrs` + `cattrs`) para definir data classes tipadas con validación en runtime. Esto funcionó hermosamente con MyPy.

Ejemplo:
```python
from attrs import define

@define
class SlackMessage:
    user_id: str
    channel_id: str
    text: str
    timestamp: float
```

Ahora cada payload de mensaje de Slack se valida en runtime *y* se chequea de tipos en tiempo de desarrollo. Si alguien intenta pasar un `int` como `user_id`, MyPy lo detecta. Si la API de Slack envía un payload mal formado, attrs lo detecta.

(También experimentamos con **[Pydantic](https://docs.pydantic.dev/)**, que es otra gran opción para validación de data + tipos.)

### 4. Eliminar Tests Triviales

Antes de MyPy, teníamos tests como este:

```python
def test_process_message_returns_dict():
    result = process_message(...)
    assert isinstance(result, dict)
```

Después de agregar type hints, ese test se volvió redundante. MyPy fuerza el tipo de retorno. Eliminamos docenas de estos tests triviales y enfocamos nuestra test suite en comportamiento, no en tipos.

---

## ¿Qué Tipos Puedes Usar?

El sistema de tipos de Python es sorprendentemente rico una vez que te metes en él.

**Tipos básicos:**
```python
int, str, float, bool, dict, list, set, tuple
```

**Tipado avanzado (Python 3.5+):**
```python
from typing import Any, Callable, Union, Optional, TypeVar, Generic
from typing import Dict, List, Tuple, Set, MutableMapping, NamedTuple
```

**Genéricos:**
```python
def get_first_item(items: list[str]) -> str:
    return items[0]
```

**Optional (nullable):**
```python
def find_user(user_id: str) -> Optional[User]:
    # Puede retornar un User o None
    pass
```

**Union (múltiples tipos posibles):**
```python
def parse_id(value: Union[str, int]) -> int:
    return int(value)
```

**Callable (tipos de función):**
```python
def apply_transform(data: dict, transform: Callable[[dict], dict]) -> dict:
    return transform(data)
```

Entre más usábamos estos, más claro se volvía nuestro código.

---

## Integrando MyPy en nuestro flujo

Agregar tipos a un codebase existente es un proceso. No puedes simplemente activar un switch. Así fue como lo lanzamos:

### Paso 1: Instalar MyPy

```bash
pip install mypy
```

### Paso 2: Correr MyPy en un Módulo Pequeño

Empieza pequeño. Elige un módulo, agrega type hints, corre MyPy, arregla errores. No intentes tipar el codebase completo de una.

```bash
mypy src/integrations/slack.py
```

### Paso 3: Configurar MyPy

Creamos una config `mypy.ini` para controlar qué tan estricto es. Inicialmente lo pusimos leniente (permitir `Any`, ignorar imports faltantes) y gradualmente lo ajustamos.

```ini
[mypy]
python_version = 3.9
warn_return_any = True
warn_unused_configs = True
disallow_untyped_defs = False  # Empezar leniente, ajustar después
```

### Paso 4: Agregar MyPy a CI

Una vez que teníamos algunos módulos tipados, agregamos MyPy a nuestro pipeline de integración continua. Cada pull request corre MyPy. Si los tipos no chequean, el build falla.

```yaml
# En config de CI
- name: Run MyPy
  run: mypy src/
```

### Paso 5: Adopción Incremental

No forzamos a todos a tipar todo inmediatamente. Establecimos una política: **código nuevo debe estar tipado**. Código existente se tipa cuando lo tocas. Con el tiempo, el coverage creció naturalmente.

---

## Ejemplo del Mundo Real: Integración con Slack

Esta es una versión simplificada de cómo tipamos uno de nuestros handlers de mensajes de Slack.

**Antes (sin tipos):**
```python
def handle_slash_command(payload):
    user_id = payload['user_id']
    command = payload['command']
    text = payload.get('text', '')
    response = process_command(command, text, user_id)
    return response
```

Muchas preguntas: ¿Qué hay en `payload`? ¿Qué retorna `process_command`? ¿Puede `user_id` ser None?

**Después (tipado):**
```python
from typing import Any

def handle_slash_command(payload: dict[str, Any]) -> dict[str, str]:
    user_id: str = payload['user_id']
    command: str = payload['command']
    text: str = payload.get('text', '')
    response: dict[str, str] = process_command(command, text, user_id)
    return response
```

Ahora es explícito. `payload` es un dict, `response` es un dict con keys y valores string, y `user_id` es un string. MyPy verifica todo.

Aún mejor con attrs:
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

Ahora la estructura del payload es un tipo de primera clase. Imposible equivocarse.

---

## Lo que aprendí

El type checking no se trata de ser pedante. Se trata de reducir la sobrecarga mental de trabajar en un codebase grande. Cuando puedo mirar una firma de función e inmediatamente entender qué hace sin leer la implementación, eso es una gran ganancia.

También se trata de detectar errores antes de que importen. Encontrar un error de tipo en CI es mucho mejor que encontrarlo en un log de error de producción.

En DailyBot, MyPy se volvió parte estándar de nuestro flujo. A los ingenieros nuevos les encantó porque hizo el onboarding más fácil — podían explorar el codebase sin estar constantemente preguntando "¿qué tipo es esto?" A los ingenieros experimentados les encantó porque redujo el número de bugs tontos que se escapaban por code review.

Si estás trabajando en un proyecto Python de tamaño significativo, recomendaría darle una oportunidad a MyPy. Empieza pequeño, agrega tipos incrementalmente y ve cómo cambia tu experiencia de desarrollo.

A seguir construyendo.

---

## Recursos

- [Slides de la charla](https://slides.com/xergioalex/introduction-to-mypy)
- [Documentación de MyPy](https://mypy-lang.org/)
- [attrs — Classes Without Boilerplate](https://pypi.org/project/attrs/)
- [Pydantic — Data Validation](https://docs.pydantic.dev/)
- [Python Type Hints (PEP 484)](https://peps.python.org/pep-0484/)
