import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Text, View, StyleSheet } from 'react-native';
import { RootStackParamList, MainTabParamList } from './types';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';

// Screens
import HomeScreen from '../screens/HomeScreen';
import FeedScreen from '../screens/FeedScreen';
import NotificationsScreen from '../screens/NotificationsScreen';
import ProfileScreen from '../screens/ProfileScreen';

// Create navigators
const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<MainTabParamList>();

// Tab Bar Icon component
const TabBarIcon = ({ focused, name }: { focused: boolean; name: string }) => {
  const getIcon = () => {
    switch (name) {
      case 'Home':
        return '🏠';
      case 'Feed':
        return '📱';
      case 'Profile':
        return '👤';
      case 'Notifications':
        return '🔔';
      default:
        return '📎';
    }
  };

  return (
    <View
      style={[
        styles.iconContainer,
        focused && { backgroundColor: `${colors.primary}20` },
      ]}>
      <Text style={styles.iconText}>{getIcon()}</Text>
    </View>
  );
};

// Tab Navigator
const MainTabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.gray,
        tabBarLabelStyle: {
          fontSize: typography.fontSizes.xs,
          fontWeight: typography.fontWeights.medium as any,
        },
        tabBarStyle: {
          borderTopWidth: 1,
          borderTopColor: colors.light,
          paddingTop: 5,
          paddingBottom: 5,
          height: 60,
        },
        headerShown: true,
        headerTitleStyle: {
          fontWeight: typography.fontWeights.semiBold as any,
          fontSize: typography.fontSizes.lg,
        },
        headerTitleAlign: 'center',
      }}>
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabBarIcon focused={focused} name="Home" />
          ),
        }}
      />
      <Tab.Screen
        name="Feed"
        component={FeedScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabBarIcon focused={focused} name="Feed" />
          ),
        }}
      />
      <Tab.Screen
        name="Notifications"
        component={NotificationsScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabBarIcon focused={focused} name="Notifications" />
          ),
          tabBarBadge: 3, // Hardcoded for simplicity, would normally be dynamic
          tabBarBadgeStyle: {
            backgroundColor: colors.danger,
          },
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabBarIcon focused={focused} name="Profile" />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

// Main Navigation
const Navigation: React.FC = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}>
        <Stack.Screen name="MainTabs" component={MainTabNavigator} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  iconContainer: {
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconText: {
    fontSize: 18,
  },
});

export default Navigation;
