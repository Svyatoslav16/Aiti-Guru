import { useUnit } from 'effector-react';
import {
  $currentPage,
  $limit,
  $products,
  $totalPages,
  $totalProducts,
  setPage,
} from '../../store/products-store';
import { Box, IconButton, Typography } from '@mui/material';
import {
  KeyboardArrowLeft as ArrowLeftIcon,
  KeyboardArrowRight as ArrowRightIcon,
} from '@mui/icons-material';

export const Pagination = () => {
  const [products, totalProducts, totalPages, currentPage, limit] = useUnit([
    $products,
    $totalProducts,
    $totalPages,
    $currentPage,
    $limit,
  ]);

  // TODO: вынести вычисления, в хук можно
  const start = products.length > 0 ? (currentPage - 1) * limit + 1 : 0;
  const end = Math.min(currentPage * limit, totalProducts);

  const visiblePages = Math.min(5, totalPages);

  // Вычисляем начальную страницу
  let startPage = Math.max(1, currentPage - Math.floor(visiblePages / 2));
  const endPage = Math.min(totalPages, startPage + visiblePages - 1);

  // Корректируем если в конце
  if (endPage - startPage < visiblePages - 1) {
    startPage = Math.max(1, endPage - visiblePages + 1);
  }

  const onPageChange = setPage;

  return (
    <Box sx={{ mt: 5, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <Typography variant="body2" color="text.secondary" flexGrow={1}>
        Показано {start}-{end} из {totalProducts}
      </Typography>

      <IconButton
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        size="small"
        sx={{
          width: 30,
          mr: 1,
          borderRadius: '4px',
          color: currentPage === 1 ? 'text.disabled' : 'text.secondary',
          '&:hover': {
            bgcolor: currentPage !== 1 ? 'grey.100' : 'transparent',
          },
        }}
      >
        <ArrowLeftIcon />
      </IconButton>

      <Box display="flex" gap={1}>
        {Array.from({ length: visiblePages }, (_, i) => startPage + i).map((page) => (
          <IconButton
            key={page}
            onClick={() => onPageChange(page)}
            disabled={currentPage === page}
            size="small"
            sx={{
              padding: '10px',
              height: '30px',
              fontSize: 14,
              borderRadius: 2,
              bgcolor: currentPage === page ? '#797FEA' : 'transparent',
              color: currentPage === page ? 'white' : 'text.secondary',
              border: '1px solid',
              borderColor: currentPage === page ? 'transparent' : '#ECECEB',
              '&:hover': {
                bgcolor: currentPage === page ? '#6045d1' : 'grey.50',
              },
              '&.Mui-disabled': {
                bgcolor: '#797FEA',
                color: 'white',
              },
            }}
          >
            {page}
          </IconButton>
        ))}
      </Box>

      <IconButton
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        size="small"
        sx={{
          width: 30,
          ml: 1,
          borderRadius: '4px',
        }}
      >
        <ArrowRightIcon />
      </IconButton>
    </Box>
  );
};
