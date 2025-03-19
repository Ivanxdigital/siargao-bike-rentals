import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { Star } from 'lucide-react-native';
import { ReviewWithUser } from '../types/supabase';

interface ReviewCardProps {
  review: ReviewWithUser;
  isShopOwner?: boolean;
  onReply?: (reviewId: string) => void;
}

export default function ReviewCard({
  review,
  isShopOwner = false,
  onReply,
}: ReviewCardProps) {
  const reviewDate = new Date(review.created_at).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  const replyDate = review.reply_date
    ? new Date(review.reply_date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      })
    : null;

  const avatarUrl =
    review.user?.avatar_url || 'https://via.placeholder.com/40';
  const userName = 
    (review.user?.first_name && review.user?.last_name) 
      ? `${review.user.first_name} ${review.user.last_name}`
      : 'Anonymous User';

  // Render stars based on rating
  const renderStars = () => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <Star
          key={i}
          size={16}
          color="#FFB800"
          fill={i <= review.rating ? '#FFB800' : 'none'}
        />
      );
    }
    return stars;
  };

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Image source={{ uri: avatarUrl }} style={styles.avatar} />
        <View style={styles.headerContent}>
          <Text style={styles.userName}>{userName}</Text>
          <View style={styles.ratingContainer}>{renderStars()}</View>
        </View>
        <Text style={styles.date}>{reviewDate}</Text>
      </View>
      
      {review.comment ? (
        <Text style={styles.comment}>{review.comment}</Text>
      ) : null}

      {review.reply ? (
        <View style={styles.replyContainer}>
          <Text style={styles.replyHeader}>
            Owner's response - {replyDate}
          </Text>
          <Text style={styles.replyText}>{review.reply}</Text>
        </View>
      ) : isShopOwner ? (
        <Text
          style={styles.replyLink}
          onPress={() => onReply && onReply(review.id)}
        >
          Reply to this review
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  headerContent: {
    flex: 1,
    marginLeft: 12,
  },
  userName: {
    fontFamily: 'Poppins-Medium',
    fontSize: 14,
    color: '#000',
    marginBottom: 2,
  },
  ratingContainer: {
    flexDirection: 'row',
  },
  date: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: '#888',
  },
  comment: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
    marginBottom: 16,
  },
  replyContainer: {
    backgroundColor: '#F5F7FA',
    borderRadius: 8,
    padding: 12,
    marginTop: 8,
  },
  replyHeader: {
    fontFamily: 'Inter-Medium',
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  replyText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
  },
  replyLink: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: '#007AFF',
    marginTop: 8,
  },
}); 