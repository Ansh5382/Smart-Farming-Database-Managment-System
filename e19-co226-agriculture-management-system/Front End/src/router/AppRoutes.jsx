import { createBrowserRouter, Route, Routes } from 'react-router-dom';

// Farmer UI
import ReportDisease from '../containers/farmer/ReportDisease.jsx';
import UseMachine from '../containers/farmer/UseMachine.jsx';
import FarmerHome from '../containers/farmer/FarmerHome.jsx';
import Irrigation from '../containers/farmer/Irrigation.jsx';
import UseChemical from '../containers/farmer/UseChemical.jsx';
import Harvest from "../containers/farmer/Harvest.jsx";
import Storage from "../containers/farmer/Storage.jsx";
import UpdateSoil from '../containers/farmer/UpdateSoil.jsx';
import UpdateWeather from '../containers/farmer/UpdateWeather.jsx';
import SoilHealth from '../containers/farmer/SoilHealth.jsx';

// Owner UI
import OwnerHome from '../containers/owner/OwnerHome.jsx';
import ManageFarmers from '../containers/owner/FarmerDetails.jsx';
import AddFarmland from '../containers/owner/AddFarmland.jsx';

// Home
import NewHome from "../containers/Home.jsx";
import FarmerLayout from "../containers/FarmerLayout.jsx";
import OwnerLayout from "../containers/OwnerLayout.jsx";

// Login & SignUp pages
import SignupFarmer from "../containers/login/SignupFarmer.jsx";
import SignupOwner from "../containers/login/SignupOwner.jsx";
import Settings from '../containers/Settings.jsx';
import Profile from '../containers/Profile.jsx';
import Reports from '../containers/Reports.jsx';

const AppRoutes = () => {
    return <Routes>
        <Route path='/' element={<NewHome />} />
        <Route path='/signupfarmer' element={<SignupFarmer/>}/>
        <Route path='/signupowner' element={<SignupOwner/>}/>

        <Route element={<FarmerLayout/>}>
            <Route path='/farmerhome' element={<FarmerHome />} />
            <Route path='/reportdisease' element={<ReportDisease />} />
            <Route path='/usechemical' element={<UseChemical />} />
            <Route path='/usemachine' element={<UseMachine />} />
            <Route path='/irrigation' element={<Irrigation />} />
            <Route path='/harvest' element={<Harvest />} />
            <Route path='/storage' element={<Storage />} />
            <Route path='/updatesoil' element={<UpdateSoil />} />
            <Route path='/updateweather' element={<UpdateWeather />} />
            <Route path='/soilhealth' element={<SoilHealth />} />
            <Route path='/settings' element={<Settings role="farmer" />} />
            <Route path='/profile' element={<Profile role="farmer" />} />
            <Route path='/reports' element={<Reports role="farmer" />} />
        </Route>

        <Route element={<OwnerLayout/>}>
            <Route path='/ownerhome' element={<OwnerHome />} />
            <Route path='/addfarmer' element={<ManageFarmers />} />
            <Route path='/addfarmland' element={<AddFarmland />} />
            <Route path='/owner/settings' element={<Settings role="owner" />} />
            <Route path='/owner/profile' element={<Profile role="owner" />} />
            <Route path='/owner/reports' element={<Reports role="owner" />} />
        </Route>


    </Routes>
};

export default AppRoutes;
