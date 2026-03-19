import { Box, Typography, TextField, InputAdornment } from '@mui/material';
import { useUnit } from 'effector-react';

import { Search as SearchIcon } from '@mui/icons-material';

import { $searchQueryLocal, setSearchQueryLocal } from '../../store/products-store';

export const TableHeader = () => {
  const [searchQueryLocal, ,] = useUnit([$searchQueryLocal]);

  const handleSearch = (value: string) => {
    setSearchQueryLocal(value);
    // setPage(1);
  };

  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: '100px 1fr 100px',
        gap: 3,
        alignItems: 'center',
        py: 3.5,
      }}
    >
      <Typography variant="h3" fontWeight={700} fontSize="1.5rem">
        Товары
      </Typography>

      <Box sx={{ display: 'flex', justifyContent: 'center', width: '100%', maxWidth: 1000, mx: 'auto', }}>
        <TextField
          placeholder="Найти"
          
          value={searchQueryLocal}
          onChange={(e) => handleSearch(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon color="action" />
              </InputAdornment>
            ),
          }}
          sx={{
            width: '100%',
            '& .MuiOutlinedInput-root': {
              //   borderRadius: 3,
              bgcolor: 'grey.200',
            },
            '& .MuiInputBase-input': {
              padding: '12.5px 14px',
            },
          }}
        />
      </Box>
      <Box />
    </Box>
  );
};
