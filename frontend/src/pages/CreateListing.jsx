import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { app } from '../firebase';

const CreateListing = () => {
  const { currentUser } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const [files, setFiles] = useState([]);
  const [formData, setFormData] = useState({
    imageUrls: [],
    name: '',
    description: '',
    address: '',
    type: 'rent',
    bedrooms: 1,
    bathrooms: 1,
    regularPrice: 50,
    discountPrice: 0,
    offer: false,
    parking: false,
    furnished: false,
  });
  const [uploading, setUploading] = useState(false);
  const [imageUploadError, setImageUploadError] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleImageSubmit = async () => {
    if (files.length > 0 && files.length <= 6) {
      setUploading(true);
      setImageUploadError('');

      const promises = Array.from(files).map((file) => storeImage(file));

      try {
        const urls = await Promise.all(promises);
        setFormData((prevFormData) => ({
          ...prevFormData,
          imageUrls: [...prevFormData.imageUrls, ...urls],
        }));
        setImageUploadError('');
      } catch (error) {
        setImageUploadError('Image upload failed (2 MB max per image)');
      } finally {
        setUploading(false);
      }
    } else {
      setImageUploadError('You can only upload up to 6 images per listing');
    }
  };

  const storeImage = (file) => {
    return new Promise((resolve, reject) => {
      const storage = getStorage(app);
      const fileName = `${new Date().getTime()}_${file.name}`;
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log(`Upload is ${progress}% done`);
        },
        (error) => {
          reject(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadUrl) => {
            resolve(downloadUrl);
          });
        }
      );
    });
  };

  const handleRemoveImage = (index) => {
    const updatedUrls = formData.imageUrls.filter((_, i) => i !== index);
    setFormData((prevFormData) => ({
      ...prevFormData,
      imageUrls: updatedUrls,
    }));
  };

  const handleChange = (e) => {
    const { id, value, checked, type } = e.target;

    if (id === 'rent' || id === 'sale') {
      setFormData((prevFormData) => ({
        ...prevFormData,
        type: id,
      }));
    } else if (type === 'checkbox') {
      setFormData((prevFormData) => ({
        ...prevFormData,
        [id]: checked,
      }));
    } else {
      setFormData((prevFormData) => ({
        ...prevFormData,
        [id]: value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
  
    try {
      if (formData.imageUrls.length < 1) {
        return setError("You must upload at least 1 image");
      }
      if (+formData.regularPrice < +formData.discountPrice) {
        return setError("Discount price must be lower than regular price");
      }
      setLoading(true);
      setError(false);
  
      const res = await fetch("http://localhost:3000/api/listing/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: 'include', // This will send cookies with the request
        body: JSON.stringify({
          ...formData,
          userRef: currentUser.user._id,
        }),
      });
  
      const data = await res.json();
      setLoading(false);
  
      if (!data.success) {
        setError(data.message);
      } else {
        navigate(`/listing/${data._id}`);
      }
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  };
  

  return (
    <main className="p-3 max-w-4xl mx-auto">
      <h1 className="text-3xl text-center font-semibold my-7">Create a Listing</h1>
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4">
        <div className="flex flex-col gap-4 flex-1">
          <input
            type="text"
            placeholder="Name"
            className="border p-3 rounded-lg"
            id="name"
            maxLength={50}
            minLength={1}
            onChange={handleChange}
            value={formData.name}
            required
          />
          <textarea
            placeholder="Description"
            className="border p-3 rounded-lg"
            id="description"
            onChange={handleChange}
            value={formData.description}
            required
          />
          <input
            type="text"
            placeholder="Address"
            className="border p-3 rounded-lg"
            id="address"
            onChange={handleChange}
            value={formData.address}
            required
          />
          <div className="flex gap-6 flex-wrap">
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="rent"
                className="w-5"
                onChange={handleChange}
                checked={formData.type === 'rent'}
              />
              <span>Rent</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="sale"
                className="w-5"
                onChange={handleChange}
                checked={formData.type === 'sale'}
              />
              <span>Sell</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="parking"
                className="w-5"
                onChange={handleChange}
                checked={formData.parking}
              />
              <span>Parking Spot</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="furnished"
                className="w-5"
                onChange={handleChange}
                checked={formData.furnished}
              />
              <span>Furnished</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="offer"
                className="w-5"
                onChange={handleChange}
                checked={formData.offer}
              />
              <span>Offer</span>
            </div>
          </div>
          <div className="flex gap-6 flex-wrap">
            <div className="flex gap-2 items-center">
              <input
                type="number"
                id="bedrooms"
                min={1}
                max={10}
                required
                className="border border-gray-300 p-3 rounded-lg"
                onChange={handleChange}
                value={formData.bedrooms}
              />
              <p>Beds</p>
            </div>
            <div className="flex gap-2 items-center">
              <input
                type="number"
                id="bathrooms"
                min={1}
                max={10}
                required
                className="border border-gray-300 p-3 rounded-lg"
                onChange={handleChange}
                value={formData.bathrooms}
              />
              <p>Baths</p>
            </div>
            <div className="flex gap-2 items-center">
              <input
                type="number"
                id="regularPrice"
                min={1}
                required
                className="border border-gray-300 p-3 rounded-lg"
                onChange={handleChange}
                value={formData.regularPrice}
              />
              <div className="flex flex-col items-center">
                <p>Regular Price</p>
                <span className="text-sm">(₹/month)</span>
              </div>
            </div>
            {formData.offer && (
              <div className="flex gap-2 items-center">
                <input
                  type="number"
                  id="discountPrice"
                  min={1}
                  required
                  className="border border-gray-300 p-3 rounded-lg"
                  onChange={handleChange}
                  value={formData.discountPrice}
                />
                <div className="flex flex-col items-center">
                  <p>Discount Price</p>
                  <span className="text-sm">(₹/month)</span>
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="flex flex-col gap-4 flex-1">
          <div className="border border-gray-300 p-3 rounded-lg">
            <input
              type="file"
              accept=".jpg,.png,.jpeg"
              multiple
              className="w-full px-3 py-1.5 text-gray-700 border border-solid border-gray-300 rounded-lg transition ease-in-out focus:border-blue-600 focus:outline-none"
              onChange={(e) => setFiles(e.target.files)}
            />
          </div>
          <button
            type="button"
            className="bg-green-600 text-white px-4 py-2 rounded-lg mt-2"
            onClick={handleImageSubmit}
            disabled={uploading}
          >
            {uploading ? 'Uploading...' : 'Upload'}
          </button>
          <div className="flex flex-wrap gap-2 mt-2">
            {formData.imageUrls.map((url, index) => (
              <div key={index} className="relative">
                <img src={url} alt="Listing" className="w-20 h-20 object-cover rounded-lg" />
                <button
                  type="button"
                  className="absolute top-1 right-1 text-red-500"
                  onClick={() => handleRemoveImage(index)}
                >
                  &#10005;
                </button>
              </div>
            ))}
          </div>
          {imageUploadError && <p className="text-red-500">{imageUploadError}</p>}
          <button
            type="submit"
            className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg"
            disabled={loading}
          >
            {loading ? 'Creating...' : 'Create Listing'}
          </button>
          {error && <p className="text-red-500">{error}</p>}
        </div>
      </form>
    </main>
  );
};

export default CreateListing;
