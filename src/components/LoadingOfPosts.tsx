import { Skeleton, makeStyles } from '@rneui/themed';
import React, { useEffect } from 'react';
import { Dimensions, StatusBar, View } from 'react-native';
import { s, vs } from 'react-native-size-matters';
import Header from './Header';
import { useAppBar } from '../context/AppBarProvider';

const { width, height } = Dimensions.get('window');

function LoadingOfPosts() {
  const { toggleAppBarVisibility, isAppBarVisible, setWithoutbackdrop } =
    useAppBar();
  const styles = useStyles();

  useEffect(() => {
    if (!isAppBarVisible) {
      setWithoutbackdrop(true);
      toggleAppBarVisibility();
    }
  }, [isAppBarVisible]);

  return (
    <View style={styles.container}>
      <StatusBar showHideTransition="slide" />
      <View>
        <Skeleton
          animation="wave"
          width={width}
          height={s(200)}
          style={styles.image}
        />

        <Skeleton
          animation="wave"
          width={width}
          height={s(50)}
          style={styles.title}
        />
        <Skeleton
          animation="wave"
          width={width}
          height={s(40)}
          style={styles.subtitle}
        />
        <Skeleton
          animation="wave"
          width={width}
          height={s(200)}
          style={styles.content}
        />

        <Skeleton
          animation="wave"
          width={width}
          height={s(100)}
          style={styles.footer}
        />
      </View>
    </View>
  );
}

const useStyles = makeStyles(theme => ({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    height: '100%',
  },

  image: {
    borderBottomLeftRadius: s(16),
    borderBottomRightRadius: s(16),
  },

  title: {
    marginTop: s(10),
    padding: s(10),
    borderRadius: s(10),
  },
  subtitle: {
    marginTop: s(4),
    padding: s(10),
    borderRadius: s(10),
  },

  content: {
    marginTop: s(5),
    padding: s(10),
    borderRadius: s(10),
  },

  footer: {
    borderTopLeftRadius: s(10),
    borderTopRightRadius: s(10),
  },
}));

export default React.memo(LoadingOfPosts);
