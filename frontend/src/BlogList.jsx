import React, { useState, useEffect } from 'react';
import { blogAPI } from './api';
import { useAuth } from './AuthContext';
import { Plus, Trash2, Calendar, User, ChevronRight, ArrowRight, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const BlogList = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      const response = await blogAPI.getAllBlogs();
      // FIX: Check if data is nested inside 'blogs' or directly in 'data'
      const blogData = response.data.blogs || response.data;
      setBlogs(Array.isArray(blogData) ? blogData : []);
    } catch (err) {
      setError('Database synchronization failed. Please check your connection.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const deleteBlog = async (id) => {
    if (window.confirm('Archive this entry permanently?')) {
      try {
        await blogAPI.deleteBlog(id);
        setBlogs(blogs.filter(blog => blog._id !== id));
      } catch (err) {
        alert('Sync error: Could not delete record');
      }
    }
  };

 

  const SkeletonCard = () => (
    <div className="bg-white border border-zinc-100 p-8 rounded-3xl animate-pulse">
      <div className="flex justify-between mb-6">
        <div className="h-3 w-20 bg-zinc-100 rounded"></div>
        <div className="h-3 w-12 bg-zinc-100 rounded"></div>
      </div>
      <div className="h-8 bg-zinc-100 rounded w-3/4 mb-4"></div>
      <div className="h-4 bg-zinc-100 rounded w-full mb-2"></div>
      <div className="h-4 bg-zinc-100 rounded w-2/3 mb-8"></div>
      <div className="flex gap-2">
        <div className="h-6 w-12 bg-zinc-50 rounded-full"></div>
        <div className="h-6 w-12 bg-zinc-50 rounded-full"></div>
      </div>
    </div>
  );

  if (loading) return (
    <div className="max-w-6xl mx-auto px-6 py-20">
      <div className="flex justify-between items-end mb-16">
        <div className="space-y-4">
          <div className="h-12 w-64 bg-zinc-100 rounded-lg animate-pulse"></div>
          <div className="h-1 w-12 bg-black"></div>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {[1, 2, 3, 4, 5, 6].map(i => <SkeletonCard key={i} />)}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen min-w-screen bg-[#fafafa] text-zinc-900 selection:bg-black selection:text-white pb-20">
      {/* Subtle Grid Pattern */}
      <div className="fixed inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none"></div>

      <div className="relative max-w-6xl mx-auto px-6 pt-20">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-16">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.5em] text-zinc-400 mb-2">System.Archive</p>
            <h1 className="text-6xl md:text-7xl font-black tracking-tighter italic uppercase">
              Latest <span className="text-zinc-400">Blogs</span>
            </h1>
            <div className="h-1.5 w-20 bg-black mt-4"></div>
          </div>
        </div>

        {error && (
          <div className="mb-10 p-4 border-2 border-red-100 bg-red-50/50 backdrop-blur-md rounded-2xl text-red-600 text-[10px] font-black uppercase tracking-[0.2em] text-center">
            {error}
          </div>
        )}

        {blogs.length === 0 ? (
          <div className="py-40 text-center border-2 border-dashed border-zinc-200 rounded-[40px] bg-white/50 backdrop-blur-sm">
            <div className="inline-flex p-6 rounded-full bg-zinc-50 mb-4">
              <Plus className="text-zinc-300 rotate-45" size={32} />
            </div>
            <p className="text-zinc-400 font-bold uppercase tracking-widest text-xs">No records found in the current directory</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogs.map((blog, index) => (
              <article 
                key={blog._id} 
                onClick={() => navigate(`/blog/${blog._id}`)}
                className={`group relative bg-white border border-zinc-100 rounded-[32px] transition-all duration-500 hover:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.08)] hover:-translate-y-2 flex flex-col justify-between cursor-pointer overflow-hidden ${
                  index === 0 ? 'md:col-span-2 lg:col-span-2' : ''
                }`}
              >
                {/* Featured Image Banner */}
                {blog.imageUrl && (
                  <div className="w-full h-48 md:h-64 overflow-hidden bg-zinc-100">
                    <img 
                      src={blog.imageUrl} 
                      alt={blog.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                )}

                <div className="p-8">
                  <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-zinc-100 flex items-center justify-center">
                        <User size={10} className="text-zinc-400" />
                      </div>
                      <span className="text-[10px] font-black uppercase tracking-tighter text-zinc-400">
                        {blog.author?.name || 'Anonymous User'}
                      </span>
                    </div>
                    <div className="text-[10px] font-bold text-zinc-300">
                      {blog.createdAt ? new Date(blog.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Draft'}
                    </div>
                  </div>

                  <h3 className={`font-black text-zinc-900 leading-[1.1] mb-4 group-hover:text-zinc-600 transition-colors ${
                    index === 0 ? 'text-4xl md:text-5xl' : 'text-2xl'
                  }`}>
                    {blog.title}
                  </h3>
                  
                  <p className="text-zinc-500 leading-relaxed text-sm mb-8 line-clamp-3">
                    {blog.excerpt || (blog.content && blog.content.substring(0, 140).concat('...'))}
                  </p>
                </div>

                <div className="px-8 pb-8 space-y-6">
                  {blog.tags && blog.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {blog.tags.slice(0, 3).map((tag, i) => (
                        <span key={i} className="text-[9px] font-black uppercase tracking-[0.15em] bg-zinc-50 px-3 py-1.5 rounded-lg text-zinc-400 group-hover:bg-zinc-900 group-hover:text-white transition-all duration-300">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}
                    
                    
                    {user && (blog.author?._id === user.id || user.role === 'admin') && (
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteBlog(blog._id);
                        }}
                        className="p-2.5 text-zinc-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                        aria-label="Delete Blog"
                      >
                        <Trash2 size={16} />
                      </button>
                    )}
                  </div>

                {index === 0 && (
                  <div className="absolute -top-4 -right-4 w-24 h-24 bg-zinc-50 rounded-full -z-10 flex items-center justify-center group-hover:scale-110 transition-transform duration-700">
                     <span className="text-zinc-200 font-black text-4xl italic">01</span>
                  </div>
                )}
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default BlogList;