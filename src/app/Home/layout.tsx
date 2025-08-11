'use client';

import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Button,
  Box,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemText,
  useTheme,
  useMediaQuery,
  CssBaseline,
  ThemeProvider,
  createTheme,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Home as HomeIcon,
  Person as PersonIcon,
  Work as WorkIcon,
  School as SchoolIcon,
  Code as CodeIcon,
  EmojiEvents as AwardsIcon,
  Article as ResearchIcon,
  Psychology as SkillsIcon,
  Verified as CertificationIcon,
} from '@mui/icons-material';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import FooterSection from '../components/FooterSection';
import GetProfileName from '../components/GetProfileName';

// Create a custom theme for the portfolio
const portfolioTheme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
      light: '#42a5f5',
      dark: '#1565c0',
    },
    secondary: {
      main: '#dc004e',
      light: '#ff5983',
      dark: '#9a0036',
    },
    background: {
      default: '#fafafa',
      paper: '#ffffff',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 700,
      fontSize: '2.5rem',
      '@media (min-width:600px)': {
        fontSize: '3.5rem',
      },
    },
    h2: {
      fontWeight: 600,
      fontSize: '2rem',
      '@media (min-width:600px)': {
        fontSize: '2.5rem',
      },
    },
    h3: {
      fontWeight: 500,
      fontSize: '1.5rem',
    },
  },
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(10px)',
          boxShadow: '0 2px 20px rgba(0, 0, 0, 0.1)',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: '8px',
          fontWeight: 500,
        },
      },
    },
  },
});

const navigationItems = [
  { name: 'Home', path: '/', icon: <HomeIcon /> },
  { name: 'Profile', path: '/Home/profile', icon: <PersonIcon /> },
  { name: 'Academics', path: '/Home/academic', icon: <SchoolIcon /> },
  { name: 'Research', path: '/Home/research', icon: <ResearchIcon /> },
  { name: 'Projects', path: '/Home/project', icon: <CodeIcon /> },
  { name: 'Experience', path: '/Home/experience', icon: <WorkIcon /> },
  { name: 'Skills', path: '/Home/skill', icon: <SkillsIcon /> },
  { name: 'Certifications', path: '/Home/certification', icon: <CertificationIcon /> },
  { name: 'Honors & Awards', path: '/Home/award', icon: <AwardsIcon /> },
];

function HomeLayout({ children }: { children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const pathname = usePathname();

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const drawer = (
    <Box sx={{ width: 250 }}>
      <Box sx={{ p: 2, borderBottom: '1px solid #e0e0e0' }}>
        <GetProfileName color={'black'}></GetProfileName>
      </Box>
      <List>
        {navigationItems.map((item) => (
          <ListItem
            key={item.name}
            component={Link}
            href={item.path}
            onClick={() => setMobileOpen(false)}
            sx={{
              color: pathname === item.path ? 'primary.main' : 'text.primary',
              backgroundColor: pathname === item.path ? 'primary.50' : 'transparent',
              '&:hover': {
                backgroundColor: 'primary.100',
              },
            }}
          >
            <Box sx={{ mr: 2, color: 'inherit' }}>{item.icon}</Box>
            <ListItemText 
              primary={item.name}
              primaryTypographyProps={{
                fontWeight: pathname === item.path ? 600 : 400,
              }}
            />
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <ThemeProvider theme={portfolioTheme}>
      <CssBaseline />
      <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', width: '100%' }}>
        {/* Header */}
        <AppBar position="sticky" elevation={0} sx={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          backdropFilter: 'blur(10px)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
        }}> 
          <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Box sx={{ p: 2, borderBottom: '1px solid rgba(255, 255, 255, 0.2)' }}>
            <GetProfileName color={'white'}></GetProfileName>
           </Box>
            {/* Desktop Navigation */}
            {!isMobile && (
              <Box sx={{ display: 'flex', gap: 1 }}>
                {navigationItems.map((item) => (
                  <Button
                    key={item.name}
                    component={Link}
                    href={item.path}
                    startIcon={item.icon}
                    sx={{
                      color: pathname === item.path ? '#ffffff' : 'rgba(255, 255, 255, 0.8)',
                      backgroundColor: pathname === item.path ? 'rgba(255, 255, 255, 0.2)' : 'transparent',
                      '&:hover': {
                        backgroundColor: 'rgba(255, 255, 255, 0.15)',
                        color: '#ffffff',
                      },
                    }}
                  >
                    {item.name}
                  </Button>
                ))}
              </Box>
            )}

            {/* Mobile Menu Button */}
            {isMobile && (
              <IconButton
                color="inherit"
                aria-label="open drawer"
                edge="start"
                onClick={handleDrawerToggle}
                sx={{ color: '#ffffff' }}
              >
                <MenuIcon />
              </IconButton>
            )}
          </Toolbar>
        </AppBar>

        {/* Mobile Drawer */}
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            display: { xs: 'block', md: 'none' },
            '& .MuiDrawer-paper': { 
              boxSizing: 'border-box', 
              width: 250,
              backgroundColor: 'background.paper',
            },
          }}
        >
          {drawer}
        </Drawer>

        {/* Main Content */}
        <Box sx={{ flexGrow: 1, width: '100%' }}>
          {/* <Container maxWidth="100%" sx={{ py: 4 }}> */}
            {children}
          {/* </Container> */}
        </Box>

        <FooterSection />
      </Box>
    </ThemeProvider>
  );
}

export default HomeLayout;  