import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import config from '../config';
import Navbar from '../components/Navbar';
import Input from '../components/Input';
import Button from '../components/Button';

const CreateEvent = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    time: '',
    location: '',
  });
  const [coverImage, setCoverImage] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleFileChange = (e) => {
      setCoverImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data = new FormData();
      data.append('title', formData.title);
      data.append('description', formData.description);
      data.append('date', formData.date);
      data.append('time', formData.time);
      data.append('location', formData.location);
      if (coverImage) {
          data.append('coverImage', coverImage);
      }

      const response = await axios.post(`${config.API_BASE_URL}/events`, data, {
        withCredentials: true,
        headers: {
            'Content-Type': 'multipart/form-data'
        }
      });

      if (response.data?.success || response.status === 201) {
        toast.success('Event created successfully!');
        navigate('/dashboard');
      }
    } catch (error) {
      console.error('Create event error:', error);
      const errorMessage = error.response?.data?.message || 'Something went wrong. Please try again.';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      <Navbar />
      
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Create New Event</h1>
            <p className="text-gray-500 mt-2">Fill in the details to publish your event.</p>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            <Input
              label="Event Title"
              id="title"
              value={formData.title}
              onChange={handleChange}
              required
              placeholder="e.g. Tech Conference 2024"
              className="bg-white border-gray-200 text-gray-900 placeholder-gray-400 focus:ring-indigo-500"
            />
            
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Cover Image</label>
                <input 
                    type="file" 
                    onChange={handleFileChange}
                    className="block w-full text-sm text-gray-500
                        file:mr-4 file:py-2 file:px-4
                        file:rounded-full file:border-0
                        file:text-sm file:font-semibold
                        file:bg-indigo-50 file:text-indigo-700
                        hover:file:bg-indigo-100
                    "
                    accept="image/*"
                />
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                id="description"
                rows="4"
                className="w-full px-4 py-3 rounded-xl bg-white border border-gray-200 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                placeholder="Describe your event..."
                value={formData.description}
                onChange={handleChange}
                required
              ></textarea>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label="Date"
                id="date"
                type="date"
                value={formData.date}
                onChange={handleChange}
                required
                className="bg-white border-gray-200 text-gray-900 focus:ring-indigo-500"
              />

              <Input
                label="Time"
                id="time"
                type="time"
                value={formData.time}
                onChange={handleChange}
                required
                className="bg-white border-gray-200 text-gray-900 focus:ring-indigo-500"
              />
              
              <Input
                label="Location"
                id="location"
                value={formData.location}
                onChange={handleChange}
                required
                placeholder="e.g. New York, NY"
                className="bg-white border-gray-200 text-gray-900 placeholder-gray-400 focus:ring-indigo-500"
              />
            </div>


            <div className="pt-4">
              <Button
                type="submit"
                isLoading={loading}
                variant="secondary"
              >
                Create Event
              </Button>
            </div>
      
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateEvent;
