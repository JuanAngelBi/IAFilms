import React from "react";
import Post from "./Post";

export default function PostList({ posts, db, setPosts }) {
  return (
    <div className="post-list">
      {posts.map((post) => (
        <Post key={post.id} post={post} db={db} setPosts={setPosts} posts={posts} />
      ))}
    </div>
  );
}