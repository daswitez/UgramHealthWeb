import React from "react";
import ReadinessBanner from "../../components/scheduling/ReadinessBanner";

export default function DoctorLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ padding: "40px", maxWidth: "1200px", margin: "0 auto" }}>
      <ReadinessBanner />
      {children}
    </div>
  );
}
