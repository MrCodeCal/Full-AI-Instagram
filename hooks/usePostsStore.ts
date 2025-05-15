import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Post, User, Comment } from '@/mocks/posts';
import { generateUniqueId } from '@/utils/helpers';
import { aiUsers } from '@/mocks/aiUsers';
import { generateAIComment } from '@/utils/aiHelpers';

interface ProfileUpdateData {
  username: string;
  bio?: string;
  avatar: string;
}

interface PostsState {
  posts: Post[];
  currentUser: User;
  notifications: Notification[];
  addPost: (images: string[], caption: string, location?: string) => Promise<Post>;
  likePost: (postId: string, userId?: string) => void;
  unlikePost: (postId: string) => void;
  savePost: (postId: string) => void;
  unsavePost: (postId: string) => void;
  addComment: (postId: string, text: string, user: User) => void;
  likeComment: (postId: string, commentId: string, userId: string) => void;
  updateProfile: (data: ProfileUpdateData) => Promise<void>;
  addNotification: (notification: Notification) => void;
  markNotificationsAsSeen: () => void;
  clearNotification: (id: string) => void;
  simulateAIActivity: () => void;
}

export interface Notification {
  id: string;
  type: 'like' | 'comment' | 'follow' | 'mention';
  userId: string;
  postId?: string;
  commentId?: string;
  message: string;
  timestamp: string;
  seen: boolean;
}

export const usePostsStore = create<PostsState>()(
  persist(
    (set, get) => ({
      posts: [],
      currentUser: {
        id: "current-user",
        username: "you",
        avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=150&q=80",
        isVerified: true,
      },
      notifications: [],
      
      addPost: async (images, caption, location) => {
        const newPost: Post = {
          id: generateUniqueId(),
          user: get().currentUser,
          images,
          caption,
          likes: 0,
          comments: [],
          createdAt: new Date().toISOString(),
          location,
          isLiked: false,
          isSaved: false,
          likedBy: [],
        };
        
        set((state) => ({
          posts: [newPost, ...state.posts],
        }));
        
        // Simulate AI users adding comments after a short delay
        setTimeout(() => {
          // Generate 2-5 comments from random AI users
          const commentCount = Math.floor(Math.random() * 4) + 2;
          
          for (let i = 0; i < commentCount; i++) {
            // Add delay between comments to make it feel more natural
            setTimeout(async () => {
              const randomUserIndex = Math.floor(Math.random() * aiUsers.length);
              const aiUser = aiUsers[randomUserIndex];
              const commentText = await generateAIComment(caption, aiUser.personality);
              
              get().addComment(newPost.id, commentText, aiUser);
              
              // Add notification
              get().addNotification({
                id: generateUniqueId(),
                type: 'comment',
                userId: aiUser.id,
                postId: newPost.id,
                message: `${aiUser.username} commented on your post: "${commentText.substring(0, 30)}${commentText.length > 30 ? '...' : ''}"`,
                timestamp: new Date().toISOString(),
                seen: false,
              });
            }, i * 3000); // Stagger comments by 3 seconds each
          }
        }, 2000); // Wait 2 seconds after post creation
        
        // Simulate AI users liking the post
        setTimeout(() => {
          const likeCount = Math.floor(Math.random() * 5) + 3; // 3-7 likes
          const likedUsers = new Set();
          
          for (let i = 0; i < likeCount; i++) {
            setTimeout(() => {
              let randomUserIndex;
              do {
                randomUserIndex = Math.floor(Math.random() * aiUsers.length);
              } while (likedUsers.has(randomUserIndex));
              
              likedUsers.add(randomUserIndex);
              const aiUser = aiUsers[randomUserIndex];
              
              get().likePost(newPost.id, aiUser.id);
              
              // Add notification for the first 3 likes only (to avoid spam)
              if (i < 3) {
                get().addNotification({
                  id: generateUniqueId(),
                  type: 'like',
                  userId: aiUser.id,
                  postId: newPost.id,
                  message: `${aiUser.username} liked your post`,
                  timestamp: new Date().toISOString(),
                  seen: false,
                });
              }
            }, i * 2000); // Stagger likes by 2 seconds each
          }
        }, 5000); // Wait 5 seconds after post creation
        
        return newPost;
      },
      
      likePost: (postId, userId) => {
        set((state) => {
          const updatedPosts = state.posts.map((post) => {
            if (post.id === postId) {
              // If no userId provided, it's the current user
              const likerId = userId || state.currentUser.id;
              const likerUser = userId ? aiUsers.find(u => u.id === userId) || state.currentUser : state.currentUser;
              
              // Check if already liked by this user
              if (!post.likedBy || !post.likedBy.some(u => u.id === likerId)) {
                return { 
                  ...post, 
                  isLiked: likerId === state.currentUser.id ? true : post.isLiked,
                  likes: post.likes + 1,
                  likedBy: [...(post.likedBy || []), likerUser]
                };
              }
            }
            return post;
          });
          
          return { posts: updatedPosts };
        });
      },
      
      unlikePost: (postId) => {
        set((state) => {
          const updatedPosts = state.posts.map((post) => {
            if (post.id === postId) {
              return { 
                ...post, 
                isLiked: false, 
                likes: post.likes - 1,
                likedBy: post.likedBy ? post.likedBy.filter(u => u.id !== state.currentUser.id) : []
              };
            }
            return post;
          });
          
          return { posts: updatedPosts };
        });
      },
      
      savePost: (postId) => {
        set((state) => ({
          posts: state.posts.map((post) => 
            post.id === postId ? { ...post, isSaved: true } : post
          ),
        }));
      },
      
      unsavePost: (postId) => {
        set((state) => ({
          posts: state.posts.map((post) => 
            post.id === postId ? { ...post, isSaved: false } : post
          ),
        }));
      },
      
      addComment: (postId, text, user) => {
        const newComment: Comment = {
          id: generateUniqueId(),
          user,
          text,
          createdAt: new Date().toISOString(),
          likes: 0,
          likedBy: [],
        };
        
        set((state) => ({
          posts: state.posts.map((post) => 
            post.id === postId 
              ? { ...post, comments: [...post.comments, newComment] } 
              : post
          ),
        }));
        
        // If it's a user comment (not AI), simulate AI likes on the comment
        if (user.id === get().currentUser.id) {
          setTimeout(() => {
            // 50% chance of getting a like on your comment
            if (Math.random() > 0.5) {
              const randomUserIndex = Math.floor(Math.random() * aiUsers.length);
              const aiUser = aiUsers[randomUserIndex];
              
              get().likeComment(postId, newComment.id, aiUser.id);
              
              // Add notification
              get().addNotification({
                id: generateUniqueId(),
                type: 'like',
                userId: aiUser.id,
                postId: postId,
                commentId: newComment.id,
                message: `${aiUser.username} liked your comment: "${text.substring(0, 20)}${text.length > 20 ? '...' : ''}"`,
                timestamp: new Date().toISOString(),
                seen: false,
              });
            }
          }, 3000);
        }
        
        return newComment;
      },
      
      likeComment: (postId, commentId, userId) => {
        set((state) => {
          const likerUser = userId === state.currentUser.id 
            ? state.currentUser 
            : aiUsers.find(u => u.id === userId) || state.currentUser;
          
          const updatedPosts = state.posts.map((post) => {
            if (post.id === postId) {
              const updatedComments = post.comments.map((comment) => {
                if (comment.id === commentId) {
                  // Check if already liked by this user
                  if (!comment.likedBy || !comment.likedBy.some(u => u.id === userId)) {
                    return {
                      ...comment,
                      likes: comment.likes + 1,
                      likedBy: [...(comment.likedBy || []), likerUser]
                    };
                  }
                }
                return comment;
              });
              
              return { ...post, comments: updatedComments };
            }
            return post;
          });
          
          return { posts: updatedPosts };
        });
      },
      
      updateProfile: async (data) => {
        // Update current user
        set((state) => ({
          currentUser: {
            ...state.currentUser,
            username: data.username,
            avatar: data.avatar,
          },
        }));
        
        // Also update user reference in all posts
        set((state) => ({
          posts: state.posts.map((post) => 
            post.user.id === state.currentUser.id
              ? { 
                  ...post, 
                  user: {
                    ...post.user,
                    username: data.username,
                    avatar: data.avatar,
                  }
                }
              : post
          ),
        }));
        
        // Simulate network delay
        return new Promise((resolve) => setTimeout(resolve, 500));
      },
      
      addNotification: (notification) => {
        set((state) => ({
          notifications: [notification, ...state.notifications]
        }));
      },
      
      markNotificationsAsSeen: () => {
        set((state) => ({
          notifications: state.notifications.map(notif => ({
            ...notif,
            seen: true
          }))
        }));
      },
      
      clearNotification: (id) => {
        set((state) => ({
          notifications: state.notifications.filter(notif => notif.id !== id)
        }));
      },
      
      simulateAIActivity: () => {
        const { posts } = get();
        
        // Only proceed if there are posts
        if (posts.length === 0) return;
        
        // Randomly select a post to interact with
        const randomPostIndex = Math.floor(Math.random() * posts.length);
        const selectedPost = posts[randomPostIndex];
        
        // Randomly decide what type of interaction to simulate
        const interactionType = Math.random();
        
        // 60% chance to add a comment
        if (interactionType < 0.6) {
          // Select random AI user
          const randomUserIndex = Math.floor(Math.random() * aiUsers.length);
          const aiUser = aiUsers[randomUserIndex];
          
          // Generate and add comment
          setTimeout(async () => {
            const commentText = await generateAIComment(selectedPost.caption, aiUser.personality);
            get().addComment(selectedPost.id, commentText, aiUser);
            
            // Add notification if it's the current user's post
            if (selectedPost.user.id === get().currentUser.id) {
              get().addNotification({
                id: generateUniqueId(),
                type: 'comment',
                userId: aiUser.id,
                postId: selectedPost.id,
                message: `${aiUser.username} commented on your post: "${commentText.substring(0, 30)}${commentText.length > 30 ? '...' : ''}"`,
                timestamp: new Date().toISOString(),
                seen: false,
              });
            }
          }, 1000);
        } 
        // 40% chance to add a like
        else {
          // Select random AI user
          const randomUserIndex = Math.floor(Math.random() * aiUsers.length);
          const aiUser = aiUsers[randomUserIndex];
          
          // Check if this user already liked the post
          const alreadyLiked = selectedPost.likedBy && selectedPost.likedBy.some(u => u.id === aiUser.id);
          
          if (!alreadyLiked) {
            // Add like
            get().likePost(selectedPost.id, aiUser.id);
            
            // Add notification if it's the current user's post
            if (selectedPost.user.id === get().currentUser.id) {
              get().addNotification({
                id: generateUniqueId(),
                type: 'like',
                userId: aiUser.id,
                postId: selectedPost.id,
                message: `${aiUser.username} liked your post`,
                timestamp: new Date().toISOString(),
                seen: false,
              });
            }
          }
        }
      },
    }),
    {
      name: 'posts-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);