import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, Platform } from 'react-native';

interface StoryProgressBarProps {
  isActive: boolean;
  isPaused: boolean;
  duration: number;
  index: number;
  currentIndex: number;
}

const StoryProgressBar: React.FC<StoryProgressBarProps> = ({
  isActive,
  isPaused,
  duration,
  index,
  currentIndex,
}) => {
  const progressAnimation = useRef(new Animated.Value(0)).current;
  const animation = useRef<Animated.CompositeAnimation | null>(null);

  useEffect(() => {
    // Clear any existing animation
    if (animation.current) {
      animation.current.stop();
    }
    
    if (isActive && !isPaused) {
      // Reset progress when becoming active
      progressAnimation.setValue(0);
      
      // Animate progress
      animation.current = Animated.timing(progressAnimation, {
        toValue: 1,
        duration: duration,
        useNativeDriver: Platform.OS !== 'web',
      });
      
      animation.current.start();
    } else if (index < currentIndex) {
      // Story already seen, show full progress
      progressAnimation.setValue(1);
    } else if (index > currentIndex) {
      // Future story, show no progress
      progressAnimation.setValue(0);
    }
    // If paused, we don't update the animation, preserving its current state
    
    return () => {
      if (animation.current) {
        animation.current.stop();
      }
    };
  }, [isActive, isPaused, currentIndex, index, duration]);

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.progress,
          {
            width: progressAnimation.interpolate({
              inputRange: [0, 1],
              outputRange: ['0%', '100%'],
            }),
          },
        ]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: 2,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    marginHorizontal: 2,
    borderRadius: 2,
  },
  progress: {
    height: '100%',
    backgroundColor: '#fff',
    borderRadius: 2,
  },
});

export default StoryProgressBar;