import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { FontAwesome5, Ionicons } from '@expo/vector-icons';
import { IconProps } from '@expo/vector-icons/build/createIconSet';

interface IconWithBadgeProps {
  name: string;
  badgeCount?: number;
  color: string;
  size: number;
}

const IconWithBadge: React.FC<IconWithBadgeProps> = ({ name, badgeCount = 0, color, size }) => {
  return (
    <View style={styles.container}>
      <FontAwesome5 name={name} size={size} color={color} />
      {badgeCount > 0 && (
        <View style={styles.badgeContainer}>
          <Text style={styles.badgeText}>{badgeCount}</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 30,
    height: 30,
    margin: 5,
  },
  badgeContainer: {
    position: 'absolute',
    left: -8,
    top: -6,
    backgroundColor: 'black',
    borderRadius: 6,
    width: 15,
    height: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
  },
});

export default IconWithBadge;
