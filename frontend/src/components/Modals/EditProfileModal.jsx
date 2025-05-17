import { UserCircleIcon } from "@heroicons/react/24/solid";
export default function EditProfileModal ({ isOpen, onClose, user, onSave}) {


    return (
        <div className="bg-gray-800 text-white rounded-lg p-6 max-w-md mx-auto shadow-lg">
          <div className="flex items-center mb-4">
            <UserCircleIcon className="h-10 w-10 mr-4"/>
            <div>
              <h2 className="text-xl font-bold">Helene Engels</h2>
              <p className="text-gray-400">Moderator</p>
            </div>
          </div>
          <p className="text-gray-300">Frontend Developer</p>
          <p className="text-gray-400">United States of America</p>
    
          <h3 className="mt-4 text-lg font-semibold">Biography</h3>
          <p className="text-gray-300">
            Hello, I'm Helene Engels, USA Designer, Creating things that stand out, Featured by Adobe, Figma, Webflow and others, Daily design tips & resources, Exploring Web3.
          </p>
    
          <h3 className="mt-4 text-lg font-semibold">Contact</h3>
          <p>Email Address: <span className="text-gray-300">helene@company.com</span></p>
          <p>Home Address: <span className="text-gray-300">92 Miles Drive, Newark, NJ 07103, California, United States of America</span></p>
          <p>Phone Number: <span className="text-gray-300">+1234 567 890 / +12 345 678</span></p>
    
          <h3 className="mt-4 text-lg font-semibold">Social</h3>
    
          <div className="mt-4 flex space-x-2">
            <button className="bg-blue-600 text-white px-4 py-2 rounded">Edit</button>
            <button className="bg-red-600 text-white px-4 py-2 rounded">Delete</button>
          </div>
        </div>
      );
    };
    