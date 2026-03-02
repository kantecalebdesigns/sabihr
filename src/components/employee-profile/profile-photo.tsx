import { useRef, useState } from "react";
import { Camera } from "lucide-react";
import { MOCK_EMPLOYEE_PROFILE } from "@/lib/employee-mock-data";

export function ProfilePhoto() {
  const employee = MOCK_EMPLOYEE_PROFILE;
  const initials = `${employee.basicDetails.firstName[0]}${employee.basicDetails.lastName[0]}`;
  const fileRef = useRef<HTMLInputElement>(null);
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setPhotoUrl(url);
    }
  }

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative">
        <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden border-4 border-card shadow-sm">
          {photoUrl ? (
            <img src={photoUrl} alt="Profile" className="w-full h-full object-cover" />
          ) : (
            <span className="text-2xl font-bold text-primary">{initials}</span>
          )}
        </div>
        <button
          onClick={() => fileRef.current?.click()}
          className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-md hover:bg-primary/90 transition-colors"
        >
          <Camera className="w-3.5 h-3.5" />
        </button>
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
        />
      </div>
      <div className="text-center">
        <p className="font-semibold">
          {employee.basicDetails.firstName} {employee.basicDetails.middleName} {employee.basicDetails.lastName}
        </p>
        <p className="text-sm text-muted-foreground">{employee.employment.jobTitle}</p>
      </div>
    </div>
  );
}
