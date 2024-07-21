import { useEffect } from 'react';

export function isHalfViewed(itemsViewed: number, totalItems: number): boolean {
  if (totalItems === 0) {
    return false;
  }
  return itemsViewed / totalItems >= 0.5;
}

export function isAlmostViewed(
  itemsViewed: number,
  totalItems: number,
): boolean {
  if (totalItems === 0) {
    return false;
  }
  return itemsViewed / totalItems >= 0.9;
}

interface Props {
  viewedItems: number;
  isLoading: boolean;
  totalItems: number;
  onPrefetch: () => void;
  enabled: boolean;
}
function useCarouselPrefetcher({
  viewedItems,
  isLoading,
  totalItems = 0,
  onPrefetch,
  enabled,
}: Props) {
  useEffect(() => {
    if (enabled && !isLoading && isHalfViewed(viewedItems, totalItems)) {
      console.log('Prefetching...');
      onPrefetch();
    }
  }, [onPrefetch, viewedItems, isLoading, totalItems, enabled]);
}

export default useCarouselPrefetcher;
