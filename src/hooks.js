import { useState, useCallback } from 'react';
import { useToaster } from './Toaster';

export const useForceUpdate = (timeout) => {
  const [, setState] = useState();
  const doSetState = () => setState({});

  return useCallback(() => {
    timeout && setTimeout(doSetState, 1);
    doSetState();
  }, [timeout]);
};

export const useReportError = () => {
  const addToast = useToaster();

  const reportError = (res) => {
    if (res?.ok) {
      return;
    }

    const msg = res?.data?.ErrorMessage || 'Unknown Error';
    const details = res?.data?.ErrorDetails || '';

    addToast({
      type: 'error',
      renderCallback: () => {
        return (
          <div>
            {msg}
            {details && <br />}
            {details}
          </div>
        );
      },
    });
  };

  return reportError;
};
