import React, { useState, useReducer, useEffect } from 'react'

import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Fab from '@mui/material/Fab';
import EditIcon from '@mui/icons-material/Edit';
import TextField from '@mui/material/TextField';

import ReactQuill from "react-quill";
import 'react-quill/dist/quill.snow.css';

import Button from '@mui/material/Button';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    pt: 2,
    px: 4,
    pb: 3,
};

export default function NewPost({ onNewPost }) {
    const [open, setOpen] = useState(false)
    const [cover, setCover] = useState(false)
    const [content, setContent] = useState('')
    const [formInput, setFormInput] = useReducer(
        (state, newState) => ({ ...state, ...newState }),
        {
            title: "",
            username: "",
            description: "",
            img: ""
        }
    )

    const handleInput = evt => {
        const name = evt.target.name;
        const newValue = evt.target.value;
        setFormInput({ [name]: newValue });
    };

    const onChangeContent = (content: any, delta: any, source: any, editor: any) => {
        setContent(editor.getHTML());
    }

    const handleOpen = () => { setOpen(true) };

    const handleClose = () => { setOpen(false) };

    const submitFile = async event => {
        const files = event.target.files
        const formData = new FormData()
        formData.append('file', files[0])

        //get the Direct Creator Upload link
        const resp = await fetch(
            "https://socialmedia.znaaron.com/posts/image",
            { mode: 'cors', method: 'POST' }
        )
        const uploadURL = await resp.text()

        fetch(uploadURL, {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            const urlPrefix = "https://imagedelivery.net/wbDE66lhHHC90fGFwDssBQ/"
            const fullUrl = urlPrefix + data.result.id + "/public"
            setFormInput({img: fullUrl})
            setCover(true)
        })
    }

    const postData = async (data) => {
        const response = await fetch(
            "https://socialmedia.znaaron.com/posts",
            {
                mode: 'cors',
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            }
        )
        return response
    }

    const submitPost = async () => {
        const post = {
            ...formInput,
            content: content
        }

        postData(post)

        alert("Success")
        setOpen(false)
        onNewPost()
    };

    return (
        <div>
            <Fab color="secondary" variant="extended" className="new-post-icon" onClick={handleOpen}>
                <EditIcon sx={{ mr: 1 }} />
                New Post
            </Fab>
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-title"
                aria-describedby="modal-description">
                <Box sx={{ ...style, width: "75%", height: "76%", padding: "3%", overflow: "scroll" }}>
                    <h2 id="modal-title" style={{ marginTop: "0em", marginBottom: "0.5em" }}>New Post</h2>
                    <TextField id="outlined-basic" name="title" label="Title" variant="outlined" onChange={handleInput}
                        style={{ marginBottom: "0.5em" }} />
                    <br />

                    <TextField id="filled-multiline-flexible" name="description" label="Description" multiline rows={3} variant="filled" onChange={handleInput}
                        style={{ marginBottom: "0.5em", width: "70%", marginRight: '0.5em' }} />
                    <Box component="span" sx={{ p: 2, border: '1px dashed grey', height: '6.5em', width: '8em', display: 'inline-flex', padding: '0px' }}>
                    <input type="file" id="myFile" onChange={submitFile} name="file" />
                    </Box>

                    <h4 style={{ marginTop: "0.5em", marginBottom: "0.5em" }}>Rich Text Content(Optional)</h4>
                    <ReactQuill theme="snow" style={{ height: "35%" }} value={content} onChange={onChangeContent} />
                    <div style={{ marginTop: "4em" }}>
                        <TextField id="standard-basic" name="username" label="username" variant="standard" onChange={handleInput} />
                        <Button variant="outlined" style={{ marginLeft: '1em', marginTop: '1em' }} onClick={submitPost}>Post</Button>
                    </div>

                    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
                </Box>
            </Modal>
        </div>
    );
}