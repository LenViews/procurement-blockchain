import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  IconButton,
  Typography,
  Avatar,
  Box,
  ListItemButton,
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  Gavel as TendersIcon,
  Assignment as BidsIcon,
  Person as ProfileIcon,
  ExitToApp as LogoutIcon,
  Menu as MenuIcon,
} from '@mui/icons-material';

const drawerWidth = 240;

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const menuItems = [
    { text: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard' },
    { text: 'Tenders', icon: <TendersIcon />, path: '/tenders' },
    { text: 'My Bids', icon: <BidsIcon />, path: '/bids' },
    { text: 'Profile', icon: <ProfileIcon />, path: '/profile' },
  ];

  const renderMenuList = (closeOnClick?: boolean) => (
    <List>
      {menuItems.map((item) => (
        <ListItem key={item.text} disablePadding>
          <ListItemButton
            onClick={() => {
              navigate(item.path);
              if (closeOnClick) handleDrawerToggle();
            }}
          >
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText primary={item.text} />
          </ListItemButton>
        </ListItem>
      ))}
    </List>
  );

  const renderUserSection = (closeOnClick?: boolean) => (
    <Box sx={{ mt: 'auto', p: 2 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <Avatar sx={{ mr: 2 }}>
          {user?.companyName?.charAt(0).toUpperCase()}
        </Avatar>
        <Box>
          <Typography variant="subtitle2">{user?.companyName}</Typography>
          <Typography variant="caption" color="textSecondary">
            {user?.email}
          </Typography>
        </Box>
      </Box>
      <ListItem disablePadding>
        <ListItemButton
          onClick={() => {
            handleLogout();
            if (closeOnClick) handleDrawerToggle();
          }}
        >
          <ListItemIcon>
            <LogoutIcon />
          </ListItemIcon>
          <ListItemText primary="Logout" />
        </ListItemButton>
      </ListItem>
    </Box>
  );

  return (
    <>
      {/* Desktop Drawer */}
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
          },
          display: { xs: 'none', sm: 'block' },
        }}
        open
      >
        <Box
          sx={{
            p: 2,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            height: 64,
          }}
        >
          <Typography variant="h6" noWrap>
            Procurement System
          </Typography>
        </Box>
        <Divider />
        {renderMenuList()}
        <Divider />
        {renderUserSection()}
      </Drawer>

      {/* Mobile Drawer */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true,
        }}
        sx={{
          display: { xs: 'block', sm: 'none' },
          '& .MuiDrawer-paper': {
            boxSizing: 'border-box',
            width: drawerWidth,
          },
        }}
      >
        <Box
          sx={{
            p: 2,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            height: 64,
          }}
        >
          <Typography variant="h6" noWrap>
            Procurement System
          </Typography>
          <IconButton onClick={handleDrawerToggle}>
            <MenuIcon />
          </IconButton>
        </Box>
        <Divider />
        {renderMenuList(true)}
        <Divider />
        {renderUserSection(true)}
      </Drawer>

      {/* Mobile Top Bar */}
      <Box
        sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          height: 64,
          display: { xs: 'flex', sm: 'none' },
          alignItems: 'center',
          px: 2,
          bgcolor: 'background.paper',
          zIndex: (theme) => theme.zIndex.drawer + 1,
          boxShadow: 1,
        }}
      >
        <IconButton
          color="inherit"
          aria-label="open drawer"
          edge="start"
          onClick={handleDrawerToggle}
          sx={{ mr: 2 }}
        >
          <MenuIcon />
        </IconButton>
        <Typography variant="h6" noWrap>
          Procurement System
        </Typography>
      </Box>
    </>
  );
};

export default Navbar;