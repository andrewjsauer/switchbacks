import React, { useRef, useState, useEffect, ChangeEvent, RefObject } from 'react';
import MapGL, { Layer } from 'react-map-gl';
import { Map, MapMouseEvent } from 'mapbox-gl';

import type { FillLayer } from 'react-map-gl';
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
import RegionModal from '@/components/Dashboard/RegionModal';
import UserProfile, { ProfileStates } from '@/components/Dashboard/UserProfile';
import SearchBar, { Suggestion } from '@/components/Dashboard/SearchBar';

import 'mapbox-gl/dist/mapbox-gl.css';
import './styles.css';

const sessionToken = uuidv4();
const accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;
const PARKAREAS_HOVERED_LAYER_ID = 'parkareas-nationalparks-hovered';

const parkLayer: FillLayer = {
  id: PARKAREAS_HOVERED_LAYER_ID,
  type: 'fill',
  source: 'composite',
  'source-layer': 'park-areas-production',
  paint: {
    'fill-color': '#627BC1',
    'fill-opacity': ['case', ['boolean', ['feature-state', 'hover'], false], 0.3, 0],
  },
};

function Dashboard() {
  const mapRef: RefObject<Map> = useRef(null);
  let { current: hoveredPolygonIdRef } = useRef<number | string | null>(null);

  const theme = useTheme();
  const { user } = useAuthContext() as { user: any };

  const [selectedFeatures, setSelectedFeatures] = useState<any>(null);
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
    const map = mapRef.current;

    if (map) {
      map.on('load', () => {
        map.on(
          'mousemove',
          PARKAREAS_HOVERED_LAYER_ID,
          (e: MapMouseEvent & { features?: any[] }) => {
            if (e.features && e.features.length > 0) {
              if (hoveredPolygonIdRef !== null) {
                map.setFeatureState(
                  {
                    id: hoveredPolygonIdRef,
                    sourceLayer: 'park-areas-production',
                    source: 'composite',
                  },
                  { hover: false },
                );
              }

              hoveredPolygonIdRef = e.features[0].id;
              map.setFeatureState(
                {
                  id: hoveredPolygonIdRef,
                  sourceLayer: 'park-areas-production',
                  source: 'composite',
                },
                { hover: true },
              );
            }
          },
        );

        map.on('mouseleave', PARKAREAS_HOVERED_LAYER_ID, () => {
          if (hoveredPolygonIdRef !== null) {
            map.setFeatureState(
              {
                source: 'composite',
                sourceLayer: 'park-areas-production',
                id: hoveredPolygonIdRef,
              },
              { hover: false },
            );
          }

          hoveredPolygonIdRef = null;
        });
      });
    }
  }, [mapRef.current, hoveredPolygonIdRef]);

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

        const results = suggestions.map((suggestion: any) => ({
          name: suggestion.name,
          id: suggestion.mapbox_id,
        }));

        setSearchResults(results);
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
        console.log(value);
        console.log(response.data.features[0]);

        const coordinates = response.data.features[0].geometry.coordinates;
        const [longitude, latitude] = coordinates;

        if (mapRef.current) {
          const map = mapRef.current.getMap();

          map.flyTo({
            center: [longitude, latitude],
            zoom: 11,
            easing(t: number) {
              return t;
            },
          });

          map.once('idle', () => {
            const point = map.project([longitude, latitude]);
            const features = map.queryRenderedFeatures(point, {
              layers: ['parkareas-nationalparks', 'parkareas-fallback'],
            });

            if (features.length > 0) {
              const polygonId = features[0].id;
              hoveredPolygonIdRef = polygonId;
              map.setFeatureState(
                {
                  id: hoveredPolygonIdRef,
                  sourceLayer: 'park-areas-production',
                  source: 'composite',
                },
                { hover: true },
              );

              console.log('features search', features);
              setSelectedFeatures(features);
            }
          });
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleMapClick = async (evt: any) => {
    const features = mapRef.current?.queryRenderedFeatures(evt.point, {
      layers: ['parkareas-nationalparks', 'parkareas-fallback'],
    });

    if (features.length > 0) {
      console.log('features click', features);
      setSelectedFeatures(features);
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
      <RegionModal
        open={!!selectedFeatures}
        features={selectedFeatures}
        onClose={() => setSelectedFeatures(null)}
      />
      <Box sx={{ position: 'relative', width: '100vw', height: '100vh' }}>
        <MapGL
          ref={mapRef}
          {...viewport}
          onClick={handleMapClick}
          onMove={(evt) => setViewport(evt.viewState)}
          mapStyle="mapbox://styles/sauerapple/clksgr8xn004b01pp6kw87ti0"
          mapboxAccessToken={accessToken}
          reuseMaps
        >
          <Layer {...parkLayer} />
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
                sx={{ bgcolor: teal[500] }}
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
