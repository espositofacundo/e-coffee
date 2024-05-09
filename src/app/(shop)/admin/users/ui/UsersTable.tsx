'use client';

import React from 'react'
import { User } from '@/interfaces/user.interface';
import { changeUserRole } from '@/actions/user/change-user-role';

interface Props{
    users:User[];
}

const UsersTable = ({users}: Props) => {
  return (
    <div>
         <table className="min-w-full">
          <thead className="bg-gray-200 border-b">
            <tr>
              <th
                scope="col"
                className="text-sm font-medium text-gray-900 pl-1 py-4 text-left"
              >
                #ID
              </th>
              <th
                scope="col"
                className="text-sm font-medium text-gray-900 pl-1 py-4 text-left"
              >
                Email
              </th>
              <th
                scope="col"
                className="text-sm font-medium text-gray-900 pl-1 py-4 text-left"
              >
                Rol
              </th>
              <th
                scope="col"
                className="text-sm font-medium text-gray-900 pl-1 py-4 text-left"
              >
                Sus ordenes
              </th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="bg-white border-b transition duration-300 ease-in-out hover:bg-gray-100">
                <td className="pl-1 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  <span>{user.id}</span>
                </td>
                <td className="pl-1 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  <span>{user.email}</span>
                </td>
                <td className="pl-1 py-4 whitespace-nowrap text-sm font-medium text-gray-900">

                  <select
                  value={user.role}
                  onChange={e => changeUserRole(user.id , e.target.value)}
                   className='text-sm w-full'>
                    <option value='admin'>Admin</option>
                    <option value='user'>User</option>
                    
                  </select>
                </td>
                <td className="pl-1 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  <span>aaa</span>
                </td>
                
               
                
              </tr>
            ))}
          </tbody>
        </table>
      
    </div>
  )
}

export default UsersTable
