import { useState } from "react";
import {
  Autocomplete,
  Loader,
  Card,
  Image,
  Text,
  Group,
  Stack,
  type AutocompleteProps,
} from "@mantine/core";
import { useDebouncedValue } from "@mantine/hooks";
import { useQuery } from "@tanstack/react-query";
import styles from "./header.module.scss";
import { api } from "../../../api/axios";
import searchIcon from "../../../assets/search.svg";

interface Product {
  id: number;
  title: string;
  description: string;
  price: number;
  discountPercentage: number;
  rating: number;
  stock: number;
  brand: string;
  category: string;
  thumbnail: string;
  images: string[];
}

interface ProductsResponse {
  products: Product[];
  total: number;
  skip: number;
  limit: number;
}

interface ProductSearchProps {
  onProductSelect?: (product: Product) => void;
  placeholder?: string;
  className?: string;
}

export function ProductSearch({
  onProductSelect,
  placeholder = "Поиск товаров...",
  className = "",
}: ProductSearchProps) {
  const [searchValue, setSearchValue] = useState("");
  const [debouncedSearch] = useDebouncedValue(searchValue, 800); // дебаунс 0.8 сек

  const { data, isLoading } = useQuery<ProductsResponse>({
    queryKey: ["products", debouncedSearch],
    queryFn: async () => {
      if (!debouncedSearch || debouncedSearch.length < 1) {
        return { products: [], total: 0, skip: 0, limit: 0 };
      }

      const response = await api.get("/products/search", {
        params: {
          q: debouncedSearch,
          limit: 10,
        },
      });
      return response.data;
    },
    enabled: debouncedSearch.length >= 1,
  });

  const autocompleteData =
    data?.products.map((product) => ({
      value: product.title,
      product: product,
    })) || [];

  const handleOptionSubmit = (value: string) => {
    const selectedProduct = data?.products.find((p) => p.title === value);
    if (selectedProduct && onProductSelect) {
      onProductSelect(selectedProduct);
    }
  };

  const renderAutocompleteOption: AutocompleteProps["renderOption"] = ({
    option,
  }) => {
    const product = autocompleteData.find(
      (p) => p.value === option.value,
    )?.product;
    if (!product) return null;

    return (
      <Card padding="sm" className={styles.productCard}>
        <Group wrap="nowrap" flex={1}>
          <Image
            src={product.thumbnail}
            alt={product.title}
            width={50}
            height={50}
            radius="sm"
            fit="cover"
            className={styles.productImage}
          />
          <Stack gap="xs" className={styles.info}>
            <Group justify="space-between">
              <Text fw={500} size="sm">
                {product.title}
              </Text>
              <Text fw={700} size="sm" c="blue">
                ${product.price}
              </Text>
            </Group>
            <Group gap="xs">
              <Text size="xs" c="dimmed">
                {product.brand}
              </Text>
              <Text size="xs" c="dimmed">
                •
              </Text>
              <Text size="xs" c="dimmed">
                Рейтинг: {product.rating}
              </Text>
            </Group>
            {product.discountPercentage > 0 && (
              <Text size="xs" c="green">
                Скидка: {product.discountPercentage}%
              </Text>
            )}
          </Stack>
        </Group>
      </Card>
    );
  };

  return (
    <div className={`${styles.container} ${className}`}>
      <Autocomplete
        leftSection={
          <img src={searchIcon} alt="" className={styles.searchIcon} />
        }
        placeholder={placeholder}
        value={searchValue}
        onChange={setSearchValue}
        data={autocompleteData}
        onOptionSubmit={handleOptionSubmit}
        limit={10}
        renderOption={renderAutocompleteOption}
        rightSection={isLoading && <Loader size="xs" />}
        classNames={{
          input: styles.input,
          dropdown: styles.dropdown,
        }}
      />
    </div>
  );
}
