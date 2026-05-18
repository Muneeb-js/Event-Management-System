import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import config from '../config';
import Navbar from '../components/Navbar';

const EditEvent = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    time: '',
    location: '',
    category: '',
    department: ''
  });
  const [coverImage, setCoverImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [existingCoverImage, setExistingCoverImage] = useState('');

  const categories = ['ACADEMIC', 'WORKSHOP', 'SOCIAL', 'CONFERENCE', 'SPORTS', 'TECHNICAL', 'GENERAL'];
  const departments = [
    'All Departments', 
    'Computer Science', 
    'Engineering', 
    'Medicine', 
    'Arts & Humanities', 
    'Business School', 
    'Law', 
    'Sciences', 
    'Social Sciences'
  ];

  useEffect(() => {
    fetchEventDetails();
  }, [id]);

  const fetchEventDetails = async () => {
    try {
      const response = await axios.get(`${config.API_BASE_URL}/events/${id}`, {
        withCredentials: true
      });
      if (response.data?.success) {
        const event = response.data.data;
        setFormData({
          title: event.title,
          description: event.description,
          date: event.date.split('T')[0],
          time: event.time,
          location: event.location,
          category: event.category || 'GENERAL',
          department: event.department || 'All Departments'
        });
        setExistingCoverImage(event.coverImage);
      }
    } catch (error) {
      console.error('Error fetching event details:', error);
      toast.error('Failed to load event details');
      navigate('/dashboard');
    } finally {
      setInitialLoading(false);
    }
  };

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
    setLoading(true);

    try {
      const data = new FormData();
      Object.keys(formData).forEach(key => {
        data.append(key, formData[key]);
      });
      if (coverImage) {
        data.append('coverImage', coverImage);
      }

      const response = await axios.patch(`${config.API_BASE_URL}/events/${id}`, data, {
        withCredentials: true,
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      if (response.data?.success) {
        toast.success('Event updated successfully!');
        navigate(-1);
      }
    } catch (error) {
      console.error('Update event error:', error);
      toast.error(error.response?.data?.message || 'Failed to update event');
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

  if (initialLoading) {
    return (
      <div className="min-h-screen bg-[#F8F9FA] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0A2540]" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAFBFD] pb-24 text-[#0A2540] selection:bg-[#FFD700] selection:text-[#0A2540]">
      <Navbar />

      {/* Full-Width Premium Header */}
      <div className="bg-gradient-to-r from-[#030914] to-[#0A2540] py-16 relative overflow-hidden mb-12 shadow-md">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#FFD700]/5 rounded-full blur-[120px] translate-x-1/3 -translate-y-1/3" />
        <div className="max-w-[1400px] mx-auto px-8 relative z-10">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="text-[#FFD700] text-[10px] font-bold uppercase tracking-[0.25em] hover:text-white transition-colors flex items-center gap-2 mb-4 cursor-pointer"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
            Back to Event details
          </button>
          <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight leading-none mb-3">Edit Event Record</h1>
          <p className="text-white/60 font-serif italic text-sm md:text-base">
            Adjust coordinates, timings, and institutional contents of this campus scheduling registry.
          </p>
        </div>
      </div>

      {/* Full Screen Main Area */}
      <div className="max-w-[1400px] mx-auto px-8">
        <form onSubmit={handleSubmit} className="animate-fade-in-up">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            
            {/* Left Column: Image and Specifications (5 cols) */}
            <div className="lg:col-span-5 space-y-10">
              
              {/* Image Upload Banner */}
              <div className="bg-white border border-gray-100 rounded-md shadow-sm overflow-hidden">
                <div className="relative h-64 bg-gray-50 border-b border-gray-100 group cursor-pointer overflow-hidden">
                  <img 
                    src={previewUrl || existingCoverImage || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=1200&auto=format&fit=crop'} 
                    alt="Preview" 
                    className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-700 ease-out" 
                  />
                  <div className="absolute inset-0 bg-[#0A2540]/60 opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col items-center justify-center gap-3 backdrop-blur-sm">
                    <div className="w-12 h-12 rounded-full border border-white/20 bg-white/10 flex items-center justify-center text-white text-xl">
                      📸
                    </div>
                    <p className="text-white text-[10px] font-bold uppercase tracking-widest">Replace cover image</p>
                    <p className="text-white/50 text-[9px] font-medium tracking-normal">Supports JPEG, PNG, WEBP</p>
                  </div>
                  <input 
                    type="file" 
                    onChange={handleFileChange}
                    className="absolute inset-0 opacity-0 cursor-pointer z-10"
                    accept="image/*"
                  />
                </div>
                <div className="p-6 bg-gray-50/50">
                  <p className="text-[10px] font-semibold text-gray-400 leading-normal text-center">Drag and drop or click on the banner to upload a custom event cover photo.</p>
                </div>
              </div>

              {/* 01. Specification Card */}
              <div className="bg-white border border-gray-100 rounded-md p-8 shadow-sm space-y-6">
                <div className="flex items-center gap-3 border-b border-gray-50 pb-4">
                  <span className="text-[#B8860B] text-[10px] font-bold uppercase tracking-[0.2em]">01</span>
                  <h3 className="text-sm font-extrabold text-[#0A2540] uppercase tracking-wider">Specification Details</h3>
                </div>

                <div className="space-y-6">
                  <div>
                    <label htmlFor="title" className="block text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-2.5">Event Title</label>
                    <input
                      id="title"
                      type="text"
                      required
                      placeholder="e.g. International Symposium on Artificial Intelligence"
                      value={formData.title}
                      onChange={handleChange}
                      className="w-full border-b border-gray-200 py-3 text-[15px] font-bold text-[#0A2540] placeholder-gray-300 bg-transparent focus:outline-none focus:border-[#FFD700] transition-colors"
                    />
                  </div>

                  <div>
                    <label htmlFor="category" className="block text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-2.5">Event Category</label>
                    <div className="relative">
                      <select
                        id="category"
                        value={formData.category}
                        onChange={handleChange}
                        className="w-full border-b border-gray-200 py-3 text-sm font-semibold text-[#0A2540] bg-transparent focus:outline-none focus:border-[#FFD700] transition-colors appearance-none cursor-pointer"
                      >
                        {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                      </select>
                      <div className="absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                        ▼
                      </div>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="department" className="block text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-2.5">Academic Department</label>
                    <div className="relative">
                      <select
                        id="department"
                        value={formData.department}
                        onChange={handleChange}
                        className="w-full border-b border-gray-200 py-3 text-sm font-semibold text-[#0A2540] bg-transparent focus:outline-none focus:border-[#FFD700] transition-colors appearance-none cursor-pointer"
                      >
                        {departments.map(dept => <option key={dept} value={dept}>{dept}</option>)}
                      </select>
                      <div className="absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                        ▼
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Logistics and Editor (7 cols) */}
            <div className="lg:col-span-7 space-y-10">
              
              {/* 02. Logistics coordinates */}
              <div className="bg-white border border-gray-100 rounded-md p-8 shadow-sm space-y-6">
                <div className="flex items-center gap-3 border-b border-gray-50 pb-4">
                  <span className="text-[#B8860B] text-[10px] font-bold uppercase tracking-[0.2em]">02</span>
                  <h3 className="text-sm font-extrabold text-[#0A2540] uppercase tracking-wider">Logistical Coordinates</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label htmlFor="date" className="block text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-2.5">Date</label>
                    <input
                      id="date"
                      type="date"
                      required
                      value={formData.date}
                      onChange={handleChange}
                      className="w-full border-b border-gray-200 py-3 text-sm font-semibold text-[#0A2540] bg-transparent focus:outline-none focus:border-[#FFD700] transition-colors cursor-pointer"
                    />
                  </div>

                  <div>
                    <label htmlFor="time" className="block text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-2.5">Start Time</label>
                    <input
                      id="time"
                      type="time"
                      required
                      value={formData.time}
                      onChange={handleChange}
                      className="w-full border-b border-gray-200 py-3 text-sm font-semibold text-[#0A2540] bg-transparent focus:outline-none focus:border-[#FFD700] transition-colors cursor-pointer"
                    />
                  </div>

                  <div>
                    <label htmlFor="location" className="block text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-2.5">Venue Location</label>
                    <input
                      id="location"
                      type="text"
                      required
                      placeholder="e.g. Science Hall 4A"
                      value={formData.location}
                      onChange={handleChange}
                      className="w-full border-b border-gray-200 py-3 text-sm font-semibold text-[#0A2540] placeholder-gray-300 bg-transparent focus:outline-none focus:border-[#FFD700] transition-colors"
                    />
                  </div>
                </div>
              </div>

              {/* 03. Institutional Context Editor */}
              <div className="bg-white border border-gray-100 rounded-md p-8 shadow-sm space-y-6">
                <div className="flex items-center gap-3 border-b border-gray-50 pb-4">
                  <span className="text-[#B8860B] text-[10px] font-bold uppercase tracking-[0.2em]">03</span>
                  <h3 className="text-sm font-extrabold text-[#0A2540] uppercase tracking-wider">Detailed Description</h3>
                </div>

                <div className="quill-container">
                  <label className="block text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-3">Institutional Context</label>
                  <ReactQuill 
                    theme="snow"
                    value={formData.description}
                    onChange={handleDescriptionChange}
                    modules={modules}
                    placeholder="Draft detailed academic descriptions or schedules..."
                    className="bg-gray-50/20 rounded-sm overflow-hidden border border-gray-100 shadow-sm"
                  />
                  <style>{`
                    .quill-container .ql-toolbar { border: none; border-bottom: 1px solid #f3f4f6; background: #fafbfc; padding: 12px; }
                    .quill-container .ql-container { border: none; min-height: 220px; font-family: inherit; font-size: 14px; }
                    .quill-container .ql-editor { line-height: 1.7; color: #4b5563; }
                    .quill-container .ql-editor.ql-blank::before { color: #cbd5e1; font-style: normal; }
                    .quill-container .ql-snow.ql-toolbar button:hover,
                    .quill-container .ql-snow .ql-toolbar button:hover { color: #FFD700; fill: #FFD700; }
                  `}</style>
                </div>
              </div>

              {/* Action Buttons Panel */}
              <div className="bg-white border border-gray-100 rounded-md p-6 shadow-sm flex flex-col sm:flex-row gap-4 justify-end items-center">
                <button
                  type="button"
                  onClick={() => navigate(-1)}
                  className="w-full sm:w-auto px-10 py-3.5 border border-gray-200 text-gray-400 text-[10px] font-bold uppercase tracking-widest rounded-sm hover:bg-gray-50 hover:text-gray-600 transition-colors text-center cursor-pointer"
                >
                  Cancel Changes
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full sm:w-auto px-10 py-3.5 bg-[#0A2540] hover:bg-[#123E66] text-white text-[10px] font-bold uppercase tracking-widest transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed rounded-sm shadow-md hover:shadow-lg flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      Save Registry Record
                      <span>✓</span>
                    </>
                  )}
                </button>
              </div>

            </div>

          </div>
        </form>
      </div>
    </div>
  );
};

export default EditEvent;
