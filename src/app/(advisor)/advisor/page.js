// Messe-Dashboard und CV-Checks wurden zusammengelegt — alle Stats + Messen + Leads
// liegen jetzt unter /advisor/leads. /advisor redirected dorthin.

import { redirect } from 'next/navigation';

export default function AdvisorRoot() {
  redirect('/advisor/leads');
}
