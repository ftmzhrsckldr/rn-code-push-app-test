import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Switch,
  Alert,
} from 'react-native';
import { mockUsers, mockPosts, User, Post } from '../utils/mockData';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';
import { typography } from '../theme/typography';
import Card from '../components/cards/Card';
import Button from '../components/buttons/Button';
import { analyticsService } from '../utils/analytics';
import { featureFlagsService } from '../utils/featureFlags';

const ProfileScreen: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [userPosts, setUserPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<'posts' | 'about'>('posts');
  const [analyticsEnabled, setAnalyticsEnabled] = useState<boolean>(
    featureFlagsService.isEnabled('enableAnalytics')
  );

  const loadUserData = () => {
    // Simulate API call to load user data (using first user from mock data)
    setLoading(true);
    setTimeout(() => {
      const userData = mockUsers[0]; // Use the first user
      setUser(userData);

      // Find posts by this user
      const posts = mockPosts.filter(
        (post) => post.author.id === userData.id
      );
      setUserPosts(posts);
      
      setLoading(false);
    }, 1000);
  };

  useEffect(() => {
    loadUserData();
    analyticsService.trackScreenView('Profile');
  }, []);

  const toggleAnalytics = (value: boolean) => {
    setAnalyticsEnabled(value);
    featureFlagsService.setFlag('enableAnalytics', value);
    analyticsService.setEnabled(value);
    analyticsService.trackEvent('toggle_analytics', { enabled: value });
  };

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Logout',
          onPress: () => {
            analyticsService.trackEvent('user_logout');
            // In a real app, we would clear auth state here
            Alert.alert('Logged out successfully');
          },
          style: 'destructive',
        },
      ]
    );
  };

  const handleEditProfile = () => {
    analyticsService.trackEvent('edit_profile_tap');
    Alert.alert('Edit Profile', 'This feature is not implemented yet.');
  };

  const renderPostsTab = () => (
    <View style={styles.tabContent}>
      {userPosts.length > 0 ? (
        userPosts.map((post) => (
          <Card
            key={post.id}
            title={post.title}
            style={styles.postCard}
            onPress={() => {
              analyticsService.trackEvent('profile_post_tap', {
                post_id: post.id,
              });
            }}>
            <Text style={styles.postBody} numberOfLines={3}>
              {post.body}
            </Text>
            <View style={styles.postFooter}>
              <Text style={styles.postStats}>
                {post.likes} likes • {post.comments} comments
              </Text>
              <Text style={styles.postDate}>
                {new Date(post.createdAt).toLocaleDateString()}
              </Text>
            </View>
          </Card>
        ))
      ) : (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No posts yet</Text>
        </View>
      )}
    </View>
  );

  const renderAboutTab = () => (
    <View style={styles.tabContent}>
      <Card title="Account Information" style={styles.aboutCard}>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Name</Text>
          <Text style={styles.infoValue}>{user?.name}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Email</Text>
          <Text style={styles.infoValue}>{user?.email}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Member Since</Text>
          <Text style={styles.infoValue}>
            {user?.createdAt
              ? new Date(user.createdAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })
              : ''}
          </Text>
        </View>
      </Card>

      <Card title="Settings" style={styles.aboutCard}>
        <View style={styles.settingRow}>
          <Text style={styles.settingLabel}>Allow Analytics</Text>
          <Switch
            value={analyticsEnabled}
            onValueChange={toggleAnalytics}
            trackColor={{ false: colors.grayLight, true: colors.primary }}
            thumbColor={colors.white}
          />
        </View>
        <View style={styles.settingRow}>
          <Text style={styles.settingLabel}>Enable Notifications</Text>
          <Switch
            value={featureFlagsService.isEnabled('enablePushNotifications')}
            onValueChange={(value) => {
              featureFlagsService.setFlag('enablePushNotifications', value);
              analyticsService.trackEvent('toggle_notifications', {
                enabled: value,
              });
            }}
            trackColor={{ false: colors.grayLight, true: colors.primary }}
            thumbColor={colors.white}
          />
        </View>
        <View style={styles.settingRow}>
          <Text style={styles.settingLabel}>Dark Mode</Text>
          <Switch
            value={featureFlagsService.isEnabled('enableDarkMode')}
            onValueChange={(value) => {
              featureFlagsService.setFlag('enableDarkMode', value);
              analyticsService.trackEvent('toggle_dark_mode', {
                enabled: value,
              });
            }}
            trackColor={{ false: colors.grayLight, true: colors.primary }}
            thumbColor={colors.white}
          />
        </View>
      </Card>

      <Button
        title="Logout"
        variant="outline"
        fullWidth
        onPress={handleLogout}
        style={styles.logoutButton}
      />
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>Loading profile...</Text>
      </View>
    );
  }

  if (!user) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Failed to load profile data</Text>
        <Button
          title="Try Again"
          onPress={loadUserData}
          style={styles.retryButton}
        />
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Image
          source={{ uri: user.avatarUrl }}
          style={styles.profileImage}
        />
        <Text style={styles.profileName}>{user.name}</Text>
        <Text style={styles.profileEmail}>{user.email}</Text>

        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{userPosts.length}</Text>
            <Text style={styles.statLabel}>Posts</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>842</Text>
            <Text style={styles.statLabel}>Followers</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>265</Text>
            <Text style={styles.statLabel}>Following</Text>
          </View>
        </View>

        <Button
          title="Edit Profile"
          variant="outline"
          size="small"
          onPress={handleEditProfile}
          style={styles.editButton}
        />
      </View>

      <View style={styles.tabsContainer}>
        <TouchableOpacity
          style={[
            styles.tabButton,
            activeTab === 'posts' && styles.activeTabButton,
          ]}
          onPress={() => setActiveTab('posts')}>
          <Text
            style={[
              styles.tabButtonText,
              activeTab === 'posts' && styles.activeTabButtonText,
            ]}>
            Posts
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.tabButton,
            activeTab === 'about' && styles.activeTabButton,
          ]}
          onPress={() => setActiveTab('about')}>
          <Text
            style={[
              styles.tabButtonText,
              activeTab === 'about' && styles.activeTabButtonText,
            ]}>
            About
          </Text>
        </TouchableOpacity>
      </View>

      {activeTab === 'posts' ? renderPostsTab() : renderAboutTab()}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  contentContainer: {
    paddingBottom: spacing.xxl,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
  loadingText: {
    marginTop: spacing.md,
    fontSize: typography.fontSizes.md,
    color: colors.gray,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
  },
  errorText: {
    fontSize: typography.fontSizes.lg,
    color: colors.danger,
    marginBottom: spacing.md,
    textAlign: 'center',
  },
  retryButton: {
    marginTop: spacing.md,
  },
  header: {
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingTop: spacing.xl,
    paddingBottom: spacing.lg,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: spacing.md,
  },
  profileName: {
    fontSize: typography.fontSizes.xl,
    fontWeight: typography.fontWeights.bold as any,
    color: colors.dark,
    marginBottom: spacing.xs,
  },
  profileEmail: {
    fontSize: typography.fontSizes.md,
    color: colors.gray,
    marginBottom: spacing.md,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    paddingVertical: spacing.md,
    marginBottom: spacing.md,
    backgroundColor: colors.white,
    borderRadius: 12,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: typography.fontSizes.lg,
    fontWeight: typography.fontWeights.bold as any,
    color: colors.dark,
    marginBottom: spacing.xs / 2,
  },
  statLabel: {
    fontSize: typography.fontSizes.sm,
    color: colors.gray,
  },
  statDivider: {
    width: 1,
    height: '60%',
    backgroundColor: colors.light,
    alignSelf: 'center',
  },
  editButton: {
    marginTop: spacing.sm,
  },
  tabsContainer: {
    flexDirection: 'row',
    marginTop: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.light,
  },
  tabButton: {
    flex: 1,
    paddingVertical: spacing.md,
    alignItems: 'center',
  },
  activeTabButton: {
    borderBottomWidth: 2,
    borderBottomColor: colors.primary,
  },
  tabButtonText: {
    fontSize: typography.fontSizes.md,
    fontWeight: typography.fontWeights.medium as any,
    color: colors.gray,
  },
  activeTabButtonText: {
    color: colors.primary,
    fontWeight: typography.fontWeights.semiBold as any,
  },
  tabContent: {
    paddingHorizontal: spacing.md,
    paddingTop: spacing.md,
  },
  postCard: {
    marginBottom: spacing.md,
  },
  postBody: {
    fontSize: typography.fontSizes.md,
    color: colors.dark,
    lineHeight: 22,
    marginBottom: spacing.md,
  },
  postFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  postStats: {
    fontSize: typography.fontSizes.sm,
    color: colors.gray,
  },
  postDate: {
    fontSize: typography.fontSizes.xs,
    color: colors.gray,
  },
  aboutCard: {
    marginBottom: spacing.md,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.light,
  },
  infoLabel: {
    fontSize: typography.fontSizes.md,
    color: colors.gray,
  },
  infoValue: {
    fontSize: typography.fontSizes.md,
    color: colors.dark,
    fontWeight: typography.fontWeights.medium as any,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.light,
  },
  settingLabel: {
    fontSize: typography.fontSizes.md,
    color: colors.dark,
  },
  logoutButton: {
    marginTop: spacing.md,
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: spacing.xl,
  },
  emptyText: {
    fontSize: typography.fontSizes.lg,
    color: colors.gray,
  },
});

export default ProfileScreen;
