import React from 'react';
import Button from '@material-ui/core/Button';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import Grow from '@material-ui/core/Grow';
import Paper from '@material-ui/core/Paper';
import Popper from '@material-ui/core/Popper';
import MenuItem from '@material-ui/core/MenuItem';
import MenuList from '@material-ui/core/MenuList';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import {Link} from "react-router-dom";


import {getPermissions, getSubscription, getUserProfile} from "../helpers/UserInfo";
import {permissionConstants} from "../helpers/PermissionConstants";


const SettingsDropDown = (props) => {

    const [open, setOpen] = React.useState(false);
    const anchorRef = React.useRef(null);

    const handleToggle = () => {
        setOpen((prevOpen) => !prevOpen);
    };

    const handleClose = (event) => {
        if (anchorRef.current && anchorRef.current.contains(event.target)) {
            return;
        }

        setOpen(false);
    };

    function handleListKeyDown(event) {
        if (event.key === 'Tab') {
            event.preventDefault();
            setOpen(false);
        }
    }

    // return focus to the button when we transitioned from !open -> open
    const prevOpen = React.useRef(open);
    React.useEffect(() => {
        if (prevOpen.current === true && open === false) {
            anchorRef.current.focus();
        }

        prevOpen.current = open;
    }, [open]);




    const renderHealthcareLinks = () => {
        const permissions = getPermissions();
        const sub = getSubscription();

        //TODO: CHECK FOR HEALTHCARE PERMISSION (&& sub.timeclock === true)

        if(permissions.indexOf(permissionConstants.permissions.HEALTH_PERMISSION) >= 0 ){
            return (
                <React.Fragment>
                    <Link to="/healthcare-settings" style={{textDecoration:'none', color:'#008080'}}><MenuItem onClick={handleClose}>Healthcare Settings</MenuItem></Link>
                </React.Fragment>
            )
        }else{
            return null;
        }
    }




    const renderSettingsLink = () => {
        const role = getUserProfile();
        if(role === permissionConstants.role.ADMIN_ROLE){
            return (
                <React.Fragment>
                    {renderHealthcareLinks()}
                </React.Fragment>
            )
        }else{
            return null;
        }
    }




    return (
        <React.Fragment>
            <Button
                ref={anchorRef}
                aria-controls={open ? 'menu-list-grow' : undefined}
                aria-haspopup="true"
                onClick={handleToggle}
            >
                <span style={{color:'#ffffff', fontSize:'15px', fontWeight:'bold', marginLeft:'18px', textTransform:'none'}}>Settings</span><ArrowDropDownIcon style={{ color: '#ffffff'}} />
            </Button>
            <Popper style={{position:'relative', zIndex:'1000'}} open={open} anchorEl={anchorRef.current} role={undefined} transition disablePortal>
                {({ TransitionProps, placement }) => (
                    <Grow
                        {...TransitionProps}
                        style={{ transformOrigin: placement === 'bottom' ? 'center top' : 'center bottom' }}
                    >
                        <Paper>
                            <ClickAwayListener onClickAway={handleClose}>
                                <MenuList autoFocusItem={open} id="menu-list-grow" onKeyDown={handleListKeyDown}>
                                    {renderSettingsLink()}
                                </MenuList>
                            </ClickAwayListener>
                        </Paper>
                    </Grow>
                )}
            </Popper>
        </React.Fragment>
    );
}


export default SettingsDropDown;
