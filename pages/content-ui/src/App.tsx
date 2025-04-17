import { useEffect } from 'react';
import { IS_DEV } from '@extension/env';
import MockUI from './MockUI';

export default function App() {
  useEffect(() => {
    console.log('IS_DEV', IS_DEV);
  }, []);

  return <>{IS_DEV && <MockUI />}</>;
}
