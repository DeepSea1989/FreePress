/*
 * @author DeepSea1989
 */

import { useEffect } from 'react';
import { noop } from '../shared/noop';
import SWUpdateEvent from './SWUpdateEvent';
import { register } from 'register-service-worker';

let swUpdateObject = {
  ready: noop,
  cached: noop,
  updated: noop,
  offline: noop,
  error: noop
};

export const useSWHook = () => {
  const dispatch = args => {
    swUpdateObject[args.type] = args.payload;
  };

  return [swUpdateObject, dispatch];
};

export const useSWRegistry = () => {
  const state = swUpdateObject;
  useEffect(() => {
    // Register service worker
    if (
      process.env.NODE_ENV === 'production' &&
      SW_ENABLED &&
      window.location.protocol === 'https:'
    ) {
      register(`${BASE_URL}/service-worker.js`, {
        ready() {
          console.log('[freepress:sw] Service worker is active.');
          state.ready();
        },
        cached(registration) {
          console.log('[freepress:sw] Content has been cached for offline use.');
          state.cached(new SWUpdateEvent(registration));
        },
        updated(registration) {
          console.log('[freepress:sw] Content updated.');
          state.updated(new SWUpdateEvent(registration));
        },
        offline() {
          console.log('[freepress:sw] No internet connection found. App is running in offline mode.');
          state.offline();
        },
        error(err) {
          console.error('[freepress:sw] Error during service worker registration:', err);
          state.error(err);
        }
      });
    }
  }, []);
};
