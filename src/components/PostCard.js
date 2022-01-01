import React, { useEffect, useState, useReducer } from "react";

import { styled } from '@mui/material/styles';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Collapse from '@mui/material/Collapse';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import { red } from '@mui/material/colors';
import FavoriteIcon from '@mui/icons-material/Favorite';
import CommentIcon from '@mui/icons-material/Comment';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import MoreVertIcon from '@mui/icons-material/MoreVert';

import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';

import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import ReactQuill from "react-quill";
import 'react-quill/dist/quill.bubble.css'
import Skeleton from '@mui/material/Skeleton';

import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';

const serverUrl = "https://socialmedia.znaaron.com"

const PostCard = ({ post, onDeletion }) => {
  const id = post.id
  const [like, setLike] = useState(0);
  const [likeStyle, setLikeStyle] = useState({});
  const [comments, setComments] = useState([]);
  const [statusChange, setStatusChange] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [commentExpanded, setCommentExpanded] = useState(false);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const [formInput, setFormInput] = useReducer(
    (state, newState) => ({ ...state, ...newState }),
    {
      username: "",
      content: ""
    }
  );

  const Cover = () => {
    if (post.img === "") {
      return ""
    }
    else {
      return (
        <CardMedia
          component="img"
          image={post.img}
        />
      )
    }
  }

  useEffect(() => {
    //only fetch when it is visible to reduce the load on the backend
    if (expanded && !id.includes("loading")) {
      const getPosts = async () => {
        const likeURL = serverUrl + "/posts/like?id=" + id;
        const commentURL = serverUrl + "/posts/comments?id=" + id;

        const likeResp = await fetch(likeURL);
        const likeNum = await likeResp.text();
        setLike(parseInt(likeNum));

        const commentResp = await fetch(commentURL);
        let postComments = await commentResp.json();
        postComments.sort(function (a, b) {
          return b.time - a.time;
        });
        setComments(postComments);
      };

      getPosts();
    }
  }, [statusChange, expanded, id]);

  if (id.includes("loading")) {
    return (
      <Card sx={{ maxWidth: 345 }} className="post-card">
        <CardHeader
          avatar={<Skeleton animation="wave" variant="circular" width={40} height={40} />}
          title={
            <Skeleton
              animation="wave"
              height={10}
              width="80%"
              style={{ marginBottom: 6 }}
            />}
          subheader={<Skeleton animation="wave" height={10} width="40%" />}
        />
        <Skeleton sx={{ height: 300 }} animation="wave" variant="rectangular" />
        <CardContent>
          <React.Fragment>
            <Skeleton animation="wave" height={10} style={{ marginBottom: 6 }} />
            <Skeleton animation="wave" height={10} width="80%" />
          </React.Fragment>
        </CardContent>
      </Card>
    )
  }

  const postComment = async (data) => {
    const response = await fetch(
      serverUrl + "/posts/comments",
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      }
    )
    return response
  }

  const submitComment = async () => {
    /* delay the fetch to the next comment to remove the dummyComment
      which would cause duplicated key if there are more than one dummy */
    setStatusChange(!statusChange)

    const comment = {
      ...formInput,
      postId: id,
    }

    postComment(comment).then(result => {
      if (result.status === 200) {
        setCommentExpanded(false)
        alert("success")

        /* fake front end change because the backend may not have finished the storage
        that will cause the new fetch to get the same comments data */
        const dummyComment = {
          ...comment,
          id: "dummy",
          time: new Date().getTime()
        }
        setComments([dummyComment, ...comments])
        /* not fecthing because it can cause inconsistent view
          if the storage is not finished */
        //setStatusChange(!statusChange)
      }
    })
  };

  const likePost = async () => {
    const likeURL = serverUrl + "/posts/like?id=" + id
    fetch(likeURL, { method: 'POST' })
    setLikeStyle({ fill: "red" })
    setLike(like + 1)
    /* not fecthing because it can cause inconsistent view
      if the storage is not finished */
    //setStatusChange(!statusChange)
  }

  const ExpandMore = styled((props) => {
    const { expand, ...other } = props;
    return <IconButton {...other} />;
  })(({ theme, expand }) => ({
    transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
    marginLeft: 'auto',
    transition: theme.transitions.create('transform', {
      duration: theme.transitions.duration.shortest,
    }),
  }));

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  const handleCommentExpandClick = () => {
    if (commentExpanded) {
      setCommentExpanded(!commentExpanded);
    } else {
      setCommentExpanded(true);
      setExpanded(true);
    }
  };

  const handleInput = evt => {
    const name = evt.target.name;
    const newValue = evt.target.value;
    setFormInput({ [name]: newValue });
  };

  const handleSettingClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleDelete = () => {
    const deleteURL = serverUrl + "/posts?id=" + id
    fetch( deleteURL, { method: 'DELETE' })
    onDeletion(id)
    setAnchorEl(null);
  };

  const date = new Date(post.time);
  const time = date.getDate() +
    "/" + (date.getMonth() + 1) +
    "/" + date.getFullYear() +
    " " + date.getHours() +
    ":" + date.getMinutes() +
    ":" + date.getSeconds();

  return (
    <Card sx={{ maxWidth: 345 }} key={post.id} className="post-card">
      <CardHeader
        avatar={
          <Avatar sx={{ bgcolor: red[500] }} aria-label="recipe">
            {post.username.charAt(0).toUpperCase()}
          </Avatar>
        }
        action={
          <IconButton aria-label="settings" onClick={handleSettingClick}>
            <MoreVertIcon />
          </IconButton>
        }
        title={post.title}
        subheader={post.username}
      />
      <Cover />
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleDelete}
        MenuListProps={{
          'aria-labelledby': 'basic-button',
        }}
      >
        <MenuItem onClick={handleDelete}>Delete</MenuItem>
      </Menu>
      <CardContent>
        <Typography variant="body2" color="text.secondary">
          {post.description}
        </Typography>
      </CardContent>

      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <CardContent>
          {/*rich text content*/}
          <Divider style={{ marginTop: "0em" }}></Divider>
          <ReactQuill
            value={post.content}
            readOnly={true}
            theme={"bubble"} />
          {/*likes and time*/}
          <Typography variant="body2" color="text.secondary" style={{ marginTop: "1em", textAlign: "right" }}>
            likes:{like}  time:{time}
          </Typography>
          <Divider >Comments</Divider>
          {/*comments*/}
          <List style={{ padding: "0em" }}>
            {comments.map(({ id, username, content }) => (
              <ListItem button key={id}>
                <ListItemAvatar>
                  <Avatar >
                    {username.charAt(0).toUpperCase()}
                  </Avatar>
                </ListItemAvatar>
                <ListItemText primary={content} secondary={username} />
              </ListItem>
            ))}
          </List>
          {/*create new comment*/}
          <Collapse in={commentExpanded} timeout="auto" unmountOnExit>
            <Divider style={{ marginTop: "0em" }}>New Comment</Divider>
            <TextField id="filled-multiline-flexible" label="Comment" multiline rows={3} variant="filled"
              name="content" onChange={handleInput}
              style={{ display: "flex", marginTop: "0.5em", width: "calc(100% - 4em)", marginLeft: "2em", marginRight: "2em" }} />
            <TextField id="standard-basic" label="username" variant="standard"
              name="username" onChange={handleInput} style={{ marginLeft: '2em' }} />
            <Button variant="outlined" onClick={submitComment} style={{ marginLeft: '1em', marginTop: '1em' }}>
              Comment
            </Button>
          </Collapse>
        </CardContent>
      </Collapse>

      {/*buttons*/}
      <CardActions disableSpacing>
        <IconButton
          aria-label="like"
          onClick={likePost}>
          <FavoriteIcon style={likeStyle} />
        </IconButton>
        <IconButton
          aria-label="comment"
          onClick={handleCommentExpandClick}>
          <CommentIcon />
        </IconButton>
        <ExpandMore
          expand={expanded}
          onClick={handleExpandClick}
          aria-expanded={expanded}
          aria-label="show more">
          <ExpandMoreIcon />
        </ExpandMore>
      </CardActions>
    </Card>
  )
};

export default PostCard;