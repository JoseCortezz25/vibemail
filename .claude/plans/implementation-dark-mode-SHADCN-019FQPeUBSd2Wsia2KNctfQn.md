# Dark Mode Implementation Plan (shadcn/ui Pattern)

**Session ID**: 019FQPeUBSd2Wsia2KNctfQn
**Created**: 2025-12-09
**Updated**: 2025-12-09 (Corrected to follow shadcn/ui official pattern)
**Status**: 🟢 Ready for Implementation

---

## Overview

Implementar dark mode siguiendo el **patrón oficial de shadcn/ui** usando `next-themes` en lugar de una solución custom. Este es el enfoque recomendado y documentado por shadcn/ui.

**Diferencias clave con plan anterior:**
- ✅ Usa `next-themes` (estándar de shadcn/ui) en lugar de Zustand custom
- ✅ Más simple: ~50 líneas en lugar de ~200
- ✅ Mantenido por la comunidad, no código custom
- ✅ Patrón probado y documentado oficialmente
- ⚠️ Solo necesitamos definir los colores de marca dark mode (que ya estaba planeado)

---

## Planes de Referencia

1. **UX/UI Design** (SIGUE VIGENTE): `.claude/plans/ux-dark-mode-plan-019FQPeUBSd2Wsia2KNctfQn.md`
   - Colores dark mode ✅
   - Accesibilidad ✅
   - Toggle design (se adapta a next-themes)

2. **Domain Architecture** (REEMPLAZADO): No necesitamos Zustand custom store

---

## Fase 1: Instalación de next-themes

### Comando:

```bash
npm install next-themes
```

**Por qué next-themes:**
- Es el estándar oficial de shadcn/ui
- Maneja SSR, hidratación, y FOUC automáticamente
- Solo 3.5KB minified+gzipped
- API simple: `useTheme()` hook
- Mantenido activamente por la comunidad

---

## Fase 2: Definición de Colores Brand (globals.css)

### Archivo: `src/app/globals.css`

**Agregar dentro del bloque `.dark { }`** (línea ~175):

```css
.dark {
  /* BRAND COLORS - Custom para el proyecto */
  --color-brand-red: #ff5757;
  --color-brand-blue: #7b8ae8;
  --color-brand-blue-dark: #4a5fc9;
  
  /* ESCALA DE NEGROS - Inversión semántica */
  --color-black-50: #0d0d0d;
  --color-black-100: #131313;
  --color-black-200: #191919;
  --color-black-300: #202020;
  --color-black-400: #2e2e2e;
  --color-black-500: #3b3b3b;
  --color-black-600: #545454;
  --color-black-700: #6e6e6e;
  --color-black-800: #8c8c8c;
  --color-black-900: #dcdcdc;
  --color-black-950: #f5f5f5;
  
  /* Los colores de shadcn ya están definidos (líneas 176-231) */
}
```

**Nota:** Los colores de shadcn/ui (background, foreground, primary, etc.) YA están definidos en el archivo. Solo agregamos los colores custom del proyecto.

---

## Fase 3: Theme Provider (Patrón shadcn/ui)

### Archivo: `src/components/providers/theme-provider.tsx` (CREAR)

**Código oficial de shadcn/ui:**

```typescript
'use client';

import * as React from 'react';
import { ThemeProvider as NextThemesProvider } from 'next-themes';
import { type ThemeProviderProps } from 'next-themes/dist/types';

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}
```

**Características:**
- ✅ Wrapper simple del ThemeProvider de next-themes
- ✅ Permite props personalizadas si es necesario
- ✅ Client component (usa 'use client')
- ✅ ~10 líneas de código

---

## Fase 4: Layout Integration

### Archivo: `src/app/layout.tsx` (MODIFICAR)

**Cambios necesarios:**

1. **Import del ThemeProvider:**

```typescript
import { ThemeProvider } from '@/components/providers/theme-provider';
```

2. **Agregar `suppressHydrationWarning` al tag `<html>`:**

```tsx
<html lang="en" suppressHydrationWarning>
```

3. **Envolver children en ThemeProvider:**

```tsx
<body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
  <ThemeProvider
    attribute="class"
    defaultTheme="system"
    enableSystem
    disableTransitionOnChange
  >
    {children}
  </ThemeProvider>
  <Toaster richColors />
</body>
```

**Props del ThemeProvider:**
- `attribute="class"`: Aplica clase `.dark` al `<html>` (requerido por shadcn)
- `defaultTheme="system"`: Default sigue preferencia del OS
- `enableSystem`: Habilita detección de `prefers-color-scheme`
- `disableTransitionOnChange`: Sin animación (accesibilidad)

**Por qué suppressHydrationWarning:**
- next-themes aplica la clase dark client-side antes de hidratación
- Evita warnings de React por mismatch server/client en `<html>`
- Es seguro y esperado con next-themes

**FOUC Prevention:**
- ✅ next-themes lo maneja automáticamente via script inline
- ✅ No necesitamos código custom

---

## Fase 5: Mode Toggle Component

### Archivo: `src/components/molecules/mode-toggle.tsx` (CREAR)

**Opción 1: Dropdown (Recomendado por shadcn):**

```typescript
'use client';

import * as React from 'react';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';

export function ModeToggle() {
  const { setTheme } = useTheme();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon">
          <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => setTheme('light')}>
          Light
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme('dark')}>
          Dark
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme('system')}>
          System
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
```

**Opción 2: Tabs en Settings Panel (Más integrado):**

Para integrarlo en el settings panel existente:

```typescript
// Dentro de settings-panel.tsx
'use client';

import { useTheme } from 'next-themes';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useEffect, useState } from 'react';

// Dentro del componente:
const { theme, setTheme } = useTheme();
const [mounted, setMounted] = useState(false);

// Evitar hydration mismatch
useEffect(() => {
  setMounted(true);
}, []);

if (!mounted) {
  return null; // O un skeleton
}

// En el JSX:
<div className="flex flex-col gap-2">
  <Label>Theme Preference</Label>
  <Tabs value={theme} onValueChange={(value) => setTheme(value)}>
    <TabsList className="grid w-full grid-cols-3">
      <TabsTrigger value="light">Light</TabsTrigger>
      <TabsTrigger value="dark">Dark</TabsTrigger>
      <TabsTrigger value="system">System</TabsTrigger>
    </TabsList>
  </Tabs>
  <p className="text-muted-foreground text-xs">
    {theme === 'system' && 'Follows your device settings'}
  </p>
</div>
```

**Nota sobre hydration:**
- `useTheme()` retorna `undefined` en servidor
- Necesitamos `mounted` flag para evitar mismatch
- Alternativa: usar `<Skeleton>` mientras carga

---

## Fase 6: Text Map (Opcional - Solo si usamos Settings Panel)

### Archivo: `src/constants/theme-toggle.text-map.ts` (CREAR)

```typescript
export const themeToggleTextMap = {
  sectionLabel: 'Theme Preference',
  sectionDescription: 'Choose how the application looks',
  
  themeLightLabel: 'Light',
  themeDarkLabel: 'Dark',
  themeSystemLabel: 'System',
  
  themeSystemHelper: 'Follows your device settings',
  
  // ARIA labels
  themeToggleAriaLabel: 'Toggle theme',
  themeLightAriaLabel: 'Switch to light mode',
  themeDarkAriaLabel: 'Switch to dark mode',
  themeSystemAriaLabel: 'Use system theme'
} as const;

export type ThemeToggleTextMap = typeof themeToggleTextMap;
```

---

## Fase 7: Integración en Settings Panel

### Archivo: `src/components/organisms/settings-panel.tsx` (MODIFICAR)

**Imports:**

```typescript
import { useTheme } from 'next-themes';
import { themeToggleTextMap } from '@/constants/theme-toggle.text-map';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useEffect, useState } from 'react';
```

**Agregar después de la sección de API Key:**

```tsx
const { theme, setTheme } = useTheme();
const [mounted, setMounted] = useState(false);

useEffect(() => {
  setMounted(true);
}, []);

// En el JSX, después de API Key section:
<Separator className="my-4" />

{/* Theme Selection */}
{mounted && (
  <div className="flex flex-col gap-2">
    <Label>{themeToggleTextMap.sectionLabel}</Label>
    <Tabs value={theme} onValueChange={(value) => setTheme(value)}>
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger 
          value="light"
          aria-label={themeToggleTextMap.themeLightAriaLabel}
        >
          {themeToggleTextMap.themeLightLabel}
        </TabsTrigger>
        <TabsTrigger 
          value="dark"
          aria-label={themeToggleTextMap.themeDarkAriaLabel}
        >
          {themeToggleTextMap.themeDarkLabel}
        </TabsTrigger>
        <TabsTrigger 
          value="system"
          aria-label={themeToggleTextMap.themeSystemAriaLabel}
        >
          {themeToggleTextMap.themeSystemLabel}
        </TabsTrigger>
      </TabsList>
    </Tabs>
    {theme === 'system' && (
      <p className="text-muted-foreground text-xs">
        {themeToggleTextMap.themeSystemHelper}
      </p>
    )}
  </div>
)}
```

---

## Orden de Implementación (Actualizado)

### Paso 1: Setup
1. ✅ `npm install next-themes`
2. ✅ Crear `theme-provider.tsx`
3. ✅ Modificar `layout.tsx` (provider + suppressHydrationWarning)

### Paso 2: Colores
4. ✅ Agregar brand colors dark mode en `globals.css`

### Paso 3: UI
5. ✅ Crear `theme-toggle.text-map.ts`
6. ✅ Actualizar `settings-panel.tsx` con theme toggle

### Paso 4: Testing
7. ✅ Probar theme toggle
8. ✅ Verificar no hay FOUC
9. ✅ Probar "System" mode
10. ✅ Verificar colores en dark mode

---

## Comparación: Custom vs shadcn/ui Pattern

| Aspecto | Plan Custom (Anterior) | shadcn/ui Pattern (Correcto) |
|---------|------------------------|------------------------------|
| **Dependencia** | Zustand (~10KB) | next-themes (~3.5KB) |
| **Código nuevo** | ~200 líneas | ~50 líneas |
| **FOUC Prevention** | Script custom | Built-in |
| **Mantenimiento** | Custom code | Community package |
| **Documentación** | Interna | Oficial shadcn |
| **SSR Handling** | Custom logic | Built-in |
| **Complejidad** | Alta | Baja |
| **Estándar** | ❌ Custom | ✅ shadcn oficial |

**Ganador:** shadcn/ui pattern ✅

---

## Resumen de Archivos

### Crear (3 archivos):
- `src/components/providers/theme-provider.tsx` (~10 líneas)
- `src/constants/theme-toggle.text-map.ts` (~20 líneas)
- Opcional: `src/components/molecules/mode-toggle.tsx` (~40 líneas)

### Modificar (2 archivos):
- `src/app/globals.css` (agregar ~15 líneas en `.dark {}`)
- `src/app/layout.tsx` (agregar provider)
- `src/components/organisms/settings-panel.tsx` (theme toggle section)

### Instalar:
- `next-themes` (npm package)

**Total: ~50-80 líneas de código nuevo** (vs ~200 del plan custom)

---

## Checklist de Verificación

**Setup:**
- [ ] next-themes instalado
- [ ] ThemeProvider creado y configurado
- [ ] Layout actualizado con suppressHydrationWarning

**Funcionalidad:**
- [ ] Toggle entre Light/Dark/System funciona
- [ ] Tema persiste (next-themes usa localStorage automáticamente)
- [ ] No hay FOUC al recargar página
- [ ] "System" detecta preferencia del OS
- [ ] Cambios en OS actualizan el tema

**Colores:**
- [ ] Brand colors definidos en dark mode
- [ ] Black scale definida (si se usa inversión)
- [ ] Todos los colores visibles y con buen contraste

**Accesibilidad:**
- [ ] Contraste cumple WCAG AA
- [ ] ARIA labels en toggle
- [ ] Navegación por teclado
- [ ] No hydration errors en consola

---

## Referencias

- **shadcn/ui Dark Mode Docs**: https://ui.shadcn.com/docs/dark-mode/next
- **next-themes GitHub**: https://github.com/pacocoursey/next-themes
- **UX Plan (colores)**: `.claude/plans/ux-dark-mode-plan-019FQPeUBSd2Wsia2KNctfQn.md`

---

**Plan Status**: 🟢 Ready for Implementation (Corrected)
**Estimated Effort**: 1-2 horas (mucho más simple que plan anterior)
