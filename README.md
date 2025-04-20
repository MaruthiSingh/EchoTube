# EchoTube - YouTube Companion Dashboard

EchoTube is a web application that allows users to interact with their YouTube videos by updating video details (title, description), managing comments, and more. It integrates with the YouTube API to provide real-time management and updates of video content.

## Features

* **Video Details Management**: Users can update video titles and descriptions.
* **Comment Management**: View, add, and delete comments on videos.
* **Authentication**: Uses Google OAuth for user login and integrates with YouTube API for authentication.
* **Easy to Use**: Intuitive UI built with Next.js, Tailwind CSS.

## Getting Started

### Prerequisites

Before you begin, ensure you have the following installed:
* **Node.js**: [Install Node.js](https://nodejs.org/)
* **Git**: [Install Git](https://git-scm.com/)

### Clone the Repository

```bash
git clone https://github.com/your-username/echotube.git
cd echotube
```

### Set Up Environment Variables

Create a `.env.local` file in the root directory of the project with the following variables:

```bash
NEXT_PUBLIC_YOUTUBE_API_KEY=your_youtube_api_key
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
NEXTAUTH_URL=http://localhost:3000 
```

* **YouTube API Key**: Obtain this from the Google Developers Console.
* **Google OAuth Client ID & Secret**: You can obtain these by setting up an OAuth project in the Google Developer Console.

### Install Dependencies

Install the necessary dependencies by running:

```bash
npm install
```

### Run the Project Locally

To run the app locally, use the following command:

```bash
npm run dev
```

This will start the development server at `http://localhost:3000`.

## Usage

### 1. Authentication

EchoTube uses Google OAuth to authenticate users. Once logged in with Google, the app will request the necessary permissions to manage YouTube videos and comments:

* **Scopes**:
   * `https://www.googleapis.com/auth/youtube`
   * `https://www.googleapis.com/auth/youtube.force-ssl`
   * `https://www.googleapis.com/auth/youtube.upload`

### 2. Updating Video Details

1. Log in with Google OAuth.
2. After logging in, the app will display a list of videos.
3. Select a video to edit.
4. Change the title and description in the provided form and submit.
5. The video details will be updated using the YouTube API.

### 3. Comments Management

* View comments associated with your video.
* Add, delete, and reply to comments.
