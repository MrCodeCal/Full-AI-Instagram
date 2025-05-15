import { User } from './posts';

export interface AIUser extends User {
  personality: string;
}

export const aiUsers: AIUser[] = [
  {
    id: "ai-1",
    username: "travel_enthusiast",
    avatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=150&q=80",
    isVerified: true,
    personality: "enthusiastic traveler who loves adventure and exploring new places",
  },
  {
    id: "ai-2",
    username: "foodie_delights",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=150&q=80",
    isVerified: false,
    personality: "food lover who appreciates culinary creativity and beautiful plating",
  },
  {
    id: "ai-3",
    username: "fitness_guru",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=150&q=80",
    isVerified: true,
    personality: "fitness enthusiast who is supportive and motivational",
  },
  {
    id: "ai-4",
    username: "art_appreciator",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=150&q=80",
    isVerified: false,
    personality: "art lover who notices creative details and artistic expression",
  },
  {
    id: "ai-5",
    username: "tech_geek",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=150&q=80",
    isVerified: true,
    personality: "tech enthusiast who gets excited about innovation and new gadgets",
  },
  {
    id: "ai-6",
    username: "nature_lover",
    avatar: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=150&q=80",
    isVerified: false,
    personality: "nature enthusiast who appreciates natural beauty and environmental consciousness",
  },
  {
    id: "ai-7",
    username: "fashion_forward",
    avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=150&q=80",
    isVerified: true,
    personality: "fashion-conscious person who notices style and trends",
  },
  {
    id: "ai-8",
    username: "positive_vibes",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=150&q=80",
    isVerified: false,
    personality: "optimistic person who always sees the bright side and spreads positivity",
  },
];