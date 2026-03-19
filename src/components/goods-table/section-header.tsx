import { Box, Typography, IconButton, Button } from '@mui/material';

import {
  Add as AddIcon,
  Autorenew as RefreshIcon,
} from '@mui/icons-material';

import { fetchProductsRequested, closeAddDialog, $limit } from '../../store/products-store';
import { useUnit } from 'effector-react';

export const SectionHeader = () => {
  const [limit, fetchProducts] = useUnit([$limit, fetchProductsRequested]);

  return (
    <Box sx={{ display: 'flex', gap: 1, justifyContent: 'space-between', alignItems: 'center', mb: 5 }}>
      <Typography variant="h3" fontWeight={600} flexGrow={1} fontSize="20px" lineHeight="20px" fontStyle="normal">
        Все позиции
      </Typography>

      <IconButton
        onClick={() => fetchProducts({ limit, skip: 0 })}
        sx={{
          borderRadius: '8px',
          border: '2px solid',
          borderColor: 'grey.200',
          bgcolor: 'grey.50',
        }}
      >
        <RefreshIcon />
      </IconButton>

      <Button
        variant="contained"
        startIcon={<AddIcon />}
        onClick={() => closeAddDialog()}
        sx={{
          bgcolor: '#242EDB',
          padding: '8.75px 16px'
        }}
      >
        Добавить
      </Button>
    </Box>
  );
};
