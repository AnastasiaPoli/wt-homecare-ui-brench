import React from 'react';
import ReactDOM from 'react-dom';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';



class Modal extends React.Component {
    renderOkBtn = () => {
        if(this.props.okLabel){
            return(
                <Button onClick={this.props.submitAction} color="primary" variant="contained">
                 {this.props.okLabel}
                </Button>
            );
        }
    }

    render() {

        return ReactDOM.createPortal(
            <Dialog
                open={true}
                onClose={this.props.closeHandler}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
                fullWidth={true}
            >
                <DialogTitle id="alert-dialog-title">
                    {this.props.title}
                </DialogTitle>
                <DialogContent>
                    {this.props.content}
                </DialogContent>
                <DialogActions>
                    {this.renderOkBtn()}
                    <Button onClick={this.props.closeHandler} className="wt-btn-danger" autoFocus  variant="contained">
                        Cancel
                    </Button>

                </DialogActions>
            </Dialog>,

            document.querySelector('#modal')
        );
    }
}

export default Modal;