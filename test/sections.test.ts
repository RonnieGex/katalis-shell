import { describe, expect, test } from 'bun:test';
import { createSections } from '../src/sections';

const links = {
  home: 'http://localhost:3000',
  crm: 'http://localhost:3000/crm?view=all#list',
  social: 'http://localhost:4200',
  replies: 'https://openreply.katalis.dev',
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
  test('rechaza protocolos ejecutables y rutas relativas', () => {
    expect(() => createSections({...links, crm: 'javascript:alert(1)'})).toThrow();
    expect(() => createSections({...links, crm: '/crm'})).toThrow();
  });
});
