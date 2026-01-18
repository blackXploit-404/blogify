import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { blogAPI } from './api';
import { useAuth } from './AuthContext';
import { ArrowLeft, User, Calendar, Trash2, Loader2 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

const BlogDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    fetchBlog();
  }, [id]);

  const fetchBlog = async () => {
    try {
      setLoading(true);
      const response = await blogAPI.getBlog(id);
      setBlog(response.data.blog || response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load blog');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Delete this blog permanently?')) return;

    setDeleting(true);
    try {
      await blogAPI.deleteBlog(id);
      navigate('/blogs');
    } catch (err) {
      setError('Failed to delete blog');
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#fafafa]">
        <Loader2 className="animate-spin text-zinc-400" size={40} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#fafafa] px-4">
        <p className="text-red-600 text-lg font-semibold mb-4">{error}</p>
        <button
          onClick={() => navigate('/blogs')}
          className="flex items-center gap-2 px-6 py-3 bg-black text-white rounded-lg hover:bg-zinc-800 transition-colors"
        >
          <ArrowLeft size={18} /> Back to blogs
        </button>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#fafafa]">
        <p className="text-zinc-400">Blog not found</p>
      </div>
    );
  }

  const isAuthor = user && (blog.author?._id === user.id || user.role === 'admin');

  return (
    <div className="min-h-screen bg-[#fafafa] text-zinc-900 selection:bg-black selection:text-white">
      {/* Subtle Grid Pattern */}
      <div className="fixed inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none"></div>

      <div className="relative">
        {/* Back Button */}
        <div className="max-w-4xl mx-auto px-6 pt-8">
          <button
            onClick={() => navigate('/blogs')}
            className="flex items-center gap-2 text-zinc-600 hover:text-zinc-900 transition-colors mb-8 group"
          >
            <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
            <span className="font-semibold">Back to blogs</span>
          </button>
        </div>

        {/* Featured Image */}
        {blog.imageUrl && (
          <div className="w-full h-96 bg-zinc-100 overflow-hidden">
            <img 
              src={blog.imageUrl} 
              alt={blog.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* Content */}
        <article className="max-w-4xl mx-auto px-6 py-16">
          {/* Header */}
          <div className="mb-12">
            <h1 className="text-5xl md:text-6xl font-black text-zinc-900 leading-tight mb-8">
              {blog.title}
            </h1>

            {/* Meta Information */}
            <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-8 mb-8 pb-8 border-b border-zinc-200">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-zinc-200 flex items-center justify-center">
                  <User size={18} className="text-zinc-600" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-zinc-900">
                    {blog.author?.name || 'Anonymous'}
                  </p>
                  <p className="text-xs text-zinc-500">{blog.author?.email}</p>
                </div>
              </div>

              <div className="flex items-center gap-2 text-zinc-500">
                <Calendar size={18} />
                <span className="text-sm font-medium">
                  {blog.createdAt ? new Date(blog.createdAt).toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  }) : 'Draft'}
                </span>
              </div>

              {isAuthor && (
                <button
                  onClick={handleDelete}
                  disabled={deleting}
                  className="ml-auto flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-all disabled:opacity-50"
                >
                  <Trash2 size={18} />
                  <span className="text-sm font-semibold">{deleting ? 'Deleting...' : 'Delete'}</span>
                </button>
              )}
            </div>

            {/* Excerpt */}
            {blog.excerpt && (
              <p className="text-lg text-zinc-600 leading-relaxed font-medium italic">
                {blog.excerpt}
              </p>
            )}
          </div>

          {/* Tags */}
          {blog.tags && blog.tags.length > 0 && (
            <div className="flex flex-wrap gap-3 mb-12">
              {blog.tags.map((tag, i) => (
                <span
                  key={i}
                  className="text-xs font-bold uppercase tracking-widest bg-zinc-100 text-zinc-600 px-4 py-2 rounded-full hover:bg-zinc-900 hover:text-white transition-all"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}

          {/* Markdown Content */}
          <div className="prose prose-lg max-w-none prose-zinc mb-16">
            <div className="text-zinc-800 leading-relaxed space-y-4">
              <ReactMarkdown
                components={{
                  h1: ({ node, ...props }) => (
                    <h1 className="text-4xl font-black text-zinc-900 mt-8 mb-4" {...props} />
                  ),
                  h2: ({ node, ...props }) => (
                    <h2 className="text-3xl font-bold text-zinc-900 mt-8 mb-4" {...props} />
                  ),
                  h3: ({ node, ...props }) => (
                    <h3 className="text-2xl font-bold text-zinc-900 mt-6 mb-3" {...props} />
                  ),
                  h4: ({ node, ...props }) => (
                    <h4 className="text-xl font-bold text-zinc-900 mt-6 mb-3" {...props} />
                  ),
                  p: ({ node, ...props }) => (
                    <p className="text-zinc-700 leading-relaxed mb-4" {...props} />
                  ),
                  a: ({ node, ...props }) => (
                    <a className="text-blue-600 hover:text-blue-800 underline transition-colors" {...props} />
                  ),
                  strong: ({ node, ...props }) => (
                    <strong className="font-bold text-zinc-900" {...props} />
                  ),
                  em: ({ node, ...props }) => (
                    <em className="italic text-zinc-700" {...props} />
                  ),
                  ul: ({ node, ...props }) => (
                    <ul className="list-disc list-inside space-y-2 my-4 text-zinc-700" {...props} />
                  ),
                  ol: ({ node, ...props }) => (
                    <ol className="list-decimal list-inside space-y-2 my-4 text-zinc-700" {...props} />
                  ),
                  li: ({ node, ...props }) => (
                    <li className="ml-4" {...props} />
                  ),
                  blockquote: ({ node, ...props }) => (
                    <blockquote className="border-l-4 border-zinc-300 pl-6 py-2 my-4 text-zinc-600 italic bg-zinc-50 py-4" {...props} />
                  ),
                  code: ({ node, inline, ...props }) => 
                    inline ? (
                      <code className="bg-zinc-100 px-2 py-1 rounded font-mono text-sm text-red-600" {...props} />
                    ) : (
                      <code className="bg-zinc-900 text-white px-4 py-2 rounded block my-4 overflow-x-auto font-mono text-sm" {...props} />
                    ),
                  pre: ({ node, ...props }) => (
                    <pre className="bg-zinc-900 text-white px-6 py-4 rounded-lg overflow-x-auto my-4" {...props} />
                  ),
                  img: ({ node, ...props }) => (
                    <img className="max-w-full h-auto rounded-lg my-6 shadow-md" {...props} />
                  ),
                  hr: ({ node, ...props }) => (
                    <hr className="my-8 border-zinc-200" {...props} />
                  ),
                  table: ({ node, ...props }) => (
                    <table className="w-full border-collapse border border-zinc-300 my-4" {...props} />
                  ),
                  th: ({ node, ...props }) => (
                    <th className="border border-zinc-300 bg-zinc-100 p-2 text-left font-bold" {...props} />
                  ),
                  td: ({ node, ...props }) => (
                    <td className="border border-zinc-300 p-2" {...props} />
                  ),
                }}
              >
                {blog.content}
              </ReactMarkdown>
            </div>
          </div>

          {/* Footer */}
          <div className="pt-8 border-t border-zinc-200">
            <button
              onClick={() => navigate('/blogs')}
              className="flex items-center gap-2 px-6 py-3 bg-black text-white rounded-lg hover:bg-zinc-800 transition-all hover:shadow-lg"
            >
              <ArrowLeft size={18} />
              <span className="font-semibold">Back to all blogs</span>
            </button>
          </div>
        </article>
      </div>
    </div>
  );
};

export default BlogDetail;
