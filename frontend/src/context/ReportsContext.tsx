import { createContext, useContext, useState, ReactNode } from 'react';

export interface Report {
  id: string;
  type: string;
  description: string;
  image: string | null;
  timestamp: Date;
}

interface ReportsContextType {
  reports: Report[];
  addReport: (report: Omit<Report, 'id' | 'timestamp'>) => void;
}

const ReportsContext = createContext<ReportsContextType | undefined>(undefined);

export const ReportsProvider = ({ children }: { children: ReactNode }) => {
  const [reports, setReports] = useState<Report[]>([]);

  const addReport = (report: Omit<Report, 'id' | 'timestamp'>) => {
    const newReport: Report = {
      ...report,
      id: crypto.randomUUID(),
      timestamp: new Date(),
    };
    setReports((prev) => [newReport, ...prev]);
  };

  return (
    <ReportsContext.Provider value={{ reports, addReport }}>
      {children}
    </ReportsContext.Provider>
  );
};

export const useReports = () => {
  const context = useContext(ReportsContext);
  if (!context) {
    throw new Error('useReports must be used within a ReportsProvider');
  }
  return context;
};
