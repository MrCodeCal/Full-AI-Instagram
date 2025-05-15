import React from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  TouchableOpacity, 
  FlatList, 
  Dimensions,
  ScrollView
} from 'react-native';
import { Image } from 'expo-image';
import { Settings, Grid, Bookmark, Tag } from 'lucide-react-native';
import Colors from '@/constants/colors';
import { usePostsStore } from '@/hooks/usePostsStore';
import { useRouter } from 'expo-router';

const { width } = Dimensions.get('window');
const THUMBNAIL_SIZE = width / 3 - 2;

export default function ProfileScreen() {
  const { posts, currentUser } = usePostsStore();
  const router = useRouter();
  const [activeTab, setActiveTab] = React.useState('posts');

  const userPosts = posts.filter(post => post.user.id === currentUser.id);
  const savedPosts = posts.filter(post => post.isSaved);

  const renderPostThumbnail = ({ item }: any) => (
    <TouchableOpacity style={styles.thumbnail}>
      <Image 
        source={{ uri: item.images[0] }} 
        style={styles.thumbnailImage}
        contentFit="cover"
      />
    </TouchableOpacity>
  );

  const renderEmptyPosts = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyTitle}>No Posts Yet</Text>
      <Text style={styles.emptyText}>
        When you create posts, they will appear here.
      </Text>
      <TouchableOpacity 
        style={styles.createButton}
        onPress={() => router.push('/(tabs)/create')}
      >
        <Text style={styles.createButtonText}>Create First Post</Text>
      </TouchableOpacity>
    </View>
  );

  const renderEmptySaved = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyTitle}>No Saved Posts</Text>
      <Text style={styles.emptyText}>
        Save posts to view them later.
      </Text>
    </View>
  );

  const handleEditProfile = () => {
    router.push('/edit-profile');
  };

  return (
    <ScrollView style={styles.container}>
      {/* Profile Header */}
      <View style={styles.profileHeader}>
        <View style={styles.profileInfo}>
          <Image 
            source={{ uri: currentUser.avatar }} 
            style={styles.profileImage}
            contentFit="cover"
          />
          <View style={styles.profileStats}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{userPosts.length}</Text>
              <Text style={styles.statLabel}>Posts</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>0</Text>
              <Text style={styles.statLabel}>Followers</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>0</Text>
              <Text style={styles.statLabel}>Following</Text>
            </View>
          </View>
        </View>
        
        <View style={styles.profileBio}>
          <Text style={styles.username}>{currentUser.username}</Text>
          <Text style={styles.bio}>Welcome to your single-player Instagram experience!</Text>
        </View>
        
        <View style={styles.profileActions}>
          <TouchableOpacity style={styles.editButton} onPress={handleEditProfile}>
            <Text style={styles.editButtonText}>Edit Profile</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.settingsButton}>
            <Settings size={20} color={Colors.light.text} />
          </TouchableOpacity>
        </View>
      </View>
      
      {/* Tabs */}
      <View style={styles.tabs}>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'posts' && styles.activeTab]} 
          onPress={() => setActiveTab('posts')}
        >
          <Grid 
            size={24} 
            color={activeTab === 'posts' ? Colors.light.text : Colors.light.placeholder} 
          />
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'saved' && styles.activeTab]} 
          onPress={() => setActiveTab('saved')}
        >
          <Bookmark 
            size={24} 
            color={activeTab === 'saved' ? Colors.light.text : Colors.light.placeholder} 
          />
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'tagged' && styles.activeTab]} 
          onPress={() => setActiveTab('tagged')}
        >
          <Tag 
            size={24} 
            color={activeTab === 'tagged' ? Colors.light.text : Colors.light.placeholder} 
          />
        </TouchableOpacity>
      </View>
      
      {/* Content */}
      {activeTab === 'posts' && (
        userPosts.length > 0 ? (
          <FlatList
            data={userPosts}
            renderItem={renderPostThumbnail}
            keyExtractor={(item) => item.id}
            numColumns={3}
            scrollEnabled={false}
          />
        ) : renderEmptyPosts()
      )}
      
      {activeTab === 'saved' && (
        savedPosts.length > 0 ? (
          <FlatList
            data={savedPosts}
            renderItem={renderPostThumbnail}
            keyExtractor={(item) => item.id}
            numColumns={3}
            scrollEnabled={false}
          />
        ) : renderEmptySaved()
      )}
      
      {activeTab === 'tagged' && (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyTitle}>No Tagged Posts</Text>
          <Text style={styles.emptyText}>
            When people tag you in posts, they'll appear here.
          </Text>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  profileHeader: {
    padding: 16,
  },
  profileInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: 24,
  },
  profileStats: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  statLabel: {
    fontSize: 14,
    color: Colors.light.text,
  },
  profileBio: {
    marginBottom: 16,
  },
  username: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  bio: {
    fontSize: 14,
  },
  profileActions: {
    flexDirection: 'row',
  },
  editButton: {
    flex: 1,
    backgroundColor: Colors.light.background,
    borderWidth: 1,
    borderColor: Colors.light.border,
    borderRadius: 4,
    paddingVertical: 6,
    alignItems: 'center',
    marginRight: 8,
  },
  editButtonText: {
    fontWeight: '600',
  },
  settingsButton: {
    width: 40,
    height: 32,
    borderWidth: 1,
    borderColor: Colors.light.border,
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabs: {
    flexDirection: 'row',
    borderTopWidth: 0.5,
    borderTopColor: Colors.light.border,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 12,
  },
  activeTab: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.text,
  },
  thumbnail: {
    width: THUMBNAIL_SIZE,
    height: THUMBNAIL_SIZE,
    margin: 1,
  },
  thumbnailImage: {
    width: '100%',
    height: '100%',
  },
  emptyContainer: {
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
    height: 300,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: Colors.light.placeholder,
    textAlign: 'center',
    marginBottom: 16,
  },
  createButton: {
    backgroundColor: Colors.light.tint,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 4,
  },
  createButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});