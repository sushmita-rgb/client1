import React, { createContext, useContext, useState, useEffect } from 'react';
import { appwriteService } from '../services/appwriteService';

const RequestContext = createContext();

export const RequestProvider = ({ children }) => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadRequests();
  }, []);

  const loadRequests = async () => {
    setLoading(true);
    try {
      const data = await appwriteService.getCustomRequests();
      setRequests(data);
    } catch (e) {
      console.error('Error loading custom requests:', e);
    } finally {
      setLoading(false);
    }
  };

  const submitCustomRequest = async (requestData) => {
    const newDoc = await appwriteService.createCustomRequest(requestData);
    if (newDoc) {
      setRequests((prev) => [newDoc, ...prev]);
    }
    return newDoc;
  };

  const updateRequestStatus = async (id, status) => {
    const updated = await appwriteService.updateRequestStatus(id, status);
    if (updated) {
      setRequests((prev) =>
        prev.map((r) => ((r.$id === id || r.id === id) ? { ...r, status } : r))
      );
    }
    return updated;
  };

  return (
    <RequestContext.Provider
      value={{
        requests,
        loading,
        submitCustomRequest,
        updateRequestStatus,
        loadRequests,
      }}
    >
      {children}
    </RequestContext.Provider>
  );
};

export const useRequests = () => useContext(RequestContext);
