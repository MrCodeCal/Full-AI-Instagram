import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Pressable,
  Platform,
  ActivityIndicator
} from 'react-native';
import { Image } from 'expo-image';
import { 
  Heart, 
  MessageCircle, 
  Send, 
  Bookmark, 
  MoreHorizontal, 
  CheckCircle2
} from 'lucide-react-native';
import Colors from '@/constants/colors';
import { Post as PostType } from '@/mocks/posts';
import PostCarousel from './PostCarousel';
import { usePostsStore } from '@/hooks/usePostsStore';
import { formatTimestamp } from '@/utils/helpers';
import CommentsList from './CommentsList';
import LikesModal from './LikesModal';

interface PostProps {
  post: PostType;
}

const Post: React.FC<PostProps> = ({ post }) => {
  const [isLiked, setIsLiked] = useState(post.isLiked);
  const [isSaved, setIsSaved] = useState(post.isSaved);
  const [likesCount, setLikesCount] = useState(post.likes);
  const [showComments, setShowComments] = useState(false);
  const [isAddingComment, setIsAddingComment] = useState(false);
  const [showLikesModal, setShowLikesModal] = useState(false);
  const [likedBy, setLikedBy] = useState(post.likedBy || []);
  
  const { likePost, unlikePost, savePost, unsavePost } = usePostsStore();

  // Update local state when post changes
  useEffect(() => {
    setLikedBy(post.likedBy || []);
    setLikesCount(post.likes);
    setIsLiked(post.isLiked);
    setIsSaved(post.isSaved);
  }, [post]);

  const handleLikePress = () => {
    if (isLiked) {
      unlikePost(post.id);
      setIsLiked(false);
      setLikesCount(likesCount - 1);
    } else {
      likePost(post.id);
      setIsLiked(true);
      setLikesCount(likesCount + 1);
    }
  };

  const handleDoubleTapLike = () => {
    if (!isLiked) {
      likePost(post.id);
      setIsLiked(true);
      setLikesCount(likesCount + 1);
    }
  };

  const handleSavePress = () => {
    if (isSaved) {
      unsavePost(post.id);
      setIsSaved(false);
    } else {
      savePost(post.id);
      setIsSaved(true);
    }
  };

  const formatCaption = (caption: string) => {
    // Format hashtags to be highlighted
    const formattedCaption = caption.split(' ').map((word, index) => {
      if (word.startsWith('#')) {
        return (
          <Text key={index} style={styles.hashtag}>
            {word}{' '}
          </Text>
        );
      }
      return word + ' ';
    });
    
    return formattedCaption;
  };

  const toggleComments = () => {
    setShowComments(!showComments);
  };

  const toggleLikesModal = () => {
    setShowLikesModal(!showLikesModal);
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.userInfo}>
          <Image 
            source={{ uri: post.user.avatar }} 
            style={styles.avatar}
            contentFit="cover"
            transition={200}
          />
          <View style={styles.usernameContainer}>
            <View style={styles.usernameRow}>
              <Text style={styles.username}>{post.user.username}</Text>
              {post.user.isVerified && (
                <CheckCircle2 
                  size={14} 
                  color={Colors.light.tint} 
                  fill={Colors.light.tint}
                  style={styles.verifiedBadge}
                />
              )}
            </View>
            {post.location && (
              <Text style={styles.location}>{post.location}</Text>
            )}
          </View>
        </View>
        <TouchableOpacity>
          <MoreHorizontal size={24} color={Colors.light.text} />
        </TouchableOpacity>
      </View>

      {/* Post Images */}
      <PostCarousel 
        images={post.images} 
        onLike={handleDoubleTapLike}
        isLiked={isLiked}
      />

      {/* Action Buttons */}
      <View style={styles.actions}>
        <View style={styles.leftActions}>
          <TouchableOpacity 
            style={styles.actionButton} 
            onPress={handleLikePress}
            activeOpacity={0.7}
          >
            <Heart 
              size={24} 
              color={isLiked ? Colors.light.like : Colors.light.text} 
              fill={isLiked ? Colors.light.like : 'transparent'} 
            />
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.actionButton} 
            activeOpacity={0.7}
            onPress={toggleComments}
          >
            <MessageCircle size={24} color={Colors.light.text} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton} activeOpacity={0.7}>
            <Send size={24} color={Colors.light.text} />
          </TouchableOpacity>
        </View>
        
        <TouchableOpacity 
          onPress={handleSavePress}
          activeOpacity={0.7}
        >
          <Bookmark 
            size={24} 
            color={Colors.light.text} 
            fill={isSaved ? Colors.light.text : 'transparent'} 
          />
        </TouchableOpacity>
      </View>

      {/* Likes */}
      <Pressable style={styles.likesContainer} onPress={toggleLikesModal}>
        {likedBy && likedBy.length > 0 ? (
          <View style={styles.likedByContainer}>
            <View style={styles.likedByAvatars}>
              {likedBy.slice(0, 3).map((user, index) => (
                <Image 
                  key={user.id}
                  source={{ uri: user.avatar }}
                  style={[
                    styles.likedByAvatar,
                    { marginLeft: index > 0 ? -10 : 0, zIndex: 3 - index }
                  ]}
                  contentFit="cover"
                />
              ))}
            </View>
            <Text style={styles.likes}>
              Liked by <Text style={styles.likedByUsername}>{likedBy[0].username}</Text>
              {likedBy.length > 1 ? (
                <Text> and <Text style={styles.likedByUsername}>{likesCount - 1} others</Text></Text>
              ) : null}
            </Text>
          </View>
        ) : (
          <Text style={styles.likes}>{likesCount.toLocaleString()} likes</Text>
        )}
      </Pressable>

      {/* Caption */}
      <View style={styles.captionContainer}>
        <Text style={styles.captionUsername}>{post.user.username}</Text>
        <Text style={styles.caption}>{formatCaption(post.caption)}</Text>
      </View>

      {/* Comments */}
      {post.comments.length > 0 && !showComments && (
        <TouchableOpacity style={styles.commentsButton} onPress={toggleComments}>
          <Text style={styles.viewComments}>
            {post.comments.length === 1 
              ? 'View 1 comment' 
              : `View all ${post.comments.length} comments`}
          </Text>
        </TouchableOpacity>
      )}

      {/* Comments Section */}
      {showComments && (
        <CommentsList 
          comments={post.comments} 
          postId={post.id}
          onClose={toggleComments}
        />
      )}

      {/* Timestamp */}
      <Text style={styles.timestamp}>{formatTimestamp(post.createdAt)}</Text>

      {/* Likes Modal */}
      {showLikesModal && (
        <LikesModal 
          visible={showLikesModal}
          onClose={toggleLikesModal}
          users={likedBy || []}
          likesCount={likesCount}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.light.background,
    marginBottom: 10,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 10,
  },
  usernameContainer: {
    justifyContent: 'center',
  },
  usernameRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  username: {
    fontWeight: '600',
    fontSize: 14,
  },
  verifiedBadge: {
    marginLeft: 4,
  },
  location: {
    fontSize: 12,
    color: Colors.light.placeholder,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  leftActions: {
    flexDirection: 'row',
  },
  actionButton: {
    marginRight: 16,
  },
  likesContainer: {
    paddingHorizontal: 12,
    marginBottom: 6,
  },
  likedByContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  likedByAvatars: {
    flexDirection: 'row',
    marginRight: 8,
  },
  likedByAvatar: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: Colors.light.background,
  },
  likes: {
    fontWeight: '400',
    fontSize: 14,
  },
  likedByUsername: {
    fontWeight: '600',
  },
  captionContainer: {
    paddingHorizontal: 12,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  captionUsername: {
    fontWeight: '600',
    fontSize: 14,
    marginRight: 4,
  },
  caption: {
    fontSize: 14,
    flex: 1,
    flexWrap: 'wrap',
  },
  hashtag: {
    color: Colors.light.link,
  },
  commentsButton: {
    paddingHorizontal: 12,
    marginTop: 6,
  },
  viewComments: {
    color: Colors.light.placeholder,
    fontSize: 14,
  },
  timestamp: {
    paddingHorizontal: 12,
    marginTop: 6,
    marginBottom: 10,
    fontSize: 12,
    color: Colors.light.placeholder,
    textTransform: 'uppercase',
  },
});

export default Post;