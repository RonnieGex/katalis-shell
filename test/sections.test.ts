import { describe, expect, test } from 'bun:test';
import {
  ALL_BUSINESSES,
  createSections,
  openReplyContactsHref,
  OPERATIONAL_SECTION_IDS,
  SECTION_LABELS,
  type CreateSectionsOptions,
  type KatalisLinks,
  type KatalisSection,
  type SectionId,
} from '../src/sections';

const links = {
  home: 'http://localhost:3000',
  crm: 'http://localhost:3000/crm?view=all#list',
  social: 'http://localhost:4200',
  replies: 'https://openreply.katalis.dev',
  mail: '#',
  ads: '#',
  settings: 'http://localhost:3000/settings',
};

describe('Navegación entre aplicaciones', () => {
  test('conserva destinos y parámetros al transferir el negocio', () => {
    const sections = createSections(links, 'rock-and-jewel');
    expect(sections.find(section => section.id === 'crm')?.href).toBe('http://localhost:3000/crm?view=all&negocio=rock-and-jewel#list');
    expect(sections.find(section => section.id === 'social')?.href).toBe('http://localhost:4200/?negocio=rock-and-jewel');
    expect(sections.find(section => section.id === 'ads')?.href).toBe('#');
  });
  test('Correo entra en la barra entre Respuestas IG y Ads, pendiente por defecto', () => {
    const sections = createSections(links, 'rock-and-jewel');
    expect(sections.map(section => section.id)).toEqual(['home', 'crm', 'social', 'replies', 'mail', 'ads', 'settings']);
    expect(sections.find(section => section.id === 'mail')?.label).toBe('Correo');
    expect(sections.find(section => section.id === 'mail')?.href).toBe('#');
  });
  test('Correo viaja con el negocio cuando tiene destino', () => {
    const sections = createSections({ ...links, mail: 'https://mail.katalis.dev' }, 'rock-and-jewel');
    expect(sections.find(section => section.id === 'mail')?.href).toBe('https://mail.katalis.dev/?negocio=rock-and-jewel');
  });
  test('rechaza protocolos ejecutables y rutas relativas', () => {
    expect(() => createSections({...links, crm: 'javascript:alert(1)'})).toThrow();
    expect(() => createSections({...links, crm: '/crm'})).toThrow();
    expect(() => createSections({...links, mail: 'javascript:alert(1)'})).toThrow();
  });
  test('enlaza al filtro real de OpenReply dentro del espacio CRM', () => {
    expect(openReplyContactsHref('https://crm.katalis.dev/katalis', 'orbita')).toBe('https://crm.katalis.dev/katalis/contacts?source=OPENREPLY&negocio=orbita');
    expect(() => openReplyContactsHref('javascript:alert(1)')).toThrow();
  });
});

describe('Contrato de secciones operativas', () => {
  test('la llamada antigua conserva las siete secciones en orden canónico', () => {
    const sections = createSections(links, 'rock-and-jewel');
    expect(sections.map(section => section.id)).toEqual(['home', 'crm', 'social', 'replies', 'mail', 'ads', 'settings']);
  });

  test('la lista operativa trae seis identificadores y sus etiquetas en orden', () => {
    const options: CreateSectionsOptions = { visibleSections: OPERATIONAL_SECTION_IDS };
    const sections = createSections(links, ALL_BUSINESSES, options);
    expect(sections.map(section => section.id)).toEqual(['home', 'crm', 'social', 'replies', 'mail', 'settings']);
    expect(sections.map(section => section.label)).toEqual(['Inicio', 'CRM', 'Redes sociales', 'Respuestas Instagram', 'Correo', 'Configuración']);
    expect(sections.some(section => section.id === 'ads')).toBe(false);
    expect(OPERATIONAL_SECTION_IDS).toEqual(['home', 'crm', 'social', 'replies', 'mail', 'settings']);
  });

  test('una lista vacía no produce secciones y los duplicados no duplican', () => {
    expect(createSections(links, undefined, { visibleSections: [] })).toEqual([]);
    const repeated = createSections({ ...links, crm: 'http://localhost:3000/crm?view=all' }, 'uno', {
      visibleSections: ['crm', 'crm', 'home', 'crm'] as SectionId[],
    });
    expect(repeated.map(section => section.id)).toEqual(['home', 'crm']);
  });

  test('el negocio sustituye el anterior sin perder parámetros ni fragmento', () => {
    const sections = createSections({ ...links, crm: 'http://localhost:3000/crm?view=all&negocio=viejo#list' }, 'nuevo');
    expect(sections.find(section => section.id === 'crm')?.href).toBe('http://localhost:3000/crm?view=all&negocio=nuevo#list');
  });

  test('all viaja explícito y una entrada vacía conserva el negocio del destino', () => {
    const destination = { ...links, social: 'http://localhost:4200/?negocio=guardado&vista=mes' };
    expect(createSections(destination, ALL_BUSINESSES).find(section => section.id === 'social')?.href).toBe('http://localhost:4200/?negocio=all&vista=mes');
    expect(createSections(destination, undefined).find(section => section.id === 'social')?.href).toBe('http://localhost:4200/?negocio=guardado&vista=mes');
    expect(createSections(destination, '').find(section => section.id === 'social')?.href).toBe('http://localhost:4200/?negocio=guardado&vista=mes');
    expect(createSections({ ...links, social: 'http://localhost:4200/?negocio=viejo&negocio=otro' }, ALL_BUSINESSES).find(section => section.id === 'social')?.href).toBe('http://localhost:4200/?negocio=all');
  });

  test('un identificador con caracteres de consulta se codifica, no se interpreta', () => {
    const href = createSections(links, 'a&b=c d').find(section => section.id === 'social')?.href ?? '';
    expect(href).toContain('negocio=a%26b%3Dc+d');
    expect(new URL(href).searchParams.get('negocio')).toBe('a&b=c d');
    expect(new URL(href).searchParams.get('b')).toBeNull();
  });

  test('una sección pendiente sigue siendo un almohadilla sin parámetros', () => {
    for (const businessId of [undefined, '', ALL_BUSINESSES, 'rock-and-jewel']) {
      const pending = createSections({ ...links, mail: '#' }, businessId).find(section => section.id === 'mail');
      expect(pending).toEqual({ id: 'mail', label: 'Correo', href: '#' });
    }
  });

  test('los destinos generados siguen restringidos a HTTP y HTTPS', () => {
    const rejected = ['javascript:alert(1)', 'mailto:hola@katalis.dev', 'data:text/html,hola', '/relativo'];
    for (const href of rejected) {
      expect(() => createSections({ ...links, settings: href })).toThrow();
    }
    expect(() => openReplyContactsHref('mailto:hola@katalis.dev')).toThrow();
  });

  test('el atajo conserva la ruta de contactos y source=OPENREPLY con all', () => {
    const href = openReplyContactsHref('https://crm.katalis.dev/katalis', ALL_BUSINESSES);
    expect(href).toBe('https://crm.katalis.dev/katalis/contacts?source=OPENREPLY&negocio=all');
    const url = new URL(href);
    expect(url.pathname).toBe('/katalis/contacts');
    expect(url.searchParams.getAll('source')).toEqual(['OPENREPLY']);
    expect(url.searchParams.getAll('negocio')).toEqual(['all']);
  });

  test('las etiquetas visibles son las acordadas y ads conserva su lugar en el tipo', () => {
    expect(SECTION_LABELS.social).toBe('Redes sociales');
    expect(SECTION_LABELS.replies).toBe('Respuestas Instagram');
    expect(SECTION_LABELS.home).toBe('Inicio');
    expect(SECTION_LABELS.crm).toBe('CRM');
    expect(SECTION_LABELS.mail).toBe('Correo');
    expect(SECTION_LABELS.settings).toBe('Configuración');
    expect(SECTION_LABELS.ads).toBe('Ads');
    const typed: KatalisLinks = links;
    const sections: KatalisSection[] = createSections(typed, undefined, { visibleSections: OPERATIONAL_SECTION_IDS });
    expect(sections).toHaveLength(6);
  });
});
