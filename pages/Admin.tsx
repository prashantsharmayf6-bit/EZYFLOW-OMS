import React, { useState, useRef } from 'react';
import { useSettings } from '../context/SettingsContext';
import { Upload, Save, Trash2, Building } from 'lucide-react';

export const Admin: React.FC = () => {
  const { companyName, setCompanyName, logo, setLogo } = useSettings();
  const [tempName, setTempName] = useState(companyName);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isSaved, setIsSaved] = useState(false);

  const handleNameSave = () => {
    setCompanyName(tempName);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogo(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveLogo = () => {
    setLogo(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Administration</h1>
        <p className="text-slate-500">Manage company settings and branding.</p>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100">
          <h2 className="text-lg font-semibold text-slate-800 flex items-center">
            <Building className="w-5 h-5 mr-2 text-primary-600" />
            Branding Settings
          </h2>
        </div>
        
        <div className="p-8 space-y-8">
          {/* Company Name Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-1">
              <label className="block text-sm font-medium text-slate-700 mb-1">Company Name</label>
              <p className="text-xs text-slate-500">This name will appear in the sidebar and official communications.</p>
            </div>
            <div className="md:col-span-2 flex items-start space-x-4">
              <div className="flex-1">
                <input
                  type="text"
                  value={tempName}
                  onChange={(e) => setTempName(e.target.value)}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
                />
              </div>
              <button 
                onClick={handleNameSave}
                className={`px-4 py-2 font-medium text-sm rounded-lg transition-all flex items-center ${
                  isSaved 
                    ? 'bg-green-600 text-white hover:bg-green-700' 
                    : 'bg-primary-600 text-white hover:bg-primary-700'
                }`}
              >
                {isSaved ? <span className="mr-2">Saved!</span> : <Save className="w-4 h-4 mr-2" />}
                {isSaved ? null : 'Save'}
              </button>
            </div>
          </div>

          <hr className="border-slate-100" />

          {/* Logo Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-1">
              <label className="block text-sm font-medium text-slate-700 mb-1">Company Logo</label>
              <p className="text-xs text-slate-500">Upload your brand logo. It will be displayed in the sidebar. Recommended size: Square aspect ratio.</p>
            </div>
            <div className="md:col-span-2">
              <div className="flex items-center space-x-6">
                <div className="w-24 h-24 bg-slate-100 rounded-xl border-2 border-dashed border-slate-300 flex items-center justify-center overflow-hidden relative group shrink-0">
                  {logo ? (
                    <img src={logo} alt="Company Logo" className="w-full h-full object-contain p-2" />
                  ) : (
                    <span className="text-3xl font-bold text-slate-300">{tempName.charAt(0)}</span>
                  )}
                </div>
                
                <div className="space-y-3">
                  <div className="flex space-x-3">
                    <button 
                      onClick={() => fileInputRef.current?.click()}
                      className="px-4 py-2 bg-white border border-slate-300 text-slate-700 font-medium text-sm rounded-lg hover:bg-slate-50 transition-colors flex items-center"
                    >
                      <Upload className="w-4 h-4 mr-2" />
                      Upload New
                    </button>
                    {logo && (
                      <button 
                        onClick={handleRemoveLogo}
                        className="px-4 py-2 bg-red-50 text-red-600 border border-red-100 font-medium text-sm rounded-lg hover:bg-red-100 transition-colors flex items-center"
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Remove
                      </button>
                    )}
                  </div>
                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    onChange={handleLogoUpload} 
                    className="hidden" 
                    accept="image/*"
                  />
                  <p className="text-xs text-slate-400">JPG, PNG, or GIF. Max 2MB.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};