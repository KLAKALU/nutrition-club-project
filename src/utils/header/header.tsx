'use client'
import {useState} from 'react';
import { Navbar, NavbarContent,NavbarItem } from "@nextui-org/navbar";
import { Button } from "@nextui-org/button";
import { Card } from "@nextui-org/card";
import { logout } from '@/app/admin/serverActions';
import { FaUser } from "react-icons/fa6";

type AdminHeaderProps = {
    userEmail: string;
  }


  export default function AdminHeader({ userEmail }: AdminHeaderProps) {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };

    const handleLogout = () => {
        logout();
        setIsDropdownOpen(false);
    };

    return (
        <Navbar className="w-full">
            <NavbarContent className="w-full justify-end">
                <div className="relative">
                    <NavbarItem>
                        <button 
                            onClick={toggleDropdown}
                            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                        >
                            <FaUser className="text-gray-600" />
                        </button>
                    </NavbarItem>

                    {isDropdownOpen && (
                        <Card className="absolute right-0 mt-2 w-64 p-4 shadow-lg bg-white">
                            <div className="space-y-4">
                                <div className="text-sm text-gray-600">
                                    {userEmail}
                                </div>
                                <hr className="border-gray-200" />
                                <Button 
                                    onClick={handleLogout}
                                    className="w-full justify-center"
                                    color="primary" 
                                    variant="flat"
                                >
                                    ログアウト
                                </Button>
                            </div>
                        </Card>
                    )}
                </div>
            </NavbarContent>
        </Navbar>
    );
}