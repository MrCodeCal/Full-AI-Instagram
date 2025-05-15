import { useRef, useState } from 'react';
import { Animated, Platform } from 'react-native';
import * as Haptics from 'expo-haptics';

export const useLikeAnimation = (initialLiked: boolean = false) => {
  const [isLiked, setIsLiked] = useState(initialLiked);
  const heartScale = useRef(new Animated.Value(0)).current;
  const doubleTapRef = useRef<NodeJS.Timeout | null>(null);
  const lastTap = useRef<number>(0);

  const animateHeart = () => {
    // Reset scale to 0
    heartScale.setValue(0);
    
    // Animate to full size with spring effect
    Animated.spring(heartScale, {
      toValue: 1,
      friction: 3,
      tension: 40,
      useNativeDriver: Platform.OS !== 'web',
    }).start(() => {
      // Animate back to 0 after showing
      Animated.timing(heartScale, {
        toValue: 0,
        duration: 100,
        useNativeDriver: Platform.OS !== 'web',
      }).start();
    });
  };

  const triggerLike = () => {
    if (!isLiked) {
      setIsLiked(true);
      animateHeart();
      
      // Trigger haptic feedback on mobile
      if (Platform.OS !== 'web') {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }
    }
  };

  const toggleLike = () => {
    setIsLiked(!isLiked);
    
    // Trigger haptic feedback on mobile
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  };

  const handleDoubleTap = () => {
    const now = Date.now();
    const DOUBLE_TAP_DELAY = 300;
    
    if (lastTap.current && (now - lastTap.current) < DOUBLE_TAP_DELAY) {
      // Double tap detected
      if (doubleTapRef.current) {
        clearTimeout(doubleTapRef.current);
        doubleTapRef.current = null;
      }
      
      triggerLike();
    } else {
      // First tap
      lastTap.current = now;
    }
  };

  return {
    isLiked,
    setIsLiked,
    heartScale,
    handleDoubleTap,
    toggleLike,
    triggerLike,
  };
};