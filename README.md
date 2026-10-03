# AniList Explorer

AniList Explorer is a modern, high-performance web client for [AniList.co](https://anilist.co) built with Next.js 15 App Router and React 19. It provides a seamless, app-like experience for discovering, exploring, and tracking your favorite anime.

## 🌟 Key Features

* **Discover Dashboard (`/`)**
  * A beautifully designed landing page with horizontal scroll-snapping carousels.
  * Real-time fetching of **Trending Right Now**, **Highest Rated All-Time**, and dynamically calculated **Top Upcoming** anime for the next season.

* **Advanced Explorer (`/explore`)**
  * Robust catalog searching with deep filters: Genre, Tag, Season, Year, Format, and Status.
  * Multiple sorting options (Popularity, Trending, Score, Release Date).
  * Seamless Infinite Scrolling.
  * Persistent URL state for easy bookmarking and sharing.
  * Dynamic Grid and List view toggles.

* **Comprehensive Anime Details (`/anime/[id]`)**
  * Gorgeous hero banner with gradient overlays.
  * Quick stats, airing countdowns (shows exactly when the next episode airs), and embedded YouTube trailers.
  * Expandable "Read More" synopsis with dynamic overflow detection.
  * Clickable tags with custom CSS tooltips.
  * Grids for **Related Media** (sequels, spin-offs) and user **Recommendations**.

* **Character & Staff Wikis (`/character/[id]`, `/staff/[id]`)**
  * Dedicated deep-dive pages for voice actors, creators, and characters.
  * Shows rich biographies with interactive **Discord-style inline spoilers** (click to reveal redacted text).
  * Lists alternative names, spoof names, and demographic details.
  * Displays a visual grid of all their anime appearances/roles.

* **Personal Watchlists & OAuth (`/watchlist`)**
  * Full integration with AniList's OAuth 2.0 (Implicit Grant) authentication.
  * Secure, client-side session management using Context API and `localStorage`.
  * Syncs your personal AniList account to display all your custom and standard watchlists (Watching, Completed, Dropped, etc.).
  * Shows current episode progress and personal scores directly on the anime cards.

## 🛠️ Tech Stack

* **Framework**: [Next.js 15](https://nextjs.org/) (App Router, Server & Client Components)
* **Library**: [React 19](https://react.dev/)
* **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
* **Data Fetching**: Native `fetch` with GraphQL querying the [AniList API v2](https://anilist.gitbook.io/anilist-apiv2-docs/)
* **Icons**: [Lucide React](https://lucide.dev/)

## 🚀 Getting Started

### 1. Set up AniList OAuth (Required for Watchlists)
To enable the Watchlist feature, you need to provide an AniList Client ID.
1. Go to your [AniList Developer Settings](https://anilist.co/settings/developer).
2. Click **Create New Client**.
3. Set the **Redirect URL** exactly to: `http://localhost:3000`
4. Create a `.env.local` file in the root directory of this project and add your new Client ID:
   ```env
   NEXT_PUBLIC_ANILIST_CLIENT_ID=your_client_id_here
   ```

### 2. Run the Development Server
Install dependencies and start the app:
```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.
