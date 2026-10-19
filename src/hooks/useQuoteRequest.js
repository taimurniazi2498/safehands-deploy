import { useCallback, useEffect, useReducer, useRef  } from "react";
import { fetchQuote } from "../api/quotesApi";

const initialState = { status: 'idle', quote: null, error: null };

function reducer(state, action) {
  switch (action.type) {
    case 'SUBMIT':
      return { status: 'pending', quote: null, error: null };
    case 'SUCCESS':
      return { status: 'success', quote: action.quote, error: null };
    case 'FAILURE':
      return { status: 'error', quote: null, error: action.message };
    default:
      return state;      
  }
}

export function useQuoteRequest() {
  const [state, dispatch] = useReducer(reducer,initialState);
  const controllerRef = useRef(null);
  const lastValuesRef = useRef(null);

  const submit = useCallback(async (values) => {
    controllerRef.current?.abort();
    const controller = new AbortController();
    controllerRef.current = controller;
    lastValuesRef.current = values;

    dispatch({ type: 'SUBMIT' });
    try {
      const quote = await fetchQuote(values, {signal: controller.signal });
      dispatch({type: 'SUCCESS', quote});
    } catch (err) {
      if (err.name === 'AbortError') return;
      dispatch({
        type: 'FAILURE',
        message: 'We could not get your quote right now. Please try again.',
      });
    }
  }, []);

  const retry  = useCallback(() => {
    if (lastValuesRef.current) submit(lastValuesRef.current);

  },[submit]);

  useEffect(() => () => controllerRef.current?.abort(), []);
  
  return { ...state, submit, retry};
}