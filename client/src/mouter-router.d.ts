declare module 'mouter-router' {
  import * as React from 'react';

  export interface RouterProps {
    routes?: Array<{ path: string; component: React.ComponentType<any> }>;
    defaultComponent?: React.ComponentType<any>;
    children?: React.ReactNode;
  }

  export interface RouteProps {
    path: string;
    component: React.ComponentType<any>;
  }

  export interface LinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
    to: string;
  }

  export const Router: React.ComponentType<RouterProps>;
  export const Route: React.ComponentType<RouteProps>;
  export const Link: React.ComponentType<LinkProps>;

  export function navigate(href: string): void;
  export function getCurrentPath(): string;
  export function subscribeToNavigation(callback: Function): () => void;
}
