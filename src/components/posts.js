import React, { useEffect, useState } from "react";

import NewPost from './NewPost'
import PostCard from './PostCard'

const Posts = () => {
  const [posts, setPosts] = useState([{id:"loading1"}, {id:"loading2"}, {id:"loading3"}]);
  const [newPost, setNewPost] = useState(false);

  useEffect(() => {
    const getPosts = async () => {
      const resp = await fetch(
        "https://socialmedia.znaaron.com/posts"
      );
      let postsResp = await resp.json();
      postsResp.sort(function (a, b) {
        return b.time - a.time;
      })
      setPosts(postsResp);
    };

    getPosts();
  }, [newPost]);

  const handleNewPosts = () => {
    setNewPost(!newPost);
  }

  return (
    <div className="post-list">
      {posts.map((post) =>
        <PostCard key={post.id} post={post} />)}
      <NewPost onNewPost={handleNewPosts}/>
    </div>
  );
};

export default Posts;