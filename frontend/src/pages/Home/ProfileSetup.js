import React, { useState, useEffect, useRef } from "react";

import { Link } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import countries from "../../Data/countries.json";
import availableInterests from "../../Data/interests.json";
const languages = [
  // "Bahasa Melayu",
  // "Bosanski",
  // "Català",
  // "Čeština",
  // "Dansk",
  // "Deutsch",
  // "Eesti",
  "English",
  // "Español",
  // "Français",
  // "Hrvatski",
  // "Indonesia",
  // "Italiano",
  // "Latviešu",
  // "Lietuvių",
  // "Magyar",
  // "Malti",
  // "Nederlands",
  // "Norsk",
  // "Polski",
  // "Português",
  // "Română",
  // "Shqip",
  // "Slovenščina",
  // "Slovenský",
  // "Srpski",
  // "Suomi",
  // "Svenska",
  // "Tagalog",
  // "Tiếng Việt",
  "Türkçe",
  // "Ελληνικά",
  // "Български",
  // "Македонски",
  // "Русский",
  // "Українська",
  // "עברית",
  // "العربية",
  // "انگریزی",
  // "فارسی",
  // "हिन्दी",
  // "ไทย",
  // "한국어",
  // "中文",
  // "日本語",
  // "繁體中文",
];
const backendUrl = "http://localhost:5000";
const translations = {
  en: {
    profileTitle: "My Profile",
    name: "Name",
    email: "Email",
    gender: "Gender",
    male: "Male",
    female: "Female",
    couple: "Couple",
    language: "Language",
    country: "Country",
    age: "Age",
    interest: "Interest",
    selectInterests: "Select Interests",
    done: "Done",
    updateProfile: "Update Profile",
    logout: "Logout",
  },
  tr: {
    profileTitle: "Profilim",
    name: "İsim",
    email: "E-posta",
    gender: "Cinsiyet",
    male: "Erkek",
    female: "Kadın",
    couple: "Çift",
    language: "Dil",
    country: "Ülke",
    age: "Yaş",
    interest: "İlgi Alanları",
    selectInterests: "İlgi Alanlarını Seç",
    done: "Tamam",
    updateProfile: "Profili Güncelle",
    logout: "Çıkış Yap",
  },
};

const ProfileSetup = ({ isOpen, onClose, authUser, setLogoutTriggered }) => {
  const [name, setName] = useState(authUser?.name || "");
  const [gender, setGender] = useState(authUser?.userGender || "");
  const [language, setLanguage] = useState(authUser?.userLanguage || "");
  const [selectedCountry, setSelectedCountry] = useState(
    authUser?.userCountry || ""
  );
  const [age, setAge] = useState(authUser?.userAge || "");
  const [interests, setInterests] = useState(authUser?.userInterests || []);
  const [genderOpen, setGenderOpen] = useState(false);
  const [languageOpen, setLanguageOpen] = useState(false);
  const [countryOpen, setCountryOpen] = useState(false);
  const [showInterestsModal, setShowInterestsModal] = useState(false);
  const genderRef = useRef();
  const languageRef = useRef();
  const countryRef = useRef();
  const t = translations[language === "Türkçe" ? "tr" : "en"];

  useEffect(() => {
    function handleClickOutside(event) {
      if (genderRef.current && !genderRef.current.contains(event.target)) {
        setGenderOpen(false);
      }
      if (languageRef.current && !languageRef.current.contains(event.target)) {
        setLanguageOpen(false);
      }
      if (countryRef.current && !countryRef.current.contains(event.target)) {
        setCountryOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [genderRef, languageRef, countryRef]);

  const handleGenderSelect = (gender) => {
    setGender(gender);
    setGenderOpen(false);
    updateUserProfile({ userGender: gender });
  };

  const handleLanguageSelect = (language) => {
    setLanguage(language);
    setLanguageOpen(false);
    updateUserProfile({ userLanguage: language });
  };

  const handleCountrySelect = (country) => {
    setSelectedCountry(country);
    setCountryOpen(false);
    updateUserProfile({ userCountry: country });
  };

  const handleAgeChange = (e) => {
    const newAge = e.target.value;
    setAge(newAge);
    updateUserProfile({ userAge: newAge });
  };
  const handleNameChange = (e) => {
    const newName = e.target.value;
    setName(newName);
    updateUserProfile({ name: newName });
  };
  const setLogout = () => {
    setLogoutTriggered(true);
  };

  const handleInterestClick = (interest) => {
    const newInterests = interests.includes(interest)
      ? interests.filter((i) => i !== interest)
      : [...interests, interest];
    setInterests(newInterests);
    updateUserProfile({ userInterests: newInterests });
  };

  const updateUserProfile = (updateFields) => {
    // console.log("authUser._id: ", authUser._id);
    // console.log("updateFields: ", updateFields);
    axios
      .put(`${backendUrl}/api/items/User/${authUser?._id}`, updateFields)
      .then((response) => {
        // toast.success("Profile updated successfully");
        // console.log("response is: ", response);
      })
      .catch((error) => {
        console.error("Error updating profile", error);
      });
  };

  return (
    <div
      className={`fixed inset-0 z-50 overflow-auto ${
        isOpen ? "flex" : "hidden"
      } items-center justify-center`}>
      <div
        className="fixed inset-0 bg-gray-800 bg-opacity-50"
        onClick={onClose}></div>
      <div className="relative bg-white w-full max-w-md m-auto flex-col flex rounded-lg z-10 shadow-md">
        <div className="relative p-4">
          <div
            className="absolute right-2 top-2 cursor-pointer text-gray-500 hover:text-gray-800"
            onClick={onClose}>
            <img src="/svg/close.svg" alt="Close" className="h-5 w-5" />
          </div>
          <h2 className="text-xl font-semibold text-center mb-4">
            {t.profileTitle}
          </h2>
          <form>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="name" className="text-sm font-medium mb-1">
                  {t.name}
                </label>
                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={handleNameChange}
                  placeholder={t.name}
                  className="w-full p-2 rounded border border-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-transparent text-sm"
                  required
                />
              </div>
              <div>
                <label htmlFor="email" className="text-sm font-medium mb-1">
                  {t.email}
                </label>
                <input
                  id="email"
                  type="email"
                  value={authUser?.email}
                  placeholder={t.email}
                  className="w-full p-2 rounded border border-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-transparent text-sm"
                  disabled
                />
              </div>
              <div ref={genderRef}>
                <label className="text-sm font-medium mb-1">{t.gender}</label>
                <div
                  onClick={() => {
                    setGenderOpen(!genderOpen);
                    setLanguageOpen(false);
                    setCountryOpen(false);
                  }}
                  className="flex items-center bg-gray-100 py-2 px-4 rounded cursor-pointer hover:bg-gray-200">
                  {gender === "male" ? (
                    <img
                      src="/svg/male.svg"
                      alt={t.male}
                      className="h-6 mr-2"
                    />
                  ) : gender === "female" ? (
                    <img
                      src="/svg/female.svg"
                      alt={t.female}
                      className="h-6 mr-2"
                    />
                  ) : (
                    <img
                      src="/svg/couple.svg"
                      alt={t.couple}
                      className="h-6 mr-2"
                    />
                  )}
                  <span className="text-sm font-medium">{t[gender]}</span>
                </div>
                {genderOpen && (
                  <div className="mt-1 border border-gray-300 rounded shadow-sm bg-white absolute z-40 drop-shadow-md">
                    <div
                      onClick={() => handleGenderSelect("male")}
                      className="flex items-center py-2 px-4 cursor-pointer hover:bg-gray-100">
                      <span className="text-sm font-medium mr-2">{t.male}</span>
                      <img src="/svg/male.svg" alt={t.male} className="h-6" />
                    </div>
                    <div
                      onClick={() => handleGenderSelect("female")}
                      className="flex items-center py-2 px-4 cursor-pointer hover:bg-gray-100">
                      <span className="text-sm font-medium mr-2">
                        {t.female}
                      </span>
                      <img
                        src="/svg/female.svg"
                        alt={t.female}
                        className="h-6"
                      />
                    </div>
                    <div
                      onClick={() => handleGenderSelect("couple")}
                      className="flex items-center py-2 px-4 cursor-pointer hover:bg-gray-100">
                      <span className="text-sm font-medium mr-2">
                        {t.couple}
                      </span>
                      <img
                        src="/svg/couple.svg"
                        alt={t.couple}
                        className="h-6"
                      />
                    </div>
                  </div>
                )}
              </div>

              <div ref={languageRef}>
                <label className="text-sm font-medium mb-1">{t.language}</label>
                <div
                  onClick={() => {
                    setLanguageOpen(!languageOpen);
                    setGenderOpen(false);
                    setCountryOpen(false);
                  }}
                  className="flex items-center bg-gray-100 py-2 px-4 rounded cursor-pointer hover:bg-gray-200">
                  <span className="text-sm font-medium">{language}</span>
                </div>
                {languageOpen && (
                  <div className="mt-1 border border-gray-300 rounded shadow-sm bg-white absolute z-40 drop-shadow-md">
                    <div className="grid grid-cols-2 gap-1 p-2">
                      {languages.map((lang, index) => (
                        <div
                          key={index}
                          onClick={() => handleLanguageSelect(lang)}
                          className="hover:bg-gray-100 cursor-pointer text-center p-2 rounded text-sm font-medium">
                          {lang}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div ref={countryRef}>
                <label className="text-sm font-medium mb-1">{t.country}</label>
                <div
                  onClick={() => {
                    setCountryOpen(!countryOpen);
                    setGenderOpen(false);
                    setLanguageOpen(false);
                  }}
                  className="flex items-center bg-gray-100 py-2 px-4 rounded cursor-pointer hover:bg-gray-200">
                  <span className="text-sm font-medium">{selectedCountry}</span>
                </div>
                {countryOpen && (
                  <div className="mt-1 border  rounded shadow-sm bg-white absolute z-40 w-[94%] max-h-52 overflow-y-scroll drop-shadow-md">
                    <div className="grid grid-cols-2 gap-1 p-2">
                      {countries.map((country, index) => (
                        <div
                          key={index}
                          onClick={() => handleCountrySelect(country)}
                          className="hover:bg-gray-100 cursor-pointer text-center p-2 rounded text-sm font-medium">
                          {country}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <label htmlFor="age" className="text-sm font-medium mb-1">
                  {t.age}
                </label>
                <input
                  id="age"
                  type="number"
                  value={age}
                  onChange={handleAgeChange}
                  placeholder={t.age}
                  className="w-full p-2 rounded border border-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-transparent text-sm"
                  required
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1">{t.interest}</label>
                <div
                  onClick={() => setShowInterestsModal(true)}
                  className="w-full p-2 rounded border border-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-transparent cursor-pointer text-sm">
                  {interests.length > 0
                    ? interests.join(", ")
                    : t.selectInterests}
                </div>
                {showInterestsModal && (
                  <div
                    className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
                    onClick={() => setShowInterestsModal(false)}>
                    <div
                      className="bg-white p-4 rounded shadow-lg max-w-md w-full relative"
                      onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={() => setShowInterestsModal(false)}
                        className="absolute top-2 right-2 text-gray-500 hover:text-gray-800 text-sm">
                        X
                      </button>
                      <h2 className="text-lg font-semibold mb-4">
                        {t.selectInterests}
                      </h2>
                      <div className="flex flex-wrap gap-2">
                        {availableInterests.map((interest) => (
                          <div
                            key={interest}
                            onClick={() => handleInterestClick(interest)}
                            className={`p-2 rounded-full cursor-pointer text-xs ${
                              interests.includes(interest)
                                ? "bg-blue-600 text-white"
                                : "bg-gray-200 text-gray-700"
                            }`}>
                            {interest}
                          </div>
                        ))}
                      </div>
                      <button
                        onClick={() => setShowInterestsModal(false)}
                        className="mt-4 w-full py-2 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm">
                        {t.done}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <button
              type="submit"
              className="w-full mt-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 font-semibold text-sm"
              onClick={onClose}>
              {t.updateProfile}
            </button>
          </form>
          <button
            onClick={() => setLogout()}
            className="w-full py-2 mt-3 text-red-500 border-[1px] border-red-500 rounded hover:bg-red-600 hover:text-white font-semibold text-sm text-center">
            {t.logout}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileSetup;
