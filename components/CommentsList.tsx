import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Animated
} from 'react-native';
import { Image } from 'expo-image';
import { X, Heart, Send, CheckCircle2 } from 'lucide-react-native';
import Colors from '@/constants/colors';
import { Comment } from '@/mocks/posts';
import { usePostsStore } from '@/hooks/usePostsStore';
import { formatTimestamp } from '@/utils/helpers';
import { generateAIReply } from '@/utils/aiHelpers';
import { AIUser, aiUsers } from '@/mocks/aiUsers';

interface CommentsListProps {
  comments: Comment[];
  postId: string;
  onClose: () => void;
}

const CommentsList: React.FC<CommentsListProps> = ({ comments, postId, onClose }) => {
  const [newComment, setNewComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [localComments, setLocalComments] = useState<Comment[]>(comments);
  const [likedComments, setLikedComments] = useState<Record<string, boolean>>({});
  const inputRef = useRef<TextInput>(null);
  const { currentUser, addComment, likeComment } = usePostsStore();
  
  // Animation values for new comments
  const newCommentAnim = useRef(new Animated.Value(0)).current;
  const [lastAddedCommentId, setLastAddedCommentId] = useState<string | null>(null);
  
  // Initialize liked comments state
  useEffect(() => {
    const initialLikedState: Record<string, boolean> = {};
    comments.forEach(comment => {
      initialLikedState[comment.id] = comment.likedBy?.some(user => user.id === currentUser.id) || false;
    });
    setLikedComments(initialLikedState);
  }, []);
  
  const handleSubmitComment = async () => {
    if (!newComment.trim()) return;
    
    setIsSubmitting(true);
    
    // Add user comment
    const userComment: Comment = {
      id: Date.now().toString(),
      user: currentUser,
      text: newComment.trim(),
      createdAt: new Date().toISOString(),
      likes: 0,
      likedBy: [],
    };
    
    // Update local state immediately
    setLocalComments(prev => [...prev, userComment]);
    setLastAddedCommentId(userComment.id);
    
    // Animate new comment
    newCommentAnim.setValue(1);
    Animated.timing(newCommentAnim, {
      toValue: 0,
      duration: 1000,
      useNativeDriver: Platform.OS !== 'web',
    }).start();
    
    // Add to global store
    addComment(postId, newComment.trim(), currentUser);
    
    // Clear input
    setNewComment('');
    
    // Simulate AI reply after a short delay
    setTimeout(async () => {
      try {
        // Select a random AI user to reply
        const randomAiUser = aiUsers[Math.floor(Math.random() * aiUsers.length)] as AIUser;
        
        // Generate AI reply
        const aiReplyText = await generateAIReply(userComment.text, randomAiUser.personality);
        
        // Create AI comment
        const aiReply: Comment = {
          id: Date.now().toString() + '-ai',
          user: randomAiUser,
          text: aiReplyText,
          createdAt: new Date().toISOString(),
          likes: 0,
          likedBy: [],
        };
        
        // Add AI reply to local state and global store
        setLocalComments(prev => [...prev, aiReply]);
        setLastAddedCommentId(aiReply.id);
        
        // Animate new comment
        newCommentAnim.setValue(1);
        Animated.timing(newCommentAnim, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: Platform.OS !== 'web',
        }).start();
        
        addComment(postId, aiReplyText, randomAiUser);
        
        // 30% chance for another AI user to reply
        if (Math.random() < 0.3) {
          setTimeout(async () => {
            // Select a different AI user
            let differentAiUser;
            do {
              const randomIndex = Math.floor(Math.random() * aiUsers.length);
              differentAiUser = aiUsers[randomIndex] as AIUser;
            } while (differentAiUser.id === randomAiUser.id);
            
            // Generate another AI reply
            const secondAiReplyText = await generateAIReply(aiReplyText, differentAiUser.personality);
            
            // Create second AI comment
            const secondAiReply: Comment = {
              id: Date.now().toString() + '-ai2',
              user: differentAiUser,
              text: secondAiReplyText,
              createdAt: new Date().toISOString(),
              likes: 0,
              likedBy: [],
            };
            
            // Add second AI reply
            setLocalComments(prev => [...prev, secondAiReply]);
            setLastAddedCommentId(secondAiReply.id);
            
            // Animate new comment
            newCommentAnim.setValue(1);
            Animated.timing(newCommentAnim, {
              toValue: 0,
              duration: 1000,
              useNativeDriver: Platform.OS !== 'web',
            }).start();
            
            addComment(postId, secondAiReplyText, differentAiUser);
          }, 3000);
        }
      } catch (error) {
        console.error('Error generating AI reply:', error);
      } finally {
        setIsSubmitting(false);
      }
    }, 1500);
  };

  const handleLikeComment = (commentId: string) => {
    // Toggle like state
    setLikedComments(prev => ({
      ...prev,
      [commentId]: !prev[commentId]
    }));
    
    // Update local comments
    setLocalComments(prev => 
      prev.map(comment => 
        comment.id === commentId 
          ? { 
              ...comment, 
              likes: likedComments[commentId] ? comment.likes - 1 : comment.likes + 1,
              likedBy: likedComments[commentId] 
                ? comment.likedBy?.filter(user => user.id !== currentUser.id) || []
                : [...(comment.likedBy || []), currentUser]
            } 
          : comment
      )
    );
    
    // Update in store
    likeComment(postId, commentId, currentUser.id);
  };

  const renderComment = ({ item }: { item: Comment }) => {
    const isNewComment = item.id === lastAddedCommentId;
    
    return (
      <Animated.View 
        style={[
          styles.commentContainer,
          isNewComment && {
            backgroundColor: newCommentAnim.interpolate({
              inputRange: [0, 1],
              outputRange: ['transparent', 'rgba(0, 149, 246, 0.1)']
            })
          }
        ]}
      >
        <Image
          source={{ uri: item.user.avatar }}
          style={styles.commentAvatar}
          contentFit="cover"
        />
        <View style={styles.commentContent}>
          <View style={styles.commentHeader}>
            <View style={styles.usernameRow}>
              <Text style={styles.commentUsername}>{item.user.username}</Text>
              {item.user.isVerified && (
                <CheckCircle2 
                  size={12} 
                  color={Colors.light.tint} 
                  fill={Colors.light.tint}
                  style={styles.verifiedBadge}
                />
              )}
            </View>
            <Text style={styles.commentText}>{item.text}</Text>
          </View>
          <View style={styles.commentFooter}>
            <Text style={styles.commentTime}>{formatTimestamp(item.createdAt)}</Text>
            {item.likes > 0 && (
              <Text style={styles.likesCount}>{item.likes} likes</Text>
            )}
            <TouchableOpacity>
              <Text style={styles.replyButton}>Reply</Text>
            </TouchableOpacity>
          </View>
        </View>
        <TouchableOpacity 
          style={styles.likeButton}
          onPress={() => handleLikeComment(item.id)}
        >
          <Heart 
            size={14} 
            color={likedComments[item.id] ? Colors.light.like : Colors.light.placeholder} 
            fill={likedComments[item.id] ? Colors.light.like : 'transparent'} 
          />
        </TouchableOpacity>
      </Animated.View>
    );
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.container}
      keyboardVerticalOffset={100}
    >
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Comments</Text>
        <TouchableOpacity onPress={onClose}>
          <X size={24} color={Colors.light.text} />
        </TouchableOpacity>
      </View>
      
      <FlatList
        data={localComments}
        renderItem={renderComment}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.commentsList}
      />
      
      <View style={styles.inputContainer}>
        <Image
          source={{ uri: currentUser.avatar }}
          style={styles.inputAvatar}
          contentFit="cover"
        />
        <TextInput
          ref={inputRef}
          style={styles.input}
          placeholder="Add a comment..."
          placeholderTextColor={Colors.light.placeholder}
          value={newComment}
          onChangeText={setNewComment}
          multiline
        />
        {newComment.trim() ? (
          <TouchableOpacity 
            style={styles.postButton} 
            onPress={handleSubmitComment}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <ActivityIndicator size="small" color={Colors.light.tint} />
            ) : (
              <Send size={24} color={Colors.light.tint} />
            )}
          </TouchableOpacity>
        ) : null}
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.light.background,
    borderTopWidth: 1,
    borderTopColor: Colors.light.border,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 0.5,
    borderBottomColor: Colors.light.border,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  commentsList: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  commentContainer: {
    flexDirection: 'row',
    marginBottom: 16,
    paddingVertical: 6,
    paddingHorizontal: 4,
    borderRadius: 8,
  },
  commentAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 12,
  },
  commentContent: {
    flex: 1,
  },
  commentHeader: {
    flexDirection: 'column',
  },
  usernameRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  commentUsername: {
    fontWeight: '600',
    marginRight: 4,
  },
  verifiedBadge: {
    marginLeft: 2,
  },
  commentText: {
    flexWrap: 'wrap',
    marginTop: 2,
  },
  commentFooter: {
    flexDirection: 'row',
    marginTop: 4,
    alignItems: 'center',
  },
  commentTime: {
    fontSize: 12,
    color: Colors.light.placeholder,
    marginRight: 12,
  },
  likesCount: {
    fontSize: 12,
    color: Colors.light.placeholder,
    marginRight: 12,
  },
  replyButton: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.light.placeholder,
  },
  likeButton: {
    marginLeft: 8,
    alignSelf: 'flex-start',
    marginTop: 4,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 0.5,
    borderTopColor: Colors.light.border,
  },
  inputAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 14,
    maxHeight: 80,
  },
  postButton: {
    marginLeft: 12,
  },
});

export default CommentsList;