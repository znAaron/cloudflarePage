import React, { useEffect, useState } from "react";

import NewPost from './NewPost'
import PostCard from './PostCard'



const Posts = () => {
  const [posts, setPosts] = useState([]);
  

  useEffect(() => {
    const getPosts = async () => {
      /* const resp = await fetch(
        "http://127.0.0.1:8787/posts",
        {mode: 'cors'}
      );*/

      //const resp =  "[{\"title\":\"My First Post\", \"username\": \"coolguy123\", \"content\": \"Hey Y'all!\"}, {\"title\":\"Story About my Dogs\", \"username\": \"kn0thing\", \"content\": \"So the other day I was in the yard, and...\"}]"

      //const postsResp = await resp.json();
      const postsResp = [{ "id": "1", "title": "My First Post", "username": "coolguy123", "content": "Hey Y'all!" }, { "id": "2", "title": "Story About my Dogs", "username": "kn0thing", "content": "So the other day I was in the yard, and..." },
      { "id": "3", "title": "My First Post", "username": "coolguy123", "content": "Hey Y'all!" }, { "id": "4", "title": "Story About my Dogs", "username": "kn0thing", "content": "So the other day I was in the yard, and..." },
      { "id": "5", "title": "My First Post", "username": "coolguy123", "content": "Hey Y'all!" }, { "id": "6", "title": "Story About my Dogs", "username": "kn0thing", "content": "So the other day I was in the yard, and..." }]

      setPosts(postsResp);
    };

    getPosts();
  }, []);

  return (
    <div className="post-list">
      {posts.map((post) =>
        <PostCard key={post.id} post={post} />)}
      <NewPost />
    </div>
  );
};

export default Posts;