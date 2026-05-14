import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import config from '../config';
import Navbar from '../components/Navbar';

const CreateEvent = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    time: '',
    location: '',
    category: 'GENERAL',
    department: 'All Departments'
  });
  const [coverImage, setCoverImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  const categories = ['ACADEMIC', 'WORKSHOP', 'SOCIAL', 'CONFERENCE', 'SPORTS', 'TECHNICAL', 'GENERAL'];
  const departments = ['All Departments', 'Computer Science', 'Engineering', 'Medicine', 'Arts & Humanities', 'Business School', 'Law', 'Sciences', 'Social Sciences'];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleDescriptionChange = (value) => {
    setFormData({ ...formData, description: value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCoverImage(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.description || formData.description === '<p><br></p>') {
      return toast.error('Description is required');
    }
    if (!coverImage) {
      return toast.error('Please upload an event cover image');
    }
    setLoading(true);

    try {
      const data = new FormData();
      Object.keys(formData).forEach(key => {
        data.append(key, formData[key]);
      });
      if (coverImage) {
        data.append('coverImage', coverImage);
      }

      const response = await axios.post(`${config.API_BASE_URL}/events`, data, {
        withCredentials: true,
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      if (response.data?.success || response.status === 201) {
        toast.success('Event submitted for approval!');
        navigate('/');
      }
    } catch (error) {
      console.error('Create event error:', error);
      toast.error(error.response?.data?.message || 'Failed to create event');
    } finally {
      setLoading(false);
    }
  };

  const modules = {
    toolbar: [
      [{ 'header': [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'list': 'ordered' }, { 'list': 'bullet' }],
      ['link', 'clean']
    ],
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] pb-20">
      <Navbar />

      {/* Premium Header */}
      <div className="bg-[#0A2540] px-8 py-12 relative overflow-hidden mb-12">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#FFD700]/5 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2" />
        <div className="max-w-[800px] mx-auto relative">
          <Link to="/" className="text-[#FFD700] text-[10px] font-bold uppercase tracking-[0.2em] hover:opacity-80 transition-opacity flex items-center gap-2 mb-4">
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
            Back to Home
          </Link>
          <h1 className="text-4xl font-extrabold text-white tracking-tight mb-2">Create New Event</h1>
          <p className="text-white/50 font-serif italic text-sm">
            Please provide comprehensive details for institutional review.
          </p>
        </div>
      </div>

      <div className="max-w-[800px] mx-auto px-8">
        <form onSubmit={handleSubmit} className="bg-white border border-gray-100 rounded-lg shadow-sm overflow-hidden">
          {/* Cover Image Upload Area */}
          <div className="relative h-64 bg-gray-50 border-b border-gray-100 group cursor-pointer overflow-hidden">
            {previewUrl ? (
              <>
                <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <p className="text-white text-xs font-bold uppercase tracking-widest">Change Cover Image</p>
                </div>
              </>
            ) : (
              <div className="absolute inset-0 flex flex-col items-center justify-center space-y-3">
                <div className="w-12 h-12 bg-white rounded-full shadow-sm flex items-center justify-center">
                  <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                </div>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Upload Event Cover Image</p>
              </div>
            )}
            <input 
              type="file" 
              onChange={handleFileChange}
              className="absolute inset-0 opacity-0 cursor-pointer"
              accept="image/*"
              required={!previewUrl}
            />
          </div>

          <div className="p-10 space-y-8">
            {/* Basic Info Section */}
            <div className="space-y-6">
              <div>
                <label htmlFor="title" className="block text-[10px] font-bold text-[#0A2540] uppercase tracking-widest mb-3">Event Title</label>
                <input
                  id="title"
                  type="text"
                  required
                  placeholder="e.g. International Symposium on Quantum Artificial Intelligence"
                  value={formData.title}
                  onChange={handleChange}
                  className="w-full border-b-2 border-gray-100 py-3 text-[15px] font-bold text-[#0A2540] bg-transparent focus:outline-none focus:border-[#FFD700] transition-colors placeholder:text-gray-300 placeholder:font-normal"
                />
              </div>

              <div className="quill-container">
                <label className="block text-[10px] font-bold text-[#0A2540] uppercase tracking-widest mb-3">Institutional Description</label>
                <ReactQuill 
                  theme="snow"
                  value={formData.description}
                  onChange={handleDescriptionChange}
                  modules={modules}
                  placeholder="Provide a detailed overview of the event's objectives, agenda, and speakers..."
                  className="bg-gray-50/50 rounded-lg overflow-hidden border border-gray-100"
                />
                <style>{`
                  .quill-container .ql-toolbar { border: none; border-bottom: 1px solid #f3f4f6; background: #fff; }
                  .quill-container .ql-container { border: none; min-height: 200px; font-family: inherit; font-size: 14px; }
                  .quill-container .ql-editor { line-height: 1.6; color: #4b5563; }
                  .quill-container .ql-editor.ql-blank::before { color: #d1d5db; font-style: normal; }
                `}</style>
              </div>
            </div>

            {/* Categorization Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <label htmlFor="category" className="block text-[10px] font-bold text-[#0A2540] uppercase tracking-widest mb-3">Category</label>
                <select
                  id="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full border-b-2 border-gray-100 py-3 text-[13px] font-bold text-[#0A2540] bg-transparent focus:outline-none focus:border-[#FFD700] transition-colors appearance-none cursor-pointer"
                >
                  {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                </select>
              </div>

              <div>
                <label htmlFor="department" className="block text-[10px] font-bold text-[#0A2540] uppercase tracking-widest mb-3">Institutional Department</label>
                <select
                  id="department"
                  value={formData.department}
                  onChange={handleChange}
                  className="w-full border-b-2 border-gray-100 py-3 text-[13px] font-bold text-[#0A2540] bg-transparent focus:outline-none focus:border-[#FFD700] transition-colors appearance-none cursor-pointer"
                >
                  {departments.map(dept => <option key={dept} value={dept}>{dept}</option>)}
                </select>
              </div>
            </div>

            {/* Logistics Section */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div>
                <label htmlFor="date" className="block text-[10px] font-bold text-[#0A2540] uppercase tracking-widest mb-3">Date</label>
                <input
                  id="date"
                  type="date"
                  required
                  value={formData.date}
                  onChange={handleChange}
                  className="w-full border-b-2 border-gray-100 py-3 text-[13px] font-bold text-[#0A2540] bg-transparent focus:outline-none focus:border-[#FFD700] transition-colors"
                />
              </div>

              <div>
                <label htmlFor="time" className="block text-[10px] font-bold text-[#0A2540] uppercase tracking-widest mb-3">Start Time</label>
                <input
                  id="time"
                  type="time"
                  required
                  value={formData.time}
                  onChange={handleChange}
                  className="w-full border-b-2 border-gray-100 py-3 text-[13px] font-bold text-[#0A2540] bg-transparent focus:outline-none focus:border-[#FFD700] transition-colors"
                />
              </div>

              <div>
                <label htmlFor="location" className="block text-[10px] font-bold text-[#0A2540] uppercase tracking-widest mb-3">Location/Venue</label>
                <input
                  id="location"
                  type="text"
                  required
                  placeholder="e.g. Grand Auditorium"
                  value={formData.location}
                  onChange={handleChange}
                  className="w-full border-b-2 border-gray-100 py-3 text-[13px] font-bold text-[#0A2540] bg-transparent focus:outline-none focus:border-[#FFD700] transition-colors placeholder:text-gray-300 placeholder:font-normal"
                />
              </div>
            </div>

            {/* Submit Area */}
            <div className="pt-10 flex flex-col items-center">
              <button
                type="submit"
                disabled={loading}
                className="w-full max-w-[300px] bg-[#0A2540] hover:bg-gray-900 text-white text-[11px] font-bold uppercase tracking-widest py-4 transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center rounded shadow-lg hover:shadow-xl"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  'Publish Event Application'
                )}
              </button>
              <p className="mt-4 text-[9px] text-gray-400 font-bold uppercase tracking-widest">Subject to Institutional Review</p>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateEvent;
