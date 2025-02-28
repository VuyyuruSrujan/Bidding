import { useEffect, useState } from "react";
import { AuthClient } from "@dfinity/auth-client";
import { useNavigate } from "react-router-dom";
import './Signup.css';


export default function Signup() {
    const navigate = useNavigate();
   const [principal, setPrincipal] = useState(null);
   const [check , setcheck] = useState(null);

   useEffect(()=>{
    var prin = localStorage.getItem("principal");
    setcheck(prin)
    console.log(prin)
   },[])

   async function handleConnect() {
      const authClient = await AuthClient.create();
      authClient.login({
         maxTimeToLive: BigInt(7 * 24 * 60 * 60 * 1000 * 1000 * 1000),
         identityProvider: "https://identity.ic0.app/#authorize",
         onSuccess: async () => {
            const identity = await authClient.getIdentity();
            const principal = identity.getPrincipal().toText(); // Extract principal as text
            setPrincipal(principal);
            localStorage.setItem("principal" , principal);
            window.location.reload();
         },
      });
   }

   useEffect(() => {
      async function init() {
         const authClient = await AuthClient.create();
         if (await authClient.isAuthenticated()) {
            const identity = await authClient.getIdentity();
            const principal = identity.getPrincipal().toText(); // Extract principal as text
            setPrincipal(principal);
            localStorage.setItem("principal" , principal);
         }
      }
      init();
   }, []);


   async function handleLogout() {
    const authClient = await AuthClient.create();
    authClient.logout(); 
    setPrincipal("");
    localStorage.removeItem("principal");
    window.location.reload();
    navigate('/');
  }

   return (
      <>    
       {check ? (
                <button id="ConnectBtn" onClick={handleLogout}>Logout</button>
            ) : (
                <button id="ConnectBtn" onClick={handleConnect}>Connect</button>
        )}
      </>
   );
}