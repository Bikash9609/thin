import React, { useCallback } from 'react';
import useMutation from './useMutation';
import Snackbar from 'react-native-snackbar';

type Props = { postuuid: string };

function useReport({ postuuid }: Props) {
  const { mutate } = useMutation({
    method: 'post',
    url: `/post/report/${postuuid}`,
  });

  const reportPost = useCallback(() => {
    mutate()
      .then(res =>
        Snackbar.show({
          text: 'Story has been reported successfully. We will review this story and take action if required!',
          duration: Snackbar.LENGTH_LONG,
        }),
      )
      .catch(error => {
        Snackbar.show({
          text: 'An error occurred while reporting the story. Please try again later.',
          duration: Snackbar.LENGTH_LONG,
        });
      });
  }, [postuuid]);

  return { reportPost };
}

export default useReport;
