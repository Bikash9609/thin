import { useCallback, useState } from 'react';
import useMutation from './useMutation';
import Snackbar from 'react-native-snackbar';

interface Props {
  storyUuid: string;
}
function useShareLink({ storyUuid }: Props) {
  const [shareLink, setShareLink] = useState<string | null>(null);

  const { mutate, isLoading } = useMutation<{ url: string }>({
    method: 'get',
    url: `/post/share/${storyUuid}`,
    onSuccess(data) {
      setShareLink(data.url);
    },
  });

  const onGetShareLink = useCallback(async () => {
    try {
      if (shareLink) return;
      const res = await mutate();
      return res;
    } catch (error) {
      Snackbar.show({
        text: 'Error sharing story. Please try again!',
        duration: Snackbar.LENGTH_SHORT,
      });
    }
  }, [shareLink]);

  return { shareLink, getShareLink: onGetShareLink, isLoading };
}

export default useShareLink;
