import React, { useEffect, useState } from 'react';
import { 
  StyleSheet, 
  View, 
  FlatList, 
  StatusBar,
  Platform,
  Text,
  TouchableOpacity,
  RefreshControl
} from 'react-native';
import { users } from '@/mocks/posts';
import Post from '@/components/Post';
import StoryCircle from '@/components/StoryCircle';
import Colors from '@/constants/colors';
import { usePostsStore } from '@/hooks/usePostsStore';
import { aiUsers } from '@/mocks/aiUsers';
import { useRouter } from 'expo-router';
import { Plus } from 'lucide-react-native';
import { useStoriesStore } from '@/hooks/useStoriesStore';

export default function FeedScreen() {
  const { posts, currentUser, simulateAIActivity } = usePostsStore();
  const { stories, generateAIStories } = useStoriesStore();
  const router = useRouter();
  const [refreshing, setRefreshing] = useState(false);

  // Generate AI stories on first load if none exist
  useEffect(() => {
    if (stories.length === 0) {
      generateAIStories();
    }
    
    // Simulate AI activity periodically
    const interval = setInterval(() => {
      simulateAIActivity();
    }, 45000); // Every 45 seconds
    
    return () => clearInterval(interval);
  }, []);

  const allUsers = [currentUser, ...aiUsers.slice(0, 6)];

  const renderStoryItem = ({ item, index }: any) => (
    <StoryCircle 
      user={item} 
      isCurrentUser={index === 0}
      hasUnseenStory={index !== 2}
    />
  );

  const renderEmptyFeed = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyTitle}>Welcome to Your Feed</Text>
      <Text style={styles.emptyText}>
        Create your first post to get started with your single-player Instagram experience.
      </Text>
      <TouchableOpacity 
        style={styles.createButton}
        onPress={() => router.push('/(tabs)/create')}
      >
        <Plus size={20} color="#fff" />
        <Text style={styles.createButtonText}>Create Post</Text>
      </TouchableOpacity>
    </View>
  );

  const renderHeader = () => (
    <View style={styles.storiesContainer}>
      <FlatList
        data={allUsers}
        renderItem={renderStoryItem}
        keyExtractor={(item, index) => `story-${item.id}-${index}`}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.storiesList}
      />
      <View style={styles.separator} />
    </View>
  );

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    
    // Regenerate AI stories on refresh
    generateAIStories();
    
    // Simulate AI activity
    simulateAIActivity();
    
    // Simulate a refresh
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      {posts.length > 0 ? (
        <FlatList
          data={posts}
          renderItem={({ item }) => <Post post={item} />}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={renderHeader}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        />
      ) : (
        <View style={styles.container}>
          {renderHeader()}
          {renderEmptyFeed()}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  storiesContainer: {
    backgroundColor: Colors.light.background,
  },
  storiesList: {
    paddingVertical: 10,
    paddingHorizontal: 8,
  },
  separator: {
    height: 0.5,
    backgroundColor: Colors.light.border,
    marginTop: 5,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  emptyTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  emptyText: {
    fontSize: 16,
    color: Colors.light.placeholder,
    textAlign: 'center',
    marginBottom: 24,
  },
  createButton: {
    backgroundColor: Colors.light.tint,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  createButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    marginLeft: 8,
  },
});