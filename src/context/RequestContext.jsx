import React, { createContext, useContext } from 'react';
import { appwriteService } from '../services/appwriteService';

const RequestContext = createContext();

// The storefront only ever writes custom requests — reading and managing them
// is the dashboard app's job, and this build has no admin session to do it with.
export const RequestProvider = ({ children }) => {
  const submitCustomRequest = (requestData) => appwriteService.createCustomRequest(requestData);

  return (
    <RequestContext.Provider value={{ submitCustomRequest }}>
      {children}
    </RequestContext.Provider>
  );
};

export const useRequests = () => useContext(RequestContext);
