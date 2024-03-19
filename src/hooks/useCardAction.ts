import { useEffect, useState } from 'react';
import { request } from '../axios';
import { Alert } from 'react-native';

interface CardState {
  like: number;
  dislike: number;
  share: number;
  postUuid: string;
}

export type ActionType = 'like' | 'dislike' | 'share';

const useCardActions = (
  initialState: CardState,
  viewerAction?: ActionType,
  enabled?: boolean,
) => {
  const [activeUserValue, setActiveUserValue] = useState<
    ActionType | undefined
  >(viewerAction);
  const [state, setState] = useState<CardState>(initialState);
  const [loading, setLoading] = useState(false);

  const handleAction = async (action: ActionType) => {
    setLoading(true);

    const prevState = { ...state };
    let newState: CardState;

    switch (activeUserValue) {
      case 'like':
        newState = handleLikes(prevState, action);
        break;
      case 'dislike':
        newState = handleDislikes(prevState, action);
        break;
      default:
        newState = handleNeutral(prevState, action);
        break;
    }

    setState(newState);
    setActiveUserValue(
      activeUserValue && action === activeUserValue ? undefined : action,
    );

    try {
      await updateCardState(action);
    } catch (error) {
      Alert.alert('Error', 'Adding reaction, please try again.');

      // Revert to previous state on error
      setState(prevState);
      console.error('Error updating card state:', error);
      // Display error message to the user
      // showToast('Failed to update card state. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleLikes = (prevState: CardState, action: ActionType) => {
    switch (action) {
      case 'like':
        return {
          ...prevState,
          like: prevState.like - 1,
        };
      case 'dislike':
        return {
          ...prevState,
          like: prevState.like - 1,
          dislike: prevState.dislike + 1,
        };
      default:
        return {
          ...prevState,
          like: prevState.like + 1,
        };
    }
  };

  const handleDislikes = (prevState: CardState, action: ActionType) => {
    switch (action) {
      case 'dislike':
        return {
          ...prevState,
          dislike: prevState.dislike - 1,
        };
      case 'like':
        return {
          ...prevState,
          dislike: prevState.dislike - 1,
          like: prevState.like + 1,
        };
      default:
        return {
          ...prevState,
          dislike: prevState.dislike + 1,
        };
    }
  };

  const handleNeutral = (prevState: CardState, action: ActionType) => {
    switch (action) {
      case 'like':
        return {
          ...prevState,
          like: prevState.like + 1,
        };
      case 'dislike':
        return {
          ...prevState,
          dislike: prevState.dislike + 1,
        };
      default:
        return prevState;
    }
  };

  const updateCardState = async (action: ActionType) => {
    await request({
      method: 'post',
      url: `/react/${initialState.postUuid}`,
      data: { reaction: action },
    });
    console.log('Post reacted', initialState.postUuid, '->', action);
  };

  return { state, handleAction, activeUserValue, loading };
};

export default useCardActions;
