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
        navigate('/events');
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
            Back to previous page
          </button>
          <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight leading-none mb-3">Publish New Event</h1>
          <p className="text-white/60 font-serif italic text-sm md:text-base">
            Draft coordinates, scheduling registry, and detailed information to publish a new event.
          </p>
        </div>
      </div>

      {/* Full Screen Main Area */}
      <div className="max-w-[1400px] mx-auto px-8">
        <form onSubmit={handleSubmit} className="animate-fade-in-up">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            
            {/* Left Column: Image and Specifications (5 cols) */}
            <div className="lg:col-span-5 space-y-10">
              
              {/* Premium Image Upload Banner */}
              <div className="bg-white border border-gray-100 rounded-md shadow-sm overflow-hidden">
                <div className="relative h-64 bg-gray-50 border-b border-gray-100 group cursor-pointer overflow-hidden">
                  {previewUrl ? (
                    <>
                      <img src={previewUrl} alt="Preview" className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-700 ease-out" />
                      <div className="absolute inset-0 bg-[#0A2540]/60 opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col items-center justify-center gap-3 backdrop-blur-sm">
                        <div className="w-12 h-12 rounded-full border border-white/20 bg-white/10 flex items-center justify-center text-white text-xl">
                          📸
                        </div>
                        <p className="text-white text-[10px] font-bold uppercase tracking-widest">Replace cover image</p>
                      </div>
                    </>
                  ) : (
                    <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center bg-gradient-to-b from-gray-50/50 to-gray-50 border-2 border-dashed border-gray-200 group-hover:border-[#FFD700]/50 transition-all duration-300">
                      <div className="w-14 h-14 bg-white rounded-full shadow-sm border border-gray-50 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                        <svg className="w-6 h-6 text-gray-400 group-hover:text-[#B8860B] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <p className="text-[#0A2540] text-[10px] font-bold uppercase tracking-widest mb-1.5">Select Event Banner</p>
                      <p className="text-gray-400 text-[9px] font-medium leading-normal">Requires high resolution cover photo<br />(Formats: JPEG, PNG, WEBP)</p>
                    </div>
                  )}
                  <input 
                    type="file" 
                    onChange={handleFileChange}
                    className="absolute inset-0 opacity-0 cursor-pointer z-10"
                    accept="image/*"
                    required={!previewUrl}
                  />
                </div>
                <div className="p-6 bg-gray-50/50">
                  <p className="text-[10px] font-semibold text-gray-400 leading-normal text-center">Uploading a high fidelity cover image creates strong engagement on search feeds.</p>
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
                  <label className="block text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-3">Institutional Context Description</label>
                  <ReactQuill 
                    theme="snow"
                    value={formData.description}
                    onChange={handleDescriptionChange}
                    modules={modules}
                    placeholder="Draft detailed academic descriptions, schedules, or outlines..."
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
                  Cancel Creation
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
                      Publish Event Record
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

export default CreateEvent;
