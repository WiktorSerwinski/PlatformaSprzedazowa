import { useState, useEffect } from "react";
import apiService from "../../app/api/apiService";
import { useAppSelector } from "../../app/redux/configureReduxStore";
import ProfilePage from "./ProfilePage";

export default function Profile() {
    const { user } = useAppSelector((state) => state.account);
    const [address, setAddress] = useState<Address | null>(null);
    
    useEffect(() => {
      apiService.Account.fetchAddress()
        .then((a) => setAddress(a))
        .catch((error) => console.log(error));
    }, []);
    if(user)
    return(<ProfilePage user={user} address={address} />)}