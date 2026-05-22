import { apiFetch } from "@/lib/api";

export type RecipeIngredient = {
  id: string;
  live_id: string;
  name: string;
  quantity: string;
  unit: string;
  note: string;
  order: number;
  checked: boolean;
  created_at: string;
  updated_at: string;
};

export type CreateIngredientPayload = {
  name: string;
  quantity?: string;
  unit?: string;
  note?: string;
  order?: number;
};

export type UpdateIngredientPayload = Partial<{
  name: string;
  quantity: string;
  unit: string;
  note: string;
  order: number;
  checked: boolean;
}>;

type IngredientsResponse = {
  ingredients: RecipeIngredient[];
};

export async function getIngredients(
  roomId: string,
  token?: string
): Promise<RecipeIngredient[]> {
  const rid = encodeURIComponent(roomId);

  const res = await apiFetch<IngredientsResponse>(
    `/lives/${rid}/ingredients`,
    {
      token,
      cache: "no-store",
      silent: true,
    }
  );

  return res.ingredients ?? [];
}

export async function createIngredient(
  roomId: string,
  payload: CreateIngredientPayload,
  token: string
): Promise<RecipeIngredient> {
  const rid = encodeURIComponent(roomId);

  return apiFetch<RecipeIngredient>(`/lives/${rid}/ingredients`, {
    method: "POST",
    token,
    body: JSON.stringify(payload),
  });
}

export async function updateIngredient(
  roomId: string,
  ingredientId: string,
  payload: UpdateIngredientPayload,
  token: string
): Promise<RecipeIngredient> {
  const rid = encodeURIComponent(roomId);
  const iid = encodeURIComponent(ingredientId);

  return apiFetch<RecipeIngredient>(`/lives/${rid}/ingredients/${iid}`, {
    method: "PATCH",
    token,
    body: JSON.stringify(payload),
  });
}

export async function deleteIngredient(
  roomId: string,
  ingredientId: string,
  token: string
): Promise<void> {
  const rid = encodeURIComponent(roomId);
  const iid = encodeURIComponent(ingredientId);

  await apiFetch(`/lives/${rid}/ingredients/${iid}`, {
    method: "DELETE",
    token,
  });
}