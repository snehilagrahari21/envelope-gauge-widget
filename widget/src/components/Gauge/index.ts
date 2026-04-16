import { createRoot, Root } from 'react-dom/client';
import React from 'react';
import Gauge from './Gauge';

const roots = new Map<string, Root>();

function mount(containerId: string, props: any) {
  console.log('[Gauge] mount() called', { containerId, props });
  const container = document.getElementById(containerId);
  if (!container) {
    console.warn('[Gauge] mount() — container not found:', containerId);
    return;
  }

  container.setAttribute('data-zone-ignore', '');

  if (roots.has(containerId)) {
    console.log('[Gauge] mount() — existing root found, unmounting first');
    roots.get(containerId)!.unmount();
    roots.delete(containerId);
  }

  const root = createRoot(container);
  roots.set(containerId, root);
  root.render(React.createElement(Gauge, props));
  console.log('[Gauge] mount() — rendered successfully');
}

function update(containerId: string, props: any) {
  console.log('[Gauge] update() called', { containerId, props });
  const root = roots.get(containerId);
  if (!root) {
    console.warn('[Gauge] update() — no root found for:', containerId);
    return;
  }
  root.render(React.createElement(Gauge, props));
  console.log('[Gauge] update() — re-rendered successfully');
}

function unmount(containerId: string) {
  console.log('[Gauge] unmount() called', { containerId });
  const root = roots.get(containerId);
  if (!root) {
    console.warn('[Gauge] unmount() — no root found for:', containerId);
    return;
  }
  root.unmount();
  roots.delete(containerId);
  console.log('[Gauge] unmount() — cleaned up');
}

(window as any).ReactWidgets = (window as any).ReactWidgets ?? {};
(window as any).ReactWidgets['Gauge'] = { mount, update, unmount };
