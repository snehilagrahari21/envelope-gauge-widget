import { createRoot, Root } from 'react-dom/client';
import React from 'react';
import GaugeConfiguration from './GaugeConfiguration';

const roots = new Map<string, Root>();

function mount(containerId: string, props: any) {
  console.log('[GaugeConfiguration] mount() called', { containerId, props });
  const container = document.getElementById(containerId);
  if (!container) {
    console.warn('[GaugeConfiguration] mount() — container not found:', containerId);
    return;
  }

  container.setAttribute('data-zone-ignore', '');

  if (roots.has(containerId)) {
    console.log('[GaugeConfiguration] mount() — existing root found, unmounting first');
    roots.get(containerId)!.unmount();
    roots.delete(containerId);
  }

  const root = createRoot(container);
  roots.set(containerId, root);
  root.render(React.createElement(GaugeConfiguration, props));
  console.log('[GaugeConfiguration] mount() — rendered successfully');
}

function update(containerId: string, props: any) {
  console.log('[GaugeConfiguration] update() called', { containerId, props });
  const root = roots.get(containerId);
  if (!root) {
    console.warn('[GaugeConfiguration] update() — no root found for:', containerId);
    return;
  }
  root.render(React.createElement(GaugeConfiguration, props));
  console.log('[GaugeConfiguration] update() — re-rendered successfully');
}

function unmount(containerId: string) {
  console.log('[GaugeConfiguration] unmount() called', { containerId });
  const root = roots.get(containerId);
  if (!root) {
    console.warn('[GaugeConfiguration] unmount() — no root found for:', containerId);
    return;
  }
  root.unmount();
  roots.delete(containerId);
  console.log('[GaugeConfiguration] unmount() — cleaned up');
}

(window as any).ReactWidgets = (window as any).ReactWidgets ?? {};
(window as any).ReactWidgets['GaugeConfiguration'] = { mount, update, unmount };
