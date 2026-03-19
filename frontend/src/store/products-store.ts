import { createStore, createEvent, createEffect, sample, combine, restore } from 'effector';
import { debounce } from 'patronum';
import { productsApi } from '../api/product';
import type { IProduct, ISortConfig, IAddProductForm } from '../types/product';

export const fetchProductsRequested = createEvent<{
  limit?: number;
  skip?: number;
  sortBy?: string;
  order?: 'asc' | 'desc';
  searchQuery?: string;
}>();

export const addProductRequested = createEvent<IAddProductForm>();
export const closeAddDialog = createEvent();
export const showToast = createEvent<string>();
export const hideToast = createEvent();
export const setSortConfig = createEvent<ISortConfig>();
export const setSearchQuery = createEvent<string>();
export const setPage = createEvent<number>();

export const setSearchQueryLocal = createEvent<string>();
export const setSearchQueryApi = createEvent<string>();

export const $searchQueryLocal = createStore<string>('');

sample({
  clock: setSearchQueryLocal,
  target: $searchQueryLocal,
});

debounce({
  source: setSearchQueryLocal,
  timeout: 300,
  target: setSearchQueryApi,
});

const fetchProductsFx = createEffect(
  async (params: {
    limit?: number;
    skip?: number;
    sortBy?: string;
    order?: 'asc' | 'desc';
    searchQuery?: string;
  }) => {
    return await productsApi.getAll(
      params.limit || 20,
      params.skip || 0,
      params.sortBy,
      params.order,
      params.searchQuery,
    );
  },
);

const addProductFx = createEffect(async (product: IAddProductForm) => {
  return await productsApi.create(product);
});

export const $products = createStore<IProduct[]>([]);
export const $totalProducts = createStore<number>(0);
export const $isLoading = createStore<boolean>(false);
export const $error = createStore<string | null>(null);
export const $sortConfig = createStore<ISortConfig>({ field: null, direction: 'asc' });
export const $searchQuery = createStore<string>('');
export const $currentPage = restore(setPage, 1);
export const $isAddDialogOpen = createStore<boolean>(false);
export const $toastMessage = createStore<string | null>(null);
export const $limit = createStore<number>(20);

export const $totalPages = combine($totalProducts, $limit, (total, limit) =>
  Math.ceil(total / limit),
);

sample({
  clock: fetchProductsRequested,
  target: fetchProductsFx,
});

sample({
  clock: fetchProductsFx,
  fn: () => true,
  target: $isLoading,
});

sample({
  clock: fetchProductsFx.done,
  fn: (data) => data.result.products,
  target: $products,
});

sample({
  clock: fetchProductsFx.done,
  fn: (data) => data.result.total,
  target: $totalProducts,
});

sample({
  clock: fetchProductsFx.done,
  fn: () => false,
  target: $isLoading,
});

sample({
  clock: fetchProductsFx.fail,
  fn: (error) => error.error.message,
  target: $error,
});

sample({
  clock: fetchProductsFx.fail,
  fn: () => false,
  target: $isLoading,
});

sample({
  clock: addProductRequested,
  target: addProductFx,
});

sample({
  clock: addProductFx.done,
  fn: () => 'Товар успешно добавлен!',
  target: showToast,
});

sample({
  clock: addProductFx.done,
  fn: () => false,
  target: $isAddDialogOpen,
});

sample({
  clock: showToast,
  target: $toastMessage,
});

sample({
  clock: hideToast,
  fn: () => null,
  target: $toastMessage,
});

sample({
  clock: $toastMessage,
  filter: (msg): msg is string => msg !== null,
  fn: () => setTimeout(() => hideToast(), 3000),
  target: [],
});

sample({
  clock: setSortConfig,
  target: $sortConfig,
});

sample({
  clock: setSearchQuery,
  target: $searchQuery,
});

sample({
  clock: setPage,
  target: $currentPage,
});

sample({
  clock: closeAddDialog,
  fn: () => false,
  target: $isAddDialogOpen,
});

sample({
  clock: setSearchQueryApi,
  fn: (query) => ({
    searchQuery: query,
    skip: 0,
  }),
  target: fetchProductsRequested,
});

sample({
  clock: [$sortConfig, $searchQuery, $currentPage],
  source: {
    sortConfig: $sortConfig,
    searchQuery: $searchQuery,
    currentPage: $currentPage,
    limit: $limit,
  },
  fn: ({ sortConfig, searchQuery, currentPage, limit }) => ({
    limit,
    skip: (currentPage - 1) * limit,
    sortBy: sortConfig.field || undefined,
    order: sortConfig.direction,
    searchQuery: searchQuery || undefined,
  }),
  target: fetchProductsRequested,
});
