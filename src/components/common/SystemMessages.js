import React from 'react';
import Alert from '@material-ui/lab/Alert';
import IconButton from '@material-ui/core/IconButton';
import Collapse from '@material-ui/core/Collapse';
import CloseIcon from '@material-ui/icons/Close';
import Typography from "@material-ui/core/Typography";


 const SystemMessages = props =>  {
     const [open, setOpen] = React.useState(true);

        if (props.msgContent !== undefined && props.msgContent !== null) {
            return (
                 <div>
                     <Collapse in={open}>
                         <Alert
                             variant="filled"
                             severity={props.msgType}
                             action={
                                 <IconButton
                                     aria-label="close"
                                     color="inherit"
                                     size="small"
                                     onClick={() => {
                                         setOpen(false);
                                     }}
                                 >
                                     <CloseIcon fontSize="inherit" />
                                 </IconButton>
                             }
                         >
                             <Typography align="center">
                                 {props.msgContent} {props.otherComponents}
                             </Typography>
                         </Alert>
                     </Collapse>
                     <br />
                </div>
            );
        }else{
            return null;
        }



}


export default SystemMessages;
