---
description: create UI Component /component/ui/
arguement-hint: Component Name | Component summary
---

## Context
- Parse $ARGUMENTS to the following value:
- [name]: Compoent name from $ARGUMENTS, converted to PascalCase
- [summary]: Component summary from $ARGUMENTS

## Task
Create a reusable component according to [name] and [summary] provided following this guidelines:

- Create component file  in `@component/ui/[name]/[name].tsx`.
- Use functional component with name [name]
- Reference [summary] when making component

Make a single UI component following these guidelines:

- Create a Component file in `@src/component/ui`
- Use functional Component following the name conversion PascalCase

## Variants

- Add the following variants for the component using the colours from the theme variants in the `@src/app/globals.css` file:
- if the variants are not there create them:

1. Primary
2. success
3. secondary
4. danger
5. warning

- support common patterns like disabled states and sizes where appropriate (sm, md, lg, defaulting to md where no preference is passed)

## Testing

- make a test file for component basic use cases
- use @src/component/ui/Button/Button.test.tsx as a reference to make test file for the component

- Run test and iterate until they all pass


## Previews

- Add the component to the `@src/app/preview/page.tsx` so that it can be viewed in the browser
- Use multiple variant

- Do not add component to any other page