import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import config from '../config';
import Navbar from '../components/Navbar';
import Input from '../components/Input';
import Button from '../components/Button';

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
    location: ''
  });
  const [coverImage, setCoverImage] = useState(null);
  const [existingCoverImage, setExistingCoverImage] = useState('');

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
                  location: event.location
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

      const response = await axios.patch(`${config.API_BASE_URL}/events/${id}`, data, {
        withCredentials: true,
        headers: {
            'Content-Type': 'multipart/form-data'
        }
      });

      if (response.data?.success) {
        toast.success('Event updated successfully!');
        navigate(`/events/${id}`);
      }
    } catch (error) {
      console.error('Update event error:', error);
      const errorMessage = error.response?.data?.message || 'Something went wrong. Please try again.';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>
      );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      <Navbar />
      
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Edit Event</h1>
            <p className="text-gray-500 mt-2">Update your event details.</p>
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
                <label className="block text-sm font-medium text-gray-700 mb-2">Cover Image</label>
                {(existingCoverImage || coverImage) && (
                    <div className="mb-4">
                        <img 
                            src={coverImage ? URL.createObjectURL(coverImage) : existingCoverImage} 
                            alt="Cover Preview" 
                            className="h-40 w-full object-cover rounded-xl"
                        />
                    </div>
                )}
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

            <div className="pt-4 flex gap-4">
              <Button
                type="button"
                variant="outline"
                className="!text-gray-600 !border-gray-300 hover:!bg-gray-50"
                onClick={() => navigate(`/events/${id}`)}
              >
                  Cancel
              </Button>
              <Button
                type="submit"
                isLoading={loading}
                variant="secondary"
              >
                Save Changes
              </Button>
            </div>
      
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditEvent;
