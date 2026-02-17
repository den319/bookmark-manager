# 📌 Bookmark Manager

![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=next.js&logoColor=white) ![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)

> A secure, responsive web application to save, manage, and organize personal bookmarks with authentication and real-time updates.

## 🚀 Features

- 🔐 Google OAuth authentication (Supabase Auth)
- ➕ Add bookmarks (title + URL)
- 🗑️ Delete bookmarks
- 📋 Copy URL to clipboard
- ⚡ Real-time updates using Supabase Realtime
- 📱 Fully responsive dark UI
- 🔒 Row Level Security (RLS)
- 📑 Pagination for large datasets
- 🧩 Component-based architecture
- 🔔 Inline notifications (no alerts)

## 🛠️ Tech Stack

- **Frontend:** Next.js (App Router), React, TypeScript, Tailwind CSS
- **Backend / DB:** Supabase (PostgreSQL)
- **Auth:** Supabase Auth (Google OAuth)
- **Realtime:** Supabase Realtime subscriptions

## ⚙️ Setup Instructions

1. **Clone the repository**
   ```
   git clone https://github.com/your-username/bookmark-manager.git
   cd bookmark-manager
   ```

2. **Install dependencies**
   ```
   npm install
   ```

3. **Configure environment variables**

   Create `.env.local`:

   ```
   NEXT_PUBLIC_SUPABASE_URL=your_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
   ```

   ⚠️ Only use the anon public key on the client.

4. **Run the development server**
   ```
   npm run dev
   ```

   Open: [http://localhost:3000](http://localhost:3000)

## 🗄️ Database Schema

**bookmarks table**

| Column    | Type      | Description                  |
|-----------|-----------|------------------------------|
| id        | uuid      | Primary key                  |
| title     | text      | Bookmark title               |
| url       | text      | Bookmark URL                 |
| user_id   | uuid      | References authenticated user|
| created_at| timestamp | Creation time                |

## 🔐 Security

Row Level Security (RLS) is enabled.

Users can only access their own bookmarks.

**Example policy:**

```
auth.uid() = user_id
```

## 📄 Application Architecture

The UI is divided into reusable components:

- **Header** — Top navigation
- **UserAvatar** — User info display
- **AddBookmarkForm** — Add bookmark inputs
- **BookmarkList** — Paginated bookmark display
- **Notification** — Error/success messages
- **AuthScreen** — Login screen
- **LoadingScreen** — Initial loading state

## ⚠️ Problems Faced & Solutions

### 🧠 1. Handling Large Datasets

**Problem:**  
Displaying all bookmarks at once caused performance issues when testing with thousands of records.

**Solution:**  
Implemented server-side pagination using Supabase `.range()` queries.

**Benefits:**
- Avoids rendering thousands of items
- Reduces memory usage
- Improves load time
- Scales better for large datasets

### 🔁 2. Infinite Scroll Complexity

**Problem:**  
Initial attempt used lazy loading with Intersection Observer, but it introduced:
- Observer edge cases
- Trigger inconsistencies
- Duplicate data risks with realtime updates
- Debugging difficulty

**Solution:**  
Replaced infinite scroll with explicit pagination.

**Reason:**  
Pagination is simpler, more predictable, and production-friendly for very large datasets.

### ⚡ 3. Realtime Updates + Pagination Collision

**Problem:**  
Realtime inserts could introduce duplicate items across pages.

**Solution:**
- Used ID-based merge logic to deduplicate records
- Ensured newest items appear first
- Maintained stable ordering by `created_at`

### 🔐 4. Client-Side Database Access Security

**Problem:**  
Database operations occur directly from the frontend.

**Solution:**  
Security ensured using:
- Supabase Row Level Security (RLS)
- Authenticated requests only
- Public anon key (not service role key)
- User-scoped policies

### 📱 5. Mobile Responsiveness

**Problem:**  
UI elements overflowed or stacked poorly on small screens.

**Solution:**
- Used Tailwind responsive utilities
- Flexbox layout adjustments
- Full-width inputs and buttons on mobile
- Optimized spacing

### 🔔 6. User Feedback UX

**Problem:**  
Using `alert()` created a poor user experience.

**Solution:**  
Implemented inline notification component:
- Separate success and error states
- Auto-dismiss after a few seconds
- Non-blocking UI

### 👤 7. Missing Avatar Handling

**Problem:**  
Some users do not have `avatar_url` in metadata.

**Solution:**  
Fallback to static avatar image.

## 📊 Performance Notes

Tested with 24,000+ bookmarks using pagination.

Performance remained stable due to:
- Limited page size
- Controlled rendering
- Efficient database queries
- No large state accumulation

## 🚧 Future Improvements

- Edit bookmark feature
- Search & filtering
- Bookmark tags / folders
- Server components for data fetching
- Optimistic updates with undo support
- Accessibility improvements
- Offline support

## 📜 License

This project is for assessment/demo purposes.