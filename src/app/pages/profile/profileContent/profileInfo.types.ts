import { TableRowProps } from 'pages/profile/tableRow/tableRow.types';

export type ProfileInfoProps = {
  firstName: string;
  lastName: string;
  email: string;
  dateOfBirth: string;
  addresses: TableRowProps[];
};
