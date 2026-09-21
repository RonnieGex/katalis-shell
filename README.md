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
| `sections` | Lista `{ id, label, href }`. IDs: `home`, `crm`, `social`, `replies`, `mail`, `ads`, `settings`. |
| `current` | ID de la sección activa. Usa tinta y subrayado de 2 px. |
| `business` | `{ value, options: [{ id, label }], onChange }`. Estado controlado por la aplicación. |
| `user` | `{ name, email, avatarUrl?, onSignOut }`. El callback cierra la sesión en la aplicación anfitriona. |
| `signInHref` | Enlace de acceso cuando `user` está ausente. El hub usa el acceso del CRM. |
| `contactsHref` | Acceso directo «Contactos de OpenReply»; icono con nombre accesible y texto desde 1600 px. |
| `contentId` | ID del contenido para el enlace accesible. Predeterminado: `katalis-content`. |

`links` es un objeto con los siete IDs y enlaces HTTP/HTTPS absolutos.
`createSections` conserva rutas, parámetros y fragmentos; `#` desactiva una sección pendiente, como Ads.
CRM: `http://localhost:3000` o `https://crm.katalis.dev`.
Social: `http://localhost:4200` o `https://social.katalis.dev`.
Respuestas IG: `https://openreply.katalis.dev`.
Correo: `https://mail.katalis.dev`, pendiente (`#`) hasta que el servicio esté desplegado.
Configuración usa el enlace absoluto del CRM terminado en `/settings`.
Inicio apunta a `https://katalis.dev` o al hub local en `http://localhost:4300`.

`useKatalisBusiness` ofrece Todos los negocios, Órbita, Rock & Jewel, Dental y Katalis Lab.
Conserva la selección en almacenamiento local y la transfiere mediante el parámetro `negocio` al navegar.
Usa la clave `katalis.business`. El almacenamiento es por origen; el parámetro `negocio` transfiere la selección entre subdominios.
El hook devuelve `ready` después de hidratar y acepta un callback opcional para cambios del selector.
Cada aplicación aplica sus filtros. El CRM usa la selección como filtro inicial de Negocio en Contactos.
La selección no concede permisos ni crea organizaciones.
La autenticación y las integraciones de datos pertenecen a cada aplicación. Este paquete no implementa login único.

Importa el CSS una vez desde el layout raíz. CRM, Postiz y OpenReply montan la barra en su zona autenticada.
El hub también monta la barra sin sesión, con el enlace Entrar.
Asigna el espacio restante al contenido con flex y `min-height: 0` para evitar doble scroll.
Las seis secciones son visibles desde 900 px. Por debajo usan un desplegable accesible. Escape cierra los desplegables.
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
La versión 0.1.3 conserva el negocio recibido por enlace al continuar por las rutas internas de otra aplicación.
La versión 0.2.0 añade el umbral de 900 px, Todos los negocios, callback, estado de hidratación, acceso sin sesión y atajo de contactos.
`openReplyContactsHref` recibe la URL del espacio CRM, por ejemplo `https://crm.katalis.dev/katalis`, y conserva el filtro `source=OPENREPLY`.
La versión 0.5.0 añade la sección **Correo** (`mail`) entre Respuestas IG y Ads. El consumidor decide si está lista: `#` la deja pendiente y la barra la dibuja desactivada con «próximamente», como Ads.

## Identidad única (v0.3.0)

Las cuatro apps pasan `signOutUrl="https://api.crm.katalis.dev/api/auth/sign-out"`.
El menú «Salir» hace POST con cookies y vuelve a `https://katalis.dev/` solo si el CRM confirma la salida. Ante un fallo conserva la página y permite reintentar.
`user.onSignOut` queda como compatibilidad para desarrollo; no se usa en la suite desplegada.
