import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  FlatList,
  Pressable
} from 'react-native';
import { Image } from 'expo-image';
import { X, CheckCircle2 } from 'lucide-react-native';
import Colors from '@/constants/colors';
import { User } from '@/mocks/posts';

interface LikesModalProps {
  visible: boolean;
  onClose: () => void;
  users: User[];
  likesCount: number;
}

const LikesModal: React.FC<LikesModalProps> = ({ 
  visible, 
  onClose, 
  users,
  likesCount
}) => {
  const renderUser = ({ item }: { item: User }) => (
    <View style={styles.userContainer}>
      <View style={styles.userInfo}>
        <Image 
          source={{ uri: item.avatar }} 
          style={styles.avatar}
          contentFit="cover"
        />
        <View style={styles.usernameContainer}>
          <View style={styles.usernameRow}>
            <Text style={styles.username}>{item.username}</Text>
            {item.isVerified && (
              <CheckCircle2 
                size={12} 
                color={Colors.light.tint} 
                fill={Colors.light.tint}
                style={styles.verifiedBadge}
              />
            )}
          </View>
        </View>
      </View>
      <TouchableOpacity style={styles.followButton}>
        <Text style={styles.followButtonText}>Follow</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Likes</Text>
            <TouchableOpacity onPress={onClose}>
              <X size={24} color={Colors.light.text} />
            </TouchableOpacity>
          </View>
          
          <FlatList
            data={users}
            renderItem={renderUser}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.usersList}
            ListHeaderComponent={
              <Text style={styles.likesCount}>{likesCount} likes</Text>
            }
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>No likes yet</Text>
              </View>
            }
          />
        </View>
        
        {/* Background overlay */}
        <Pressable style={styles.modalOverlay} onPress={onClose} />
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  modalOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: Colors.light.background,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '80%',
    zIndex: 1,
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
  usersList: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  likesCount: {
    fontSize: 14,
    fontWeight: '600',
    marginVertical: 12,
  },
  userContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    marginRight: 12,
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
  followButton: {
    backgroundColor: Colors.light.tint,
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 6,
  },
  followButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 16,
    color: Colors.light.placeholder,
  },
});

export default LikesModal;