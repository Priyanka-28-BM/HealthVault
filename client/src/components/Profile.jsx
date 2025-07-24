import { useUser } from "../context/UserContext.jsx";
import Navbar2 from "./Navbar2.jsx";

const Profile = () => {
  const { userData, authUser, loading } = useUser();

  if (loading) {
    return (
      <div style={{ height: "100vh", width: "100vw" }}>
        <Navbar2 />
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          height: '50vh' 
        }}>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ height: "100vh", width: "100vw" }}>
      <Navbar2 />
      
      <div style={{ padding: '20px' }}>
        <h1>Hello, {userData?.name || 'User'}!</h1>
        <p>Email: {userData?.email || authUser?.email}</p>
        
        {/* Display additional profile information if available */}
        {userData?.age && <p>Age: {userData.age}</p>}
        {userData?.blood_group && <p>Blood Group: {userData.blood_group}</p>}
        {userData?.dob && <p>Date of Birth: {userData.dob}</p>}
        {userData?.height && <p>Height: {userData.height} cm</p>}
        {userData?.weight && <p>Weight: {userData.weight} kg</p>}
        
        {/* Show profile completion status */}
        {!userData?.name && (
          <div style={{ 
            backgroundColor: '#fff3cd', 
            border: '1px solid #ffecb3', 
            padding: '10px', 
            borderRadius: '5px',
            marginTop: '20px'
          }}>
            <p>👋 Complete your profile to get the most out of HealthVault!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;