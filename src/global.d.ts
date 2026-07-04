import { HTMLAttributes } from 'react';

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'pose-viewer': HTMLAttributes<HTMLElement> & {
        src?: string;
      };
    }
  }
}
