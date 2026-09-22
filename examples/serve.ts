const port = Number(process.argv[2] ?? 4310);
const hostname = process.argv[3] ?? 'localhost';
const root = new URL('..', import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1');
const dist = `${root}/examples/dist`;

const page = async (file: string, type: string): Promise<Response> =>
  new Response(Bun.file(file), { headers: { 'content-type': type } });

Bun.serve({
  port,
  hostname,
  async fetch(request) {
    const { pathname } = new URL(request.url);
    if (pathname === '/api/salida') return new Response(null, { status: 200 });
    if (pathname === '/api/salida-fallida') return new Response(null, { status: 500 });
    if (pathname === '/salida-ok') {
      return new Response(
        '<!doctype html><html lang="es-MX"><head><meta charset="utf-8"><title>Salida correcta</title></head><body><main id="katalis-content"><h1>Salida correcta</h1><p>La sesión se cerró y el navegador llegó al destino seguro.</p></main></body></html>',
        { headers: { 'content-type': 'text/html; charset=utf-8' } },
      );
    }
    if (pathname === '/' || pathname === '/crm' || pathname === '/social' || pathname === '/replies' || pathname === '/correo' || pathname === '/configuracion') {
      return page(`${root}/examples/index.html`, 'text/html; charset=utf-8');
    }
    if (pathname === '/preview.js') return page(`${dist}/preview.js`, 'text/javascript; charset=utf-8');
    if (pathname === '/styles.css') return page(`${dist}/preview.css`, 'text/css; charset=utf-8');
    const asset = pathname.slice(1);
    if (/^[A-Za-z0-9._-]+$/.test(asset) && (await Bun.file(`${dist}/${asset}`).exists())) {
      return new Response(Bun.file(`${dist}/${asset}`));
    }
    return new Response('No encontrado', { status: 404, headers: { 'content-type': 'text/plain; charset=utf-8' } });
  },
});

console.log(`Fixture en http://${hostname}:${port}/`);
