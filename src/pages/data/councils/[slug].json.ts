/** Static JSON per council, read by the browser tools when the visitor picks another council. */
import type { APIRoute } from 'astro';
import { COUNCILS, toLite } from '../../../lib/councils';
export function getStaticPaths() { return COUNCILS.map((c) => ({ params: { slug: c.slug } })); }
export const GET: APIRoute = ({ params }) => {
  const c = COUNCILS.find((x) => x.slug === params.slug)!;
  return new Response(JSON.stringify(toLite(c)), { headers: { 'Content-Type': 'application/json' } });
};
