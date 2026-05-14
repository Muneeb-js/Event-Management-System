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
  const departments = ['All Departments', 'Computer Science', 'Engineering', 'Medicine', 'Arts & Humanities', 'Business School', 'Law', 'Sciences', 'Social Sciences'];

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
        navigate(`/events/${id}`);
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
    <div className="min-h-screen bg-[#F8F9FA] pb-20">
      <Navbar />

      {/* Premium Header */}
      <div className="bg-[#0A2540] px-8 py-12 relative overflow-hidden mb-12">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#FFD700]/5 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2" />
        <div className="max-w-[800px] mx-auto relative">
          <Link to={`/events/${id}`} className="text-[#FFD700] text-[10px] font-bold uppercase tracking-[0.2em] hover:opacity-80 transition-opacity flex items-center gap-2 mb-4">
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
            Back to Event Details
          </Link>
          <h1 className="text-4xl font-extrabold text-white tracking-tight mb-2">Edit Event</h1>
          <p className="text-white/50 font-serif italic text-sm">
            Modify the institutional record for this event.
          </p>
        </div>
      </div>

      <div className="max-w-[800px] mx-auto px-8">
        <form onSubmit={handleSubmit} className="bg-white border border-gray-100 rounded-lg shadow-sm overflow-hidden">
          {/* Cover Image Upload Area */}
          <div className="relative h-64 bg-gray-50 border-b border-gray-100 group cursor-pointer overflow-hidden">
            <img 
              src={previewUrl || existingCoverImage || 'https://via.placeholder.com/800x400'} 
              alt="Preview" 
              className="w-full h-full object-cover" 
            />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <p className="text-white text-xs font-bold uppercase tracking-widest">Update Cover Image</p>
            </div>
            <input 
              type="file" 
              onChange={handleFileChange}
              className="absolute inset-0 opacity-0 cursor-pointer"
              accept="image/*"
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
                  className="w-full border-b-2 border-gray-100 py-3 text-[15px] font-bold text-[#0A2540] bg-transparent focus:outline-none focus:border-[#FFD700] transition-colors"
                />
              </div>

              <div className="quill-container">
                <label className="block text-[10px] font-bold text-[#0A2540] uppercase tracking-widest mb-3">Institutional Description</label>
                <ReactQuill 
                  theme="snow"
                  value={formData.description}
                  onChange={handleDescriptionChange}
                  modules={modules}
                  placeholder="Provide a detailed overview..."
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
                  className="w-full border-b-2 border-gray-100 py-3 text-[13px] font-bold text-[#0A2540] bg-transparent focus:outline-none focus:border-[#FFD700] transition-colors"
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-10 flex gap-4 justify-center">
              <Link
                to={`/events/${id}`}
                className="px-10 py-3 border border-gray-200 text-gray-500 text-[11px] font-bold uppercase tracking-widest rounded hover:bg-gray-50 transition-colors"
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={loading}
                className="px-10 py-3 bg-[#0A2540] hover:bg-gray-900 text-white text-[11px] font-bold uppercase tracking-widest transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed rounded shadow-lg hover:shadow-xl"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  'Save Institutional Record'
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditEvent;
