# i18n naming rules

Translation keys in this project follow a **screen → section → key** structure so the same JSON works on web, iOS, and Android. Use these rules when adding or changing keys.

## Convention: `<screen>.<section>.<key>`

| Level   | Meaning              | Examples |
|--------|----------------------|----------|
| **Screen**  | Namespace (file)     | `home`, `journey`, `job`, `common`, `layout` |
| **Section** | Area or block on screen | `intro`, `hero`, `ctas`, `footer`, `form` |
| **Key**     | Specific string      | `title`, `description`, `deploy`, `primaryButton` |

Resolved path examples: `home.intro.title`, `journey.hero.cta`, `common.language`.

- **Screen** = one JSON namespace file (e.g. `home.json` → screen `home`).
- **Section** = logical grouping on that screen (hero, intro, form, footer).
- **Key** = the individual string (title, description, button label, placeholder).

Keep **2–3 levels** (screen.section.key). Use a fourth level only when a screen has many subsections (e.g. `job.form.salary.label`). Avoid deeper nesting.

## Character and casing rules

- **Characters**: Use only **letters**, **numbers**, **underscore**, and **dot** (for path segments). No spaces, hyphens, or special characters in key names.
- **Casing**: Use one style consistently. This repo uses **camelCase** for keys (e.g. `submitButton`, `card1Title`, `placeholderEmail`). If you prefer **snake_case** (e.g. `submit_button`), use it everywhere.
- **Stable keys**: Name keys by **role or purpose**, not by the exact English copy, so keys stay valid when copy changes (e.g. `primaryButton` not `deployNow`).

## Section naming

Use clear, semantic names for sections so the same concept reuses the same name across screens:

- `hero`, `intro`, `ctas`, `form`, `footer`, `nav`, `about`, `stats`, `values`, `roles`, `perks`, `team`

Avoid vague names like `block1` or `sectionA` unless the content is generic.

## Examples from this repo

```json
{
  "intro": {
    "title": "To get started, edit the page.tsx file.",
    "description": "Looking for a starting point..."
  },
  "ctas": {
    "deploy": "Deploy Now",
    "documentation": "Documentation"
  }
}
```

→ Keys: `home.intro.title`, `home.intro.description`, `home.ctas.deploy`, `home.ctas.documentation`

```json
{
  "hero": {
    "title": "Join our journey",
    "subtitle": "Working with us is more than just a job.",
    "cta": "See our open roles"
  }
}
```

→ Keys: `journey.hero.title`, `journey.hero.subtitle`, `journey.hero.cta`

## Interpolation

Values may contain `{{name}}` placeholders. Use the same placeholder name in the key path and in code when passing variables (e.g. `"Hello {{name}}"` with `{ name: "World" }`). See [i18n.md](i18n.md) and [mobile-i18n.md](mobile-i18n.md) for usage.

## Exporting to native resources (optional)

If you later generate **Android `strings.xml`** or **iOS `.strings`** from this JSON:

- **Android**: Resource names must be `[a-z0-9_.]`. Flatten paths to something like `journey_hero_title` (lowercase, underscores).
- **iOS**: No strict format; dot-separated or flattened keys both work.

The **screen.section.key** convention stays the same; only the export format (flat key name) would change.

## Summary

| Rule | Do | Avoid |
|------|----|--------|
| Structure | `screen.section.key` (2–3 levels) | Deeper nesting, flat keys only |
| Characters | Letters, numbers, `_`, `.` | Spaces, hyphens, special chars |
| Casing | camelCase (or snake_case) consistently | Mixing styles |
| Key names | Role/purpose (`primaryButton`, `title`) | Copy-based (`deployNow`) |
| Sections | Semantic (`hero`, `ctas`, `footer`) | Generic (`block1`, `sectionA`) |

These rules keep translation JSON portable and predictable across web, iOS, and Android.
