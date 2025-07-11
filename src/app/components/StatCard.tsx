"use client";
import { Card, Box, Typography } from "@mui/material";
import { motion } from "framer-motion";
import React from "react";

interface StatCardProps {
  icon: React.ReactNode;
  count: number;
  title: string;
  subtitle: string;
  color: string;
}

const StatCard: React.FC<StatCardProps> = ({ icon, count, title, subtitle, color }) => (
  <motion.div
    whileHover={{ y: -5 }}
    transition={{ duration: 0.2 }}
    style={{ height: "100%", width: "100%" }}
  >
    <Card
      sx={{
        p: 3,
        width: "100%",
        height: "100%",
        borderRadius: "12px",
        background: color,
        color: "#fff",
        boxShadow: 4,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        transition: "all 0.3s ease",
        "&:hover": {
          boxShadow: 6,
        },
      }}
    >
      <Box
        sx={{
          width: 60,
          height: 60,
          borderRadius: "50%",
          backgroundColor: "rgba(255,255,255,0.2)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          mb: 2,
        }}
      >
        {icon}
      </Box>
      <Typography
        variant="h3"
        fontWeight={700}
        sx={{
          fontSize: { xs: "2rem", sm: "2.5rem" },
          lineHeight: 1.2,
          mb: 1,
        }}
      >
        {count}
      </Typography>
      <Typography
        variant="h6"
        sx={{
          fontWeight: 600,
          mb: 1,
          fontSize: { xs: "1rem", sm: "1.125rem" },
        }}
      >
        {title}
      </Typography>
      <Typography
        variant="body2"
        sx={{
          opacity: 0.9,
          fontSize: { xs: "0.7rem", sm: "0.9rem" },
          lineHeight: 1.4,
          width: "100%",
        }}
      >
        {subtitle}
      </Typography>
    </Card>
  </motion.div>
);

export default StatCard;
