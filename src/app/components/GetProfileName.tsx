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
        const res = await axios.get("https://protfolio-product-backend.vercel.app/api/profile");
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
      sx={{ flexGrow: 1, fontWeight: "bold", color: "primary.main" }}
    >
      {profile?.name}
    </Typography>
  );
}

export default GetProfileName;
