import React, { useEffect, useState } from "react";

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

const PostCard = ({ post }) => {
  const [expanded, setExpanded] = React.useState(false);
  const [commentExpanded, setCommentExpanded] = React.useState(false);

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

  const messages = [
    {
      primary: 'Brunch this week?',
      secondary: "I'll be in the neighbourhood this week. Let's grab a bite to eat",
      person: '/static/images/avatar/5.jpg',
    },
    {
      primary: 'Birthday Gift',
      secondary: `Do you have a suggestion for a good present for John on his work
        anniversary. I am really confused & would love your thoughts on it.`,
      person: '/static/images/avatar/1.jpg',
    },
    {
      primary: 'Recipe to try',
      secondary: 'I am try out this new BBQ recipe, I think this might be amazing',
      person: '/static/images/avatar/2.jpg',
    }
  ];

  return (
    <Card sx={{ maxWidth: 345 }} key={post.id} className="post-card">
      <CardHeader
        avatar={
          <Avatar sx={{ bgcolor: red[500] }} aria-label="recipe">
            {post.username.charAt(0).toUpperCase()}
          </Avatar>
        }
        action={
          <IconButton aria-label="settings">
            <MoreVertIcon />
          </IconButton>
        }
        title={post.title}
        subheader={post.username}
      />
      {/* <CardMedia
            component="img"
            height="194"
            image="/static/images/cards/paella.jpg"
            alt="Paella dish"
          /> */}
      <CardContent>
        <Typography variant="body2" color="text.secondary">
          {post.content}
        </Typography>
      </CardContent>
      
      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <CardContent>
          <Typography paragraph>Method:</Typography>
          <Typography paragraph>
            Heat 1/2 cup of the broth in a pot until simmering, add saffron and set
            aside for 10 minutes.
          </Typography>
          <Typography paragraph>
            Heat oil in a (14- to 16-inch) paella pan or a large, deep skillet over
            medium-high heat. Add chicken, shrimp and chorizo, and cook, stirring
            occasionally until lightly browned, 6 to 8 minutes. Transfer shrimp to a
            large plate and set aside, leaving chicken and chorizo in the pan. Add
            pimentón, bay leaves, garlic, tomatoes, onion, salt and pepper, and cook,
            stirring often until thickened and fragrant, about 10 minutes. Add
            saffron broth and remaining 4 1/2 cups chicken broth; bring to a boil.
          </Typography>
          <Typography paragraph>
            Add rice and stir very gently to distribute. Top with artichokes and
            peppers, and cook without stirring, until most of the liquid is absorbed,
            15 to 18 minutes. Reduce heat to medium-low, add reserved shrimp and
            mussels, tucking them down into the rice, and cook again without
            stirring, until mussels have opened and rice is just tender, 5 to 7
            minutes more. (Discard any mussels that don’t open.)
          </Typography>
          <Typography>
            Set aside off of the heat to let rest for 10 minutes, and then serve.
          </Typography>

          <Divider style={{ marginTop: "1.5em" }}>Comments</Divider>

          <List style={{ padding: "0em" }}>
            {messages.map(({ primary, secondary, person }, index) => (
              <ListItem button key={index + person}>
                <ListItemAvatar>
                  <Avatar alt="Profile Picture" src={person} />
                </ListItemAvatar>
                <ListItemText primary={primary} secondary={secondary} />
              </ListItem>
            ))}
          </List>

          
          <Collapse in={commentExpanded} timeout="auto" unmountOnExit>
            <Divider style={{ marginTop: "0em" }}>New Comment</Divider>
            <TextField id="filled-multiline-flexible" label="Comment" multiline rows={3} variant="filled"
              style={{ display: "flex", marginTop: "0.5em", width: "calc(100% - 4em)", marginLeft: "2em", marginRight: "2em" }} />
            <TextField id="standard-basic" label="user name" variant="standard" style={{ marginLeft: '2em' }} />
            <Button variant="outlined" style={{ marginLeft: '1em', marginTop: '1em' }}>Comment</Button>
          </Collapse>
              

        </CardContent>
      </Collapse>
      <CardActions disableSpacing>
            <IconButton aria-label="add to favorites">
              <FavoriteIcon />
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