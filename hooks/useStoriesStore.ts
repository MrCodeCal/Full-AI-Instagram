import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { generateUniqueId } from '@/utils/helpers';
import { User } from '@/mocks/posts';
import { aiUsers } from '@/mocks/aiUsers';

export interface StoryItem {
  id: string;
  imageUrl: string;
  createdAt: string;
  seen: boolean;
}

export interface UserStories {
  userId: string;
  user: User;
  items: StoryItem[];
  lastUpdated: string;
}

interface StoriesState {
  stories: UserStories[];
  addStory: (userId: string, imageUrl: string) => void;
  markStoryAsSeen: (userId: string, storyId: string) => void;
  hasUnseenStories: (userId: string) => boolean;
  generateAIStories: () => void;
}

// Story image URLs for AI-generated stories
const storyImages = [
  "https://images.unsplash.com/photo-1469474968028-56623f02e42e?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1551632811-561732d1e306?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1527786356703-4b100091cd2c?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1533105079780-92b9be482077?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1516685018646-549198525c1b?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1517457373958-b7bdd4587205?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1514565131-fce0801e5785?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1504674900247-0877df9cc836?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1526336024174-e58f5cdd8e13?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
];

export const useStoriesStore = create<StoriesState>()(
  persist(
    (set, get) => ({
      stories: [],
      
      addStory: (userId, imageUrl) => {
        const newStory: StoryItem = {
          id: generateUniqueId(),
          imageUrl,
          createdAt: new Date().toISOString(),
          seen: false,
        };
        
        set((state) => {
          // Check if user already has stories
          const userStoriesIndex = state.stories.findIndex(s => s.userId === userId);
          
          if (userStoriesIndex >= 0) {
            // User already has stories, add new one
            const updatedStories = [...state.stories];
            updatedStories[userStoriesIndex] = {
              ...updatedStories[userStoriesIndex],
              items: [newStory, ...updatedStories[userStoriesIndex].items],
              lastUpdated: new Date().toISOString(),
            };
            return { stories: updatedStories };
          } else {
            // User doesn't have stories yet, create new entry
            // Find user from aiUsers or use current user
            const user = aiUsers.find(u => u.id === userId) || { id: userId, username: "you", avatar: "", isVerified: false };
            
            return {
              stories: [
                ...state.stories,
                {
                  userId,
                  user: user as User,
                  items: [newStory],
                  lastUpdated: new Date().toISOString(),
                },
              ],
            };
          }
        });
      },
      
      markStoryAsSeen: (userId, storyId) => {
        set((state) => {
          const updatedStories = state.stories.map(userStory => {
            if (userStory.userId === userId) {
              return {
                ...userStory,
                items: userStory.items.map(item => 
                  item.id === storyId ? { ...item, seen: true } : item
                ),
              };
            }
            return userStory;
          });
          
          return { stories: updatedStories };
        });
      },
      
      hasUnseenStories: (userId) => {
        const userStories = get().stories.find(s => s.userId === userId);
        if (!userStories) return false;
        
        return userStories.items.some(item => !item.seen);
      },
      
      generateAIStories: () => {
        // Generate stories for AI users
        const now = new Date().toISOString();
        const newStories: UserStories[] = [];
        
        // Generate 1-3 stories for each AI user
        aiUsers.forEach(user => {
          const storyCount = Math.floor(Math.random() * 3) + 1;
          const items: StoryItem[] = [];
          
          for (let i = 0; i < storyCount; i++) {
            // Get random image from storyImages
            const randomImageIndex = Math.floor(Math.random() * storyImages.length);
            
            items.push({
              id: generateUniqueId(),
              imageUrl: storyImages[randomImageIndex],
              createdAt: now,
              seen: false,
            });
          }
          
          newStories.push({
            userId: user.id,
            user: user as User,
            items,
            lastUpdated: now,
          });
        });
        
        set((state) => {
          // Merge with existing stories
          const updatedStories = [...state.stories];
          
          newStories.forEach(newUserStory => {
            const existingIndex = updatedStories.findIndex(s => s.userId === newUserStory.userId);
            
            if (existingIndex >= 0) {
              // Update existing user's stories
              updatedStories[existingIndex] = newUserStory;
            } else {
              // Add new user's stories
              updatedStories.push(newUserStory);
            }
          });
          
          return { stories: updatedStories };
        });
      },
    }),
    {
      name: 'stories-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);