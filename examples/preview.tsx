import { createRoot } from 'react-dom/client';
import { KatalisShell, createSections, openReplyContactsHref, useKatalisBusiness } from '../src/index.js';
import '../styles.css';

const links = {
  home: 'http://localhost:4310',
  crm: 'http://localhost:3000',
  social: 'http://localhost:4200',
  replies: 'https://openreply.katalis.dev',
  ads: '#',
  settings: 'http://localhost:3000/settings',
};

function Preview() {
  const business = useKatalisBusiness();
  return <>
    <KatalisShell sections={createSections(links, business.value)} current="crm" business={business} contactsHref={openReplyContactsHref('http://localhost:3000/crm', business.value)} user={{ name: 'Usuario de ejemplo', email: 'demo@example.com', onSignOut() {} }} />
    <main id="katalis-content" tabIndex={-1}><h1>Una suite, todas tus secciones.</h1><p>Vista de demostración del paquete @katalis/shell.</p></main>
  </>;
}

createRoot(document.getElementById('root')!).render(<Preview />);
