import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button, Stack } from "@mantine/core";
import { useState } from "react";
import { FormInput } from "../../../../components/input/formInput";
import { api } from "../../../../api/axios";
import { notifications } from "@mantine/notifications";

const productSchema = z.object({
  title: z.string().min(1, "Наименование обязательно"),
  price: z.number().positive("Цена должна быть положительной"),
  vendor: z.string().min(1, "Вендор обязателен"),
  sku: z.string().min(1, "Артикул обязателен"),
});

type ProductFormData = z.infer<typeof productSchema>;

interface AddProductResponse {
  id: number;
  title: string;
  price: number;
}

export function AddProductForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { control, handleSubmit, reset } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    mode: "onBlur",
    defaultValues: {
      title: "",
      price: undefined,
      vendor: "",
      sku: "",
    },
  });

  const onSubmit = async (data: ProductFormData) => {
    setIsSubmitting(true);

    try {
      const response = await api.post<AddProductResponse>("/products/add", {
        title: data.title,
        price: data.price,
        vendor: data.vendor,
        sku: data.sku,
      });

      notifications.show({ message: "Товар добавлен:" + response.data.title });

      reset();
    } catch (error) {
      console.error("Ошибка при добавлении товара:", error);

      notifications.show({ message: "Ошибка при добавлении товара" });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Stack>
        <FormInput
          type="text"
          name="title"
          control={control}
          placeholder="Наименование товара"
        />

        <FormInput
          type="number"
          name="price"
          control={control}
          placeholder="Цена"
        />

        <FormInput
          type="text"
          name="vendor"
          control={control}
          placeholder="Вендор"
        />

        <FormInput
          type="text"
          name="sku"
          control={control}
          placeholder="Артикул (SKU)"
        />

        <Button type="submit" loading={isSubmitting} fullWidth size="md">
          {isSubmitting ? "Добавление..." : "Добавить товар"}
        </Button>
      </Stack>
    </form>
  );
}
