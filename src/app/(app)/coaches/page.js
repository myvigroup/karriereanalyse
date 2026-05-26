import { redirect } from 'next/navigation';

// Coaches-Page wurde in /coach zusammengeführt — diese Route leitet permanent dorthin um.
export default function CoachesRedirect() {
  redirect('/coach');
}
