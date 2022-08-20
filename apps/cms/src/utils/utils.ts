import appConfig from '../../config.json';
import {
  FiHome,
  FiUsers,
  FiUserCheck,
  FiBookOpen,
} from 'react-icons/fi';

export interface Config {
  siteName: string;
};

type GetConfig = () => Config;

export const getConfig: GetConfig = () => {
  const config: Config = {
    siteName: appConfig.siteName,
  };
  return config;
};

export const getIcon = (name: string) => {
  switch(name) {
    case 'Dashboard':
      return FiHome;
    case 'User Management':
      return FiUsers;
    case 'Roles':
      return FiUserCheck;
    case 'Course Management':
      return FiBookOpen;
    default:
      return FiHome;
  }
};
