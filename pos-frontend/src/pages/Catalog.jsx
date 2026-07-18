import React, { useEffect, useMemo, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { enqueueSnackbar } from "notistack";
import BackButton from "../components/shared/BackButton";
import AddCategoryModal from "../components/dashboard/AddCategoryModal";
import AddDishModal from "../components/dashboard/AddDishModal";
import ConfirmModal from "../components/shared/ConfirmModal";
import { selectAllDishes, selectMenuCategories, selectTotalDishCount, deleteDish, removeCategory } from "../redux/slices/menuSlice";
import { deleteProduct, deleteCategory } from "../https/index";
import TabGroup from "../components/shared/TabGroup";
import { FiPlus, FiGrid, FiEdit2, FiTrash2 } from "react-icons/fi";

const Catalog = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [searchParams, setSearchParams] = useSearchParams();
  const categories = useSelector(selectMenuCategories);
  const allDishes = useSelector(selectAllDishes);
  const totalDishCount = useSelector(selectTotalDishCount);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [isDishModalOpen, setIsDishModalOpen] = useState(false);
  const [editingDish, setEditingDish] = useState(null);
  const [deletingDishId, setDeletingDishId] = useState(null);
  const [deletingCategoryId, setDeletingCategoryId] = useState(null);
  const activeTab = searchParams.get("tab") === "dishes" ? "dishes" : "categories";

  useEffect(() => { document.title = "POS | Catalog"; }, []);

  const deleteMutation = useMutation({
    mutationFn: (id) => deleteProduct(id),
    onSuccess: (_, id) => {
      dispatch(deleteDish(id));
      setDeletingDishId(null);
      enqueueSnackbar("Dish deleted successfully", { variant: "success" });
    },
    onError: (err) => {
      enqueueSnackbar(err?.response?.data?.message || "Failed to delete dish", { variant: "error" });
    }
  });

  const deleteCategoryMutation = useMutation({
    mutationFn: (id) => deleteCategory(id),
    onSuccess: (_, id) => {
      dispatch(removeCategory(id));
      setDeletingCategoryId(null);
      enqueueSnackbar("Category deleted successfully", { variant: "success" });
    },
    onError: (err) => {
      enqueueSnackbar(err?.response?.data?.message || "Failed to delete category", { variant: "error" });
    }
  });

  const handleEditDish = (dish) => {
    setEditingDish(dish);
    setIsDishModalOpen(true);
  };

  const handleDeleteDish = (id) => {
    setDeletingDishId(id);
  };

  const handleConfirmDelete = () => {
    if (deletingDishId) {
      deleteMutation.mutate(deletingDishId);
    }
  };

  const handleDeleteCategory = (id) => {
    setDeletingCategoryId(id);
  };

  const handleConfirmDeleteCategory = () => {
    if (deletingCategoryId) {
      deleteCategoryMutation.mutate(deletingCategoryId);
    }
  };

  const setTab = (tab) => setSearchParams({ tab });

  const deletingDish = useMemo(
    () => allDishes.find((d) => d.id === deletingDishId) || null,
    [allDishes, deletingDishId]
  );
  const deletingCategory = useMemo(
    () => categories.find((c) => c.id === deletingCategoryId) || null,
    [categories, deletingCategoryId]
  );
  const categoryDishCount = deletingCategory?.items.length || 0;

  return (
    <section className="min-h-[calc(100dvh-4rem)] bg-background pb-24">
      {/* Page Header */}
      <div className="flex flex-col gap-2 px-4 py-2 border-b border-border bg-card/50 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          <BackButton />
          <div>
            <h1 className="text-2xl font-extrabold text-foreground tracking-tight">Menu Catalog</h1>
            <p className="text-xs text-muted-foreground font-medium">
              {categories.length} categories · {totalDishCount} dishes
            </p>
          </div>
        </div>
 
        <div className="flex flex-wrap items-center gap-2">
          <TabGroup
            tabs={[
              { id: "categories", label: `Categories (${categories.length})` },
              { id: "dishes",     label: `Dishes (${totalDishCount})` },
            ]}
            activeTab={activeTab}
            onTabChange={setTab}
          />
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsCategoryModalOpen(true)}
              className="btn btn-primary"
            >
              <FiPlus size={15} /> Add Category
            </button>
            <button
              onClick={() => setIsDishModalOpen(true)}
              className="btn btn-secondary"
            >
              <FiGrid size={15} className="text-muted-foreground" /> Add Dish
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      {activeTab === "categories" ? (
        <div className="grid grid-cols-1 gap-3 px-4 py-3 sm:grid-cols-2 xl:grid-cols-3">
          {categories.map((category) => (
            <div key={category.id} className="bg-card rounded-[14px] border border-border transition-all duration-200 hover:shadow-[rgba(0,0,0,0.02)_0_0_0_1px,rgba(0,0,0,0.04)_0_2px_6px,rgba(0,0,0,0.1)_0_4px_8px] p-6 group">
              <div className="flex items-center justify-between gap-2 mb-5">
                <div className="flex items-center gap-2">
                  <div
                    className="flex h-12 w-12 items-center justify-center rounded-[14px] text-xl text-white shadow-sm"
                    style={{ backgroundColor: category.bgColor || "#374151" }}
                  >
                    {category.icon}
                  </div>
                  <div>
                    <h2 className="text-sm font-extrabold text-foreground">{category.name}</h2>
                    <p className="text-xs text-muted-foreground font-medium mt-0.5">
                      {category.items.length} {category.items.length === 1 ? "dish" : "dishes"}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => setTab("dishes")}
                    className="btn btn-secondary flex-shrink-0 !h-8 text-xs px-3"
                  >
                    View Dishes
                  </button>
                  <button
                    onClick={() => handleDeleteCategory(category.id)}
                    disabled={deleteCategoryMutation.isPending}
                    title={`Delete ${category.name}`}
                    aria-label={`Delete ${category.name}`}
                    className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-error/10 hover:text-error focus-visible:bg-error/10 focus-visible:text-error disabled:opacity-40"
                  >
                    <FiTrash2 size={15} />
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                {category.items.slice(0, 4).map((dish) => (
                  <div key={dish.id} className="flex items-center justify-between rounded-xl px-3 py-2.5 transition-all group-hover:bg-surface-soft">
                    <div>
                      <p className="text-sm font-bold text-foreground">{dish.name}</p>
                    </div>
                    <p className="text-sm font-medium text-foreground">PKR {dish.price}</p>
                  </div>
                ))}
                {category.items.length === 0 && (
                  <div className="rounded-xl bg-secondary/50 border border-dashed border-border px-3 py-2 text-center">
                    <p className="text-xs font-semibold text-muted-foreground">No dishes yet</p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-2 px-4 py-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {allDishes.map((dish) => (
            <div key={dish.id} className="bg-card rounded-[14px] border border-border transition-all duration-200 hover:shadow-[rgba(0,0,0,0.02)_0_0_0_1px,rgba(0,0,0,0.04)_0_2px_6px,rgba(0,0,0,0.1)_0_4px_8px] p-6 group">
              <div className="flex items-start justify-between gap-2 mb-4">
                <div className="flex-1 min-w-0">
                  <h2 className="text-[15px] font-extrabold text-foreground truncate">{dish.name}</h2>
                  <div className="inline-flex items-center mt-1.5 px-2 py-0.5 rounded-full bg-secondary border border-border">
                    <p className="text-xs font-bold text-muted-foreground">{dish.categoryName}</p>
                  </div>
                </div>
                <div
                  className="flex-shrink-0 flex h-11 w-11 items-center justify-center rounded-xl text-lg text-white shadow-sm"
                  style={{ backgroundColor: dish.bgColor || "#374151" }}
                >
                  {dish.icon}
                </div>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-border">
                <div>
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Type</p>
                  <p className="text-sm font-bold text-foreground mt-0.5">{dish.category}</p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Price</p>
                  {dish.hasPortions ? (
                    <div className="text-[11px] font-bold text-foreground mt-0.5 space-y-0.5">
                      {dish.portions?.quarter > 0 && <div>Q: PKR {dish.portions.quarter}</div>}
                      {dish.portions?.half > 0 && <div>H: PKR {dish.portions.half}</div>}
                      {dish.portions?.large > 0 && <div>L: PKR {dish.portions.large}</div>}
                    </div>
                  ) : (
                    <p className="text-[15px] font-extrabold text-primary mt-0.5">PKR {dish.price}</p>
                  )}
                </div>
              </div>

              {/* Actions — Edit is primary; Delete is de-emphasized to prevent mis-taps */}
              <div className="flex gap-2 pt-3 mt-4 border-t border-border/50">
                <button
                  onClick={() => handleEditDish(dish)}
                  className="btn btn-secondary flex-1 !h-9 text-xs"
                >
                  <FiEdit2 size={12} /> Edit
                </button>
                <button
                  onClick={() => handleDeleteDish(dish.id)}
                  disabled={deleteMutation.isPending}
                  title={`Delete ${dish.name}`}
                  aria-label={`Delete ${dish.name}`}
                  className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-[12px] border border-border text-muted-foreground transition-colors hover:border-error/40 hover:bg-error/10 hover:text-error focus-visible:border-error/40 focus-visible:text-error disabled:opacity-40"
                >
                  <FiTrash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <AddCategoryModal isOpen={isCategoryModalOpen} onClose={() => setIsCategoryModalOpen(false)} />
      <AddDishModal
        isOpen={isDishModalOpen}
        onClose={() => {
          setIsDishModalOpen(false);
          setEditingDish(null);
        }}
        dishToEdit={editingDish}
      />
      <ConfirmModal
        isOpen={Boolean(deletingDishId)}
        onClose={() => setDeletingDishId(null)}
        onConfirm={handleConfirmDelete}
        variant="danger"
        title="Delete Dish"
        message="You're about to permanently delete"
        itemName={deletingDish?.name}
        confirmText="Delete Dish"
        isPending={deleteMutation.isPending}
      />
      <ConfirmModal
        isOpen={Boolean(deletingCategoryId)}
        onClose={() => setDeletingCategoryId(null)}
        onConfirm={handleConfirmDeleteCategory}
        variant="danger"
        title="Delete Category"
        message="You're about to permanently delete the category"
        itemName={deletingCategory?.name}
        requireText={categoryDishCount === 0 ? deletingCategory?.name : undefined}
        blockReason={
          categoryDishCount > 0
            ? `This category still has ${categoryDishCount} ${
                categoryDishCount === 1 ? "dish" : "dishes"
              }. Move or delete them from the Dishes tab first, then you can remove the category.`
            : undefined
        }
        confirmText="Delete Category"
        isPending={deleteCategoryMutation.isPending}
      />
    </section>
  );
};

export default Catalog;
