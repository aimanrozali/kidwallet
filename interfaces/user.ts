export interface User {
  email: string;
  userName: string;
  phoneNumber: string;
  profilePicture: string;
  students: Student[];
}

interface Student {
  studentID: number;
  studentName: string;
  birthDate: string;
  gender: string;
  grade: string;
  className: string;
  allergy: string[];
  wallet?: any;
}