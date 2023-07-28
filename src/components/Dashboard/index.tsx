import React, { useRef, useState, useEffect, ChangeEvent } from 'react';
import MapGL from 'react-map-gl';
import { v4 as uuidv4 } from 'uuid';
import axios, { AxiosResponse } from 'axios';

import { signOut } from 'firebase/auth';
import { auth } from '@/firebase';

import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { Box } from '@mui/system';
import { useTheme } from '@mui/material/styles';
import { teal } from '@mui/material/colors';

import { useAuthContext } from '@/context/AuthContext';
import { getUserInitials } from './utils';

import FullScreenModal from '@/components/FullScreenModal';
import UserProfile, { ProfileStates } from '@/components/Dashboard/UserProfile';
import SearchBar, { Suggestion } from '@/components/Dashboard/SearchBar';

import 'mapbox-gl/dist/mapbox-gl.css';
import './styles.css';

const sessionToken = uuidv4();
const accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;

function Dashboard() {
  const mapRef = useRef<typeof MapGL | null>(null);

  const theme = useTheme();
  const { user } = useAuthContext() as { user: any };

  const [searchResults, setSearchResults] = useState<Suggestion[]>([]);
  const [userProfileType, setUserProfileType] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [viewport, setViewport] = useState({
    width: '100vw',
    height: '100vh',
    latitude: 37.7577,
    longitude: -122.4376,
    zoom: 10,
  });

  useEffect(() => {
    if (user && !user.displayName) {
      setUserProfileType(ProfileStates.WELCOME);
    }
  }, [user]);

  const handleProfileClick = () => {
    setUserProfileType(ProfileStates.EDIT);
  };

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.log(error);
    }
  };

  const handleSearchChange = async (_: ChangeEvent<{}>, value: string) => {
    if (value.length > 2) {
      try {
        const response: AxiosResponse = await axios.get(
          `https://api.mapbox.com/search/searchbox/v1/suggest?q=${value}&poi_category=park,forest&access_token=${accessToken}&session_token=${sessionToken}`,
        );
        const suggestions = response.data.suggestions;

        setSearchResults(
          suggestions.map((suggestion: any) => ({
            name: suggestion.name,
            id: suggestion.mapbox_id,
          })),
        );
      } catch (error) {
        console.log(error);
      }
    }
  };

  const handleSelection = async (_: ChangeEvent<{}>, value: Suggestion) => {
    if (!value?.id) return;

    try {
      const response: AxiosResponse<any> = await axios.get(
        `https://api.mapbox.com/search/searchbox/v1/retrieve/${value.id}?session_token=${sessionToken}&access_token=${accessToken}`,
      );

      if (response.data.features[0]) {
        const coordinates = response.data.features[0].geometry.coordinates;
        const [longitude, latitude] = coordinates;

        if (mapRef.current) {
          mapRef.current.getMap().flyTo({
            center: [longitude, latitude],
            zoom: 11,
            easing(t: number) {
              return t;
            },
          });
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <FullScreenModal
        open={!!userProfileType}
        onClose={() => setUserProfileType(null)}
        closeButton={userProfileType === ProfileStates.EDIT}
      >
        <UserProfile user={user} onClose={() => setUserProfileType(null)} type={userProfileType} />
      </FullScreenModal>
      <Box sx={{ position: 'relative', width: '100vw', height: '100vh' }}>
        <MapGL
          ref={mapRef}
          {...viewport}
          onMove={(evt) => setViewport(evt.viewState)}
          mapStyle="mapbox://styles/sauerapple/clkk4mefr001h01r22t5w4wqg"
          mapboxAccessToken={accessToken}
          reuseMaps
        >
          <SearchBar
            onSearchChange={handleSearchChange}
            onSelection={handleSelection}
            searchResults={searchResults}
          />
          <Box
            sx={{
              position: 'absolute',
              top: theme.spacing(2),
              right: theme.spacing(2),
              zIndex: 1,
            }}
          >
            <IconButton onClick={handleClick}>
              <Avatar
                src={user.photoURL || undefined}
                alt="Profile Picture"
                sx={{ bgcolor: teal[500], width: 50, height: 50 }}
              >
                {user.displayName ? getUserInitials(user.displayName) : ''}
              </Avatar>
            </IconButton>
            <Menu anchorEl={anchorEl} keepMounted open={Boolean(anchorEl)} onClose={handleClose}>
              <MenuItem onClick={handleProfileClick}>Profile</MenuItem>
              <MenuItem onClick={handleSignOut}>Logout</MenuItem>
            </Menu>
          </Box>
        </MapGL>
      </Box>
    </>
  );
}

export default Dashboard;
