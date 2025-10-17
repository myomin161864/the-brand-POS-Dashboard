import React from 'react';

const Icon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props} />
);

export const OverviewIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <Icon {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h7.5" />
  </Icon>
);

export const OrderIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <Icon {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.658-.463 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
  </Icon>
);

export const ServiceIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (<Icon {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" /></Icon>);
export const BranchesIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (<Icon {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" /></Icon>);
export const AdminAccessIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (<Icon {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.286z" /></Icon>);
export const CustomerDataIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (<Icon {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-4.664v.005zM18 19.128a9.38 9.38 0 002.625.372A9.337 9.337 0 0021 18.75c-2.672 0-5.182-.57-7.687-1.545M12 12a4.5 4.5 0 100-9 4.5 4.5 0 000 9z" /></Icon>);
export const FinanceIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (<Icon {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414-.336.75-.75.75h-.75m0-1.5h.375c.621 0 1.125.504 1.125 1.125v1.5c0 .621-.504 1.125-1.125 1.125h-.375m1.5-3.75V.75A.75.75 0 0020.25 0h-.75M4.5 19.5h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z" /></Icon>);
export const TalentDataIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (<Icon {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M12 7.5h1.5m-1.5 3h1.5m-7.5 3h7.5m-7.5 3h7.5m3-9h3.375c.621 0 1.125.504 1.125 1.125V18a2.25 2.25 0 01-2.25 2.25M16.5 7.5V18a2.25 2.25 0 002.25 2.25M16.5 7.5V4.875c0-.621-.504-1.125-1.125-1.125H4.125C3.504 3.75 3 4.254 3 4.875V18a2.25 2.25 0 002.25 2.25h13.5M6 7.5h3v3H6v-3z" /></Icon>);
export const SettingIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (<Icon {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-1.008 1.11-1.226.55-.218 1.19-.218 1.74 0 .55.218 1.02.684 1.11 1.226l.094.542c.065.393.18 1.02.219 1.489.041.503.11 1.01.21 1.511.102.502.245.985.43 1.442.186.458.437.863.74 1.226.304.363.655.655 1.06.868.405.213.845.32 1.31.32.465 0 .905-.107 1.31-.32.405-.213.755-.505 1.06-.868.303-.363.554-.768.74-1.226.186-.457.328-.94.43-1.442.1-.502.17-1.012.21-1.511.04-.469.155-.9.219-1.489l.094-.542c.09-.542.56-1.008 1.11-1.226.55-.218 1.19-.218 1.74 0 .55.218 1.02.684 1.11 1.226l.094.542-.005.026c-.052 1.458-1.274 2.65-2.772 2.65s-2.72-1.192-2.772-2.65l-.005-.026.094-.542zM12 15.75a3.75 3.75 0 100-7.5 3.75 3.75 0 000 7.5z" /></Icon>);
export const BrandIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg viewBox="0 0 120 40" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <defs>
      <linearGradient id="brand-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style={{stopColor: '#fb923c', stopOpacity: 1}} />
        <stop offset="100%" style={{stopColor: '#f97316', stopOpacity: 1}} />
      </linearGradient>
    </defs>
    <path d="M72.1,34.2c-2.3,1.3-4.9,2-7.7,2c-8.9,0-16.2-7.2-16.2-16.2S55.5,3.8,64.4,3.8c2.8,0,5.4,0.7,7.7,2l-1.9,3.3 c-2-1.1-4.2-1.7-6.5-1.7c-6.1,0-11,4.9-11,11s4.9,11,11,11c2.3,0,4.5-0.6,6.5-1.7L72.1,34.2z" fill="url(#brand-gradient)" />
    <path d="M64.4,11.5c-4.6,0-8.4,3.8-8.4,8.4s3.8,8.4,8.4,8.4s8.4-3.8,8.4-8.4S69,11.5,64.4,11.5z M64.4,25.3 c-2.9,0-5.3-2.4-5.3-5.3s2.4-5.3,5.3-5.3s5.3,2.4,5.3,5.3S67.3,25.3,64.4,25.3z" fill="url(#brand-gradient)" />
    <text x="0" y="30" fontFamily="Arial, sans-serif" fontSize="24" fontWeight="bold" fill="url(#brand-gradient)">The</text>
    <text x="78" y="30" fontFamily="Arial, sans-serif" fontSize="24" fontWeight="bold" fill="url(#brand-gradient)">rand</text>
  </svg>
);
export const UserCircleIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (<Icon {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z" /></Icon>);
export const LogoutIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (<Icon {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" /></Icon>);
export const ChevronDoubleLeftIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (<Icon {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M18.75 19.5l-7.5-7.5 7.5-7.5m-6 15L5.25 12l7.5-7.5" /></Icon>);
export const TrashIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (<Icon {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" /></Icon>);
export const PlusIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (<Icon {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></Icon>);
export const MinusIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (<Icon {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M18 12H6" /></Icon>);
export const MenuIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (<Icon {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" /></Icon>);
export const UserPlusIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (<Icon {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M19 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zM4 19.235v-.11a6.375 6.375 0 0112.75 0v.109A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766z" /></Icon>);
export const SearchIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (<Icon {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" /></Icon>);
export const PencilIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (<Icon {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" /></Icon>);
