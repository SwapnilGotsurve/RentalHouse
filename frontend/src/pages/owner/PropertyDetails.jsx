import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { 
  FaArrowLeft,
  FaBed, 
  FaBath, 
  FaRupeeSign, 
  FaMapMarkerAlt, 
  FaEye, 
  FaEdit, 
  FaTrash,
  FaCalendarAlt,
  FaHome,
  FaExpand,
  FaWifi,
  FaCar,
  FaSwimmingPool,
  FaDumbbell,
  FaShieldAlt,
  FaLeaf,
  FaCouch,
  FaTv,
  FaSnowflake,
  FaUtensils
} from 'react-icons/fa';

const PropertyDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  useEffect(() => {
    fetchProperty();
  }, [id]);

  const fetchProperty = async () => {
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:5000/api/properties/${id}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      const data = await response.json();
      if (data.success) {
        setProperty(data.data.property);
      } else {
        setError(data.message || 'Property not found');
      }
    } catch (error) {
      setError('Network error. Please try again.');
      console.error('Error fetching property:', error);
  