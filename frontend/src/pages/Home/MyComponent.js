// import React from "react";

// function MyComponent({
//   title,
//   user,
//   items,
//   onClick,
//   header,
//   style,
//   className,
// }) {
//   return (
//     <div className={className} style={style}>
//       {header}
//       <h1>{title}</h1>
//       <p>
//         {user.name}, {user.age} years old
//       </p>
//       <ul>
//         {items.map((item, index) => (
//           <li key={index}>{item}</li>
//         ))}
//       </ul>
//       <button onClick={onClick}>Click Me</button>
//     </div>
//   );
// }

// export default MyComponent;

import React from "react";

function ProfileCard({
  name,
  age,
  hobbies,
  profilePicture,
  onFollow,
  renderAdditionalInfo,
  style,
  className,
}) {
  return (
    <div className={`profile-card ${className}`} style={style}>
      <img
        src={profilePicture}
        alt={`${name}'s profile`}
        className="profile-picture"
      />
      <h2>{name}</h2>
      <p>Age: {age}</p>
      <h3>Hobbies</h3>
      <ul>
        {hobbies.map((hobby, index) => (
          <li key={index}>{hobby}</li>
        ))}
      </ul>
      <button onClick={onFollow} className="follow-button">
        Follow
      </button>
      <div className="additional-info">
        {renderAdditionalInfo && renderAdditionalInfo()}
      </div>
    </div>
  );
}

export default ProfileCard;
