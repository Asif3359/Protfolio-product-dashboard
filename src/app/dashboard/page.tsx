"use client";
import ProtectedRoute from "@/components/ProtectedRoute";
import { Box, Typography } from "@mui/material";

export default function Home() {
  return (
    <ProtectedRoute>
      <Box>
        <Typography variant="h4" gutterBottom>
          Welcome to your Portfolio Dashboard!
        </Typography>
        <Typography variant="body1">
          Select a section from the sidebar to manage your portfolio content.
        </Typography>
      </Box>
    </ProtectedRoute>
  );
}
