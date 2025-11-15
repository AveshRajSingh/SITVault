import React, { useState, useEffect } from 'react';
import { FaTimes, FaSpinner, FaPlus, FaFilePdf, FaUpload } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { createResource, updateResource } from '../../services/resourceApi';
import { lockBodyScroll, unlockBodyScroll } from '../../utils/scrollLock';

const ResourceFormModal = ({ isOpen, onClose, onResourceCreated, initialData }) => {
  const [loading, setLoading] = useState(false);
  const [pdfFile, setPdfFile] = useState(null);
  const [pdfFileName, setPdfFileName] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    link: '',
    category: 'Career Guides',
    tags: '',
    thumbnail: '',
  });

  const isEditMode = !!initialData;
  const categories = ["Career Guides", "Roadmaps", "Playlists", "Notes & PYQs", "Syllabus"];
  const isPDFCategory = formData.category === 'Notes & PYQs' || formData.category === 'Syllabus';

  useEffect(() => {
    if (isOpen) {
      lockBodyScroll();
      if (isEditMode) {
        setFormData({
          title: initialData.title || '',
          description: initialData.description || '',
          link: initialData.link || '',
          category: initialData.category || 'Career Guides',
          tags: initialData.tags ? initialData.tags.join(', ') : '',
          thumbnail: initialData.thumbnail || '',
        });
      } else {
        setFormData({
          title: '',
          description: '',
          link: '',
          category: 'Career Guides',
          tags: '',
          thumbnail: '',
        });
        setPdfFile(null);
        setPdfFileName('');
      }
    } else {
      unlockBodyScroll();
    }
    return () => unlockBodyScroll();
  }, [isOpen, initialData, isEditMode]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear PDF when category changes to non-PDF category
    if (name === 'category' && value !== 'Notes & PYQs' && value !== 'Syllabus') {
      setPdfFile(null);
      setPdfFileName('');
    }
  };

  const handlePDFChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (file.type !== 'application/pdf') {
        toast.error('Please select a PDF file');
        return;
      }
      
      // Validate file size (5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('PDF file size must be less than 5MB');
        return;
      }
      
      setPdfFile(file);
      setPdfFileName(file.name);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isEditMode) {
        // For edit mode, send JSON data (no PDF upload allowed)
        const updateData = {
          title: formData.title,
          description: formData.description,
          category: formData.category,
          tags: formData.tags,
          thumbnail: formData.thumbnail,
        };

        // Only include link if it's not a PDF category or if it exists
        if (!isPDFCategory && formData.link) {
          updateData.link = formData.link;
        }

        await updateResource(initialData._id, updateData);
        toast.success('Resource updated successfully!');
      } else {
        // For create mode, validate and send FormData
        // Validate PDF for PDF categories
        if (isPDFCategory && !pdfFile) {
          toast.error('Please upload a PDF file');
          setLoading(false);
          return;
        }

        // Validate link for non-PDF categories
        if (!isPDFCategory && !formData.link) {
          toast.error('Please provide a resource link');
          setLoading(false);
          return;
        }

        const formDataToSend = new FormData();
        formDataToSend.append('title', formData.title);
        formDataToSend.append('description', formData.description);
        formDataToSend.append('category', formData.category);
        formDataToSend.append('tags', formData.tags);
        if (formData.thumbnail) {
          formDataToSend.append('thumbnail', formData.thumbnail);
        }
        
        if (isPDFCategory && pdfFile) {
          formDataToSend.append('pdf', pdfFile);
        } else if (!isPDFCategory && formData.link) {
          formDataToSend.append('link', formData.link);
        }

        await createResource(formDataToSend);
        toast.success('Resource submitted for Approval!');
      }
      
      onClose();
      if (onResourceCreated) onResourceCreated();

    } catch (error) {
      console.error('Error submitting resource:', error);
      toast.error(error || 'Failed to submit resource.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 animate-fade-in">
      <div className="bg-white md:rounded-xl shadow-2xl w-full md:max-w-lg lg:max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white z-20 px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-gray-800">{isEditMode ? 'Edit Resource' : 'Submit a New Resource for Approval'}</h3>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
              <FaTimes size={20} />
            </button>
          </div>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-3 md:p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Title</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded-lg"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows={4}
              className="w-full p-2 border border-gray-300 rounded-lg"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">Category</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded-lg"
              required
              disabled={isEditMode && isPDFCategory}
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
            {isEditMode && isPDFCategory && (
              <p className="text-xs text-gray-500 mt-1">Category cannot be changed for PDF resources</p>
            )}
          </div>

          {/* Conditional rendering: PDF upload for Notes & PYQs and Syllabus */}
          {isPDFCategory ? (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Upload PDF (Max 5MB)
              </label>
              {isEditMode ? (
                <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <FaFilePdf className="text-red-500" size={24} />
                    <span className="text-sm text-gray-700">PDF already uploaded</span>
                  </div>
                  {initialData.link && (
                    <a
                      href={initialData.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-orange-600 hover:text-orange-700 flex items-center gap-1"
                    >
                      <FaFilePdf />
                      View PDF
                    </a>
                  )}
                  <p className="text-xs text-gray-500 mt-2">
                    PDF cannot be changed after upload. Delete and create a new resource if needed.
                  </p>
                </div>
              ) : (
                <div className="relative">
                  <input
                    type="file"
                    accept=".pdf"
                    onChange={handlePDFChange}
                    className="hidden"
                    id="pdf-upload"
                  />
                  <label
                    htmlFor="pdf-upload"
                    className="flex items-center justify-center gap-2 w-full p-4 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-orange-500 hover:bg-orange-50 transition-colors"
                  >
                    {pdfFileName ? (
                      <>
                        <FaFilePdf className="text-red-500" size={24} />
                        <span className="text-sm text-gray-700">{pdfFileName}</span>
                      </>
                    ) : (
                      <>
                        <FaUpload className="text-gray-400" size={20} />
                        <span className="text-sm text-gray-600">Click to upload PDF</span>
                      </>
                    )}
                  </label>
                </div>
              )}
            </div>
          ) : (
            <div>
              <label className="block text-sm font-medium text-gray-700">Link (URL)</label>
              <input
                type="url"
                name="link"
                value={formData.link}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded-lg"
                required={!isPDFCategory}
              />
            </div>
          )}
          
          <div>
            <label className="block text-sm font-medium text-gray-700">Tags (comma-separated)</label>
            <input
              type="text"
              name="tags"
              value={formData.tags}
              onChange={handleInputChange}
              placeholder="e.g., react, javascript, tutorial"
              className="w-full p-2 border border-gray-300 rounded-lg"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Thumbnail URL (optional)</label>
            <input
              type="url"
              name="thumbnail"
              value={formData.thumbnail}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded-lg"
            />
          </div>
          
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <FaSpinner className="animate-spin" />
                  <span>Submitting...</span>
                </>
              ) : (
                <>
                  <span>{isEditMode ? 'Update Resource' : 'Submit Resource'}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ResourceFormModal;