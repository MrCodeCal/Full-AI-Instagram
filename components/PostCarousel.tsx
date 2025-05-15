import React, { useState, useRef } from 'react';
import { 
  View, 
  StyleSheet, 
  Dimensions, 
  FlatList, 
  Image, 
  TouchableWithoutFeedback,
  Animated,
  Platform
} from 'react-native';
import { useLikeAnimation } from '@/hooks/useLikeAnimation';
import { Heart } from 'lucide-react-native';
import Colors from '@/constants/colors';

interface PostCarouselProps {
  images: string[];
  onLike: () => void;
  isLiked: boolean;
}

const { width } = Dimensions.get('window');

const PostCarousel: React.FC<PostCarouselProps> = ({ 
  images, 
  onLike,
  isLiked
}) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const { heartScale, handleDoubleTap, triggerLike } = useLikeAnimation(isLiked);
  const flatListRef = useRef<FlatList>(null);

  const handleScroll = (event: any) => {
    const slideIndex = Math.floor(
      event.nativeEvent.contentOffset.x / (event.nativeEvent.layoutMeasurement.width)
    );
    if (slideIndex !== activeIndex) {
      setActiveIndex(slideIndex);
    }
  };

  const handleImagePress = () => {
    handleDoubleTap();
    onLike();
  };

  return (
    <View style={styles.container}>
      <FlatList
        ref={flatListRef}
        data={images}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        keyExtractor={(_, index) => index.toString()}
        renderItem={({ item }) => (
          <TouchableWithoutFeedback onPress={handleImagePress}>
            <View style={styles.imageContainer}>
              <Image 
                source={{ uri: item }} 
                style={styles.image}
                resizeMode="cover"
              />
              <Animated.View 
                style={[
                  styles.heartContainer, 
                  { 
                    transform: [
                      { scale: heartScale }
                    ],
                    opacity: heartScale
                  }
                ]}
              >
                <Heart 
                  size={80} 
                  fill={Colors.light.like} 
                  color={Colors.light.like} 
                />
              </Animated.View>
            </View>
          </TouchableWithoutFeedback>
        )}
      />
      
      {images.length > 1 && (
        <View style={styles.pagination}>
          {images.map((_, index) => (
            <View
              key={index}
              style={[
                styles.paginationDot,
                index === activeIndex ? styles.paginationDotActive : null,
              ]}
            />
          ))}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    width: '100%',
    height: width, // Square aspect ratio
  },
  imageContainer: {
    width,
    height: width,
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  pagination: {
    position: 'absolute',
    bottom: 10,
    flexDirection: 'row',
    justifyContent: 'center',
    width: '100%',
  },
  paginationDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    marginHorizontal: 2,
  },
  paginationDotActive: {
    backgroundColor: Colors.light.tint,
    width: 6,
    height: 6,
  },
  heartContainer: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 5,
  },
});

export default PostCarousel;