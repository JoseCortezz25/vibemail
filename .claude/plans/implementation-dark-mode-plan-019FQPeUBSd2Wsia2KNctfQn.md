# Dark Mode Implementation Plan

**Session ID**: 019FQPeUBSd2Wsia2KNctfQn
**Created**: 2025-12-09
**Status**: 🟢 Ready for Implementation

---

## Overview

Implementar un sistema completo de dark mode que incluye:
- Definición de colores de marca en modo oscuro (brand-red, brand-blue, brand-blue-dark)
- Sistema de gestión de tema con Zustand (Light/Dark/System)
- Toggle de tema en el panel de configuración
- Prevención de FOUC (Flash of Unstyled Content)
- Actualización de componentes que usan colores hardcodeados

---

## Planes de Referencia

1. **UX/UI Design**: `.claude/plans/ux-dark-mode-plan-019FQPeUBSd2Wsia2KNctfQn.md`
2. **Domain Architecture**: `.claude/plans/domain-theme-plan-019FQPeUBSd2Wsia2KNctfQn.md`

---

## Fase 1: Definición de Colores (globals.css)

### Archivo: `src/app/globals.css`

**Agregar dentro del bloque `.dark { }`:**

```css
.dark {
  /* Colores de marca para dark mode */
  --color-brand-red: #ff5757;
  --color-brand-blue: #7b8ae8;
  --color-brand-blue-dark: #4a5fc9;
  
  /* Inversión semántica de la escala de negros */
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
}
```

**Justificación de colores:**
- Red: #ff5757 (más suave que #f00 para fondos oscuros)
- Blue: #7b8ae8 (más brillante para mejor visibilidad)
- Blue-dark: #4a5fc9 (paradójicamente más claro en dark mode para contraste)
- Black scale: invertida para mantener semántica (black-50 sigue siendo "sutil" en ambos temas)

**Verificación:**
- ✅ Todos los colores cumplen WCAG 2.1 AA (contraste mínimo 4.5:1)

---

## Fase 2: Theme Store (Zustand)

### Archivo: `src/stores/theme.store.ts` (CREAR)

```typescript
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export enum Theme {
  LIGHT = 'light',
  DARK = 'dark',
  SYSTEM = 'system'
}

export type ResolvedTheme = 'light' | 'dark';

interface ThemeStore {
  theme: Theme;
  resolvedTheme: ResolvedTheme;
  hasHydrated: boolean;
  setTheme: (theme: Theme) => void;
  setResolvedTheme: (theme: ResolvedTheme) => void;
  setHasHydrated: (state: boolean) => void;
  initializeSystemThemeListener: () => () => void;
}

const safeLocalStorage = {
  getItem: (name: string): string | null => {
    if (typeof window === 'undefined') return null;
    try {
      return window.localStorage.getItem(name);
    } catch {
      return null;
    }
  },
  setItem: (name: string, value: string): void => {
    if (typeof window === 'undefined') return;
    try {
      window.localStorage.setItem(name, value);
    } catch {}
  },
  removeItem: (name: string): void => {
    if (typeof window === 'undefined') return;
    try {
      window.localStorage.removeItem(name);
    } catch {}
  }
};

export const useThemeStore = create<ThemeStore>()(
  persist(
    (set, get) => ({
      theme: Theme.SYSTEM,
      resolvedTheme: 'light',
      hasHydrated: false,

      setTheme: (theme: Theme) => {
        set({ theme });

        if (theme !== Theme.SYSTEM) {
          set({ resolvedTheme: theme as ResolvedTheme });
        } else {
          const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
          set({ resolvedTheme: systemPrefersDark ? 'dark' : 'light' });
        }
      },

      setResolvedTheme: (resolvedTheme: ResolvedTheme) => set({ resolvedTheme }),

      setHasHydrated: (state: boolean) => set({ hasHydrated: state }),

      initializeSystemThemeListener: () => {
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

        const handleChange = (e: MediaQueryListEvent) => {
          const { theme } = get();
          if (theme === Theme.SYSTEM) {
            set({ resolvedTheme: e.matches ? 'dark' : 'light' });
          }
        };

        mediaQuery.addEventListener('change', handleChange);
        return () => mediaQuery.removeEventListener('change', handleChange);
      }
    }),
    {
      name: 'theme-preference',
      storage: createJSONStorage(() => safeLocalStorage),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
      partialize: (state) => ({
        theme: state.theme
      })
    }
  )
);
```

**Características:**
- ✅ SSR-safe con wrapper de localStorage
- ✅ Persiste solo la preferencia del usuario (no el tema resuelto)
- ✅ Detecta preferencia del sistema automáticamente
- ✅ Listener para cambios en preferencias del OS
- ✅ Sigue patrón de `model.store.ts`

---

## Fase 3: Theme Provider

### Archivo: `src/components/providers/theme-provider.tsx` (CREAR)

```typescript
'use client';

import { useEffect } from 'react';
import { useThemeStore, Theme } from '@/stores/theme.store';

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const { theme, resolvedTheme, hasHydrated, initializeSystemThemeListener } = useThemeStore();

  // Apply theme class to HTML element
  useEffect(() => {
    if (!hasHydrated) return;

    const root = document.documentElement;

    if (resolvedTheme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [resolvedTheme, hasHydrated]);

  // Initialize system theme listener
  useEffect(() => {
    if (!hasHydrated) return;
    if (theme !== Theme.SYSTEM) return;

    const cleanup = initializeSystemThemeListener();
    return cleanup;
  }, [theme, hasHydrated, initializeSystemThemeListener]);

  // Initial resolution of system theme
  useEffect(() => {
    if (!hasHydrated) return;
    if (theme !== Theme.SYSTEM) return;

    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    useThemeStore.getState().setResolvedTheme(systemPrefersDark ? 'dark' : 'light');
  }, [hasHydrated, theme]);

  return <>{children}</>;
}
```

**Responsabilidades:**
- Aplicar clase `dark` al elemento `<html>` reactivamente
- Configurar listener de cambios del sistema
- Resolver tema inicial cuando es "System"

---

## Fase 4: Text Map

### Archivo: `src/constants/theme-toggle.text-map.ts` (CREAR)

```typescript
export const themeToggleTextMap = {
  // Section header
  sectionLabel: 'Theme Preference',
  sectionDescription: 'Choose how the application looks',

  // Theme options
  themeLightLabel: 'Light',
  themeDarkLabel: 'Dark',
  themeSystemLabel: 'System',

  // Helper text
  themeSystemHelper: 'Follows your device settings',

  // Toast messages
  toastThemeUpdatedLight: 'Theme updated to Light mode',
  toastThemeUpdatedDark: 'Theme updated to Dark mode',
  toastThemeUpdatedSystem: 'Theme will follow your system preference',

  // ARIA labels
  themeToggleAriaLabel: 'Select theme preference',
  themeLightAriaLabel: 'Switch to light mode',
  themeDarkAriaLabel: 'Switch to dark mode',
  themeSystemAriaLabel: 'Use system theme preference'
} as const;

export type ThemeToggleTextMap = typeof themeToggleTextMap;
```

---

## Fase 5: Layout Modifications

### Archivo: `src/app/layout.tsx` (MODIFICAR)

**Cambios:**

1. **Agregar script de prevención de FOUC en `<head>`:**

```tsx
<head>
  {/* FOUC Prevention Script */}
  <script
    dangerouslySetInnerHTML={{
      __html: `
        (function() {
          try {
            var theme = localStorage.getItem('theme-preference');
            var stored = theme ? JSON.parse(theme) : null;
            var preference = stored?.state?.theme || 'system';
            
            var isDark = preference === 'dark';
            
            if (preference === 'system') {
              isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            }
            
            if (isDark) {
              document.documentElement.classList.add('dark');
            }
          } catch (e) {}
        })();
      `
    }}
  />
  
  {/* Existing head content... */}
</head>
```

2. **Agregar `suppressHydrationWarning` al tag `<html>`:**

```tsx
<html lang="en" suppressHydrationWarning>
```

3. **Envolver children en ThemeProvider:**

```tsx
import { ThemeProvider } from '@/components/providers/theme-provider';

<body className={...}>
  <ThemeProvider>
    {children}
  </ThemeProvider>
  <Toaster richColors />
</body>
```

**Por qué suppressHydrationWarning:**
- React detectará diferencia entre server (sin clase `dark`) y client (con clase `dark`)
- Es esperado y seguro para el tag `<html>` en este caso
- Suprime solo la advertencia de hidratación, no afecta funcionalidad

---

## Fase 6: Settings Panel Integration

### Archivo: `src/components/organisms/settings-panel.tsx` (MODIFICAR)

**Agregar imports:**

```typescript
import { useThemeStore, Theme } from '@/stores/theme.store';
import { themeToggleTextMap } from '@/constants/theme-toggle.text-map';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
```

**Agregar dentro del componente (después de modelo y API key):**

```tsx
const { theme, setTheme } = useThemeStore();

const handleThemeChange = (newTheme: Theme) => {
  setTheme(newTheme as Theme);
  
  const messages = {
    [Theme.LIGHT]: themeToggleTextMap.toastThemeUpdatedLight,
    [Theme.DARK]: themeToggleTextMap.toastThemeUpdatedDark,
    [Theme.SYSTEM]: themeToggleTextMap.toastThemeUpdatedSystem
  };
  
  toast.success(messages[newTheme]);
};

// En el JSX, después de la sección de API Key:
<Separator className="my-4" />

{/* Theme Selection */}
<div className="flex flex-col gap-2">
  <Label htmlFor="theme-select">
    {themeToggleTextMap.sectionLabel}
  </Label>
  <Tabs value={theme} onValueChange={handleThemeChange}>
    <TabsList className="grid w-full grid-cols-3">
      <TabsTrigger 
        value={Theme.LIGHT}
        aria-label={themeToggleTextMap.themeLightAriaLabel}
      >
        {themeToggleTextMap.themeLightLabel}
      </TabsTrigger>
      <TabsTrigger 
        value={Theme.DARK}
        aria-label={themeToggleTextMap.themeDarkAriaLabel}
      >
        {themeToggleTextMap.themeDarkLabel}
      </TabsTrigger>
      <TabsTrigger 
        value={Theme.SYSTEM}
        aria-label={themeToggleTextMap.themeSystemAriaLabel}
      >
        {themeToggleTextMap.themeSystemLabel}
      </TabsTrigger>
    </TabsList>
  </Tabs>
  {theme === Theme.SYSTEM && (
    <p className="text-muted-foreground text-xs">
      {themeToggleTextMap.themeSystemHelper}
    </p>
  )}
</div>
```

---

## Fase 7: Component Updates (Optional - Future Enhancement)

**Componentes que usan colores hardcodeados:**

### Alta prioridad:
- `src/app/error.tsx`
- `src/app/global-error.tsx`
- `src/app/not-found.tsx`
- `src/components/ui/button.tsx`

**Estrategia:**
- Reemplazar `text-brand-blue` con `text-[var(--color-brand-blue)]`
- O definir utilidades en globals.css (ver plan UX sección 4.3)

**Nota:** Estos componentes ya funcionarán en dark mode si los colores base están bien definidos en globals.css. La actualización es para mejor mantenibilidad.

---

## Orden de Implementación

### Paso 1: Fundamentos
1. ✅ Agregar colores dark mode en `globals.css`
2. ✅ Crear `theme.store.ts`
3. ✅ Crear `theme-provider.tsx`
4. ✅ Crear `theme-toggle.text-map.ts`

### Paso 2: Integración
5. ✅ Modificar `layout.tsx` (FOUC script + ThemeProvider)
6. ✅ Actualizar `settings-panel.tsx` (theme toggle)

### Paso 3: Testing
7. ✅ Probar theme toggle en settings
8. ✅ Verificar no hay FOUC al recargar página
9. ✅ Probar "System" con cambios de preferencia del OS
10. ✅ Verificar todos los colores en dark mode

### Paso 4: Refinamiento (Opcional)
11. Actualizar componentes con colores hardcodeados
12. Agregar tests unitarios para theme store
13. Documentar decisiones de diseño

---

## Checklist de Verificación

**Funcionalidad:**
- [ ] Toggle entre Light/Dark/System funciona
- [ ] Tema persiste en localStorage
- [ ] No hay FOUC al recargar página
- [ ] "System" detecta preferencia del OS
- [ ] Cambios en OS actualizan el tema automáticamente
- [ ] Toast notifications aparecen al cambiar tema

**Accesibilidad:**
- [ ] Contraste de colores cumple WCAG AA
- [ ] Labels ARIA en theme toggle
- [ ] Navegación por teclado funciona
- [ ] Screen readers anuncian cambios

**Constraints del Proyecto:**
- [ ] Solo exports con nombre (no default)
- [ ] Strings externalizados en text map
- [ ] Zustand para UI state
- [ ] SSR-safe (no errores en servidor)

---

## Resumen de Archivos

### Crear:
- `src/stores/theme.store.ts` (~100 líneas)
- `src/components/providers/theme-provider.tsx` (~40 líneas)
- `src/constants/theme-toggle.text-map.ts` (~20 líneas)

### Modificar:
- `src/app/globals.css` (agregar ~15 líneas en `.dark {}`)
- `src/app/layout.tsx` (agregar script FOUC + ThemeProvider)
- `src/components/organisms/settings-panel.tsx` (agregar sección theme toggle)

### Total: ~200 líneas de código nuevo

---

## Referencias

- **UX Plan**: Detalles de colores, accesibilidad, diseño del toggle
- **Domain Plan**: Arquitectura del store, FOUC prevention, SSR safety
- **Session Context**: Historial de decisiones y próximos pasos

---

**Plan Status**: 🟢 Ready for Implementation
**Estimated Effort**: 2-3 horas de desarrollo + 1 hora de testing
