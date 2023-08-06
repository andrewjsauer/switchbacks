import React, { useEffect, useState } from 'react';
import { doc, getDoc } from 'firebase/firestore';

import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CircularProgress from '@mui/material/CircularProgress';
import CloseIcon from '@mui/icons-material/Close';
import Box from '@mui/material/Box';

import { db } from '@/firebase';

type RegionModalProps = {
  open: boolean;
  features: any[];
  onClose: () => void;
};

function lowerCaseKeys(obj: any) {
  return Object.keys(obj).reduce((acc, key) => {
    acc[key.toLowerCase()] = obj[key];
    return acc;
  }, {});
}

function RegionModal({ open, features, onClose }: RegionModalProps) {
  const [regionData, setRegionData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);

    const lowerCasedFeatures = features.map((feature) => lowerCaseKeys(feature.properties));

    const featureMap = new Map();
    for (let feature of lowerCasedFeatures) {
      featureMap.set(feature.name, feature);
    }

    const uniqueFeatures = Array.from(featureMap.values());
    const data = [];

    try {
      for (const feature of uniqueFeatures) {
        const { name } = feature;

        const docRef = doc(db, 'regions', name.replace(' ', '_'));
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          data.push({ name, ...docSnap.data() });
        } else {
          data.push({
            name,
            members: 0,
            postsPerWeek: 0,
            description: 'No description available',
          });
        }
      }
      setRegionData(data);
    } catch (err) {
      setError(err.message);
    }

    setLoading(false);
  };

  useEffect(() => {
    if (features) fetchData();
  }, [features]);

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogContent sx={{ minHeight: '200px', minWidth: '500px', position: 'relative' }}>
        <IconButton
          style={{ position: 'absolute', right: 15, top: 15, color: '#aaa' }}
          onClick={onClose}
        >
          <CloseIcon />
        </IconButton>
        {loading && <CircularProgress sx={{ position: 'absolute', top: '50%', left: '50%' }} />}
        {error && (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <Typography variant="body1">Error: {error}</Typography>
            <Button onClick={fetchData}>Retry</Button>
          </Box>
        )}
        {!loading && !error && (
          <Box sx={{ marginTop: '48px' }}>
            {regionData.map((region, index) => (
              <Card key={index} sx={{ marginBottom: '16px', position: 'relative' }}>
                <CardContent
                  sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}
                >
                  <Box>
                    <Typography variant="h6" fontWeight="bold">
                      {region.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {region.members} members • {region.postsPerWeek} posts a week
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ marginTop: '4px' }}>
                      Here is a description to fill in the space. Here is a description to fill in
                      the. Here Here is a description to fill in the space. Here is a description to
                      fill in the.
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      paddingLeft: '16px',
                    }}
                  >
                    <Button variant="contained" color="primary">
                      Join
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            ))}
          </Box>
        )}
      </DialogContent>
    </Dialog>
  );
}

export default RegionModal;
