# @katalis/shell

Barra común de Katalis para React 19. No depende de Next.js, Tailwind ni un router.
El CSS consume `@katalis/ui-tokens` v0.1.0. La barra mide 56 px, conserva esquinas rectas y usa Lufga.
Instala los tokens explícitamente en cada aplicación; son una dependencia par, igual que React.

```tsx
import { KatalisShell, createSections, useKatalisBusiness } from '@katalis/shell';
import '@katalis/shell/styles.css';

function Navigation({ links, user }) {
  const business = useKatalisBusiness();
  return <KatalisShell sections={createSections(links, business.value)} current="crm" business={business} user={user} />;
}
```

| Prop | Contrato |
| --- | --- |
| `sections` | Lista `{ id, label, href }`. IDs: `home`, `crm`, `social`, `replies`, `ads`, `settings`. |
| `current` | ID de la sección activa. Usa tinta y subrayado de 2 px. |
| `business` | `{ value, options: [{ id, label }], onChange }`. Estado controlado por la aplicación. |
| `user` | `{ name, email, avatarUrl?, onSignOut }`. El callback cierra la sesión en la aplicación anfitriona. |
| `contentId` | ID del contenido para el enlace accesible. Predeterminado: `katalis-content`. |

`links` es un objeto con los seis IDs y enlaces HTTP/HTTPS absolutos.
`createSections` conserva rutas, parámetros y fragmentos; `#` desactiva una sección pendiente, como Ads.
CRM: `http://localhost:3000` o `https://crm.katalis.dev`.
Social: `http://localhost:4200` o `https://social.katalis.dev`.
Respuestas IG: `https://openreply.katalis.dev`.
Configuración usa el enlace absoluto del CRM terminado en `/settings`.
Inicio apunta al CRM mientras el hub no existe.

`useKatalisBusiness` ofrece Órbita, Rock & Jewel, Dental y Katalis Lab.
Conserva la selección en almacenamiento local y la transfiere mediante el parámetro `negocio` al navegar.
El selector define contexto de navegación. No filtra registros, concede permisos ni crea organizaciones.
La autenticación y las integraciones de datos pertenecen a cada aplicación. Este paquete no implementa login único.

Importa el CSS una vez desde el layout raíz. Monta la barra únicamente en la zona autenticada.
Asigna el espacio restante al contenido con flex y `min-height: 0` para evitar doble scroll.
En pantallas estrechas, las secciones viven en un desplegable accesible. Escape cierra los desplegables.
La barra usa enlaces nativos, foco visible y movimiento reducido. No contiene una acción primaria.
Las microcaps inactivas siguen el requisito explícito de tinta al 40 %, que prevalece sobre K6 en esta barra.

## Capturas

Las capturas de escritorio y móvil se generan con datos de demostración, sin datos del CRM.

![Barra de escritorio](capturas/escritorio.png)
![Menú de secciones en móvil](capturas/movil.png)

## Desarrollo

```sh
bun install
bun run build
bun run check-types
bun test
```

Se publica `dist` compilado para que las dependencias git no necesiten scripts de instalación.
No muevas una etiqueta publicada. Crea una nueva versión para cualquier cambio posterior.

La versión 0.1.1 añade `main` y `types` para TypeScript con resolución `node` en Postiz.
Conserva los exports modernos y el mismo código y CSS de 0.1.0.
La versión 0.1.2 declara los tokens como dependencia par para evitar duplicados de Git en Bun 1.3.12.
