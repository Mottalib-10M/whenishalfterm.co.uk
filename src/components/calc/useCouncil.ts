import { useMemo, useState } from 'react';
import { fromLite, loadCouncil, type CouncilLite } from '../../lib/lite';
import { updateURL } from '../../lib/url-state';

/** One council picked by the visitor; the page's own council is in the props, others are loaded on demand. */
export function useCouncil(initial: CouncilLite, urlKey = 'c') {
  const [lite, setLite] = useState(initial);
  const [slug, setSlug] = useState(initial.s);
  const [error, setError] = useState('');
  function pick(s: string, write = true) {
    setSlug(s);
    if (s === initial.s) { setLite(initial); setError(''); }
    else loadCouncil(s).then((l) => { setLite(l); setError(''); }).catch(() => setError('This council could not be loaded. Reload the page and try again.'));
    if (write) updateURL({ [urlKey]: s });
  }
  const council = useMemo(() => fromLite(lite), [lite]);
  return { council, slug, pick, loading: slug !== lite.s, error };
}
