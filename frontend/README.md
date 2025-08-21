# Habit Streak Tracker - Frontend

## Profile Photo Feature

The application now includes a profile photo feature that allows users to add their profile pictures via URL links.

### How to Add a Profile Photo:

1. **Navigate to your Profile page** (`/profile`)
2. **Click the "Change Photo" button** below your profile picture
3. **Enter a valid image URL** in the prompt dialog
4. **Click OK** to save your profile photo

### Where Profile Photos Appear:

- **Profile Page**: Large circular profile photo at the top
- **Navigation Bar**: Small circular profile photo next to your username
- **Dashboard**: Medium circular profile photo in the welcome section

### Example Profile Photo URLs:

You can use any of these example URLs to test the feature:

#### Free Avatar Services:
- `https://api.dicebear.com/7.x/avataaars/svg?seed=Felix`
- `https://api.dicebear.com/7.x/bottts/svg?seed=John`
- `https://api.dicebear.com/7.x/pixel-art/svg?seed=Jane`
- `https://api.dicebear.com/7.x/identicon/svg?seed=Mike`

#### Placeholder Images:
- `https://via.placeholder.com/200x200/3B82F6/FFFFFF?text=Profile`
- `https://via.placeholder.com/200x200/10B981/FFFFFF?text=User`

#### Random User Photos:
- `https://randomuser.me/api/portraits/men/1.jpg`
- `https://randomuser.me/api/portraits/women/1.jpg`
- `https://randomuser.me/api/portraits/men/32.jpg`
- `https://randomuser.me/api/portraits/women/32.jpg`

### Features:

- **Automatic Fallback**: If no profile photo is set, shows a default avatar icon
- **Error Handling**: If an image fails to load, automatically removes the broken URL
- **Responsive Design**: Profile photos scale appropriately on all devices
- **Circular Design**: All profile photos are displayed in circular frames with borders
- **Hover Effects**: Profile photos have subtle hover animations

### Technical Details:

- Profile photos are stored in the user's local storage
- Images are displayed using the HTML `<img>` tag with error handling
- CSS ensures consistent sizing and circular cropping
- Bootstrap Icons provide fallback avatars when no photo is available

### Tips:

- Use HTTPS URLs for better security
- Ensure the image URL is publicly accessible
- Square images work best for the circular display
- The application automatically handles image loading errors
