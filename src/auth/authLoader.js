// authLoader.ts
import { redirect } from 'react-router-dom';

export function authLoader() {
  const user = JSON.parse(localStorage.getItem('user') || 'null');
  if (!user) throw redirect('/login');
  return null;          // must return something
}
