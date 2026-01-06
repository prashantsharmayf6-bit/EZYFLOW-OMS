import React, { useState } from 'react';
import { Product } from '../types';
import { Sparkles, Loader2, X, Search, Plus, Package } from 'lucide-react';
import { generateProductDescription } from '../services/geminiService';
import { useData } from '../context/DataContext';

export const Inventory: React.FC = () => {
  const { products, updateProduct, addProduct } = useData();
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isModalOpen, setModalOpen] = useState(false);
  const [generatedDesc, setGeneratedDesc] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [keywords, setKeywords] = useState('');

  const handleGenerateDesc = async () => {
    if (!selectedProduct) return;
    setIsGenerating(true);
    const desc = await generateProductDescription(
      selectedProduct.name,
      selectedProduct.category,
      keywords || 'high quality, durable, modern'
    );
    setGeneratedDesc(desc);
    setIsGenerating(false);
  };

  const handleSaveDescription = () => {
    if (selectedProduct && generatedDesc) {
      updateProduct({ ...selectedProduct, description: generatedDesc });
      setModalOpen(false);
    }
  };

  const openDescModal = (product: Product) => {
    setSelectedProduct(product);
    setGeneratedDesc('');
    setKeywords('');
    setModalOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Inventory</h1>
          <p className="text-slate-500">Manage your product catalog and stock.</p>
        </div>
        <button className="flex items-center space-x-2 bg-primary-600 text-white px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-primary-700 shadow-sm transition-all">
          <Plus className="w-4 h-4" />
          <span>Add Product</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <div key={product.id} className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden hover:shadow-md transition-shadow flex flex-col">
            <div className="h-48 bg-slate-100 flex items-center justify-center relative">
              <Package className="w-16 h-16 text-slate-300" />
              <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-md text-xs font-bold text-slate-700 shadow-sm border border-slate-100">
                {product.stock} in stock
              </div>
            </div>
            <div className="p-5 flex-1 flex flex-col">
              <div className="flex justify-between items-start mb-2">
                 <h3 className="font-bold text-slate-800 text-lg leading-tight">{product.name}</h3>
                 <span className="font-semibold text-primary-600">₹{product.price}</span>
              </div>
              <p className="text-xs text-slate-500 uppercase tracking-wide font-semibold mb-3">{product.category}</p>
              <p className="text-sm text-slate-600 line-clamp-3 mb-4 flex-1">
                {product.description || <span className="italic text-slate-400">No description available.</span>}
              </p>
              
              <div className="pt-4 border-t border-slate-100 flex items-center justify-between mt-auto">
                <span className="text-xs font-mono text-slate-400">{product.sku}</span>
                <button
                  onClick={() => openDescModal(product)}
                  className="text-xs font-medium bg-indigo-50 text-indigo-700 px-3 py-1.5 rounded-full hover:bg-indigo-100 transition-colors flex items-center"
                >
                  <Sparkles className="w-3 h-3 mr-1" />
                  AI Enhance
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* AI Description Modal */}
      {isModalOpen && selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-800">AI Description Generator</h3>
                  <p className="text-xs text-slate-500">{selectedProduct.name}</p>
                </div>
              </div>
              <button onClick={() => setModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6 space-y-4 overflow-y-auto">
               <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Keywords / Features (Optional)</label>
                  <input
                    type="text"
                    value={keywords}
                    onChange={(e) => setKeywords(e.target.value)}
                    placeholder="e.g. ergonomic, premium leather, 2-year warranty"
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary-500 outline-none"
                  />
               </div>

               <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 min-h-[120px]">
                  {isGenerating ? (
                    <div className="flex flex-col items-center justify-center h-full py-8 text-primary-600">
                      <Loader2 className="w-8 h-8 animate-spin mb-2" />
                      <span className="text-sm font-medium">Crafting perfect description...</span>
                    </div>
                  ) : generatedDesc ? (
                    <p className="text-sm text-slate-700 leading-relaxed">{generatedDesc}</p>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full py-4 text-slate-400 text-sm">
                      <Sparkles className="w-8 h-8 mb-2 opacity-50" />
                      <p>Click generate to create a description.</p>
                    </div>
                  )}
               </div>
            </div>

            <div className="p-6 border-t border-slate-100 flex justify-end space-x-3 bg-white">
              <button
                onClick={() => setModalOpen(false)}
                className="px-4 py-2 text-slate-600 font-medium text-sm hover:bg-slate-100 rounded-lg transition-colors"
              >
                Cancel
              </button>
              {!generatedDesc ? (
                <button
                  onClick={handleGenerateDesc}
                  disabled={isGenerating}
                  className="px-6 py-2 bg-slate-900 text-white font-medium text-sm rounded-lg hover:bg-slate-800 transition-colors disabled:opacity-70 flex items-center"
                >
                   <Sparkles className="w-4 h-4 mr-2" />
                   Generate
                </button>
              ) : (
                <>
                  <button
                    onClick={handleGenerateDesc}
                    className="px-4 py-2 text-slate-600 font-medium text-sm hover:bg-slate-100 rounded-lg transition-colors border border-slate-200"
                  >
                    Try Again
                  </button>
                  <button
                    onClick={handleSaveDescription}
                    className="px-6 py-2 bg-primary-600 text-white font-medium text-sm rounded-lg hover:bg-primary-700 transition-colors"
                  >
                    Save Changes
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};