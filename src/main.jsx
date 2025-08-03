import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import Signup from './Signup'
import Login from './Login'
import DonorProfile from './Donardetails'
import MedicineDonation from './Availmed'
import MedicineList from './Listedmed'
import NeedyProfile from './Needyprofile'
import IndexPage from './Index'
import App from './App'
import { BrowserRouter } from 'react-router-dom'
import NeedyForm from './Needyprofile'
import MedicineFinder from './Medfinder'
import DonorDashboard from './Donordash'
import NeedyDashboard from './Needydash'
import Navbar from './Navbar'
import EquipmentDonation from './Donorequip'
import EquipmentFinder from './Needyequip'



createRoot(document.getElementById('root')).render(
 <>
 <BrowserRouter>
 <App></App>
 </BrowserRouter>
 {/* <Signup></Signup> */}
 {/* <Login></Login> */}
 {/* <DonorProfile></DonorProfile> */}
 {/* <MedicineDonation></MedicineDonation> */}
 {/* <MedicineList></MedicineList> */}
 {/* <NeedyProfile></NeedyProfile> */}
 {/* <IndexPage></IndexPage> */}
 {/* <NeedyForm></NeedyForm> */}
 {/* <MedicineFinder></MedicineFinder> */}
{/* <DonorDashboard></DonorDashboard> */}
{/* <NeedyDashboard></NeedyDashboard> */}
{/* <Navbar></Navbar> */}
{/* <EquipmentDonation></EquipmentDonation> */}
{/* <EquipmentFinder></EquipmentFinder> */}


 </>
)
