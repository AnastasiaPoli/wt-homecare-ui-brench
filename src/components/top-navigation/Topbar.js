import React from 'react';
import { AppBar, Divider, IconButton, makeStyles, Menu, MenuItem, Toolbar } from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';
import { Link } from 'react-router-dom';

import { permissionConstants } from '../helpers/PermissionConstants';
import SettingsDropDown from './SettingsDropDown';
import { getSubscription } from '../helpers/UserInfo';
import logo from '../../images/logo_noBG.png';

const useStyles = makeStyles((theme) => ({
  grow: {
    flexGrow: 1
  },

  title: {
    display: 'none',
    [theme.breakpoints.up('sm')]: {
      display: 'block'
    }
  },
  search: {
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    marginRight: theme.spacing(2),
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      marginLeft: theme.spacing(3),
      width: 'auto'
    }
  },

  inputInput: {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: '20ch'
    }
  },
  sectionDesktop: {
    display: 'none',
    [theme.breakpoints.up('md')]: {
      display: 'flex'
    }
  },
  sectionMobile: {
    display: 'flex',
    [theme.breakpoints.up('md')]: {
      display: 'none'
    }
  }
}));

export default function TopBar(props) {
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = React.useState(null);

  const isMenuOpen = Boolean(anchorEl);
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMobileMenuClose = () => {
    setMobileMoreAnchorEl(null);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    handleMobileMenuClose();
  };

  const handleMobileMenuOpen = (event) => {
    setMobileMoreAnchorEl(event.currentTarget);
  };

  const returnLink = (linkItem, mbile) => {
    const role = props.role;
    const permissions = props.permissions;
    const cls = mbile ? 'mobile-top-nav-links' : 'top-nav-menu-items';
    const sub = getSubscription();

    if (role === permissionConstants.role.ADMIN_ROLE) {
      //TODO: Check if they have subscription for this module. (sub.healthcarePlan === true)
      if (permissions.indexOf(permissionConstants.permissions.HEALTH_PERMISSION) >= 0) {
        if (mbile) {
          return (
            <MenuItem>
              <Link to="/healthcare" className={cls}>
                Healthcare
              </Link>
            </MenuItem>
          );
        } else {
          return (
            <Link to="/healthcare" className={cls}>
              Healthcare
            </Link>
          );
        }
      }
    }
  };

  const menuId = 'primary-search-account-menu';
  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      id={menuId}
      keepMounted
      transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      open={isMenuOpen}
      onClose={handleMenuClose}
    >
      <MenuItem onClick={handleMenuClose}>
        <Link to="/my-profile" className="mobile-top-nav-links">
          {' '}
          My Profile
        </Link>
      </MenuItem>
      <MenuItem onClick={handleMenuClose}>
        <Link to="/give-feedback" className="mobile-top-nav-links">
          {' '}
          Give Feedback
        </Link>
      </MenuItem>
      <MenuItem onClick={handleMenuClose}>
        <Link to="/logout" className="mobile-top-nav-links">
          {' '}
          Logout
        </Link>
      </MenuItem>
    </Menu>
  );

  const mobileMenuId = 'primary-search-account-menu-mobile';
  const renderMobileMenu = (
    <Menu
      anchorEl={mobileMoreAnchorEl}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      id={mobileMenuId}
      keepMounted
      transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      open={isMobileMenuOpen}
      onClose={handleMobileMenuClose}
    >
      <Divider />
      <MenuItem onClick={handleMenuClose}>
        <Link to="/my-profile" className="mobile-top-nav-links">
          {' '}
          My Profile
        </Link>
      </MenuItem>
      <MenuItem onClick={handleMenuClose}>
        <Link to="/give-feedback" className="mobile-top-nav-links">
          {' '}
          Give Feedback
        </Link>
      </MenuItem>
      <MenuItem onClick={handleMenuClose}>
        <Link to="/logout" className="mobile-top-nav-links">
          {' '}
          Logout
        </Link>
      </MenuItem>
    </Menu>
  );

  const renderSettings = () => {
    const permissions = props.permissions;
    const sub = getSubscription();
    if (
      (permissions.indexOf(permissionConstants.permissions.TIMECLOCKMANAGER_PERMISSION) >= 0 &&
        sub.timeclock === true) ||
      (permissions.indexOf(permissionConstants.permissions.SCHEDULER_PERMISSION) >= 0 && sub.scheduler === true) ||
      (permissions.indexOf(permissionConstants.permissions.HEALTH_PERMISSION) >= 0 && sub.healthcarePlan === true)
    ) {
      return <SettingsDropDown />;
    } else {
      return null;
    }
  };

  return (
    <div className={classes.grow}>
      <AppBar position="static">
        <Toolbar>
          <IconButton edge="start" color="inherit" aria-label="open drawer">
            <img width={30} height={30} src={logo} alt="worktrim Logo" /> Worktrim
          </IconButton>

          <div className={classes.sectionDesktop}>
            <div className={classes.search}>{returnLink('health', false)}</div>
          </div>
          <div className={classes.grow} />
          <div className={classes.sectionDesktop}>
            {renderSettings()}

            <IconButton
              edge="end"
              aria-label="account of current user"
              aria-controls={menuId}
              aria-haspopup="true"
              onClick={handleProfileMenuOpen}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
          </div>
          <div className={classes.sectionMobile}>
            <IconButton
              aria-label="show more"
              aria-controls={mobileMenuId}
              aria-haspopup="true"
              onClick={handleMobileMenuOpen}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
          </div>
        </Toolbar>
      </AppBar>
      {renderMobileMenu}
      {renderMenu}
    </div>
  );
}
