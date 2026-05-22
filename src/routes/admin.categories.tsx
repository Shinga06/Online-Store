import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useDb } from "@/hooks/use-db";
import { db, type DBCategory } from "@/lib/db";
import {
  Plus,
  Edit2,
  Trash2,
  X,
  Search,
  Tags,
  ShieldAlert,
  Check,
  Folder,
  Layers,
  Inbox,
  AlertTriangle,
} from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/categories")({
  component: AdminCategories,
});

function AdminCategories() {
  const { products, categories } = useDb();
  const [searchTerm, setSearchTerm] = useState("");

  // Auth User Role Check
  const [userRole, setUserRole] = useState("Manager"); // Default safe role
  useEffect(() => {
    const sessionStr = sessionStorage.getItem("cbalcool_admin_session");
    if (sessionStr) {
      try {
        const u = JSON.parse(sessionStr);
        setUserRole(u.role);
      } catch {
        // ignore
      }
    }
  }, []);

  const isReadOnly = userRole === "Manager";

  // Drawer states
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [editCategory, setEditCategory] = useState<DBCategory | null>(null);

  // Form inputs
  const [formName, setFormName] = useState("");
  const [formBlurb, setFormBlurb] = useState("");

  const handleOpenAddDrawer = () => {
    if (isReadOnly) {
      toast.error("Access Denied", {
        description: "Managers possess read-only catalog authorization. Contact stone@cbalcool.co.za",
      });
      return;
    }
    setEditCategory(null);
    setFormName("");
    setFormBlurb("");
    setIsDrawerOpen(true);
  };

  const handleOpenEditDrawer = (category: DBCategory) => {
    if (isReadOnly) {
      toast.error("Access Denied", {
        description: "Managers possess read-only catalog authorization. Contact stone@cbalcool.co.za",
      });
      return;
    }
    setEditCategory(category);
    setFormName(category.name);
    setFormBlurb(category.blurb);
    setIsDrawerOpen(true);
  };

  const handleSaveCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isReadOnly) return;

    if (!formName.trim()) {
      toast.error("Category name is required.");
      return;
    }
    if (!formBlurb.trim()) {
      toast.error("Description / Blurb is required.");
      return;
    }

    try {
      // Slug is either kept as editCategory.slug or generated from name
      const slug = editCategory
        ? editCategory.slug
        : formName
            .toLowerCase()
            .trim()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/(^-|-$)/g, "");

      if (!slug) {
        toast.error("Failed to generate a valid unique slug. Try a different name.");
        return;
      }

      // Check for duplicate slug when creating new
      if (!editCategory && categories.some((c) => c.slug === slug)) {
        toast.error("A category with a similar name or slug already exists.");
        return;
      }

      const saved = await db.saveCategory({
        slug,
        name: formName.trim(),
        blurb: formBlurb.trim(),
      });

      toast.success(
        editCategory ? "Category updated successfully!" : "Category created successfully!",
        {
          description: `Category "${saved.name}" is now live in the catalogue.`,
        }
      );
      setIsDrawerOpen(false);
    } catch (err) {
      console.error(err);
      toast.error("Failed to save category. Please check your inputs.");
    }
  };

  const handleDeleteCategory = async (category: DBCategory) => {
    if (isReadOnly) {
      toast.error("Access Denied", { description: "Action prohibited for managers." });
      return;
    }

    // Safeguard: Check if any product is assigned to this category
    const linkedProductsCount = products.filter((p) => p.category === category.slug).length;
    if (linkedProductsCount > 0) {
      toast.error("Cannot Delete Category", {
        description: `There are ${linkedProductsCount} product(s) currently assigned to "${category.name}". Reassign or delete them first.`,
      });
      return;
    }

    if (
      window.confirm(
        `Are you absolutely sure you want to delete the "${category.name}" category? This cannot be undone.`
      )
    ) {
      try {
        await db.deleteCategory(category.slug);
        toast.success(`Category "${category.name}" deleted successfully.`);
      } catch (err) {
        console.error(err);
        toast.error("Could not remove category from database.");
      }
    }
  };

  // Live Statistics calculations
  const totalCategories = categories.length;
  
  // Calculate top category by product count
  const categoryCounts = categories.map((c) => ({
    ...c,
    count: products.filter((p) => p.category === c.slug).length,
  }));
  
  const sortedByCount = [...categoryCounts].sort((a, b) => b.count - a.count);
  const topCategory = sortedByCount[0];
  const emptyCategoriesCount = categoryCounts.filter((c) => c.count === 0).length;

  // Filter Categories
  const filteredCategories = categoryCounts.filter(
    (c) =>
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.blurb.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.slug.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 relative min-h-[80vh] animate-fade-in font-sans">
      {/* 1. Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Category Directory</h1>
          <p className="text-muted-foreground mt-1">
            Manage catalogue segmentation for PPE, workwear, and safety products.
          </p>
        </div>

        {!isReadOnly ? (
          <button
            onClick={handleOpenAddDrawer}
            className="inline-flex items-center gap-1.5 text-xs bg-primary hover:bg-primary/95 text-primary-foreground font-semibold h-10 px-4 rounded-sm transition cursor-pointer"
          >
            <Plus size={14} /> Add New Category
          </button>
        ) : (
          <div className="bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-500 text-xs font-bold px-3 py-1.5 rounded-sm flex items-center gap-1.5 select-none">
            <ShieldAlert size={14} />
            <span>Operational Mode: Read-Only for Managers</span>
          </div>
        )}
      </div>

      {/* 2. Top Metric Analytics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Total Categories */}
        <div className="bg-card border border-border p-5 rounded-md shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Total Categories</span>
            <h3 className="text-2xl font-black mt-1 text-foreground">{totalCategories}</h3>
            <p className="text-[10px] text-muted-foreground mt-1">Active storefront directories</p>
          </div>
          <div className="h-10 w-10 rounded-sm bg-primary/10 flex items-center justify-center text-primary dark:text-[var(--hi-vis)]">
            <Tags size={20} />
          </div>
        </div>

        {/* Most Popular Category */}
        <div className="bg-card border border-border p-5 rounded-md shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Top Category</span>
            <h3 className="text-lg font-bold mt-1 text-foreground truncate max-w-[170px]">
              {topCategory ? topCategory.name : "N/A"}
            </h3>
            <p className="text-[10px] text-muted-foreground mt-1">
              {topCategory ? `${topCategory.count} products assigned` : "No products yet"}
            </p>
          </div>
          <div className="h-10 w-10 rounded-sm bg-blue-500/10 flex items-center justify-center text-blue-500">
            <Layers size={20} />
          </div>
        </div>

        {/* Empty Categories Alert */}
        <div className="bg-card border border-border p-5 rounded-md shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Empty Directories</span>
            <h3 className="text-2xl font-black mt-1 text-foreground">{emptyCategoriesCount}</h3>
            <p className="text-[10px] text-muted-foreground mt-1">Categories with 0 items</p>
          </div>
          <div className="h-10 w-10 rounded-sm bg-amber-500/10 flex items-center justify-center text-amber-500">
            <Inbox size={20} />
          </div>
        </div>
      </div>

      {/* 3. Search and stats banner */}
      <div className="bg-card border border-border p-4 rounded-md shadow-xs flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative w-full sm:max-w-xs">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search categories by name, blurb..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full h-10 pl-9 pr-3 bg-background border border-input rounded-sm text-sm focus:outline-none focus:border-primary"
          />
        </div>
        <div className="text-xs font-semibold text-muted-foreground whitespace-nowrap">
          Displaying {filteredCategories.length} of {categories.length} segments
        </div>
      </div>

      {/* 4. Category Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCategories.length === 0 ? (
          <div className="col-span-full py-16 text-center border border-dashed border-border rounded-md bg-card">
            <Folder className="mx-auto text-muted-foreground mb-3" size={36} />
            <h3 className="font-bold text-lg text-foreground">No Categories Found</h3>
            <p className="text-sm text-muted-foreground mt-1">Adjust search parameters or create a new category.</p>
          </div>
        ) : (
          filteredCategories.map((cat) => (
            <div
              key={cat.slug}
              className="bg-card border border-border rounded-md shadow-xs p-5 hover:shadow-md transition flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-bold text-lg text-foreground group-hover:text-primary dark:group-hover:text-[var(--hi-vis)] transition-colors">
                      {cat.name}
                    </h3>
                    <code className="text-[10px] text-muted-foreground font-mono bg-secondary px-1.5 py-0.5 rounded-xs mt-1 inline-block">
                      slug: {cat.slug}
                    </code>
                  </div>
                  <span
                    className={`text-xs font-bold px-2 py-0.5 rounded-full select-none ${
                      cat.count === 0
                        ? "bg-amber-500/10 text-amber-500"
                        : "bg-green-500/10 text-green-600"
                    }`}
                  >
                    {cat.count} {cat.count === 1 ? "Product" : "Products"}
                  </span>
                </div>

                <p className="text-sm text-muted-foreground mt-4 leading-relaxed line-clamp-3">
                  {cat.blurb}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="border-t border-border mt-5 pt-4 flex justify-between items-center">
                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                  SABS Segment
                </span>
                
                <div className="flex items-center gap-1.5">
                  {!isReadOnly ? (
                    <>
                      <button
                        onClick={() => handleOpenEditDrawer(cat)}
                        className="inline-flex items-center justify-center h-8 w-8 rounded-sm bg-secondary hover:bg-accent text-foreground transition cursor-pointer"
                        title="Edit Category"
                      >
                        <Edit2 size={13} />
                      </button>
                      <button
                        onClick={() => handleDeleteCategory(cat)}
                        className="inline-flex items-center justify-center h-8 w-8 rounded-sm bg-destructive/10 hover:bg-destructive text-destructive hover:text-white transition cursor-pointer"
                        title="Delete Category"
                      >
                        <Trash2 size={13} />
                      </button>
                    </>
                  ) : (
                    <span className="text-[11px] text-muted-foreground italic font-semibold">Locked</span>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* 5. Add / Edit Drawer */}
      {isDrawerOpen && (
        <div className="fixed inset-0 z-50 flex justify-end animate-fade-in font-sans">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-xs" onClick={() => setIsDrawerOpen(false)} />
          <div className="relative w-full max-w-lg bg-card border-l border-border h-full flex flex-col shadow-2xl overflow-hidden p-6 animate-slide-in">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-border pb-4 mb-6">
              <div>
                <h3 className="text-xl font-bold">
                  {editCategory ? "Edit Category Directory" : "Create New Category Directory"}
                </h3>
                <p className="text-xs text-muted-foreground mt-1">
                  Configure directory segmentation labels.
                </p>
              </div>
              <button
                onClick={() => setIsDrawerOpen(false)}
                className="p-1 hover:bg-secondary rounded-sm transition"
              >
                <X size={20} />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSaveCategory} className="flex-1 overflow-y-auto space-y-6">
              {/* Category Name */}
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Category Name *
                </label>
                <input
                  type="text"
                  required
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="e.g. Chemical Wear"
                  disabled={!!editCategory} // Slug cannot be changed once established for route integrity
                  className="mt-1 w-full h-10 px-3 border border-input rounded-sm bg-background text-sm focus:outline-none focus:border-primary disabled:opacity-60 disabled:cursor-not-allowed"
                />
                {!editCategory && formName && (
                  <p className="text-[10px] text-muted-foreground font-mono mt-1">
                    Slug will generate as:{" "}
                    <span className="text-primary dark:text-[var(--hi-vis)] font-bold">
                      {formName
                        .toLowerCase()
                        .trim()
                        .replace(/[^a-z0-9]+/g, "-")
                        .replace(/(^-|-$)/g, "")}
                    </span>
                  </p>
                )}
                {editCategory && (
                  <p className="text-[10px] text-amber-500 font-semibold mt-1">
                    Slug index key cannot be altered after registration to protect shopping routing links.
                  </p>
                )}
              </div>

              {/* Category Description / Blurb */}
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Directory Description / Blurb *
                </label>
                <textarea
                  required
                  rows={4}
                  value={formBlurb}
                  onChange={(e) => setFormBlurb(e.target.value)}
                  placeholder="Summarize products covered, certifications required (e.g. SABS, ISO specs)..."
                  className="mt-1 w-full p-3 border border-input rounded-sm bg-background text-sm focus:outline-none focus:border-primary resize-y"
                />
              </div>

              {/* Caution note about deletions */}
              {!editCategory && (
                <div className="bg-amber-500/10 border border-amber-500/20 p-4 rounded-sm flex items-start gap-2.5">
                  <AlertTriangle className="text-amber-500 shrink-0 mt-0.5" size={16} />
                  <div className="text-xs text-amber-600 dark:text-amber-500 leading-normal">
                    <span className="font-bold">Important Notice:</span> Adding a new category creates a storefront route listing. Ensure descriptions explain catalog applications to assist customer checkout filters.
                  </div>
                </div>
              )}
            </form>

            {/* Actions Footer */}
            <div className="border-t border-border pt-4 mt-6 flex justify-end gap-3 shrink-0">
              <button
                type="button"
                onClick={() => setIsDrawerOpen(false)}
                className="bg-secondary px-5 h-11 text-xs font-bold border border-input rounded-sm hover:bg-accent cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                onClick={handleSaveCategory}
                className="bg-primary hover:bg-primary/95 text-primary-foreground px-6 h-11 text-xs font-bold rounded-sm shadow-xs cursor-pointer inline-flex items-center gap-1.5"
              >
                <Check size={14} />
                <span>{editCategory ? "Apply Specifications" : "Register Segment"}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
