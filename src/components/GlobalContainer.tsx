import React from 'react';
import { View, StyleSheet, ViewStyle, StatusBar, Platform } from 'react-native';

interface GlobalContainerProps {
  children: React.ReactNode;
  style?: ViewStyle;
  backgroundColor?: string;
  edges?: ('top' | 'bottom' | 'left' | 'right')[];
  useInsets?: boolean; // Pour un contrôle plus fin avec useSafeAreaInsets
}

const GlobalContainer: React.FC<GlobalContainerProps> = ({ 
  children, 
  style, 
  backgroundColor = '#2a3b63',
  edges = ['top', 'bottom'],
  useInsets = false
}) => {
  // Calcul des marges safe area manuelles pour Android
  const statusBarHeight = Platform.OS === 'android' ? StatusBar.currentHeight || 24 : 0;
  const safeAreaTop = edges.includes('top') ? statusBarHeight : 0;
  const safeAreaBottom = edges.includes('bottom') ? 15 : 0; // Marge pour navigation bar

  const dynamicStyle = {
    paddingTop: safeAreaTop,
    paddingBottom: safeAreaBottom,
  };

  return (
    <View style={[styles.container, { backgroundColor }, dynamicStyle, style]}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default GlobalContainer;