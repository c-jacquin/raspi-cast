import { useEffect, useState } from 'react';
import { Observable } from 'rxjs';

function useObservable<T = unknown>(obs$: Observable<T>) {
  const [state, setState] = useState<T>({} as T);

  useEffect(() => {
    const subscription = obs$.subscribe(setState);

    return () => subscription.unsubscribe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return state;
}

export default useObservable;
