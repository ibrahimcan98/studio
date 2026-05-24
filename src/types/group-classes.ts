export interface GroupCoursePackage {
  id: string;
  title: string;
  description: string;
  shortDescription?: string; // e.g. "45 dakika | 4 derslik grup paketi"
  teacherId: string;
  capacity: number;
  enrolledCount: number;
  price: number;
  googleMeetLink?: string;
  status: 'draft' | 'published' | 'completed';
  createdAt: Date | any; // Firebase Timestamp
  updatedAt: Date | any;
}

export interface GroupCourseSession {
  id: string;
  packageId: string;
  teacherId: string;
  startTime: Date | any; // Firebase Timestamp
  endTime: Date | any;
  status: 'scheduled' | 'completed' | 'cancelled';
}

export interface GroupCourseEnrollment {
  id: string;
  packageId: string;
  studentId: string; // The child's ID
  parentId: string; // The parent's ID who bought the package
  paymentStatus: 'paid' | 'pending';
  enrolledAt: Date | any;
  makeupLessons?: {
    originalSessionId: string;
    makeupPackageId: string;
    makeupSessionId: string;
    assignedAt: Date | any;
  }[];
}

export interface GroupAnnouncement {
  id: string;
  packageId: string;
  teacherId: string;
  title: string;
  content: string;
  attachmentUrl?: string; // For PDFs/materials
  createdAt: Date | any;
}
