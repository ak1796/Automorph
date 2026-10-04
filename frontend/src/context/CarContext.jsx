import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { CARS_DATA, CUSTOMIZATION_OPTIONS, INITIAL_GARAGE_BUILDS } from '../data/carsData';

const CarContext = createContext();

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5002/api';

export const CarProvider = ({ children }) => {
  const [cars, setCars] = useState(CARS_DATA);

  const [selectedCar, setSelectedCar] = useState(() => {
    const savedCarId = localStorage.getItem('automorph_selected_car');
    return CARS_DATA.find(c => c.id === savedCarId) || CARS_DATA[0];
  });

  const DEFAULT_CUSTOMIZATIONS = {
    paint: CUSTOMIZATION_OPTIONS.paints[0],
    wheels: CUSTOMIZATION_OPTIONS.wheels[0],
    spoiler: CUSTOMIZATION_OPTIONS.spoilers[0],
    bodyKit: CUSTOMIZATION_OPTIONS.bodyKits[0],
    frontSplitter: CUSTOMIZATION_OPTIONS.frontSplitters[0],
    sideSkirts: CUSTOMIZATION_OPTIONS.sideSkirts[0],
    rearDiffuser: CUSTOMIZATION_OPTIONS.rearDiffusers[0],
    hood: CUSTOMIZATION_OPTIONS.hoods[0],
    caliper: CUSTOMIZATION_OPTIONS.calipers[0],
    livery: CUSTOMIZATION_OPTIONS.liveries[0],
    suspension: CUSTOMIZATION_OPTIONS.suspension[0],
    exhaust: CUSTOMIZATION_OPTIONS.exhausts[0],
    powertrain: CUSTOMIZATION_OPTIONS.powertrain[0],
    turbocharger: CUSTOMIZATION_OPTIONS.turbochargers[0],
    wingAngle: CUSTOMIZATION_OPTIONS.wingAngles[0],
    mirrorCaps: CUSTOMIZATION_OPTIONS.mirrorCaps[0]
  };

  const [customizations, setCustomizations] = useState(() => {
    const savedCustomizations = localStorage.getItem('automorph_customizations');
    if (savedCustomizations) {
      try {
        return { ...DEFAULT_CUSTOMIZATIONS, ...JSON.parse(savedCustomizations) };
      } catch (e) {
        return DEFAULT_CUSTOMIZATIONS;
      }
    }
    return DEFAULT_CUSTOMIZATIONS;
  });

  // Persist active customizations in local state
  useEffect(() => {
    try {
      localStorage.setItem('automorph_customizations', JSON.stringify(customizations));
    } catch (e) {
      // Ignore storage errors
    }
  }, [customizations]);

  const [savedGarage, setSavedGarage] = useState(() => {
    const localGarage = localStorage.getItem('automorph_garage');
    if (localGarage) {
      try {
        return JSON.parse(localGarage);
      } catch (e) {
        return INITIAL_GARAGE_BUILDS;
      }
    }
    return INITIAL_GARAGE_BUILDS;
  });

  const [isGarageLoading, setIsGarageLoading] = useState(false);
  const [garageError, setGarageError] = useState(null);

  const [token, setToken] = useState(() => localStorage.getItem('automorph_token') || null);

  const [user, setUser] = useState(() => {
    const localUser = localStorage.getItem('automorph_user');
    return localUser ? JSON.parse(localUser) : { isLoggedIn: false, name: '', email: '' };
  });

  // Fetch Cars from Backend GET /api/cars on mount
  useEffect(() => {
    const fetchCars = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/cars`);
        if (!res.ok) return;
        const data = await res.json();
        if (data.status === 'success' && Array.isArray(data.data) && data.data.length > 0) {
          const formatted = data.data.map(c => ({
            ...c,
            id: c.carId || c.id || c._id
          }));
          setCars(formatted);

          // Sync selectedCar with live backend data if available
          setSelectedCar(prev => {
            const currentId = prev?.id || prev?.carId;
            const match = formatted.find(c => c.id === currentId || c.carId === currentId);
            return match || prev || formatted[0];
          });
        }
      } catch (e) {
        // Fallback CARS_DATA if server offline
      }
    };
    fetchCars();
  }, []);

  // Fetch User-Scoped Garage Builds from Backend GET /api/builds
  const fetchBuilds = useCallback(async (activeToken = token) => {
    setIsGarageLoading(true);
    setGarageError(null);
    try {
      const headers = {};
      if (activeToken) {
        headers['Authorization'] = `Bearer ${activeToken}`;
      }

      const res = await fetch(`${API_BASE_URL}/builds`, { headers });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      if (data.status === 'success' && Array.isArray(data.data)) {
        const formatted = data.data.map(b => ({
          ...b,
          id: b._id || b.id
        }));
        setSavedGarage(formatted);
      }
    } catch (err) {
      console.log('[CarContext] API unreachable, using cached garage builds.');
    } finally {
      setIsGarageLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchBuilds(token);
  }, [token, fetchBuilds]);

  // Persist garage fallback to localStorage
  useEffect(() => {
    localStorage.setItem('automorph_garage', JSON.stringify(savedGarage));
  }, [savedGarage]);

  // Persist user state & token
  useEffect(() => {
    if (token) {
      localStorage.setItem('automorph_token', token);
    } else {
      localStorage.removeItem('automorph_token');
    }
    localStorage.setItem('automorph_user', JSON.stringify(user));
  }, [user, token]);

  const selectCar = (car) => {
    setSelectedCar(car);
    localStorage.setItem('automorph_selected_car', car.id || car.carId);
    setCustomizations(DEFAULT_CUSTOMIZATIONS);
  };

  const updateCustomization = (category, option) => {
    setCustomizations(prev => ({
      ...prev,
      [category]: option
    }));
  };

  const resetCustomizations = () => {
    setCustomizations(DEFAULT_CUSTOMIZATIONS);
  };

  const calculateTotalPrice = () => {
    if (!selectedCar) return 0;
    const partsTotal = Object.values(customizations).reduce((acc, curr) => {
      return acc + (curr?.price || 0);
    }, 0);
    return selectedCar.basePrice + partsTotal;
  };

  /**
   * Register User via POST /api/auth/register
   */
  const registerUser = async (name, email, password) => {
    try {
      const res = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password })
      });
      const data = await res.json();
      if (res.ok && data.status === 'success' && data.data) {
        const userObj = {
          isLoggedIn: true,
          _id: data.data._id,
          name: data.data.name,
          email: data.data.email
        };
        setToken(data.data.token);
        setUser(userObj);
        fetchBuilds(data.data.token);
        return { success: true };
      } else {
        return { success: false, error: data.message || 'Registration failed' };
      }
    } catch (e) {
      return { success: false, error: 'Network error during registration' };
    }
  };

  /**
   * Login User via POST /api/auth/login
   */
  const loginUser = async (email, password) => {
    try {
      const res = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (res.ok && data.status === 'success' && data.data) {
        const userObj = {
          isLoggedIn: true,
          _id: data.data._id,
          name: data.data.name,
          email: data.data.email
        };
        setToken(data.data.token);
        setUser(userObj);
        fetchBuilds(data.data.token);
        return { success: true };
      } else {
        return { success: false, error: data.message || 'Invalid email or password' };
      }
    } catch (e) {
      // Local fallback login mode if backend server offline
      const fallbackUser = { isLoggedIn: true, name: email.split('@')[0], email };
      setUser(fallbackUser);
      return { success: true, fallback: true };
    }
  };

  /**
   * Logout User
   */
  const logoutUser = () => {
    setToken(null);
    setUser({ isLoggedIn: false, name: '', email: '' });
    localStorage.removeItem('automorph_token');
    fetchBuilds(null);
  };

  /**
   * Save build via POST /api/builds (Attaches Bearer JWT Header)
   */
  const saveCurrentBuild = async () => {
    if (!selectedCar) return null;

    const payload = {
      carId: selectedCar.id || selectedCar.carId,
      carName: selectedCar.name,
      carImage: selectedCar.image,
      customizations: { ...customizations },
      totalPrice: calculateTotalPrice(),
      savedAt: new Date().toISOString().split('T')[0]
    };

    const headers = { 'Content-Type': 'application/json' };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    try {
      const res = await fetch(`${API_BASE_URL}/builds`, {
        method: 'POST',
        headers,
        body: JSON.stringify(payload)
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      const data = await res.json();
      if (data.status === 'success' && data.data) {
        const created = {
          ...data.data,
          id: data.data._id || data.data.id
        };
        setSavedGarage(prev => [created, ...prev.filter(b => (b._id !== created.id && b.id !== created.id))]);
        return { success: true, data: created };
      }
    } catch (err) {
      // Local fallback if API fails
      const fallbackBuild = {
        id: `build-${Date.now()}`,
        _id: `build-${Date.now()}`,
        ...payload
      };
      setSavedGarage(prev => [fallbackBuild, ...prev]);
      return { success: true, data: fallbackBuild, fallback: true };
    }
  };

  /**
   * Delete build via DELETE /api/builds/:id (Attaches Bearer JWT Header)
   */
  const deleteGarageBuild = async (buildId) => {
    const targetId = buildId;
    setSavedGarage(prev => prev.filter(b => b.id !== targetId && b._id !== targetId));

    const headers = {};
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    try {
      await fetch(`${API_BASE_URL}/builds/${targetId}`, {
        method: 'DELETE',
        headers
      });
    } catch (err) {
      console.warn('Failed to delete build on backend:', err);
    }
  };

  return (
    <CarContext.Provider
      value={{
        cars,
        selectedCar,
        selectCar,
        customizations,
        setCustomizations,
        updateCustomization,
        resetCustomizations,
        DEFAULT_CUSTOMIZATIONS,
        calculateTotalPrice,
        savedGarage,
        isGarageLoading,
        garageError,
        saveCurrentBuild,
        deleteGarageBuild,
        user,
        token,
        loginUser,
        registerUser,
        logoutUser,
        fetchBuilds
      }}
    >
      {children}
    </CarContext.Provider>
  );
};

export const useCarContext = () => {
  const context = useContext(CarContext);
  if (!context) {
    throw new Error('useCarContext must be used within a CarProvider');
  }
  return context;
};
