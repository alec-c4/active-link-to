# active-link

Framework-independent active navigation matching inspired by [active_link_to](https://github.com/comfy/active_link_to). Zero runtime dependencies. Works in browsers, Node and Bun; includes TypeScript declarations.

## Installation

```sh
npm install active-link
# or
bun add active-link
```

## Usage

```js
import { isActiveLink } from 'active-link';

isActiveLink('/admin/users/42/edit?q=alex', '/admin/users'); // true
isActiveLink('/admin/users', '/admin', 'exclusive');        // false
isActiveLink('/users?role=admin', '/users?role=admin', 'exact'); // true
```

Set your framework's active class or data attribute from the boolean result. Use `aria-current="page"` on active navigation links. The function does not access `window`, manipulate the DOM or subscribe to routing changes: pass the current URL reactively from your router.

## Matching modes

| Mode | Behavior |
| --- | --- |
| `inclusive` (default) | Match the target path and its descendants at a slash boundary. Ignore query strings, fragments and trailing slashes. `/users-other` does not match `/users`. Root `/` matches every path. |
| `exclusive` | Match the target path only. Ignore query strings, fragments and trailing slashes. Use this for overview/home links. |
| `exact` | Match the complete URL after standard URL parsing, including trailing slash, query order and fragment. |

Both arguments accept a string or a `URL` object. Relative targets resolve against the current URL using standard URL rules. If both arguments are root-relative paths, no origin is required. When comparing absolute targets, pass an absolute current URL so that origin checks have the real application origin.

Cross-origin and non-HTTP(S) links are inactive. Empty, malformed and non-URL inputs return `false`. Unknown matching modes throw a `RangeError` with code `ERR_ACTIVE_LINK_MODE`.

## Svelte and Inertia

```svelte
<script>
  import { page } from '@inertiajs/svelte';
  import { isActiveLink } from 'active-link';

  const active = $derived(isActiveLink(page.url, '/admin/users'));
</script>

<a href="/admin/users" class:active aria-current={active ? 'page' : undefined}>
  Users
</a>
```

## Development

```sh
npm test
bun run test:bun
npm run check
npm pack --dry-run
```

The same test suite runs natively in Node and Bun. No install or compilation step is required. `src/index.js` is the ESM runtime entry point and `src/index.d.ts` supplies TypeScript types. Consumers can bundle the package for browsers.

## License

MIT © Alexey Poimtsev
