import React, { useEffect, useState } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  FlatList, 
  TouchableOpacity,
  RefreshControl
} from 'react-native';
import { Image } from 'expo-image';
import { Heart, MessageCircle, UserPlus } from 'lucide-react-native';
import Colors from '@/constants/colors';
import { usePostsStore, Notification } from '@/hooks/usePostsStore';
import { formatTimestamp } from '@/utils/helpers';
import { Stack } from 'expo-router';

export default function ActivityScreen() {
  const { notifications, markNotificationsAsSeen, simulateAIActivity } = usePostsStore();
  const [refreshing, setRefreshing] = useState(false);
  
  // Mark notifications as seen when viewing this screen
  useEffect(() => {
    markNotificationsAsSeen();
    
    // Simulate AI activity every 30 seconds
    const interval = setInterval(() => {
      simulateAIActivity();
    }, 30000);
    
    return () => clearInterval(interval);
  }, []);
  
  const onRefresh = () => {
    setRefreshing(true);
    
    // Simulate AI activity on refresh
    simulateAIActivity();
    
    // Simulate network delay
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };
  
  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'like':
        return <Heart size={16} color="#fff" fill={Colors.light.like} />;
      case 'comment':
        return <MessageCircle size={16} color="#fff" />;
      case 'follow':
        return <UserPlus size={16} color="#fff" />;
      default:
        return <Heart size={16} color="#fff" />;
    }
  };
  
  const getNotificationBackground = (type: string) => {
    switch (type) {
      case 'like':
        return Colors.light.like;
      case 'comment':
        return Colors.light.tint;
      case 'follow':
        return '#5851DB';
      default:
        return Colors.light.tint;
    }
  };
  
  const renderNotification = ({ item }: { item: Notification }) => {
    const user = item.userId ? { 
      id: item.userId,
      username: item.message.split(' ')[0],
      avatar: `https://images.unsplash.com/photo-${Math.floor(Math.random() * 1000000000)}?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=150&q=80`,
      isVerified: false
    } : null;
    
    return (
      <TouchableOpacity style={styles.notificationItem}>
        <View style={styles.notificationContent}>
          {user && (
            <Image 
              source={{ uri: user.avatar }} 
              style={styles.avatar}
              contentFit="cover"
            />
          )}
          <View style={styles.notificationTextContainer}>
            <Text style={styles.notificationText}>{item.message}</Text>
            <Text style={styles.notificationTime}>{formatTimestamp(item.timestamp)}</Text>
          </View>
        </View>
        <View 
          style={[
            styles.notificationIcon, 
            { backgroundColor: getNotificationBackground(item.type) }
          ]}
        >
          {getNotificationIcon(item.type)}
        </View>
      </TouchableOpacity>
    );
  };
  
  const renderEmptyNotifications = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyTitle}>No Activity Yet</Text>
      <Text style={styles.emptyText}>
        When you interact with posts or other users, you'll see notifications here.
      </Text>
    </View>
  );
  
  return (
    <>
      <Stack.Screen options={{ title: "Activity" }} />
      <View style={styles.container}>
        <FlatList
          data={notifications}
          renderItem={renderNotification}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.notificationsList}
          ListEmptyComponent={renderEmptyNotifications}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  notificationsList: {
    padding: 16,
    flexGrow: 1,
  },
  notificationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 0.5,
    borderBottomColor: Colors.light.border,
  },
  notificationContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 12,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    marginRight: 12,
  },
  notificationTextContainer: {
    flex: 1,
  },
  notificationText: {
    fontSize: 14,
    lineHeight: 20,
  },
  notificationTime: {
    fontSize: 12,
    color: Colors.light.placeholder,
    marginTop: 2,
  },
  notificationIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 100,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  emptyText: {
    fontSize: 16,
    color: Colors.light.placeholder,
    textAlign: 'center',
  },
});