import React, { ChangeEvent, ReactEventHandler } from 'react';

import { Box, Paper, IconButton, TextField, AutocompleteRenderInputParams } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { Autocomplete } from '@mui/material';
import { useTheme } from '@mui/material/styles';

export interface Suggestion {
  name: string;
  id: string;
}

interface SearchBarProps {
  searchResults: Suggestion[];
  onSearchChange: (_: ChangeEvent<{}>, value: string) => void;
  onSelection: (_: ChangeEvent<{}>, value: Suggestion) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ searchResults, onSearchChange, onSelection }) => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        position: 'absolute',
        top: theme.spacing(3),
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 1,
        width: '50%',
      }}
    >
      <Paper
        component="form"
        sx={{
          display: 'flex',
          alignItems: 'center',
          boxShadow: '2px 2px 10px rgba(0,0,0,0.1)',
        }}
      >
        <IconButton type="submit" sx={{ p: '10px' }} aria-label="search">
          <SearchIcon />
        </IconButton>
        <Autocomplete
          freeSolo
          options={searchResults}
          onInputChange={onSearchChange}
          onChange={onSelection}
          getOptionLabel={(option: Suggestion) => option.name}
          sx={{ flexGrow: 1, mr: 2 }}
          renderInput={(params: AutocompleteRenderInputParams) => (
            <TextField
              {...params}
              variant="standard"
              sx={{ ml: 1, py: 1 }}
              placeholder="Search…"
              InputProps={{
                ...params.InputProps,
                notched: 'false',
                disableUnderline: true,
              }}
            />
          )}
        />
      </Paper>
    </Box>
  );
};

export default SearchBar;
