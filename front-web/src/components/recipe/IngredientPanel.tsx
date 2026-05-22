"use client";

import { useCallback, useEffect, useState } from "react";
import {
  Check,
  Loader2,
  Plus,
  RefreshCw,
  Trash2,
  Utensils,
} from "lucide-react";
import {
  createIngredient,
  deleteIngredient,
  getIngredients,
  updateIngredient,
  type RecipeIngredient,
} from "@/lib/ingredients";

type Props = {
  roomId: string;
  token?: string | null;
  editable?: boolean;
};

export default function IngredientPanel({
  roomId,
  token,
  editable = false,
}: Props) {
  const [ingredients, setIngredients] = useState<RecipeIngredient[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [name, setName] = useState("");
  const [quantity, setQuantity] = useState("");
  const [unit, setUnit] = useState("");
  const [note, setNote] = useState("");

  const loadIngredients = useCallback(async () => {
    if (!roomId) return;

    try {
      setLoading(true);
      const data = await getIngredients(roomId, token ?? undefined);
      setIngredients(data);
    } catch {
      setIngredients([]);
    } finally {
      setLoading(false);
    }
  }, [roomId, token]);

  useEffect(() => {
    loadIngredients();

    const interval = window.setInterval(loadIngredients, 3000);

    return () => window.clearInterval(interval);
  }, [loadIngredients]);

  const resetForm = () => {
    setName("");
    setQuantity("");
    setUnit("");
    setNote("");
  };

  const onCreate = async () => {
    if (!editable || !token || !name.trim() || saving) return;

    try {
      setSaving(true);

      const created = await createIngredient(
        roomId,
        {
          name: name.trim(),
          quantity: quantity.trim(),
          unit: unit.trim(),
          note: note.trim(),
          order: ingredients.length,
        },
        token
      );

      setIngredients((prev) => [...prev, created]);
      resetForm();
    } finally {
      setSaving(false);
    }
  };

  const onToggleChecked = async (ingredient: RecipeIngredient) => {
    if (!editable || !token) return;

    const nextChecked = !ingredient.checked;

    setIngredients((prev) =>
      prev.map((item) =>
        item.id === ingredient.id
          ? { ...item, checked: nextChecked }
          : item
      )
    );

    try {
      await updateIngredient(
        roomId,
        ingredient.id,
        { checked: nextChecked },
        token
      );
    } catch {
      setIngredients((prev) =>
        prev.map((item) =>
          item.id === ingredient.id
            ? { ...item, checked: ingredient.checked }
            : item
        )
      );
    }
  };

  const onDelete = async (ingredientId: string) => {
    if (!editable || !token) return;

    const previous = ingredients;

    setIngredients((prev) => prev.filter((item) => item.id !== ingredientId));

    try {
      await deleteIngredient(roomId, ingredientId, token);
    } catch {
      setIngredients(previous);
    }
  };

  return (
    <section className="overflow-hidden rounded-[30px] border border-black/8 bg-white/75 shadow-[0_16px_50px_rgba(0,0,0,0.06)] backdrop-blur-md dark:border-white/10 dark:bg-[#120b05]/65 dark:shadow-[0_16px_50px_rgba(0,0,0,0.35)]">
      <div className="flex items-center justify-between border-b border-black/8 px-4 py-4 dark:border-white/10">
        <div className="flex items-center gap-2">
          <div className="grid h-9 w-9 place-items-center rounded-2xl bg-orange-50 text-orange-600 dark:bg-orange-500/10 dark:text-orange-300">
            <Utensils className="h-4 w-4" />
          </div>

          <div>
            <div className="text-sm font-bold text-gray-950 dark:text-white">
              Ingrédients
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">
              {ingredients.length} ingrédient
              {ingredients.length > 1 ? "s" : ""}
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={loadIngredients}
          className="grid h-9 w-9 place-items-center rounded-2xl bg-black/[0.04] text-gray-600 transition hover:bg-black/[0.08] dark:bg-white/[0.06] dark:text-gray-300 dark:hover:bg-white/[0.1]"
        >
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <RefreshCw className="h-4 w-4" />
          )}
        </button>
      </div>

      <div className="space-y-3 p-4">
        {editable ? (
          <div className="rounded-2xl border border-black/8 bg-white/70 p-3 dark:border-white/10 dark:bg-white/[0.04]">
            <div className="grid gap-2 sm:grid-cols-[1fr_80px_80px]">
              <input
                value={name}
                onChange={(e) => setName(e.target.value.slice(0, 120))}
                placeholder="Ingrédient"
                className="rounded-xl border border-black/8 bg-white px-3 py-2 text-sm text-gray-900 outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-500/10 dark:border-white/10 dark:bg-[#1b140e] dark:text-white"
              />

              <input
                value={quantity}
                onChange={(e) => setQuantity(e.target.value.slice(0, 40))}
                placeholder="Qté"
                className="rounded-xl border border-black/8 bg-white px-3 py-2 text-sm text-gray-900 outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-500/10 dark:border-white/10 dark:bg-[#1b140e] dark:text-white"
              />

              <input
                value={unit}
                onChange={(e) => setUnit(e.target.value.slice(0, 30))}
                placeholder="Unité"
                className="rounded-xl border border-black/8 bg-white px-3 py-2 text-sm text-gray-900 outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-500/10 dark:border-white/10 dark:bg-[#1b140e] dark:text-white"
              />
            </div>

            <div className="mt-2 flex gap-2">
              <input
                value={note}
                onChange={(e) => setNote(e.target.value.slice(0, 255))}
                placeholder="Note optionnelle"
                className="min-w-0 flex-1 rounded-xl border border-black/8 bg-white px-3 py-2 text-sm text-gray-900 outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-500/10 dark:border-white/10 dark:bg-[#1b140e] dark:text-white"
              />

              <button
                type="button"
                onClick={onCreate}
                disabled={!name.trim() || saving}
                className="inline-flex items-center gap-2 rounded-xl bg-orange-500 px-3 py-2 text-sm font-semibold text-white transition hover:bg-orange-400 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {saving ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Plus className="h-4 w-4" />
                )}
                Ajouter
              </button>
            </div>
          </div>
        ) : null}

        {loading && ingredients.length === 0 ? (
          <div className="space-y-2">
            {Array.from({ length: 3 }).map((_, index) => (
              <div
                key={index}
                className="h-12 animate-pulse rounded-2xl bg-black/[0.05] dark:bg-white/10"
              />
            ))}
          </div>
        ) : ingredients.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-black/10 bg-white/60 px-4 py-6 text-center text-sm text-gray-500 dark:border-white/10 dark:bg-white/[0.03] dark:text-gray-400">
            Aucun ingrédient pour l’instant.
          </div>
        ) : (
          <div className="space-y-2">
            {ingredients.map((ingredient) => (
              <div
                key={ingredient.id}
                className="flex items-start gap-3 rounded-2xl border border-black/8 bg-white/70 px-3 py-3 dark:border-white/10 dark:bg-white/[0.04]"
              >
                <button
                  type="button"
                  onClick={() => onToggleChecked(ingredient)}
                  disabled={!editable}
                  className={[
                    "mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full border transition",
                    ingredient.checked
                      ? "border-orange-500 bg-orange-500 text-white"
                      : "border-black/10 bg-white text-transparent dark:border-white/15 dark:bg-white/5",
                    editable ? "cursor-pointer" : "cursor-default",
                  ].join(" ")}
                >
                  <Check className="h-3.5 w-3.5" />
                </button>

                <div className="min-w-0 flex-1">
                  <div
                    className={[
                      "text-sm font-semibold text-gray-950 dark:text-white",
                      ingredient.checked
                        ? "line-through opacity-50"
                        : "",
                    ].join(" ")}
                  >
                    {ingredient.name}
                  </div>

                  <div className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">
                    {[ingredient.quantity, ingredient.unit]
                      .filter(Boolean)
                      .join(" ")}
                    {ingredient.note ? ` · ${ingredient.note}` : ""}
                  </div>
                </div>

                {editable ? (
                  <button
                    type="button"
                    onClick={() => onDelete(ingredient.id)}
                    className="grid h-8 w-8 shrink-0 place-items-center rounded-xl text-gray-400 transition hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-500/10"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                ) : null}
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}