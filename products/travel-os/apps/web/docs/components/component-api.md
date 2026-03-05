# Component API — TravelOS Web

All components in `src/components/` follow these conventions:
- `forwardRef` for form controls and interactive elements
- `tos-*` BEM classes (no Tailwind)
- `--tos-*` CSS tokens for colours/spacing
- Named exports (no default exports from component files)

---

## ErrorBoundary

`src/components/common/ErrorBoundary/ErrorBoundary.tsx`

React class component. Catches render-time errors and renders fallback UI.

```tsx
// Default fallback (built-in tos-* styled)
<ErrorBoundary>
  <FeatureComponent />
</ErrorBoundary>

// Static fallback
<ErrorBoundary fallback={<Alert>Failed to load</Alert>}>...</ErrorBoundary>

// Render-prop fallback
<ErrorBoundary fallback={(error, reset) => (
  <div>
    <p>{error.message}</p>
    <button onClick={reset}>Retry</button>
  </div>
)}>...</ErrorBoundary>
```

| Prop | Type | Description |
|------|------|-------------|
| `children` | `ReactNode` | Content to protect |
| `fallback` | `ReactNode \| (error, reset) => ReactNode` | Fallback UI |
| `onError` | `(error: AppError, info: ErrorInfo) => void` | Side-effect on error |

---

## TextField

`src/components/forms/TextField/TextField.tsx`

Floating-label input or textarea. SSR-safe (uses `useId()`).

```tsx
<TextField label="Email" type="email" />
<TextField label="Notes" multiline rows={4} />
<TextField label="Code" error="Required" />
```

| Prop | Type | Default |
|------|------|---------|
| `label` | `string` | required |
| `type` | `HTMLInputElement['type']` | `'text'` |
| `multiline` | `boolean` | `false` |
| `rows` | `number` | `3` |
| `error` | `string` | — |
| `hint` | `string` | — |

All native `<input>` / `<textarea>` props are forwarded via `forwardRef`.

---

## Icon

`src/components/icons/Icon.tsx`

Thin wrapper over lucide-react. Only icons in `icons.ts` registry are available.

```tsx
<Icon name="Map" size={24} aria-hidden />
<Icon name="TrendingUp" size={16} className="tos-icon--success" />
```

| Prop | Type | Default |
|------|------|---------|
| `name` | `keyof typeof icons` | required |
| `size` | `number` | `16` |
| `className` | `string` | — |
| `style` | `CSSProperties` | — |
| `aria-hidden` | `boolean` | — |
| `aria-label` | `string` | — |

**To add a new icon:** add its named export to `src/components/icons/icons.ts`.

---

## AppError

`src/lib/errors/AppError.ts`

Typed error class with HTTP status and `ErrorCode` enum.

```ts
throw new AppError('Not found', { code: ErrorCode.NOT_FOUND, status: 404 });
AppError.fromHttpStatus(401, 'Token expired');
```

---

## useErrorHandler

`src/hooks/useErrorHandler.ts`

```ts
const { error, hasError, captureError, clearError } = useErrorHandler();

try {
  await createItinerary(data);
} catch (err) {
  captureError(err); // normalises to AppError
}

if (hasError) return <ErrorMessage error={error} onDismiss={clearError} />;
```
