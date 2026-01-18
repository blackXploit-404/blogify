import React, { useState, useRef } from 'react';
import { blogAPI, uploadAPI } from './api';
import { Type, Image, Hash, FileText, Send, CheckCircle, Upload, X } from 'lucide-react';
import EasyMDE from 'easymde';
import 'easymde/dist/easymde.min.css';

const INITIAL_STATE = {
  title: '',
  content: '',
  tags: '',
  published: false,
  imageUrl: '',
  excerpt: ''
};

const CreateBlog = ({ onBlogCreated }) => {
  const [formData, setFormData] = useState(INITIAL_STATE);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState('');
  const editorRef = useRef(null);
  const [editor, setEditor] = useState(null);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setError('');
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('Please select an image file');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError('Image size must be less than 5MB');
      return;
    }

    setUploading(true);
    setError('');

    try {
      const formDataObj = new FormData();
      formDataObj.append('image', file);

      const response = await uploadAPI.uploadImage(formDataObj);
      setFormData(prev => ({ ...prev, imageUrl: response.data.imageUrl }));
      setPreview(response.data.imageUrl);
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Image upload failed');
    } finally {
      setUploading(false);
    }
  };

  const removeImage = () => {
    setFormData(prev => ({ ...prev, imageUrl: '' }));
    setPreview('');
  };

  const initializeEditor = () => {
    if (editorRef.current && !editor) {
      const mdeInstance = new EasyMDE({
        element: editorRef.current,
        spellChecker: false,
        autoDownloadFontAwesome: false,
        placeholder: 'Write your markdown content here...',
        initialValue: formData.content,
        toolbar: ['bold', 'italic', 'heading', '|', 'quote', 'unordered-list', 'ordered-list', '|', 'link', 'image', '|', 'preview', 'side-by-side', 'fullscreen', '|', 'guide'],
      });
      setEditor(mdeInstance);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);

    try {
      const content = editor ? editor.value() : formData.content;
      const blogData = {
        ...formData,
        content: content,
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(Boolean)
      };
      await blogAPI.createBlog(blogData);
      setFormData(INITIAL_STATE);
      if (editor) editor.value('');
      setSuccess(true);
      if (onBlogCreated) onBlogCreated();
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto my-10 p-6 bg-white rounded-xl shadow-lg border border-gray-100">
      <header className="mb-8 border-b pb-4">
        <h2 className="text-3xl font-bold text-gray-800">Draft a New Story</h2>
        <p className="text-gray-500">Share your thoughts with the world.</p>
      </header>

      {/* Status Messages */}
      {error && <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg border border-red-200">{error}</div>}
      {success && <div className="mb-4 p-3 bg-green-50 text-green-600 rounded-lg border border-green-200 flex items-center"><CheckCircle className="w-5 h-5 mr-2" /> Blog published successfully!</div>}

      <form onSubmit={handleSubmit} className="space-y-6">

        {/* Title Input */}
        <div className="relative">
          <label className="text-sm font-semibold text-gray-700 block mb-1">Blog Title</label>
          <div className="flex items-center">
            <Type className="absolute ml-3 text-gray-400 w-5 h-5" />
            <input
              type="text"
              name="title"
              placeholder="e.g. Mastering React Hooks"
              value={formData.title}
              onChange={handleChange}
              required
              className="w-full pl-10 pr-4 py-3 bg-white text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all placeholder:text-gray-500"
            />
          </div>
        </div>

        {/* Image Upload */}
        <div>
          <label className="text-sm font-semibold text-gray-700 block mb-3">Featured Image</label>
          
          {preview ? (
            <div className="relative group">
              <img src={preview} alt="Preview" className="w-full h-64 object-cover rounded-lg shadow-md" />
              <button
                type="button"
                onClick={removeImage}
                className="absolute top-2 right-2 bg-red-600 hover:bg-red-700 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="w-5 h-5" />
              </button>
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 rounded-lg flex items-center justify-center transition-opacity">
                <span className="text-white text-sm font-semibold">Click X to remove</span>
              </div>
            </div>
          ) : (
            <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <Upload className="w-10 h-10 text-gray-400 mb-2" />
                <p className="text-sm text-gray-600 font-medium">Click to upload image</p>
                <p className="text-xs text-gray-500 mt-1">PNG, JPG, JPEG up to 5MB</p>
              </div>
              <input
                type="file"
                onChange={handleImageUpload}
                disabled={uploading}
                accept="image/*"
                className="hidden"
              />
            </label>
          )}

          {uploading && (
            <div className="mt-2 flex items-center gap-2 text-blue-600 text-sm">
              <div className="animate-spin">
                <Upload className="w-4 h-4" />
              </div>
              Uploading image...
            </div>
          )}
        </div>
          {/* Tags */}
          <div>
            <label className="text-sm font-semibold text-gray-700 block mb-1">Tags (Comma separated)</label>
            <div className="flex items-center">
              <Hash className="absolute ml-3 text-gray-400 w-5 h-5" />
              <input
                type="text"
                name="tags"
                placeholder="tech, tutorial, webdev"
                value={formData.tags}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-2 bg-white text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-sm placeholder:text-gray-500"
              />
            </div>
          </div>

        {/* Excerpt */}
        <div>
          <label className="text-sm font-semibold text-gray-700 block mb-1">Short Excerpt</label>
          <textarea
            name="excerpt"
            placeholder="A brief summary for the card view..."
            value={formData.excerpt}
            onChange={handleChange}
            rows={2}
            className="w-full p-4 bg-white text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all resize-none placeholder:text-gray-500"
          />
          <p className="text-xs text-gray-400 mt-1 text-right">{formData.excerpt.length} characters</p>
        </div>

        {/* Content Body - Markdown Editor */}
        <div>
          <label className="text-sm font-semibold text-gray-700 block mb-1">Content (Markdown)</label>
          <div 
            onFocus={initializeEditor}
            className="rounded-lg border border-gray-300 overflow-hidden"
          >
            <textarea ref={editorRef} defaultValue={formData.content}></textarea>
          </div>
          <p className="text-xs text-gray-400 mt-2">Supports markdown formatting: **bold**, *italic*, # headings, etc.</p>
        </div>

        <div className="flex items-center justify-between pt-4 border-t">
          <label className="flex items-center cursor-pointer group">
            <input
              type="checkbox"
              name="published"
              checked={formData.published}
              onChange={handleChange}
              className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="ml-2 text-sm text-gray-600 group-hover:text-gray-800 transition-colors">Publish immediately</span>
          </label>

          <button
            type="submit"
            disabled={loading}
            className={`flex items-center px-8 py-3 rounded-lg font-bold text-white shadow-md transition-all active:scale-95 ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 hover:shadow-lg hover:bg-green-600'
              }`}
          >
            {loading ? (
              'Processing...'
            ) : (
              <>
                  Create Blog Post
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateBlog;