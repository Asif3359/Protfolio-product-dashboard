"use client";
import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useRouter } from "next/navigation";
import { TextField, Button, Box, Typography, Paper, Divider, Fade, InputAdornment } from "@mui/material";
import axios from "axios";
import { Lock, Person, ArrowForward } from "@mui/icons-material";
import { styled } from "@mui/system";

const GradientBox = styled(Box)({
  minHeight: '100vh',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
});

const StyledPaper = styled(Paper)({
  padding: '2rem',
  borderRadius: '16px',
  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
  backdropFilter: 'blur(8px)',
  backgroundColor: 'rgba(255, 255, 255, 0.9)',
  width: '100%',
  maxWidth: '420px',
});

const StyledButton = styled(Button)({
  background: 'linear-gradient(45deg,rgb(46, 46, 46) 0%, #764ba2 100%)',
  padding: '12px 24px',
  borderRadius: '50px',
  fontWeight: '600',
  letterSpacing: '0.5px',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
  },
  transition: 'all 0.3s ease',
});

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth();
  const router = useRouter();
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    
    try {
      const res = await axios.post("http://localhost:3000/api/admin/login", {
        username,
        password,
      });
      login(res.data.token);

      // Save ownerEmail to localStorage
      console.log(res.data);
      if (res.data.admin.email) {
        localStorage.setItem("ownerEmail", res.data.admin.email);
      }

      router.push("/dashboard");
    } catch (err: unknown) {
      const axiosError = err as { response?: { data?: { message?: string } }; message?: string };
      const msg =
        axiosError?.response?.data?.message ||
        axiosError?.message ||
        "Login failed. Please try again.";
      setError(msg);
      setIsLoading(false);
    }
  };

  return (
    <GradientBox>
      <StyledPaper elevation={3}>
        <Box textAlign="center" mb={3}>
          <Typography 
            variant="h4" 
            component="h1" 
            fontWeight="700"
            color="text.primary"
            gutterBottom
            sx={{
              background: 'linear-gradient(45deg, #667eea 0%, #764ba2 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Welcome Back
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Sign in to access your portfolio dashboard
          </Typography>
        </Box>

        <Divider sx={{ my: 3 }} />

        <form onSubmit={handleSubmit}>
          <TextField
            label="Username"
            fullWidth
            margin="normal"
            value={username}
            onChange={e => setUsername(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Person color="action" />
                </InputAdornment>
              ),
            }}
            variant="outlined"
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: '50px',
              }
            }}
          />
          <TextField
            label="Password"
            type="password"
            fullWidth
            margin="normal"
            value={password}
            onChange={e => setPassword(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Lock color="action" />
                </InputAdornment>
              ),
            }}
            variant="outlined"
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: '50px',
              }
            }}
          />

          <Fade in={!!error}>
            <Typography color="error" variant="body2" sx={{ mt: 1, textAlign: 'center' }}>
              {error}
            </Typography>
          </Fade>

          <Box mt={4}>
            <StyledButton
              type="submit"
              fullWidth
              disabled={isLoading}
              endIcon={<ArrowForward />}
            >
              {isLoading ? 'Signing In...' : 'Sign In'}
            </StyledButton>
          </Box>
        </form>

        {/* <Box mt={3} textAlign="center">
          <Typography variant="body2" color="text.secondary">
            Forgot your password?{' '}
            <Typography 
              component="span" 
              color="primary.main" 
              sx={{ cursor: 'pointer', '&:hover': { textDecoration: 'underline' } }}
            >
              Reset it
            </Typography>
          </Typography>
        </Box> */}
      </StyledPaper>
    </GradientBox>
  );
}

// http://localhost:3000/api/admin/login
// http://localhost:3000/api/admin/login