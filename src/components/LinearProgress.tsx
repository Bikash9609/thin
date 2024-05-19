import React from 'react';
import { LinearProgress, useTheme } from '@rneui/themed';

function LinearProgressGeneric() {
  const { theme } = useTheme();
  return (
    <LinearProgress
      variant="indeterminate"
      trackColor={theme.colors.blue[50]}
      color={theme.colors.blue[500]}
      style={{
        height: theme.border.size.medium,
        borderRadius: theme.borderRadius.lg,
      }}
    />
  );
}

export default LinearProgressGeneric;
