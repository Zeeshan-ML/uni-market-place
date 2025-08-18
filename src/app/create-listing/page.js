// File: src/app/create-listing/page.js
'use client';
import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import {Button} from '../components/Button';
import {Input} from '../components/Input';
import Textarea from '../components/Textarea';
import Select from '../components/Select';
import Checkbox from '../components/Checkbox';
import ImageUpload from '../components/ImageUpload';
import EmptyState from '../components/EmptyState';

export default function CreateListing() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    category: '',
    condition: '',
    negotiable: false,
  });
  const [images, setImages] = useState([]);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [aiSuggestion, setAiSuggestion] = useState(null);
  const [duplicateWarning, setDuplicateWarning] = useState(null);
  const fileInputRef = useRef(null);

  // Validation function
  const validateForm = () => {
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = 'Title is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (!formData.price || formData.price <= 0) newErrors.price = 'Price must be a positive number';
    if (!formData.category) newErrors.category = 'Category is required';
    if (!formData.condition) newErrors.condition = 'Condition is required';
    if (images.length === 0) newErrors.images = 'At least one image is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    setErrors((prev) => ({ ...prev, [name]: null }));
  };

  // Handle image upload
  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const newImages = files.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }));
    setImages((prev) => [...prev, ...newImages]);
    setErrors((prev) => ({ ...prev, images: null }));
  };

  // Remove image
  const removeImage = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  // Stubbed AI price suggestion
  const fetchAiSuggestion = () => {
    setAiSuggestion(`Suggested price: $${(parseFloat(formData.price) * 1.1).toFixed(2) || '10.00'}`);
    setTimeout(() => setAiSuggestion(null), 5000); // Clear after 5 seconds
  };

  // Stubbed duplicate listing check
  const checkDuplicates = () => {
    if (formData.title.toLowerCase().includes('textbook')) {
      setDuplicateWarning('Similar listings found for textbooks. Proceed anyway?');
      setTimeout(() => setDuplicateWarning(null), 5000); // Clear after 5 seconds
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      // Prepare form data for POST request
      const formDataToSend = new FormData();
      formDataToSend.append('title', formData.title);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('price', formData.price);
      formDataToSend.append('category', formData.category);
      formDataToSend.append('condition', formData.condition);
      formDataToSend.append('negotiable', formData.negotiable);
      images.forEach((img, index) => {
        formDataToSend.append('images', img.file);
      });

      const res = await fetch('https://web-production-0077.up.railway.app/api/v1/listings/', {
        method: 'POST',
        body: formDataToSend,
        headers: {
          // Add authentication headers if required by your server
          // e.g., Authorization: `Bearer ${token}`
        },
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.message || 'Failed to create listing');
      }

      const data = await res.json();
      router.push(`/listing/${data.id}`);
    } catch (err) {
      setSubmitError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto p-4 space-y-6">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
        Create a New Listing
      </h1>
      {submitError && <p className="text-red-500">{submitError}</p>}
      {duplicateWarning && (
        <div className="p-4 bg-yellow-100 text-yellow-800 rounded-md">
          {duplicateWarning}
        </div>
      )}
      {aiSuggestion && (
        <div className="p-4 bg-blue-100 text-blue-800 rounded-md">
          {aiSuggestion}
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Title
          </label>
          <Input
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            placeholder="e.g., Calculus Textbook"
            className={errors.title ? 'border-red-500' : ''}
          />
          {errors.title && <p className="text-red-500 text-sm">{errors.title}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Description
          </label>
          <Textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            placeholder="Describe your item..."
            className={errors.description ? 'border-red-500' : ''}
          />
          {errors.description && <p className="text-red-500 text-sm">{errors.description}</p>}
        </div>

        <div className="flex space-x-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Price ($)
            </label>
            <div className="flex space-x-2">
              <Input
                name="price"
                type="number"
                step="0.01"
                value={formData.price}
                onChange={handleInputChange}
                placeholder="e.g., 29.99"
                className={errors.price ? 'border-red-500' : ''}
              />
              <Button
                type="button"
                variant="secondary"
                onClick={fetchAiSuggestion}
                disabled={!formData.price}
              >
                Get AI Price Suggestion
              </Button>
            </div>
            {errors.price && <p className="text-red-500 text-sm">{errors.price}</p>}
          </div>

          <div className="flex items-end">
            <Checkbox
              name="negotiable"
              checked={formData.negotiable}
              onChange={handleInputChange}
              label="Price Negotiable"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Category
          </label>
          <Select
            name="category"
            value={formData.category}
            onChange={handleInputChange}
            options={[
              { value: '', label: 'Select a category' },
              { value: 'textbooks', label: 'Textbooks' },
              { value: 'electronics', label: 'Electronics' },
              { value: 'furniture', label: 'Furniture' },
              { value: 'other', label: 'Other' },
            ]}
            className={errors.category ? 'border-red-500' : ''}
          />
          {errors.category && <p className="text-red-500 text-sm">{errors.category}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Condition
          </label>
          <Select
            name="condition"
            value={formData.condition}
            onChange={handleInputChange}
            options={[
              { value: '', label: 'Select condition' },
              { value: 'new', label: 'New' },
              { value: 'like-new', label: 'Like New' },
              { value: 'used', label: 'Used' },
              { value: 'poor', label: 'Poor' },
            ]}
            className={errors.condition ? 'border-red-500' : ''}
          />
          {errors.condition && <p className="text-red-500 text-sm">{errors.condition}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Images
          </label>
          <ImageUpload
            onChange={handleImageUpload}
            ref={fileInputRef}
            multiple
            accept="image/*"
          />
          {errors.images && <p className="text-red-500 text-sm">{errors.images}</p>}
          <div className="grid grid-cols-3 gap-4 mt-4">
            {images.map((img, index) => (
              <div key={index} className="relative">
                <img
                  src={img.preview}
                  alt="Preview"
                  className="w-full h-32 object-cover rounded-md"
                />
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1"
                >
                  X
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="flex space-x-4">
          <Button
            type="submit"
            variant="primary"
            disabled={isSubmitting}
            onClick={checkDuplicates}
          >
            {isSubmitting ? 'Creating...' : 'Create Listing'}
          </Button>
          <Button
            type="button"
            variant="secondary"
            onClick={() => router.push('/browse')}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}