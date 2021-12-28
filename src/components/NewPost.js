import React, { useCallback, useEffect, useState } from 'react'

import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Fab from '@mui/material/Fab';
import EditIcon from '@mui/icons-material/Edit';
import TextField from '@mui/material/TextField';

import ReactQuill, { Mixin, Toolbar, Quill } from "react-quill";
import 'react-quill/dist/quill.snow.css';

import { useDropzone } from 'react-dropzone'
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

const thumbsContainer = {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',

};

const thumb = {
    display: 'inline-flex',
    borderRadius: 2,
    border: '1px solid #eaeaea',
    marginBottom: 8,
    marginRight: 8,
    height: '4em',
    width: '4em',
    padding: 2,
    margin: 0,
    boxSizing: 'border-box'
};

const thumbInner = {
    display: 'flex',
    minWidth: 0,
    overflow: 'hidden'
};

const img = {
    display: 'block',
    width: 'auto',
    height: '100%'
};


function Previews(props) {
    const [files, setFiles] = useState([]);
    const { getRootProps, getInputProps } = useDropzone({
        accept: 'image/*',
        onDrop: acceptedFiles => {
            setFiles(acceptedFiles.map(file => Object.assign(file, {
                preview: URL.createObjectURL(file)
            })));
        }
    });

    const thumbs = files.map(file => (
        <div style={thumb} key={file.name}>
            <div style={thumbInner}>
                <img
                    src={file.preview}
                    style={img}
                />
            </div>
        </div>
    ));

    useEffect(() => () => {
        // Make sure to revoke the data uris to avoid memory leaks
        files.forEach(file => URL.revokeObjectURL(file.preview));
    }, [files]);

    return (
        <section className="container">
            <div {...getRootProps({ className: 'dropzone' })} style={{ display: 'flex' }}>
                <input {...getInputProps()} />
                <p style={{ fontSize: "0.5em", margin: "0" }}>cover photo (optional)</p>
            </div>
            <aside style={thumbsContainer}>
                {thumbs}
            </aside>
        </section>
    );
}

export default function NewPost() {
    const [open, setOpen] = React.useState(false);
    const handleOpen = () => {
        setOpen(true);
    };
    const handleClose = () => {
        setOpen(false);
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
                    <TextField id="outlined-basic" label="Title" variant="outlined" style={{ marginBottom: "0.5em" }} />
                    <br />

                    <TextField id="filled-multiline-flexible" label="Description" multiline rows={3} variant="filled" style={{ marginBottom: "0.5em", width: "70%", marginRight: '0.5em'}} />
                    <Box component="span" sx={{ p: 2, border: '1px dashed grey',  height: '6.5em', width: '8em', display: 'inline-flex', padding: '0px' }}>
                        <Button><Previews /></Button>
                    </Box>

                    <h4 style={{ marginTop: "0.5em", marginBottom: "0.5em" }}>Rich Text Content(Optional)</h4>
                    <ReactQuill theme="snow" style={{ height: "35%" }} />
                    <div style={{ marginTop: "4em"}}>
                        <TextField id="standard-basic" label="user name" variant="standard"/>
                        <Button variant="outlined"  style={{ marginLeft:'1em', marginTop: '1em' }}>Post</Button>
                    </div>

                    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
                </Box>
            </Modal>
        </div>
    );
}