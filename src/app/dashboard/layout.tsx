"use client";
import { useState } from "react";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useAuth } from "@/context/AuthContext";
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Divider,
  useMediaQuery,
  CssBaseline,
} from "@mui/material";
import {
  AccountCircle,
  Work,
  Folder,
  School,
  EmojiEvents,
  Star,
  Science,
  Logout,
  Menu as MenuIcon,
  Home,
} from "@mui/icons-material";
import Link from "next/link";
import { useTheme } from "@mui/material/styles";

const navItems = [
  { text: "Profile", icon: <AccountCircle />, href: "/dashboard/profile" },
  { text: "Experience", icon: <Work />, href: "/dashboard/experience" },
  { text: "Projects", icon: <Folder />, href: "/dashboard/projects" },
  { text: "Skills", icon: <Star />, href: "/dashboard/skills" },
  { text: "Academics", icon: <School />, href: "/dashboard/academics" },
  {
    text: "Certifications",
    icon: <EmojiEvents />,
    href: "/dashboard/certifications",
  },
  { text: "Awards", icon: <EmojiEvents />, href: "/dashboard/awards" },
  { text: "Research", icon: <Science />, href: "/dashboard/research" },
  { text: "Home", icon: <Home />, href: "/" },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { logout } = useAuth();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [logoutOpen, setLogoutOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const drawerContent = (
    <>
      <Toolbar sx={{ bgcolor: theme.palette.primary.main }}>
        <Typography variant="h6" noWrap color="white">
          Portfolio Admin
        </Typography>
      </Toolbar>
      <Divider />
      <List sx={{ py: 0, height: '100%', display: 'flex', flexDirection: 'column' }}>
        {navItems.map((item) => (
          <ListItem
            key={item.text}
            component={Link}
            href={item.href}
            onClick={isMobile ? () => setDrawerOpen(false) : undefined}
            sx={{
              color: theme.palette.text.secondary,
              "&:hover": {
                bgcolor: theme.palette.action.hover,
                color: theme.palette.primary.main,
              },
              "&.Mui-selected": {
                bgcolor: theme.palette.action.selected,
                color: theme.palette.primary.main,
              },
            }}
          >
            <ListItemIcon sx={{ color: "inherit" }}>{item.icon}</ListItemIcon>
            <ListItemText 
              primary={item.text} 
              primaryTypographyProps={{ fontWeight: 500 }} 
            />
          </ListItem>
        ))}
        <Box sx={{ flexGrow: 1 }} />
        <Divider sx={{ my: 1 }} />
        <ListItem
          component="button"
          onClick={() => setLogoutOpen(true)}
          sx={{
            color: theme.palette.error.main,
            mt: 'auto',
            '&:hover': {
              bgcolor: theme.palette.action.hover,
              color: theme.palette.error.dark,
            },
          }}
        >
          <ListItemIcon sx={{ color: 'inherit' }}><Logout /></ListItemIcon>
          <ListItemText primary="Logout" primaryTypographyProps={{ fontWeight: 500 }} />
        </ListItem>
      </List>
    </>
  );

  return (
    <ProtectedRoute>
      <CssBaseline />
      <Box sx={{ display: "flex", minHeight: "100vh" }}>
        {/* Mobile Drawer */}
        <Drawer
          variant="temporary"
          open={drawerOpen}
          onClose={() => setDrawerOpen(false)}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: "block", sm: "none" },
            "& .MuiDrawer-paper": {
              width: 240,
              boxSizing: "border-box",
            },
          }}
        >
          {drawerContent}
        </Drawer>

        {/* Desktop Drawer */}
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: "none", sm: "block" },
            "& .MuiDrawer-paper": {
              width: 240,
              boxSizing: "border-box",
              borderRight: "none",
              boxShadow: theme.shadows[2],
            },
          }}
          open
        >
          {drawerContent}
        </Drawer>

        {/* Main Content */}
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            bgcolor: theme.palette.grey[50],
            minHeight: "100vh",
            ml: { sm: "240px" },
            width: { sm: "calc(100% - 240px)" },
          }}
        >
          {/* AppBar */}
          <AppBar
            position="sticky"
            color="inherit"
            elevation={0}
            sx={{
              borderBottom: `1px solid ${theme.palette.divider}`,
              bgcolor: "white",
              zIndex: (theme) => theme.zIndex.drawer + 1,
              top: 0,
            }}
          >
            <Toolbar>
              {isMobile && (
                <IconButton
                  edge="start"
                  sx={{ mr: 2 }}
                  onClick={() => setDrawerOpen(true)}
                >
                  <MenuIcon />
                </IconButton>
              )}
              <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 600 }}>
                Dashboard
              </Typography>
            </Toolbar>
          </AppBar>

          {/* Dashboard Content */}
          <Box
            sx={{
              p: { xs: 2, sm: 3 },
              width: "100%",
              maxWidth: 1200,
              mx: "auto",
              my: 2,
            }}
          >
            {children}
          </Box>
        </Box>

        {/* Logout Confirmation Dialog */}
        <Dialog
          open={logoutOpen}
          onClose={() => setLogoutOpen(false)}
          PaperProps={{
            sx: {
              borderRadius: 2,
              p: 1,
            },
          }}
        >
          <DialogTitle fontWeight={600}>Confirm Logout</DialogTitle>
          <DialogContent>
            <Typography>
              You will need to login again to access your dashboard.
            </Typography>
          </DialogContent>
          <DialogActions sx={{ p: 2 }}>
            <Button
              onClick={() => setLogoutOpen(false)}
              variant="outlined"
              sx={{ borderRadius: 1 }}
            >
              Cancel
            </Button>
            <Button
              onClick={logout}
              color="error"
              variant="contained"
              sx={{ borderRadius: 1 }}
              autoFocus
            >
              Logout
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </ProtectedRoute>
  );
}
