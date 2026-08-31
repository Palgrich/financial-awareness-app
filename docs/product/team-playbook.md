# Team Playbook (TPM / Dev / Design / Marketing)

## 1) Sprint Cycle (2 недели)

### Cadence
- **Day 1 (Planning, 60 мин):** цель спринта, scope, capacity, риски.
- **Day 3–4 (Refinement, 30–45 мин):** подготовка задач следующей волны.
- **Day 5/10 (Async mid-check):** статус, блокеры, корректировки.
- **Day 10 (Demo + Retro, 60 мин):** результат, выводы, улучшения процесса.

### Ceremonies & Owners
- Planning — TPM (facilitator), все роли участвуют.
- Daily async updates — каждый owner.
- Demo — Dev/Design/Marketing показывают артефакты.
- Retro — TPM собирает action items и owners.

## 2) Definition of Done (DoD)
Задача считается Done, если:
1. Выполнены acceptance criteria.
2. Есть проверяемый артефакт (PR, макет, кампания, отчёт и т.д.).
3. Проведён review релевантной ролью (Dev/Design/Marketing/TPM).
4. Обновлены связанные документы (backlog/status/report при необходимости).
5. Известно влияние на метрики или зафиксирован способ его измерить.
6. Нет критических открытых блокеров для релиза.

## 3) Dev Task Format (Ready Card)

### Обязательная структура постановки
- **Title:** коротко и предметно.
- **Context:** зачем это нужно (user/business problem).
- **Scope:** что входит / не входит.
- **Acceptance Criteria:** 3–7 проверяемых пунктов.
- **Tech Notes:** ограничения, зависимости, API/данные.
- **Test Plan:** unit/integration/manual checks.
- **Definition of Done link:** ссылка на DoD.
- **Owner / ETA / Priority / Risks.**

### Шаблон
```md
Title:
Context:
Scope in:
Scope out:
Acceptance Criteria:
1)
2)
3)
Tech Notes:
Test Plan:
Owner:
ETA:
Priority: P0/P1/P2
Risks:
```

### AI-assisted execution (Claude CLI / Codex CLI)
Перед стартом Dev может использовать CLI для ускорения:

```bash
# Вариант 1: Claude CLI
claude
# далее: вставить Ready Card + попросить план реализации и список файлов

# Вариант 2: Codex CLI
codex
# далее: вставить Ready Card + попросить diff/patch и тест-план
```

Минимальный prompt в CLI:
- "Проанализируй задачу, предложи пошаговый план, затем подготовь изменения по файлам и проверочный чеклист. Не выходи за Scope."

## 4) Weekly Reporting Format
Каждая роль обновляет статус по шаблону:
- **Planned:** что обещали на неделю/спринт.
- **Done:** что завершено и где артефакт.
- **Risks:** блокеры, вероятности, impact.
- **Next:** 1–3 фокуса на следующую неделю.
- **Need help:** какие решения/ресурсы нужны от команды.

TPM собирает общий отчёт в `docs/reports/weekly.md` и фиксирует решения в `docs/product/decisions.md`.

## 5) Working Agreements
- Один источник правды по приоритетам: `docs/product/backlog.md`.
- Любая новая инициатива проходит через triage (TPM + owner).
- Изменения scope внутри спринта — только через explicit trade-off.
- "Сделано" без артефакта = не сделано.
