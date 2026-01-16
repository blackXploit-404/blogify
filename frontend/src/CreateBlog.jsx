import React, { useState } from 'react';
import { blogAPI } from './api';
import { Type, Image, Hash, FileText, Send, CheckCircle } from 'lucide-react'; // Icons

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

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setError('');
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);

    try {
      const blogData = {
        ...formData,
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(Boolean)
      };
      await blogAPI.createBlog(blogData);
      setFormData(INITIAL_STATE);
      setSuccess(true);
      if (onBlogCreated) onBlogCreated();
      setTimeout(() => setSuccess(false), 3000); // Reset success message
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
              className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all"
            />
          </div>
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
                className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all text-sm"
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
            className="w-full p-4 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all resize-none"
          />
          <p className="text-xs text-gray-400 mt-1 text-right">{formData.excerpt.length} characters</p>
        </div>

        {/* Content Body */}
        <div>
          <label className="text-sm font-semibold text-gray-700 block mb-1">Content</label>
          <textarea
            name="content"
            placeholder="Tell your story..."
            value={formData.content}
            onChange={handleChange}
            required
            rows={12}
            className="w-full p-4 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all font-mono text-sm"
          />
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