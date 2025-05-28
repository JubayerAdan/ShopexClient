import React, { useState, useRef, useEffect } from 'react';
import { X, Loader2, Package } from 'lucide-react';
import { Skeleton } from "@/components/ui/skeleton";
import Swal from 'sweetalert2';
import useAuth from '@/app/hooks/useAuth';

// Add type definition for newProduct state
interface Variety {
  name: string;
  price: number;
  stock: number;
}

interface ProductFormData {
  name: string;
  description: string;
  price: string;
  category: string;
  image: string;
  varieties: Variety[];
  sellerID: string;
  images: string[]; // Stores Cloudinary URLs
}

const categories = [
  'Electronics',
  'Fashion',
  'Home & Kitchen',
  'Beauty',
  'Sports',
  'Books',
  'Toys',
  'Automotive'
];

function Products() {
  const [products, setProducts] = useState<any[]>([]);
  const [userInfo, setUserInfo] = useState<any>(null);
  const { user, loading, currentUserFromBackend } = useAuth();
  useEffect(() => {
    const fetchCurrentUser = async () => {
      const userData = await currentUserFromBackend();
      setUserInfo(userData);
    };
    fetchCurrentUser();
  }, []);
  const sellerID = userInfo?.role === 'seller' ? userInfo?._id : null;
  const [newProduct, setNewProduct] = useState<ProductFormData>({
    name: '',
    description: '',
    price: '',
    category: '',
    image: '',
    varieties: [],
    sellerID: sellerID,
    images: []
  });
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const addModalRef = useRef<HTMLInputElement>(null);
  const editModalRef = useRef<HTMLInputElement>(null);
  const viewModalRef = useRef<HTMLInputElement>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (userInfo) {
      setNewProduct(prev => ({
        ...prev,
        sellerID: userInfo.role === 'seller' ? userInfo._id : ''
      }));
    }
  }, [userInfo]);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const res = await fetch('http://localhost:5000/products?page=1&limit=10');
        if (!res.ok) throw new Error('Failed to fetch products');
        const data = await res.json();
        // Assuming the backend returns { products, total, page, pages }
        setProducts(data.products.map((p: any) => ({ ...p, id: p._id })));
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    }
    fetchProducts();
  }, []);

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setIsLoading(true);
      const response = await fetch('http://localhost:5000/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...newProduct,
          price: parseFloat(newProduct.price),
          images: newProduct.images,
          varieties: Array.isArray(newProduct.varieties) ? newProduct.varieties : []
        }),
      });

      if (!response.ok) throw new Error('Failed to add product');

      const createdProduct = await response.json();
      setProducts([...products, { ...createdProduct, id: createdProduct._id }]);
      setNewProduct({
        name: '',
        description: '',
        price: '',
        category: '',
        image: '',
        varieties: [],
        sellerID: sellerID,
        images: []
      });

      if (addModalRef.current) addModalRef.current.checked = false;

      // Success notification
      Swal.fire({
        title: 'Success!',
        text: 'Product added successfully',
        icon: 'success',
        confirmButtonColor: '#6366f1',
        confirmButtonText: 'OK',
        customClass: {
          popup: 'rounded-xl shadow-xl',
          title: 'text-lg font-semibold'
        }
      });
    } catch (error) {
      console.error('Error adding product:', error);

      // Error notification
      Swal.fire({
        title: 'Error!',
        text: 'Failed to add product. Please try again.',
        icon: 'error',
        confirmButtonColor: '#ef4444',
        confirmButtonText: 'OK',
        customClass: {
          popup: 'rounded-xl shadow-xl',
          title: 'text-lg font-semibold'
        }
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageUpload = async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'product_images');  // Add your Cloudinary upload preset
    formData.append('cloud_name', 'dwv8borox');  // Add your Cloudinary cloud name

    const response = await fetch('https://api.cloudinary.com/v1_1/dwv8borox/image/upload', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) throw new Error('Failed to upload image');

    const data = await response.json();
    return data.secure_url; // Cloudinary URL
  };

  const handleAddImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const imageUrl = await handleImageUpload(file);
        setNewProduct({ ...newProduct, image: imageUrl });
      } catch (error) {
        Swal.fire({
          title: 'Error!',
          text: 'Failed to upload image. Please try again.',
          icon: 'error',
          confirmButtonColor: '#ef4444',
          confirmButtonText: 'OK',
          customClass: {
            popup: 'rounded-xl shadow-xl',
            title: 'text-lg font-semibold'
          }
        });
      }
    }
  };

  const handleEditProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;

    try {
      // Ensure we're using the string ID
      const productId = editingProduct.id || editingProduct._id;
      
      const response = await fetch(`http://localhost:5000/products/${productId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...editingProduct,
          price: parseFloat(editingProduct.price),
          varieties: editingProduct.varieties.map((v: any) => ({
            name: v.name,
            price: parseFloat(v.price),
            stock: parseInt(v.stock)
          }))
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update product');
      }
      
      const updatedProduct = await response.json();
      setProducts(products.map(p => p.id === updatedProduct.id ? updatedProduct : p));
      
      // Close modal
      if (editModalRef.current) editModalRef.current.checked = false;
      setEditingProduct(null);

    } catch (error) {
      console.error('Error updating product:', error);
      Swal.fire('Update Error', 'Failed to save product changes', 'error');
    }
  };

  return (
    <div className="p-8">
      {/* Add Product Button */}
      <div className="flex justify-end mb-8">
        <label htmlFor="add-product-modal" className="btn btn-primary gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
          </svg>
          Add Product
        </label>
      </div>

      {/* Add Product Modal */}
      <input type="checkbox" id="add-product-modal" className="modal-toggle" ref={addModalRef} />
      <div className="modal">
        <div className="modal-box max-w-full sm:max-w-2xl">
          <h3 className="font-bold text-lg mb-4">Add New Product</h3>
          <form onSubmit={handleAddProduct}>
            <div className="form-control relative">
              <input
                type="text"
                required
                className="peer pt-6 pb-2 px-4 w-full border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder=" "
                value={newProduct.name}
                onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
              />
              <label className="absolute top-2 left-4 text-xs font-medium text-gray-500 transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-4 peer-focus:top-2 peer-focus:text-xs peer-focus:text-indigo-600">
                Product Name
              </label>
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Category</span>
              </label>
              <select
                required
                value={newProduct.category}
                onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                className="select select-bordered w-full focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              >
                <option value="" disabled>Select Category</option>
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Description</span>
              </label>
              <textarea
                required
                value={newProduct.description}
                onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                className="textarea textarea-bordered h-32"
                rows={4}
              />
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Price</span>
              </label>
              <input
                type="number"
                required
                step="0.01"
                value={newProduct.price}
                onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                className="input input-bordered"
              />
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Product Image</span>
              </label>
              <input type="file" onChange={handleAddImage} className="input input-bordered" />
              {newProduct.image && <img src={newProduct.image} alt="Product Preview" className="mt-4 w-full h-48 object-cover" />}
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Product Varieties</span>
              </label>
              <div className="space-y-4">
                {newProduct.varieties.map((variety, index) => (
                  <div key={index} className="group relative flex gap-4 items-center p-4 bg-white rounded-xl border hover:border-indigo-200 transition-colors">
                    <div className="flex-1 grid grid-cols-3 gap-4">
                      <div className="relative">
                        <input
                          type="text"
                          value={variety.name}
                          onChange={(e) => {
                            const updatedVarieties = [...newProduct.varieties];
                            updatedVarieties[index].name = e.target.value;
                            setNewProduct({ ...newProduct, varieties: updatedVarieties });
                          }}
                          className="input input-bordered"
                          placeholder="Variety Name"
                        />
                      </div>
                      <div className="relative">
                        <input
                          type="number"
                          value={variety.price}
                          onChange={(e) => {
                            const updatedVarieties = [...newProduct.varieties];
                            updatedVarieties[index].price = parseFloat(e.target.value);
                            setNewProduct({ ...newProduct, varieties: updatedVarieties });
                          }}
                          className="input input-bordered"
                          placeholder="Variety Price"
                        />
                      </div>
                      <div className="relative">
                        <input
                          type="number"
                          value={variety.stock}
                          onChange={(e) => {
                            const updatedVarieties = [...newProduct.varieties];
                            updatedVarieties[index].stock = parseInt(e.target.value);
                            setNewProduct({ ...newProduct, varieties: updatedVarieties });
                          }}
                          className="input input-bordered"
                          placeholder="Variety Stock"
                        />
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        const updatedVarieties = newProduct.varieties.filter((_, idx) => idx !== index);
                        setNewProduct({ ...newProduct, varieties: updatedVarieties });
                      }}
                      className="absolute top-0 right-0 p-2 text-red-600"
                    >
                      <X />
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => setNewProduct({ ...newProduct, varieties: [...newProduct.varieties, { name: '', price: 0, stock: 0 }] })}
                  className="btn btn-outline btn-sm w-full"
                >
                  Add Variety
                </button>
              </div>
            </div>
            <div className="modal-action">
              <button type="submit" className="btn btn-primary" disabled={isLoading}>
                {isLoading ? <Loader2 className="animate-spin" /> : 'Add Product'}
              </button>
              <label htmlFor="add-product-modal" className="btn">Cancel</label>
            </div>
          </form>
        </div>
      </div>

      {/* Product List */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {products.map((product: any) => (
          <div key={product.id} className="card bg-white shadow-md rounded-lg p-4">
            <img src={product.image} alt={product.name} className="w-full h-48 object-cover rounded-lg" />
            <h3 className="mt-4 text-lg font-semibold">{product.name}</h3>
            <p className="text-sm text-gray-500">{product.description}</p>
            <div className="mt-4 flex justify-between items-center">
              <span className="text-xl font-bold">
                ${Number(product.price).toFixed(2)}
              </span>
              <button
                className="btn btn-outline btn-xs"
                onClick={() => {
                  const productToEdit = products.find(p => p.id === product.id);
                  if (productToEdit) {
                    const varietiesWithTempIds = productToEdit.varieties?.map(v => ({
                      ...v,
                      tempId: v._id || Date.now() + Math.random()
                    }));
                    setEditingProduct({ ...productToEdit, varieties: varietiesWithTempIds });
                  }
                  if (editModalRef.current) editModalRef.current.checked = true;
                }}
              >
                Edit
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* View Product Modal */}
      <input type="checkbox" id="view-product-modal" className="modal-toggle" ref={viewModalRef} />
      <div className="modal">
        <div className="modal-box max-w-xl">
          <h3 className="font-bold text-lg mb-4">Product Details</h3>
          {editingProduct && (
            <div className="space-y-4">
              <img src={editingProduct.image} alt={editingProduct.name} 
                   className="rounded-xl h-48 w-full object-cover" />
              <div>
                <label className="label-text font-semibold">Product Name</label>
                <p className="mt-1">{editingProduct.name}</p>
              </div>
              <div>
                <label className="label-text font-semibold">Description</label>
                <p className="mt-1">{editingProduct.description}</p>
              </div>
              <div>
                <label className="label-text font-semibold">Category</label>
                <p className="mt-1">{editingProduct.category}</p>
              </div>
              <div>
                <label className="label-text font-semibold">Price</label>
                <p className="mt-1">${parseFloat(editingProduct.price).toFixed(2)}</p>
              </div>
            </div>
          )}
          <div className="modal-action">
            <label htmlFor="view-product-modal" className="btn">Close</label>
          </div>
        </div>
      </div>

      {/* Edit Product Modal */}
      <input type="checkbox" id="edit-product-modal" className="modal-toggle" ref={editModalRef} />
      <div className="modal modal-bottom sm:modal-middle">
        <div className="modal-box max-w-full sm:max-w-3xl">
          <h3 className="font-bold text-lg mb-4">Edit Product</h3>
          {editingProduct && (
            <form onSubmit={handleEditProduct}>
              {/* API Endpoint Display */}
              <div className="text-sm mb-4 p-2 bg-gray-100 rounded-md">
                <span className="font-medium">API Endpoint:</span>
                <code className="ml-2 text-indigo-600 break-all">
                  {`PUT http://localhost:5000/products/${editingProduct?._id || editingProduct?.id}`}
                </code>
              </div>

              <div className="form-control mb-4">
                <label className="label">
                  <span className="label-text">Product Name</span>
                </label>
                <input
                  type="text"
                  required
                  value={editingProduct.name}
                  onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                  className="input input-bordered"
                />
              </div>

              <div className="form-control mb-4">
                <label className="label">
                  <span className="label-text">Category</span>
                </label>
                <input 
                  type="text"
                  required
                  value={editingProduct.category}
                  onChange={(e) => setEditingProduct({ ...editingProduct, category: e.target.value })}
                  className="input input-bordered"
                />
              </div>

              <div className="form-control mb-4">
                <label className="label">
                  <span className="label-text">Description</span>
                </label>
                <textarea
                  required
                  value={editingProduct.description}
                  onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })}
                  className="textarea textarea-bordered"
                  rows={4}
                />
              </div>

              <div className="form-control mb-4">
                <label className="label">
                  <span className="label-text">Price</span>
                </label>
                <input
                  type="number"
                  required
                  value={editingProduct.price}
                  onChange={(e) => setEditingProduct({ ...editingProduct, price: e.target.value })}
                  className="input input-bordered"
                />
              </div>

              <div className="form-control mb-4">
                <label className="label">
                  <span className="label-text">Product Image URL</span>
                </label>
                <input
                  type="text"
                  required
                  value={editingProduct.image}
                  onChange={(e) => setEditingProduct({ ...editingProduct, image: e.target.value })}
                  className="input input-bordered"
                />
              </div>

              <div className="space-y-4">
                <h4 className="font-medium">Product Varieties</h4>
                {editingProduct?.varieties?.map((variety: any) => (
                  <div 
                    key={variety.tempId || variety._id}
                    className="grid grid-cols-1 sm:grid-cols-3 gap-4"
                  >
                    <input
                      type="text"
                      placeholder="Variety Name"
                      value={variety.name}
                      onChange={(e) => {
                        const newVarieties = editingProduct.varieties.map((v: any) => {
                          if (v.tempId === variety.tempId || v._id === variety._id) {
                            return { ...v, name: e.target.value };
                          }
                          return v;
                        });
                        setEditingProduct({...editingProduct, varieties: newVarieties});
                      }}
                      className="input input-bordered"
                    />
                    <input
                      type="number"
                      placeholder="Price"
                      value={variety.price}
                      onChange={(e) => {
                        const newVarieties = editingProduct.varieties.map((v: any) => {
                          if (v.tempId === variety.tempId || v._id === variety._id) {
                            return { ...v, price: parseFloat(e.target.value) };
                          }
                          return v;
                        });
                        setEditingProduct({...editingProduct, varieties: newVarieties});
                      }}
                      className="input input-bordered"
                    />
                    <input
                      type="number"
                      placeholder="Stock"
                      value={variety.stock}
                      onChange={(e) => {
                        const newVarieties = editingProduct.varieties.map((v: any) => {
                          if (v.tempId === variety.tempId || v._id === variety._id) {
                            return { ...v, stock: parseInt(e.target.value) };
                          }
                          return v;
                        });
                        setEditingProduct({...editingProduct, varieties: newVarieties});
                      }}
                      className="input input-bordered"
                    />
                  </div>
                ))}
                
                <button
                  type="button"
                  onClick={() => {
                    setEditingProduct({
                      ...editingProduct,
                      varieties: [...editingProduct.varieties, { 
                        tempId: Date.now() + Math.random(),
                        name: '', 
                        price: 0,
                        stock: 0 
                      }]
                    });
                  }}
                  className="btn btn-outline btn-sm"
                >
                  + Add Variety
                </button>
              </div>

              <div className="modal-action">
                <button type="submit" className="btn btn-primary">Save Changes</button>
                <label 
                  htmlFor="edit-product-modal" 
                  className="btn"
                  onClick={() => {
                    setEditingProduct(null);
                    if (editModalRef.current) editModalRef.current.checked = false;
                  }}
                >
                  Cancel
                </label>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

export default Products;
