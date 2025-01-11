import React, { useState } from "react";
const translations = {
  en: {
    advancedFilters: "Advanced Filters",
    gender: "Gender",
    male: "Male",
    female: "Female",
    other: "Other",
    age: "Age",
    ageRange: "Age Range",
    location: "Location",
    interests: "Interests",
    any: "Any",
    selectLocation: "Select Location",
    selectInterests: "Select Interests",
    applyFilters: "Apply Filters",
    done: "Done",
    music: "Music",
    movies: "Movies",
    sports: "Sports",
    traveling: "Traveling",
    reading: "Reading",
    cooking: "Cooking",
    fitness: "Fitness",
    technology: "Technology",
    gaming: "Gaming",
    fashion: "Fashion",
    photography: "Photography",
    hiking: "Hiking",
    art: "Art",
    gardening: "Gardening",
    dancing: "Dancing",
    writing: "Writing",
    yoga: "Yoga",
    meditation: "Meditation",
    theater: "Theater",
    cycling: "Cycling",
  },
  tr: {
    advancedFilters: "Gelişmiş Filtreler",
    gender: "Cinsiyet",
    male: "Erkek",
    female: "Kadın",
    other: "Diğer",
    age: "Yaş",
    ageRange: "Yaş Aralığı",
    location: "Konum",
    interests: "İlgi Alanları",
    any: "Herhangi",
    selectLocation: "Konum Seç",
    selectInterests: "İlgi Alanlarını Seç",
    applyFilters: "Filtreleri Uygula",
    done: "Tamam",
    music: "Müzik",
    movies: "Filmler",
    sports: "Sporlar",
    traveling: "Seyahat",
    reading: "Okuma",
    cooking: "Yemek Pişirme",
    fitness: "Fitness",
    technology: "Teknoloji",
    gaming: "Oyun",
    fashion: "Moda",
    photography: "Fotoğrafçılık",
    hiking: "Doğa Yürüyüşü",
    art: "Sanat",
    gardening: "Bahçecilik",
    dancing: "Dans",
    writing: "Yazı",
    yoga: "Yoga",
    meditation: "Meditasyon",
    theater: "Tiyatro",
    cycling: "Bisiklet Sürme",
  },
};

const FilterModal = ({
  user,
  closeModal,
  applyUserFilters,
  countries,
  handleOpenMoneyPanel,
}) => {
  const [activeTab, setActiveTab] = useState("gender");
  const [gender, setGender] = useState(user.filters.gender);
  const [minAge, setMinAge] = useState(user.filters.ageRange.min);
  const [maxAge, setMaxAge] = useState(user.filters.ageRange.max);
  const [location, setLocation] = useState(user.filters.location);
  const [interests, setInterests] = useState(user.filters.interests || []);
  const [showInterestsDropdown, setShowInterestsDropdown] = useState(false);
  const [showInterestsModal, setShowInterestsModal] = useState(false);

  const t = translations[user.userLanguage === "Türkçe" ? "tr" : "en"];

  const applyFilters = () => {
    if (!user.isPremium) {
      handleOpenMoneyPanel("Upgrade to premium to use Advance Filter.");
      return;
    }
    const filters = {
      gender,
      ageRange: {
        min: minAge,
        max: maxAge,
      },
      location,
      interests,
    };

    applyUserFilters(filters);
    closeModal();
  };

  const handleInterestClick = (interest) => {
    if (interests.includes(interest)) {
      setInterests(interests.filter((i) => i !== interest));
    } else {
      setInterests([...interests, interest]);
    }
  };

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-20"
      onClick={closeModal}>
      <div
        className="bg-white p-6 rounded-md shadow-md max-w-md w-full relative"
        onClick={(e) => e.stopPropagation()}>
        <button
          onClick={closeModal}
          className="absolute top-2 right-2 text-gray-600 hover:text-gray-900">
          <img src="/svg/close.svg" alt="" className="h-5 w-5" />
        </button>
        <h2 className="text-2xl font-bold mb-4">{t.advancedFilters}</h2>
        <div className="mb-4">
          <div className="flex border-b border-gray-300 mb-4">
            <button
              className={`py-2 px-4 ${
                activeTab === "gender"
                  ? "border-b-2 border-indigo-500 text-indigo-500"
                  : ""
              }`}
              onClick={() => handleTabClick("gender")}>
              {t.gender}
            </button>
            <button
              className={`py-2 px-4 ${
                activeTab === "age"
                  ? "border-b-2 border-indigo-500 text-indigo-500"
                  : ""
              }`}
              onClick={() => handleTabClick("age")}>
              {t.ageRange}
            </button>
            <button
              className={`py-2 px-4 ${
                activeTab === "location"
                  ? "border-b-2 border-indigo-500 text-indigo-500"
                  : ""
              }`}
              onClick={() => handleTabClick("location")}>
              {t.location}
            </button>
            <button
              className={`py-2 px-4 ${
                activeTab === "interests"
                  ? "border-b-2 border-indigo-500 text-indigo-500"
                  : ""
              }`}
              onClick={() => handleTabClick("interests")}>
              {t.interests}
            </button>
          </div>
          {activeTab === "gender" && (
            <div>
              <label className="block text-sm font-medium text-gray-700">
                {t.gender}
              </label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                className="w-full p-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent">
                <option value="">{t.any}</option>
                <option value="male">{t.male}</option>
                <option value="female">{t.female}</option>
                <option value="other">{t.other}</option>
              </select>
              <button
                onClick={applyFilters}
                className="mt-4 w-full py-2 bg-blue-500 text-white rounded-md hover:bg-blue-700">
                {t.applyFilters}
              </button>
            </div>
          )}
          {activeTab === "age" && (
            <div>
              <label className="block text-sm font-medium text-gray-700">
                {t.ageRange}
              </label>
              <div className="flex space-x-2">
                <input
                  type="number"
                  value={minAge}
                  onChange={(e) => setMinAge(+e.target.value)}
                  placeholder="Min"
                  className="w-1/2 p-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
                <input
                  type="number"
                  value={maxAge}
                  onChange={(e) => setMaxAge(+e.target.value)}
                  placeholder="Max"
                  className="w-1/2 p-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>
              <button
                onClick={applyFilters}
                className="mt-4 w-full py-2 bg-blue-500 text-white rounded-md hover:bg-blue-700">
                {t.applyFilters}
              </button>
            </div>
          )}
          {activeTab === "location" && (
            <div>
              <label className="block text-sm font-medium text-gray-700">
                {t.location}
              </label>
              <select
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full p-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent">
                <option value="">{t.selectLocation}</option>
                {countries.map((country, index) => (
                  <option key={index} value={country}>
                    {country}
                  </option>
                ))}
              </select>
              <button
                onClick={applyFilters}
                className="mt-4 w-full py-2 bg-blue-500 text-white rounded-md hover:bg-blue-700">
                {t.applyFilters}
              </button>
            </div>
          )}
          {activeTab === "interests" && (
            <div>
              <label className="block text-sm font-medium text-gray-700">
                {t.interests}
              </label>
              <div
                onClick={() => setShowInterestsModal(true)}
                className="w-full p-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent cursor-pointer">
                {interests.length > 0
                  ? interests.join(", ")
                  : t.selectInterests}
              </div>
              <button
                onClick={applyFilters}
                className="mt-4 w-full py-2 bg-blue-500 text-white rounded-md hover:bg-blue-700">
                {t.applyFilters}
              </button>
            </div>
          )}
        </div>
      </div>
      {showInterestsModal && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={() => setShowInterestsModal(false)}>
          <div
            className="bg-white p-6 rounded-md shadow-md max-w-md w-full relative"
            onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setShowInterestsModal(false)}
              className="absolute top-2 right-2 text-gray-600 hover:text-gray-900">
              X
            </button>
            <h2 className="text-2xl font-bold mb-4">{t.selectInterests}</h2>
            <div className="flex flex-wrap gap-2">
              {[
                t.music,
                t.movies,
                t.sports,
                t.traveling,
                t.reading,
                t.cooking,
                t.fitness,
                t.technology,
                t.gaming,
                t.fashion,
                t.photography,
                t.hiking,
                t.art,
                t.gardening,
                t.dancing,
                t.writing,
                t.yoga,
                t.meditation,
                t.theater,
                t.cycling,
              ].map((interest) => (
                <div
                  key={interest}
                  onClick={() => handleInterestClick(interest)}
                  className={`p-2 rounded-md cursor-pointer ${
                    interests.includes(interest)
                      ? "bg-purple-600 text-white"
                      : "bg-gray-200 text-gray-700"
                  }`}>
                  {interest}
                </div>
              ))}
            </div>
            <button
              onClick={() => setShowInterestsModal(false)}
              className="mt-4 w-full py-2 bg-blue-500 text-white rounded-md hover:bg-blue-700">
              {t.done}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FilterModal;
