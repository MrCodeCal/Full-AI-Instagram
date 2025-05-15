import React, { useEffect, useState, useCallback } from 'react';
import { 
  View, 
  StyleSheet, 
  Dimensions, 
  TouchableOpacity, 
  StatusBar,
  Platform
} from 'react-native';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { X } from 'lucide-react-native';
import Colors from '@/constants/colors';
import { useStoriesStore } from '@/hooks/useStoriesStore';
import StoryProgressBar from '@/components/StoryProgressBar';

const { width, height } = Dimensions.get('window');

export default function StoryScreen() {
  const { userId } = useLocalSearchParams();
  const router = useRouter();
  const { stories, markStoryAsSeen } = useStoriesStore();
  
  const [currentStoryIndex, setCurrentStoryIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  
  // Find stories for the selected user
  const userStories = stories.find(s => s.userId === userId)?.items || [];
  
  // Mark story as seen when viewed - using useCallback to prevent infinite loops
  const markAsSeen = useCallback(() => {
    if (userStories.length > 0 && userId && currentStoryIndex < userStories.length) {
      markStoryAsSeen(userId as string, userStories[currentStoryIndex].id);
    }
  }, [userId, currentStoryIndex, userStories]);
  
  useEffect(() => {
    // Mark current story as seen
    markAsSeen();
    
    // Auto-advance to next story after duration
    let timer: NodeJS.Timeout | null = null;
    
    if (!isPaused && userStories.length > 0) {
      timer = setTimeout(() => {
        if (currentStoryIndex < userStories.length - 1) {
          setCurrentStoryIndex(currentStoryIndex + 1);
        } else {
          // End of stories for this user, go back
          router.back();
        }
      }, 5000); // 5 seconds per story
    }
    
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [currentStoryIndex, isPaused, userStories.length, markAsSeen]);
  
  const handleClose = () => {
    router.back();
  };
  
  const handlePrevStory = () => {
    if (currentStoryIndex > 0) {
      setCurrentStoryIndex(currentStoryIndex - 1);
    } else {
      // At the first story, go back
      router.back();
    }
  };
  
  const handleNextStory = () => {
    if (currentStoryIndex < userStories.length - 1) {
      setCurrentStoryIndex(currentStoryIndex + 1);
    } else {
      // End of stories for this user, go back
      router.back();
    }
  };
  
  const handlePress = (e: any) => {
    const touchX = e.nativeEvent.locationX;
    
    // Left third of screen goes to previous story
    if (touchX < width / 3) {
      handlePrevStory();
    } 
    // Right third of screen goes to next story
    else if (touchX > (width * 2) / 3) {
      handleNextStory();
    }
    // Middle third toggles pause
    else {
      setIsPaused(!isPaused);
    }
  };
  
  // If no stories, go back
  if (userStories.length === 0) {
    router.back();
    return null;
  }
  
  // Safety check to prevent index out of bounds
  const safeIndex = Math.min(currentStoryIndex, userStories.length - 1);
  const currentStory = userStories[safeIndex];
  
  if (!currentStory) {
    router.back();
    return null;
  }
  
  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      {/* Progress bars */}
      <View style={styles.progressContainer}>
        {userStories.map((story, index) => (
          <StoryProgressBar 
            key={story.id}
            isActive={index === safeIndex}
            isPaused={isPaused}
            duration={5000}
            index={index}
            currentIndex={safeIndex}
          />
        ))}
      </View>
      
      {/* Close button */}
      <TouchableOpacity style={styles.closeButton} onPress={handleClose}>
        <X size={24} color="#fff" />
      </TouchableOpacity>
      
      {/* Story content */}
      <TouchableOpacity 
        activeOpacity={1} 
        style={styles.storyContent}
        onPress={handlePress}
      >
        <Image 
          source={{ uri: currentStory.imageUrl }} 
          style={styles.storyImage}
          contentFit="cover"
        />
        
        {/* Optional gradient overlay for better text visibility */}
        <LinearGradient
          colors={['rgba(0,0,0,0.3)', 'transparent', 'rgba(0,0,0,0.3)']}
          style={styles.gradient}
          locations={[0, 0.5, 1]}
        />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  progressContainer: {
    flexDirection: 'row',
    position: 'absolute',
    top: Platform.OS === 'ios' ? 50 : 20,
    left: 0,
    right: 0,
    zIndex: 10,
    paddingHorizontal: 10,
  },
  closeButton: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 50 : 20,
    right: 15,
    zIndex: 10,
  },
  storyContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  storyImage: {
    width,
    height,
    position: 'absolute',
  },
  gradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
});