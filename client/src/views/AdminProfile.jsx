import React, {useState, useEffect} from "react";
import axios from "axios";
import {useNavigate} from "react-router-dom";
import { Toaster, toast } from 'sonner'
import {isAuth, getCookie, signout, updateUser} from "../auth/Helpers";
import img from '../assets/img.jpeg';

const AdminProfile = () => {

  const [userData, setUserData] = useState({
    role : "",
    name: "",
    email: "",
    phone: "",
    password: "",
    buttonText: "Update", 
});

  const [showModal, setShowModal] = useState(false);
  const [profilePhoto, setProfilePhoto] = useState(null);


  const handleProfilePhotoChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePhoto(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const navigate = useNavigate(); 

  const token = getCookie("token");

  useEffect(() => {
      loadProfile();
  },[]);

  function loadProfile(){
      axios({
          method: "GET",
          url: `http://localhost:8000/api/user/${isAuth()._id}`,
          headers: {
              Authorization: `Bearer ${token}`
          }
      })
      .then(function(response) {
          console.log("PRIVATE PROFILE UPDATE", response);
          const {role, name, email, phone} = response.data;
          setUserData({...userData, role, name, email, phone});
      }
      )
      .catch(function(error) {
          console.log("PRIVATE PROFILE UPDATE ERROR", error.response.data.error);
          if(error.response.status === 401){
              signout(() => {
                  navigate("/", {replace: true});
              });
              toast.error(error.response.data.error);
          }
      });
  }

  const {role,name, email, phone, password} = userData;

  function handleChange(name, event) {
      setUserData({...userData, [name]: event.target.value});
  }
  

  function clickSubmit(event) {
      event.preventDefault();
      setUserData({...userData});
      axios({
          method: "PUT",
          url: `http://localhost:8000/api/user/update`,
          headers: {
              Authorization: `Bearer ${token}`
          },
          data: {name, phone, password}
      })
      .then(function(response) {
          console.log("PRIVATE PROFILE UPDATE SUCCESS", response);
          updateUser(response, () => {
              setUserData({...userData});
              toast.success("Profile updated successfully");
          }); 
      })
      .catch(function(error) {
          console.log("PRIVATE PROFILE UPDATE ERROR", error.response.data.error);
          setUserData({...userData});
          toast.error(error.response.data.error);
      });
  }
  

  return (
    <div>
      <Toaster richColors position="top-right" expand='true' />
      <div className="max-w-md mx-auto bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
      <h2 className="text-xl font-semibold mb-4 text-center">Admin Profile</h2>
      <div className="flex items-center justify-center mb-4">
        <label htmlFor="profilePhoto" className="relative cursor-pointer">
          <img
            src={profilePhoto || img }
            alt="Profile"
            className="h-24 w-24 rounded-full object-cover border-4 border-white shadow-md"
          />
          <input
            type="file"
            id="profilePhoto"
            accept="image/*"
            className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
            onChange={handleProfilePhotoChange}
          />
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-full opacity-0 hover:opacity-100 transition-opacity duration-300">
            <span className="text-white text-sm">Change Photo</span>
          </div>
        </label>
      </div>
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
          Name
        </label>
        <input
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          id="name"
          type="text"
          onChange={(e) => handleChange("name",e)}
          value={name}
          required
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
          Email
        </label>
        <input
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          id="email"
          type="email"
          defaultValue={email}
          disabled
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="phoneNumber">
          Phone Number
        </label>
        <input
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          id="phoneNumber"
          type="tel"
          value={phone}
          onChange={(e) => handleChange("phone",e)}
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="role">
          Role
        </label>
        <input
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          id="role"
          type="text"
          defaultValue={role}
          disabled
        />
      </div>
      <div className="mb-6 flex justify-between">
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          onClick={() => setShowModal(true)}
        >
          Change Password
        </button>
        <button
          className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          onClick={clickSubmit}
        >
          Update Profile
        </button>
      </div>
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-x-hidden overflow-y-auto">
          <div className="fixed inset-0 bg-gray-500 opacity-75"></div>
          <div className="relative z-50 bg-white rounded-lg shadow-lg overflow-y-auto">
            <div className="flex items-start justify-between p-5 border-b border-solid border-blueGray-200 rounded-t">
              <h3 className="text-3xl font-semibold">Change Password</h3>
              <button
                className="p-1 ml-auto bg-transparent border-0 text-black float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
                onClick={() => setShowModal(false)}
              >
                <span className="bg-transparent text-black h-6 w-6 text-2xl block outline-none focus:outline-none">×</span>
              </button>
            </div>
            <div className="relative p-6 flex-auto">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
                New Password
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mb-4"
                id="newPassword"
                type="password"
                placeholder="Enter new password"
                onChange={(e) => handleChange("password",e)}
                value={password}
              />
            </div>
            <div className="flex items-center justify-end p-6 border-t border-solid border-blueGray-200 rounded-b">
              <button
                className="text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1"
                type="button"
                onClick={() => setShowModal(false)}
              >
                Close
              </button>
              <button
                className="bg-green-500 text-white active:bg-green-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1"
                onClick={clickSubmit}
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
    </div>

  );
};

export default AdminProfile;
