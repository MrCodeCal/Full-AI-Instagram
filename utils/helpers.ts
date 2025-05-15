/**
 * Generates a unique ID for posts, comments, etc.
 */
export const generateUniqueId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
};

/**
 * Formats a timestamp into a human-readable format
 */
export const formatTimestamp = (timestamp: string) => {
  const postDate = new Date(timestamp);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - postDate.getTime()) / 1000);
  
  if (diffInSeconds < 60) {
    return `${diffInSeconds}s`;
  } else if (diffInSeconds < 3600) {
    return `${Math.floor(diffInSeconds / 60)}m`;
  } else if (diffInSeconds < 86400) {
    return `${Math.floor(diffInSeconds / 3600)}h`;
  } else if (diffInSeconds < 604800) {
    return `${Math.floor(diffInSeconds / 86400)}d`;
  } else {
    return postDate.toLocaleDateString();
  }
};

/**
 * Identifies hashtags in a caption
 * Returns an array of segments with type and content
 */
export interface CaptionSegment {
  type: 'text' | 'hashtag';
  content: string;
}

export const parseCaption = (caption: string): CaptionSegment[] => {
  const words = caption.split(' ');
  const segments: CaptionSegment[] = [];
  
  words.forEach((word, index) => {
    if (word.startsWith('#')) {
      segments.push({
        type: 'hashtag',
        content: word + (index < words.length - 1 ? ' ' : '')
      });
    } else {
      segments.push({
        type: 'text',
        content: word + (index < words.length - 1 ? ' ' : '')
      });
    }
  });
  
  return segments;
};