export interface User {
  id: string;
  username: string;
  avatar: string;
  isVerified: boolean;
}

export interface Comment {
  id: string;
  user: User;
  text: string;
  createdAt: string;
  likes: number;
  likedBy?: User[];
}

export interface Post {
  id: string;
  user: User;
  images: string[];
  caption: string;
  likes: number;
  comments: Comment[];
  createdAt: string;
  location?: string;
  isLiked: boolean;
  isSaved: boolean;
  likedBy?: User[];
}

export const users: User[] = [
  {
    id: "1",
    username: "janedoe",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=150&q=80",
    isVerified: true,
  },
  {
    id: "2",
    username: "johndoe",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=150&q=80",
    isVerified: false,
  },
  {
    id: "3",
    username: "travel_addict",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=150&q=80",
    isVerified: true,
  },
  {
    id: "4",
    username: "foodie_adventures",
    avatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=150&q=80",
    isVerified: false,
  },
  {
    id: "5",
    username: "nature_explorer",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=150&q=80",
    isVerified: true,
  },
];

export const posts: Post[] = [
  {
    id: "1",
    user: users[0],
    images: [
      "https://images.unsplash.com/photo-1502791451862-7bd8c1df43a7?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1519046904884-53103b34b206?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80"
    ],
    caption: "Perfect day at the beach! 🌊☀️ #summer #beachvibes #vacation",
    likes: 1243,
    comments: [
      {
        id: "c1",
        user: users[1],
        text: "Looks amazing! Where is this?",
        createdAt: "2023-09-15T14:23:45Z",
        likes: 5,
      },
      {
        id: "c2",
        user: users[2],
        text: "I need to go there! 😍",
        createdAt: "2023-09-15T15:10:22Z",
        likes: 2,
      },
    ],
    createdAt: "2023-09-15T12:30:00Z",
    location: "Maldives",
    isLiked: false,
    isSaved: false,
    likedBy: [users[1], users[2], users[3]],
  },
  {
    id: "2",
    user: users[2],
    images: [
      "https://images.unsplash.com/photo-1476224203421-9ac39bcb3327?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80"
    ],
    caption: "Homemade pasta for dinner tonight! 🍝 #foodie #homecooking #pasta #italianfood",
    likes: 892,
    comments: [
      {
        id: "c3",
        user: users[3],
        text: "Recipe please! This looks delicious",
        createdAt: "2023-09-14T19:45:12Z",
        likes: 8,
      },
    ],
    createdAt: "2023-09-14T18:15:00Z",
    isLiked: true,
    isSaved: true,
    likedBy: [users[0], users[3], users[4]],
  },
  {
    id: "3",
    user: users[4],
    images: [
      "https://images.unsplash.com/photo-1501854140801-50d01698950b?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1426604966848-d7adac402bff?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80"
    ],
    caption: "Morning hike through the mountains. The view was worth every step! 🏔️ #nature #hiking #mountains #adventure",
    likes: 1567,
    comments: [
      {
        id: "c4",
        user: users[0],
        text: "Breathtaking view!",
        createdAt: "2023-09-13T09:12:33Z",
        likes: 3,
      },
      {
        id: "c5",
        user: users[1],
        text: "I need to visit this place!",
        createdAt: "2023-09-13T10:05:17Z",
        likes: 1,
      },
    ],
    createdAt: "2023-09-13T07:45:00Z",
    location: "Swiss Alps",
    isLiked: false,
    isSaved: false,
    likedBy: [users[0], users[1], users[2], users[3]],
  },
  {
    id: "4",
    user: users[1],
    images: [
      "https://images.unsplash.com/photo-1511988617509-a57c8a288659?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1511988617509-a57c8a288659?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1511988617509-a57c8a288659?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80"
    ],
    caption: "New workspace setup complete! 💻 #workspace #productivity #homeoffice #techlover",
    likes: 723,
    comments: [
      {
        id: "c6",
        user: users[3],
        text: "Love the minimalist vibe!",
        createdAt: "2023-09-12T16:34:21Z",
        likes: 4,
      },
    ],
    createdAt: "2023-09-12T15:20:00Z",
    isLiked: true,
    isSaved: false,
    likedBy: [users[0], users[3]],
  },
  {
    id: "5",
    user: users[3],
    images: [
      "https://images.unsplash.com/photo-1504674900247-0877df9cc836?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80"
    ],
    caption: "Sunday brunch done right! 🥑🍳 #brunch #foodie #avocadotoast #sundayfunday",
    likes: 1102,
    comments: [
      {
        id: "c7",
        user: users[2],
        text: "This is making me hungry!",
        createdAt: "2023-09-11T11:23:45Z",
        likes: 6,
      },
      {
        id: "c8",
        user: users[4],
        text: "Perfect brunch spread!",
        createdAt: "2023-09-11T12:15:32Z",
        likes: 2,
      },
    ],
    createdAt: "2023-09-11T10:30:00Z",
    location: "Breakfast Club, London",
    isLiked: false,
    isSaved: true,
    likedBy: [users[2], users[4]],
  },
];