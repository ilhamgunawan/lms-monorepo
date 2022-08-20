import { LoginData } from '@lms-monorepo/types';
import DashboardContent from './DashboardContent';
import { FaUser, FaBook, FaBookOpen } from 'react-icons/fa';

const menus = {
  admin: [
    {
      id: 'user',
      name: 'Users',
      url: '/user',
      description: 'User management',
      icon: <FaUser />,
    },
    {
      id: 'course',
      name: 'Courses',
      url: '/course',
      description: 'Course management',
      icon: <FaBook />,
    },
  ],
  teacher: [
    {
      id: 'course',
      name: 'Courses',
      url: '/course',
      description: 'Course management',
      icon: <FaBook />,
    },
  ],
  student: [
    {
      id: 'myCourse',
      name: 'My Courses',
      url: '/my-courses',
      description: 'Enrolled Courses',
      icon: <FaBookOpen />,
    },
  ],
}

function getMenusByRole(role: string) {
  switch(role) {
    case 'admin':
      return menus.admin;
    case 'teacher':
      return menus.teacher;
    case 'student':
      return menus.student;
    default: 
    return [];
  }
}

export default function Dashboard() {
  const userJSON = window.localStorage.getItem('user');
  const user: LoginData | null = userJSON 
    ? JSON.parse(userJSON)
    : null
  ;
  const role = user ? user.role.name : '';

  return <DashboardContent menus={getMenusByRole(role)} />
}
