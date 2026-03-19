import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Checkbox,
  CircularProgress,
  Alert,
} from '@mui/material';
import {
  ArrowUpward as ArrowUpwardIcon,
  ArrowDownward as ArrowDownwardIcon,
} from '@mui/icons-material';
import { useUnit } from 'effector-react';
import {
  $products,
  $isLoading,
  $error,
  $sortConfig,
  $limit,
  fetchProductsRequested,
  setSortConfig,
} from '../../store/products-store';
// import { AddProductDialog } from './AddProductDialog';
// import { Toast } from './Toast';
import type { ISortConfig } from '../../types/product';
import { TableHeader } from './table-header';
import { SectionHeader } from './section-header';
import { ActionCell } from './cell';
import { Pagination } from './pagination';

type SortField = 'title' | 'brand' | 'price' | 'rating' | 'sku';

export const GoodsTable: React.FC = () => {
  const [products, isLoading, error, sortConfig, limit, fetchProducts] = useUnit([
    $products,
    $isLoading,
    $error,
    $sortConfig,
    $limit,
    // setSearchQuery,
    fetchProductsRequested,
  ]);

  useEffect(() => {
    fetchProducts({ limit, skip: 0 });
  }, [fetchProducts, limit]);

  const [selectedRows, setSelectedRows] = useState<number[]>([]);

  // Обработчик сортировки
  const handleSort = (field: SortField) => {
    const direction: 'asc' | 'desc' =
      sortConfig.field === field && sortConfig.direction === 'asc' ? 'desc' : 'asc';

    setSortConfig({ field, direction } as ISortConfig);
  };

  // Обработчик выбора строки
  const handleSelectRow = (id: number) => {
    setSelectedRows((prev) =>
      prev.includes(id) ? prev.filter((rowId) => rowId !== id) : [...prev, id],
    );
  };

  // Обработчик выбора всех
  const handleSelectAll = () => {
    if (selectedRows.length === products.length) {
      setSelectedRows([]);
    } else {
      setSelectedRows(products.map((p) => p.id));
    }
  };

  // Сортировка иконок
  const getSortIcon = (field: SortField) => {
    if (sortConfig.field !== field) return null;
    return sortConfig.direction === 'asc' ? (
      <ArrowUpwardIcon fontSize="small" />
    ) : (
      <ArrowDownwardIcon fontSize="small" />
    );
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ru-RU', {
      minimumFractionDigits: 2,
    }).format(price);
  };

  if (isLoading && products.length === 0) {
    return (
      <Box
        sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}
      >
        <CircularProgress size={60} />
      </Box>
    );
  }

  return (
    <>
      <Box bgcolor="grey.50" height={20} />

      <Box sx={{ p: 3, pt: 0 }}>
        <TableHeader />

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        <Box bgcolor="grey.50" height={30} mx={-3} />
        <SectionHeader />
        <TableContainer component={Paper} elevation={0} sx={{ borderRadius: 3, border: 'none' }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell padding="checkbox">
                  <Checkbox
                    checked={selectedRows.length === products.length && products.length > 0}
                    indeterminate={selectedRows.length > 0 && selectedRows.length < products.length}
                    onChange={handleSelectAll}
                    sx={{
                      color: 'gray.200',
                    }}
                  />
                </TableCell>
                <TableCell>Наименование</TableCell>
                <TableCell>Вендор</TableCell>
                <TableCell>Артикул</TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    Оценка
                    <IconButton size="small" onClick={() => handleSort('rating')}>
                      {getSortIcon('rating')}
                    </IconButton>
                  </Box>
                </TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    Цена, ₽
                    <IconButton size="small" onClick={() => handleSort('price')}>
                      {getSortIcon('price')}
                    </IconButton>
                  </Box>
                </TableCell>
                <TableCell align="right"></TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {isLoading && (
                <TableRow>
                  <TableCell colSpan={7} sx={{ textAlign: 'center', py: 4 }}>
                    <CircularProgress size={24} />
                  </TableCell>
                </TableRow>
              )}

              {!isLoading && products.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} sx={{ textAlign: 'center', py: 4 }}>
                    <Typography color="text.secondary">Товары не найдены</Typography>
                  </TableCell>
                </TableRow>
              )}

              {products.map((product) => (
                <TableRow
                  key={product.id}
                  hover
                  selected={selectedRows.includes(product.id)}
                  sx={{
                    '&:hover': { bgcolor: 'grey.50' },
                    '&.Mui-selected': { bgcolor: 'primary.lighter' },
                  }}
                >
                  <TableCell padding="checkbox">
                    <Checkbox
                      checked={selectedRows.includes(product.id)}
                      onChange={() => handleSelectRow(product.id)}
                    />
                  </TableCell>

                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Box
                        sx={{
                          width: 48,
                          height: 48,
                          borderRadius: 2,
                          bgcolor: 'grey.200',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          overflow: 'hidden',
                        }}
                      >
                        {product.thumbnail ? (
                          <img
                            src={product.thumbnail}
                            alt={product.title}
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                          />
                        ) : (
                          <Box />
                        )}
                      </Box>
                      <Box>
                        <Typography variant="body2" fontWeight={600}>
                          {product.title}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {product.category}
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>

                  <TableCell>
                    <Typography variant="body2" fontWeight={500}>
                      {product.brand}
                    </Typography>
                  </TableCell>

                  <TableCell>
                    <Typography variant="body2" color="text.secondary">
                      {product.sku}
                    </Typography>
                  </TableCell>

                  <TableCell>
                    <Box display="flex">
                      <Typography
                        variant="body2"
                        color={product.rating < 3 ? '#d32f2f' : 'text.secondary'}
                      >
                        {product.rating.toFixed(1)}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        /5
                      </Typography>
                    </Box>
                  </TableCell>

                  <TableCell>
                    <Typography variant="body2" fontWeight={500}>
                      {formatPrice(product.price)}
                    </Typography>
                  </TableCell>

                  <ActionCell />
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Пагинация */}
        <Pagination />
      </Box>
    </>
  );
};

export default GoodsTable;
