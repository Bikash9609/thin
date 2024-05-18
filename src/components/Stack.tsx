import React, {PropsWithChildren} from 'react';

import {makeStyles} from '@rneui/themed';
import {FlexAlignType, View, ViewStyle} from 'react-native';

type Props = {
  direction: 'row' | 'column';
  justifyC?: 'space-between' | 'center' | 'flex-end' | 'flex-start';
  alignI?: FlexAlignType;
  style?: ViewStyle;
  p?: number;
  px?: number;
  py?: number;
  pt?: number;
  pr?: number;
  pb?: number;
  pl?: number;
  m?: number;
  mx?: number;
  my?: number;
  mt?: number;
  mr?: number;
  mb?: number;
  ml?: number;
  spacing?: number;
};

const useStyles = makeStyles((theme, props: Props) => ({
  root: {
    display: 'flex',
    justifyContent: props.justifyC || 'center',
    alignItems: props.alignI || 'center',
    flexDirection: props.direction,
    padding: props.p,
    paddingHorizontal: props.px,
    paddingVertical: props.py,
    paddingTop: props.pt,
    paddingRight: props.pr,
    paddingBottom: props.pb,
    paddingLeft: props.pl,
    margin: props.m,
    marginHorizontal: props.mx,
    marginVertical: props.my,
    marginTop: props.mt,
    marginRight: props.mr,
    marginBottom: props.mb,
    marginLeft: props.ml,
    gap: props.spacing,
  },
}));

function Stack({
  children,
  style,
  direction,
  justifyC,
  alignI,
  ...restProps
}: PropsWithChildren<Props>) {
  const styles = useStyles({direction, justifyC, alignI, ...restProps});
  return (
    <View style={[style, styles.root]} {...restProps}>
      {children}
    </View>
  );
}

export default Stack;
