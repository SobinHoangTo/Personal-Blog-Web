# User Profile Components

This directory contains reusable components for the user profile page functionality.

## Components

### UserProfileHeader

- Displays user avatar, name, username, and stats
- Shows post count, join date, and email
- Props: `user`, `userId`, `postsCount`

### UserPostsSection

- Renders user's posts in a grid layout
- Shows "no posts" state when user has no posts
- Props: `user`, `posts`

### UserProfileLoading

- Loading spinner component for profile page
- No props required

### UserProfileError

- Error state component with customizable error message
- Props: `error` (string)

## Custom Hook

### useUserProfile

- Custom hook for fetching user data and posts
- Handles loading and error states
- Returns: `{ user, posts, loading, error }`
- Parameters: `userId` (number)

## Usage

```tsx
import {
  UserProfileHeader,
  UserPostsSection,
  UserProfileLoading,
  UserProfileError,
} from "@/components/user-profile";
import { useUserProfile } from "@/hooks/useUserProfile";

// Use in your page component
const { user, posts, loading, error } = useUserProfile(userId);
```
