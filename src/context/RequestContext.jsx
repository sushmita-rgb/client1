import React, { createContext, useContext, useState, useEffect } from 'react';
import { appwriteService } from '../services/appwriteService';
import { useAuth } from './AuthContext';

const RequestContext = createContext();

export const RequestProvider = ({ children }) => {
  const { isAdmin } = useAuth();
  const [requests, setRequests] = useState([]);
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(false);

  // Both collections are admin-read-only. Fetching them on every public page
  // load cost two round-trips per visitor and always 401'd.
  useEffect(() => {
    if (isAdmin) loadAllData();
  }, [isAdmin]);

  const loadAllData = async () => {
    setLoading(true);
    try {
      const [reqData, inqData] = await Promise.all([
        appwriteService.getCustomRequests(),
        appwriteService.getProductInquiries(),
      ]);
      setRequests(reqData || []);
      setInquiries(inqData || []);
    } catch (e) {
      console.error('Error loading requests & inquiries:', e);
    } finally {
      setLoading(false);
    }
  };

  const submitCustomRequest = async (requestData, file) => {
    const newDoc = await appwriteService.createCustomRequest(requestData, file);
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

  const updateInquiryStatus = async (id, status) => {
    const updated = await appwriteService.updateInquiryStatus(id, status);
    if (updated) {
      setInquiries((prev) =>
        prev.map((i) => ((i.$id === id || i.id === id) ? { ...i, status } : i))
      );
    }
    return updated;
  };

  const deleteInquiry = async (id) => {
    const ok = await appwriteService.deleteInquiry(id);
    if (ok) {
      setInquiries((prev) => prev.filter((i) => i.$id !== id && i.id !== id));
    }
    return ok;
  };

  return (
    <RequestContext.Provider
      value={{
        requests,
        inquiries,
        loading,
        submitCustomRequest,
        updateRequestStatus,
        updateInquiryStatus,
        deleteInquiry,
        loadAllData,
      }}
    >
      {children}
    </RequestContext.Provider>
  );
};

export const useRequests = () => useContext(RequestContext);
