import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useDb } from "@/hooks/use-db";
import { db, type DBProduct } from "@/lib/db";
import { formatZAR } from "@/lib/catalog";
import {
  Plus,
  Edit2,
  Trash2,
  X,
  Search,
  Filter,
  Check,
  ShieldAlert,
  Sliders,
  CheckCircle,
} from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/products")({
  component: AdminProducts,
});

const SIZE_OPTIONS = ["S", "M", "L", "XL", "2XL", "3XL", "One Size", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13"];
const COLOR_OPTIONS = ["Black", "Navy", "Khaki", "White", "Royal", "Charcoal", "Grey", "Sky Blue", "Red", "Brown", "Hi-Vis Orange", "Hi-Vis Yellow", "Grey/Black", "Default"];

function AdminProducts() {
  const { products, categories } = useDb();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  // Auth User Role Check
  const [userRole, setUserRole] = useState("Manager"); // Default safe role
  useEffect(() => {
    const sessionStr = sessionStorage.getItem("safegear_admin_session");
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

  // Form Drawer States
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [editProduct, setEditProduct] = useState<DBProduct | null>(null);

  // Form Fields State
  const [formName, setFormName] = useState("");
  const [formCategory, setFormCategory] = useState("aprons");
  const [formPrice, setFormPrice] = useState(0);
  const [formDiscountPrice, setFormDiscountPrice] = useState("");
  const [formStock, setFormStock] = useState(0);
  const [formDescription, setFormDescription] = useState("");
  const [formFeatures, setFormFeatures] = useState<string[]>([]);
  const [formSizes, setFormSizes] = useState<string[]>([]);
  const [formColors, setFormColors] = useState<string[]>([]);
  const [formBadge, setFormBadge] = useState("");
  const [formFeatured, setFormFeatured] = useState(false);
  const [formNewArrival, setFormNewArrival] = useState(false);

  // Helper States for features input
  const [featureInput, setFeatureInput] = useState("");

  const handleOpenAddDrawer = () => {
    if (isReadOnly) {
      toast.error("Access Denied", { description: "Managers possess read-only catalog authorization. Contact stone@safegear.co.za" });
      return;
    }
    setEditProduct(null);
    setFormName("");
    setFormCategory(categories[0]?.slug || "aprons");
    setFormPrice(0);
    setFormDiscountPrice("");
    setFormStock(10);
    setFormDescription("");
    setFormFeatures([]);
    setFormSizes([]);
    setFormColors([]);
    setFormBadge("");
    setFormFeatured(false);
    setFormNewArrival(true);
    setIsDrawerOpen(true);
  };

  const handleOpenEditDrawer = (product: DBProduct) => {
    if (isReadOnly) {
      toast.error("Access Denied", { description: "Managers possess read-only catalog authorization. Contact stone@safegear.co.za" });
      return;
    }
    setEditProduct(product);
    setFormName(product.name);
    setFormCategory(product.category);
    setFormPrice(product.price);
    setFormDiscountPrice(product.discountPrice?.toString() || "");
    setFormStock(product.stock);
    setFormDescription(product.description);
    setFormFeatures(product.features || []);
    setFormSizes(product.sizes || []);
    setFormColors(product.colors || []);
    setFormBadge(product.badge || "");
    setFormFeatured(!!product.featured);
    setFormNewArrival(!!product.newArrival);
    setIsDrawerOpen(true);
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isReadOnly) return;

    if (!formName.trim()) {
      toast.error("Product name is required.");
      return;
    }

    try {
      const generatedId = editProduct ? editProduct.id : `p-${Date.now()}`;
      const saved = await db.saveProduct({
        id: generatedId,
        name: formName.trim(),
        category: formCategory,
        price: Number(formPrice),
        discountPrice: formDiscountPrice.trim() ? Number(formDiscountPrice) : undefined,
        stock: Number(formStock),
        description: formDescription.trim(),
        features: formFeatures,
        sizes: formSizes,
        colors: formColors,
        badge: formBadge.trim() || undefined,
        featured: formFeatured,
        newArrival: formNewArrival,
        images: editProduct?.images || [`/images/products/${formName.toLowerCase().replace(/[^a-z0-9]+/g, "-")}_1.jpg`],
      });

      toast.success(editProduct ? "Product updated successfully!" : "Product created successfully!", {
        description: `${saved.name} matches database guidelines.`,
      });
      setIsDrawerOpen(false);
    } catch (err) {
      console.error(err);
      toast.error("Failed to compile product registry. Please verify entries.");
    }
  };

  const handleDeleteProduct = async (id: string, name: string) => {
    if (isReadOnly) {
      toast.error("Access Denied", { description: "Action prohibited for managers." });
      return;
    }
    if (window.confirm(`Are you absolutely sure you want to discontinue "${name}"? This removes it permanently.`)) {
      try {
        await db.deleteProduct(id);
        toast.success(`Discontinued product: ${name}`);
      } catch (err) {
        console.error(err);
        toast.error("Could not remove item registry from database.");
      }
    }
  };

  const toggleSize = (s: string) => {
    setFormSizes((prev) => (prev.includes(s) ? prev.filter((item) => item !== s) : [...prev, s]));
  };

  const toggleColor = (c: string) => {
    setFormColors((prev) => (prev.includes(c) ? prev.filter((item) => item !== c) : [...prev, c]));
  };

  const handleAddFeature = () => {
    if (featureInput.trim()) {
      setFormFeatures((prev) => [...prev, featureInput.trim()]);
      setFeatureInput("");
    }
  };

  const handleRemoveFeature = (idx: number) => {
    setFormFeatures((prev) => prev.filter((_, i) => i !== idx));
  };

  // Filters & Searches
  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCat = selectedCategory === "all" || p.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="space-y-6 relative min-h-[80vh] animate-fade-in">
      {/* 1. Header Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Product Catalogue Management</h1>
          <p className="text-muted-foreground mt-1">Configure SABS-approved lines, prices, sizes, and active stock counts.</p>
        </div>

        {!isReadOnly ? (
          <button
            onClick={handleOpenAddDrawer}
            className="inline-flex items-center gap-1.5 text-xs bg-primary hover:bg-primary/95 text-primary-foreground font-semibold h-10 px-4 rounded-sm transition cursor-pointer"
          >
            <Plus size={14} /> Add New Product
          </button>
        ) : (
          <div className="bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-500 text-xs font-bold px-3 py-1.5 rounded-sm flex items-center gap-1.5 select-none">
            <ShieldAlert size={14} />
            <span>Operational Mode: Read-Only for Managers</span>
          </div>
        )}
      </div>

      {/* 2. Filters & Search Box */}
      <div className="bg-card border border-border p-4 rounded-md shadow-xs grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Search */}
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search by ID, name, details..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full h-10 pl-9 pr-3 bg-background border border-input rounded-sm text-sm focus:outline-none focus:border-primary"
          />
        </div>

        {/* Category */}
        <div className="relative">
          <Filter size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full h-10 pl-9 pr-3 bg-background border border-input rounded-sm text-sm focus:outline-none focus:border-primary appearance-none"
          >
            <option value="all">All PPE Categories</option>
            {categories.map((c) => (
              <option key={c.slug} value={c.slug}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        {/* Dynamic statistics */}
        <div className="flex items-center justify-end text-xs text-muted-foreground font-semibold px-2">
          Listing {filteredProducts.length} of {products.length} registered items
        </div>
      </div>

      {/* 3. Products List Grid */}
      <div className="bg-card border border-border rounded-md shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-secondary/40 text-[10px] uppercase tracking-wider text-muted-foreground border-b border-border">
                <th className="px-6 py-3.5 font-semibold">SKU ID</th>
                <th className="px-6 py-3.5 font-semibold">Product Name</th>
                <th className="px-6 py-3.5 font-semibold">Category</th>
                <th className="px-6 py-3.5 font-semibold">Price (ZAR)</th>
                <th className="px-6 py-3.5 font-semibold text-center">Stock</th>
                <th className="px-6 py-3.5 font-semibold">Status Flags</th>
                <th className="px-6 py-3.5 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border text-sm">
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-muted-foreground">
                    No matching products found. Adjust filters or search strings.
                  </td>
                </tr>
              ) : (
                filteredProducts.map((p) => (
                  <tr key={p.id} className="hover:bg-secondary/15 transition-colors">
                    <td className="px-6 py-4 font-mono text-xs font-bold text-slate-500">{p.id}</td>
                    <td className="px-6 py-4">
                      <div className="font-semibold text-foreground">{p.name}</div>
                      {p.badge && (
                        <span className="inline-block bg-primary/10 text-primary dark:text-[var(--hi-vis)] text-[9px] font-bold px-1 py-0.5 rounded-xs mt-1 uppercase tracking-wider">
                          {p.badge}
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 capitalize text-xs font-semibold text-slate-500">
                      {p.category.replace("-", " ")}
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-bold text-foreground">{formatZAR(p.price)}</div>
                      {p.discountPrice && (
                        <div className="text-[10px] text-muted-foreground line-through">
                          {formatZAR(p.discountPrice)}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 text-center">
                      {p.stock === 0 ? (
                        <span className="bg-red-500/10 text-red-500 text-xs font-bold px-2 py-0.5 rounded-sm">
                          OUT
                        </span>
                      ) : p.stock <= 5 ? (
                        <span className="bg-amber-500/10 text-amber-600 dark:text-amber-500 text-xs font-bold px-2 py-0.5 rounded-sm">
                          LOW ({p.stock})
                        </span>
                      ) : (
                        <span className="bg-green-500/10 text-green-600 text-xs font-bold px-2 py-0.5 rounded-sm">
                          {p.stock}
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 space-y-1">
                      <div className="flex flex-wrap gap-1.5">
                        {p.featured && (
                          <span className="bg-blue-500/10 text-blue-500 text-[10px] font-bold px-1.5 py-0.5 rounded-xs uppercase">
                            Featured
                          </span>
                        )}
                        {p.newArrival && (
                          <span className="bg-emerald-500/10 text-emerald-600 text-[10px] font-bold px-1.5 py-0.5 rounded-xs uppercase">
                            New
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right space-x-1.5 whitespace-nowrap">
                      {!isReadOnly ? (
                        <>
                          <button
                            onClick={() => handleOpenEditDrawer(p)}
                            className="inline-flex items-center justify-center h-8 w-8 rounded-sm bg-secondary hover:bg-accent text-foreground transition cursor-pointer"
                            title="Edit Product"
                          >
                            <Edit2 size={13} />
                          </button>
                          <button
                            onClick={() => handleDeleteProduct(p.id, p.name)}
                            className="inline-flex items-center justify-center h-8 w-8 rounded-sm bg-destructive/10 hover:bg-destructive text-destructive hover:text-white transition cursor-pointer"
                            title="Delete Product"
                          >
                            <Trash2 size={13} />
                          </button>
                        </>
                      ) : (
                        <span className="text-xs text-muted-foreground italic font-semibold">Locked</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 4. Side drawer for Add / Edit product */}
      {isDrawerOpen && (
        <div className="fixed inset-0 z-50 flex justify-end animate-fade-in font-sans">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-xs" onClick={() => setIsDrawerOpen(false)} />
          <div className="relative w-full max-w-2xl bg-card border-l border-border h-full flex flex-col shadow-2xl overflow-hidden p-6 animate-slide-in">
            {/* Drawer Header */}
            <div className="flex items-center justify-between border-b border-border pb-4 mb-6">
              <div>
                <h3 className="text-xl font-bold">{editProduct ? "Modify Product Specifications" : "Register New Product"}</h3>
                <p className="text-xs text-muted-foreground mt-1">Fields are synced instantly in the main DB ledger.</p>
              </div>
              <button onClick={() => setIsDrawerOpen(false)} className="p-1 hover:bg-secondary rounded-sm transition">
                <X size={20} />
              </button>
            </div>

            {/* Form Scroll Container */}
            <form onSubmit={handleSaveProduct} className="flex-1 overflow-y-auto space-y-6 pr-2">
              {/* Product Info */}
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Product Name *</label>
                  <input
                    type="text"
                    required
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    placeholder="e.g. D59 Flame Conti Suit"
                    className="mt-1 w-full h-10 px-3 border border-input rounded-sm bg-background text-sm focus:outline-none focus:border-primary"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Category Category *</label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value)}
                    className="mt-1 w-full h-10 px-3 border border-input rounded-sm bg-background text-sm focus:outline-none focus:border-primary"
                  >
                    {categories.map((c) => (
                      <option key={c.slug} value={c.slug}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Price & Stocks */}
              <div className="grid sm:grid-cols-3 gap-4">
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Price ZAR *</label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={formPrice}
                    onChange={(e) => setFormPrice(Number(e.target.value))}
                    className="mt-1 w-full h-10 px-3 border border-input rounded-sm bg-background text-sm focus:outline-none focus:border-primary"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Discount Price (Optional)</label>
                  <input
                    type="number"
                    min="0"
                    value={formDiscountPrice}
                    onChange={(e) => setFormDiscountPrice(e.target.value)}
                    placeholder="None"
                    className="mt-1 w-full h-10 px-3 border border-input rounded-sm bg-background text-sm focus:outline-none focus:border-primary"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Initial Stock Count *</label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={formStock}
                    onChange={(e) => setFormStock(Number(e.target.value))}
                    className="mt-1 w-full h-10 px-3 border border-input rounded-sm bg-background text-sm focus:outline-none focus:border-primary"
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Description *</label>
                <textarea
                  required
                  rows={3}
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  placeholder="Explain fabric material, EN standards, durability specs..."
                  className="mt-1 w-full p-3 border border-input rounded-sm bg-background text-sm focus:outline-none focus:border-primary resize-y"
                />
              </div>

              {/* Sizes Multi-Select */}
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground block mb-2">Available Sizes</label>
                <div className="flex flex-wrap gap-1.5">
                  {SIZE_OPTIONS.map((size) => {
                    const isSelected = formSizes.includes(size);
                    return (
                      <button
                        type="button"
                        key={size}
                        onClick={() => toggleSize(size)}
                        className={`h-9 px-3 border rounded-sm text-xs font-semibold transition ${
                          isSelected ? "bg-primary text-primary-foreground border-primary" : "border-input bg-background hover:bg-secondary/40"
                        }`}
                      >
                        {size}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Colors Multi-Select */}
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground block mb-2">Available Colors</label>
                <div className="flex flex-wrap gap-1.5">
                  {COLOR_OPTIONS.map((color) => {
                    const isSelected = formColors.includes(color);
                    return (
                      <button
                        type="button"
                        key={color}
                        onClick={() => toggleColor(color)}
                        className={`h-9 px-3 border rounded-sm text-xs font-semibold transition ${
                          isSelected ? "bg-primary text-primary-foreground border-primary" : "border-input bg-background hover:bg-secondary/40"
                        }`}
                      >
                        {color}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Bullet Features (Add lists) */}
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground block">Key Selling Bullet Features</label>
                <div className="flex gap-2 mt-1">
                  <input
                    type="text"
                    value={featureInput}
                    onChange={(e) => setFeatureInput(e.target.value)}
                    placeholder="e.g. 100% Cotton Canvas"
                    className="flex-1 h-10 px-3 border border-input rounded-sm bg-background text-sm focus:outline-none focus:border-primary"
                  />
                  <button
                    type="button"
                    onClick={handleAddFeature}
                    className="bg-secondary px-4 h-10 text-xs font-bold border border-input rounded-sm hover:bg-accent"
                  >
                    Add
                  </button>
                </div>
                {formFeatures.length > 0 && (
                  <ul className="mt-2 space-y-1">
                    {formFeatures.map((feat, idx) => (
                      <li key={idx} className="flex justify-between items-center bg-secondary/30 border border-border/60 px-3 py-1.5 rounded-sm text-xs">
                        <span>{feat}</span>
                        <button type="button" onClick={() => handleRemoveFeature(idx)} className="text-muted-foreground hover:text-destructive">
                          <X size={12} />
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {/* Flags Toggles */}
              <div className="border-t border-border pt-4 grid grid-cols-2 gap-4">
                <label className="flex items-center gap-3 bg-secondary/20 p-3 border border-border/80 rounded-sm cursor-pointer hover:bg-secondary/40">
                  <input
                    type="checkbox"
                    checked={formFeatured}
                    onChange={(e) => setFormFeatured(e.target.checked)}
                    className="h-4 w-4 rounded-xs border-input text-primary focus:ring-primary"
                  />
                  <div>
                    <span className="text-xs font-bold block">Featured Product</span>
                    <span className="text-[10px] text-muted-foreground">Promote on homepage showcase</span>
                  </div>
                </label>

                <label className="flex items-center gap-3 bg-secondary/20 p-3 border border-border/80 rounded-sm cursor-pointer hover:bg-secondary/40">
                  <input
                    type="checkbox"
                    checked={formNewArrival}
                    onChange={(e) => setFormNewArrival(e.target.checked)}
                    className="h-4 w-4 rounded-xs border-input text-primary focus:ring-primary"
                  />
                  <div>
                    <span className="text-xs font-bold block">New Arrival</span>
                    <span className="text-[10px] text-muted-foreground">Flags with active badge tags</span>
                  </div>
                </label>
              </div>

              {/* Additional Tags */}
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Highlight Banner Badge (Optional)</label>
                <input
                  type="text"
                  value={formBadge}
                  onChange={(e) => setFormBadge(e.target.value)}
                  placeholder="e.g. SABS Approved, Flame Resistant, Heavy Duty"
                  className="mt-1 w-full h-10 px-3 border border-input rounded-sm bg-background text-sm focus:outline-none focus:border-primary"
                />
              </div>
            </form>

            {/* Drawer Footer Actions */}
            <div className="border-t border-border pt-4 mt-6 flex justify-end gap-3 shrink-0">
              <button
                type="button"
                onClick={() => setIsDrawerOpen(false)}
                className="bg-secondary px-5 h-11 text-xs font-bold border border-input rounded-sm hover:bg-accent"
              >
                Cancel
              </button>
              <button
                type="submit"
                onClick={handleSaveProduct}
                className="bg-primary hover:bg-primary/95 text-primary-foreground px-6 h-11 text-xs font-bold rounded-sm shadow-xs cursor-pointer inline-flex items-center gap-1.5"
              >
                <Check size={14} />
                <span>{editProduct ? "Apply Specifications" : "Register Product"}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
