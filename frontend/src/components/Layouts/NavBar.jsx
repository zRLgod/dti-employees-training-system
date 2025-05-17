import React, { useState, useEffect, useMemo } from "react";
import { Link, useLocation } from "react-router-dom";
import { HomeIcon, UsersIcon, BookOpenIcon, UserGroupIcon, DocumentIcon, ArrowTrendingUpIcon, ChevronDownIcon, } from "@heroicons/react/24/solid";
import { useAuth } from "../../context/AuthContext";

const Navbar = () => {
  const location = useLocation();
  const { user } = useAuth();
  const [isProgressOpen, setIsProgressOpen] = useState(false);
  const [userToggledProgress, setUserToggledProgress] = useState(false);

  const allMenus = useMemo(() => [
    { title: "Dashboard", icon: <HomeIcon className="h-5 w-5 mr-2" />, path: "/dashboard" },
    { title: "Users", icon: <UsersIcon className="h-5 w-5 mr-2" />, path: "/usermanage" },
    { title: "Employees", icon: <UserGroupIcon className="h-5 w-5 mr-2" />, path: "/employeemanage" },
    { title: "Trainings", icon: <BookOpenIcon className="h-5 w-5 mr-2" />, path: "/trainingmanage" },
    {
      title: "Progress",
      icon: <ArrowTrendingUpIcon className="h-5 w-5 mr-2" />,
      hasSubmenu: true,
      submenu: [
        { title: "Learning Action Plan", path: "/LAP" },
        { title: "Employee Progress", path: "/employeeprogress" },
      ],
    },
    { title: "Reports", icon: <DocumentIcon className="h-5 w-5 mr-2" />, path: "/reports" },
  ], []);

  const Menus = useMemo(() => {
    if (user && user.user_role) {
      if (user.user_role.toLowerCase() === "employee") {
        return allMenus.filter(menu =>
          menu.title === "Trainings" || menu.title === "Progress"
        );
      } else if (user.user_role.toLowerCase() === "supervisor") {
        return allMenus.filter(menu => menu.title !== "Users");
      }
    }
    return allMenus;
  }, [user, allMenus]);

  const isSubmenuActive = (submenu) =>
    submenu.some((sub) => location.pathname === sub.path);

  useEffect(() => {
    
    const progressMenu = Menus.find((menu) => menu.hasSubmenu);
    if (progressMenu && progressMenu.submenu.some((sub) => location.pathname === sub.path)) {
      if (!isProgressOpen && !userToggledProgress) {
        setIsProgressOpen(true);
      }
    } else {
      if (isProgressOpen && !userToggledProgress) {
        setIsProgressOpen(false);
      }
    }
  }, [location.pathname, Menus, isProgressOpen, userToggledProgress]);

  const toggleProgress = () => {
    setIsProgressOpen(!isProgressOpen);
    setUserToggledProgress(true);
  };

  return (
    <nav
      className="bg-blue-600 fixed top-0 left-0 h-full w-64 mt-20"
      role="navigation">
      <ul className="space-y-2 font-bold">
        {Menus.map((menu, index) => (
          <li key={index} className="w-full">
            {menu.hasSubmenu ? (
              <>
                <button
                  className={`flex items-center w-full py-4 px-3 text-white transition-all duration-200 ${
                    isProgressOpen || isSubmenuActive(menu.submenu)
                      ? "bg-blue-800"
                      : "hover:bg-blue-700"}`}
                  onClick={toggleProgress}>
                  {menu.icon}
                  {menu.title}
                  <ChevronDownIcon
                    className={`h-4 w-4 ml-auto transition-transform ${
                      isProgressOpen ? "rotate-180" : ""}`}/>
                </button>

                {isProgressOpen && (
                  <ul className="space-y-1 mt-1">
                    {menu.submenu.map((sub, subIndex) => (
                      <li key={subIndex}>
                        <Link
                          to={sub.path}
                          className={`block w-full pl-9 py-3 px-3 text-white text-sm transition-all duration-200 ${
                            location.pathname === sub.path
                              ? "bg-blue-800"
                              : "hover:bg-blue-700"}`}>
                          {sub.title}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </>
            ) : (
              <Link
                to={menu.path}
                className={`flex items-center py-4 px-3 text-white transition-all duration-200 ${
                  location.pathname === menu.path
                    ? "bg-blue-800"
                    : "hover:bg-blue-700"}`} >
                {menu.icon}
                {menu.title}
              </Link>
            )}
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default Navbar;
