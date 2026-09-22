import { createRoot } from 'react-dom/client';
import {
  createSections,
  KatalisBusinessProvider,
  KatalisShell,
  openReplyContactsHref,
  OPERATIONAL_SECTION_IDS,
  useKatalisBusiness,
  type BusinessCatalog,
  type KatalisLinks,
} from '../dist/index.js';
import '../styles.css';

const ORIGIN_A = 'http://localhost:4310';
const ORIGIN_B = 'http://127.0.0.1:4311';

const links: KatalisLinks = {
  home: `${ORIGIN_A}/`,
  crm: `${ORIGIN_B}/crm`,
  social: `${ORIGIN_B}/social`,
  replies: `${ORIGIN_B}/replies`,
  mail: `${ORIGIN_A}/correo`,
  ads: '#',
  settings: `${ORIGIN_A}/configuracion`,
};

const catalog: BusinessCatalog = {
  options: [
    { id: 'biz-orbita-sw', label: 'Órbita SW', groupId: 'orbita', groupLabel: 'Órbita' },
    { id: 'biz-orbita-luxury', label: 'Órbita Luxury', groupId: 'orbita', groupLabel: 'Órbita' },
    { id: 'biz-rock-and-jewel', label: 'Rock & Jewel' },
    {
      id: 'biz-distribuidora-de-materiales-industriales-del-bajio',
      label: 'Distribuidora de materiales industriales del Bajío',
    },
  ],
};

const longUser = {
  name: 'María Fernanda de la Cruz Villaseñor',
  email: 'maria.fernanda.delacruz@negocio-de-ejemplo-largo.test',
};

const shortUser = {
  name: 'Ana Ruiz',
  email: 'ana@ejemplo.test',
};

function Operational() {
  const business = useKatalisBusiness();
  return (
    <KatalisShell
      sections={createSections(links, business.value, { visibleSections: OPERATIONAL_SECTION_IDS })}
      current="crm"
      business={business}
      contactsHref={openReplyContactsHref(`${ORIGIN_A}/espacio`, business.value)}
      signOutUrl={`${ORIGIN_A}/api/salida`}
      signOutDestination="/salida-ok"
      user={longUser}
    />
  );
}

function Compatibility() {
  const business = useKatalisBusiness();
  return (
    <KatalisShell
      sections={createSections(links, business.value)}
      current="home"
      business={business}
      signOutUrl={`${ORIGIN_A}/api/salida-fallida`}
      signOutDestination="/salida-ok"
      user={shortUser}
    />
  );
}

function Preview() {
  const withCompatibility = new URLSearchParams(window.location.search).get('compatibilidad') === '1';
  return (
    <KatalisBusinessProvider catalog={catalog}>
      <div className="fixture">
        <Operational />
        {withCompatibility ? <Compatibility /> : null}
        <main id="katalis-content" tabIndex={-1} className="fixture__content">
          <h1>Barra común de la suite</h1>
          <p>
            Vista de demostración de <code>@katalis/shell</code>: paquete compilado, hoja de estilos y
            fuentes reales, con negocios y cuentas ficticios.
          </p>
          <p>
            Origen de esta página: <strong>{window.location.origin}</strong>
          </p>
        </main>
      </div>
    </KatalisBusinessProvider>
  );
}

createRoot(document.getElementById('root')!).render(<Preview />);
