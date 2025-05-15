import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import Colors from '@/constants/colors';
import { User } from '@/mocks/posts';
import { useStoriesStore } from '@/hooks/useStoriesStore';

interface StoryCircleProps {
  user: User;
  isCurrentUser?: boolean;
  hasUnseenStory?: boolean;
}

const StoryCircle: React.FC<StoryCircleProps> = ({ 
  user, 
  isCurrentUser = false,
  hasUnseenStory = true
}) => {
  const router = useRouter();
  const { hasUnseenStories } = useStoriesStore();
  
  // Check if user has unseen stories
  const userHasUnseenStories = hasUnseenStories(user.id);
  
  // Use provided prop or check from store
  const showStoryRing = hasUnseenStory !== undefined ? hasUnseenStory : userHasUnseenStories;
  
  const handlePress = () => {
    // Navigate to story screen with user ID
    router.push(`/story?userId=${user.id}`);
  };
  
  return (
    <TouchableOpacity style={styles.container} activeOpacity={0.8} onPress={handlePress}>
      {showStoryRing ? (
        <LinearGradient
          colors={[Colors.light.storyRing.start, Colors.light.storyRing.end]}
          style={styles.storyRing}
          start={{ x: 0, y: 1 }}
          end={{ x: 1, y: 0 }}
        >
          <View style={styles.avatarContainer}>
            <Image 
              source={{ uri: user.avatar }} 
              style={styles.avatar}
              contentFit="cover"
              transition={200}
            />
          </View>
        </LinearGradient>
      ) : (
        <View style={styles.noStoryRing}>
          <Image 
            source={{ uri: user.avatar }} 
            style={styles.avatar}
            contentFit="cover"
            transition={200}
          />
        </View>
      )}
      <Text style={styles.username} numberOfLines={1}>
        {isCurrentUser ? 'Your story' : user.username}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginHorizontal: 8,
    width: 70,
  },
  storyRing: {
    width: 68,
    height: 68,
    borderRadius: 34,
    alignItems: 'center',
    justifyContent: 'center',
  },
  noStoryRing: {
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 1,
    borderColor: Colors.light.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarContainer: {
    width: 62,
    height: 62,
    borderRadius: 31,
    backgroundColor: Colors.light.background,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: Colors.light.background,
  },
  avatar: {
    width: 58,
    height: 58,
    borderRadius: 29,
  },
  username: {
    fontSize: 12,
    marginTop: 4,
    textAlign: 'center',
    width: 64,
    overflow: 'hidden',
  },
});

export default StoryCircle;