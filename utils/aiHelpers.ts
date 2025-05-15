/**
 * Generates an AI comment based on the post caption and commenter's personality
 */
export const generateAIComment = async (
  postCaption: string,
  personality: string
): Promise<string> => {
  try {
    const response = await fetch('https://toolkit.rork.com/text/llm/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messages: [
          {
            role: 'system',
            content: `You are an Instagram user with the following personality: ${personality}. 
            Generate a short, realistic Instagram comment (1-2 sentences max) in response to a post.
            Your comment should feel authentic and conversational, not generic.
            Occasionally include emojis if appropriate.
            Never use hashtags in your comments.
            Keep your response under 100 characters.`
          },
          {
            role: 'user',
            content: `Here's the caption of an Instagram post. Write a single comment in response:
            "${postCaption}"`
          }
        ]
      }),
    });

    const data = await response.json();
    return data.completion.trim();
  } catch (error) {
    console.error('Error generating AI comment:', error);
    // Fallback comments if AI generation fails
    const fallbackComments = [
      "This is amazing! 😍",
      "Love this content!",
      "Great post, keep it up!",
      "This made my day!",
      "So inspiring!",
      "Can't stop looking at this!",
      "Absolutely beautiful!",
      "This is everything! 🙌",
      "Wow, incredible shot!",
      "Need more of this content!"
    ];
    return fallbackComments[Math.floor(Math.random() * fallbackComments.length)];
  }
};

/**
 * Generates an AI response to a user comment
 */
export const generateAIReply = async (
  userComment: string,
  personality: string
): Promise<string> => {
  try {
    const response = await fetch('https://toolkit.rork.com/text/llm/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messages: [
          {
            role: 'system',
            content: `You are an Instagram user with the following personality: ${personality}. 
            Generate a short, realistic Instagram reply (1 sentence max) to another user's comment.
            Your reply should feel authentic and conversational.
            Occasionally include emojis if appropriate.
            Keep your response under 80 characters.`
          },
          {
            role: 'user',
            content: `Someone commented this on your Instagram post. Write a brief reply:
            "${userComment}"`
          }
        ]
      }),
    });

    const data = await response.json();
    return data.completion.trim();
  } catch (error) {
    console.error('Error generating AI reply:', error);
    // Fallback replies if AI generation fails
    const fallbackReplies = [
      "Thank you so much! 💕",
      "Appreciate that!",
      "Thanks for the love!",
      "That means a lot!",
      "You're too kind!",
      "Glad you like it!",
      "Thanks for the support!",
      "Made my day! 🙏",
      "You're awesome!",
      "Thanks for noticing!"
    ];
    return fallbackReplies[Math.floor(Math.random() * fallbackReplies.length)];
  }
};