import React, { useEffect, useState } from "react";

import NewPost from './NewPost'
import PostCard from './PostCard'

const serverUrl = "https://socialmedia.znaaron.com"

const Posts = () => {
  const [posts, setPosts] = useState([{id:"loading1"}, {id:"loading2"}, {id:"loading3"}])
  const [newPost, setNewPost] = useState(false)

  useEffect(() => {
    const getPosts = async () => {
      const resp = await fetch(
        serverUrl +"/posts"
      )
      let postsResp = await resp.json();
      postsResp.sort(function (a, b) {
        if (a == null || b == null){
          return 1
        }
        return b.time - a.time
      })
      console.log("debug: ", postsResp)
      setPosts(postsResp)
    };

    getPosts()
  }, [newPost])

  const handleNewPosts = () => {
    setNewPost(!newPost)
  }

  const fakeDelete = (id) => {
    let newPosts = []
    for (const p of posts) {
      if (p.id != id) {
        newPosts.push(p)
      }
    }
    setPosts(newPosts)
  }

  return (
    <div className="post-list">
      {posts.map((post) =>
        <PostCard key={post.id} post={post} onDeletion={fakeDelete}/>)}
      <NewPost onNewPost={handleNewPosts}/>
    </div>
  )
}

export default Posts