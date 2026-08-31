import React, { createContext, useContext, useState, useEffect } from 'react';
import { appwriteService } from '../services/appwriteService';

const RequestContext = createContext();

export const RequestProvider = ({ children }) => {
  const [requests, setRequests] = useState([]);
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAllData();
  }, []);

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

  const submitProductInquiry = async (inquiryData) => {
    const newDoc = await appwriteService.createProductInquiry(inquiryData);
    if (newDoc) {
      setInquiries((prev) => [newDoc, ...prev]);
    }
    return newDoc;
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
        submitProductInquiry,
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
