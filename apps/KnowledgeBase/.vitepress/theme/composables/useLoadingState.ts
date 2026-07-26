import { reactive } from 'vue';

interface LoadingState {
  isPageReady: boolean;
  isLoading: boolean;
}

const state = reactive<LoadingState>({
  isPageReady: false,
  isLoading: false,
});

export function useLoadingState() {
  function setLoading(loading: boolean) {
    state.isLoading = loading;
  }

  function markPageReady() {
    state.isLoading = false;
    state.isPageReady = true;
  }

  function resetForNavigation() {
    state.isPageReady = false;
  }

  return {
    isPageReady: () => state.isPageReady,
    isLoading: () => state.isLoading,
    setLoading,
    markPageReady,
    resetForNavigation,
  };
}

export const loadingStateRef = state;
