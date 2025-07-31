import { Typography } from "@mui/material";
import axios from "axios";
import React, { useEffect, useState } from "react";

interface ProfileData {
  name: string;
}

function GetProfileName() {

  const [profile, setProfile] = useState<ProfileData | null>(null);

    useEffect(() => {
      const fetchProfile = async () => {
        try {
        const res = await axios.get("http://localhost:3000/api/profile");
        setProfile(res.data);

        } catch{
          console.log("Profile name error ")
        }
      }
      fetchProfile();
    },[]);


  return (
    <Typography
      variant="h6"
      component="div"
      sx={{
        flexGrow: 1,
        fontWeight: "bold",
        width: '100%',
        background: "linear-gradient(90deg,rgb(22, 112, 196) 0%,rgb(102, 25, 153) 100%)",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
        backgroundClip: "text",
        textFillColor: "transparent",
      }}
    >
      {profile?.name}
    </Typography>
  );
}

export default GetProfileName;
