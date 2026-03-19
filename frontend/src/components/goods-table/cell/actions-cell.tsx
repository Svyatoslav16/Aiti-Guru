import { TableCell, Box, IconButton } from '@mui/material';

import {
  Add as AddIcon,
  MoreHoriz as MoreHorizIcon,
} from '@mui/icons-material';

export const ActionCell = () => {
  return (
    <TableCell align="right">
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: 1 }}>
        <IconButton
          size="small"
          sx={{
            borderRadius: '23px',
            padding: '3.5px 16px',
            maxHeight: '27px',
            bgcolor: '#242EDB',
            color: 'white',
            '&:hover': { bgcolor: '#242EDB' },
          }}
        >
          <AddIcon fontSize="small" />
        </IconButton>
        <IconButton
          size="small"
          sx={{
            border: '2px solid #C7C7CC',
            color: '#C7C7CC',
            borderRadius: '23px',
            padding: '0',
            maxHeight: '24px',
            '&:hover': { bgcolor: 'transparent' },
          }}
        >
          <MoreHorizIcon fontSize="small" />
        </IconButton>
      </Box>
    </TableCell>
  );
};
