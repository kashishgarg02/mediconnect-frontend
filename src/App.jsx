import React from 'react'
import IndexPage from './Index'
import { Routes, Route } from 'react-router-dom'
import Signup from './Signup'
import Login from './Login'
import DonorDashboard from './Donordash'
import NeedyDashboard from './Needydash'
import Navbar from './Navbar'
import DonorProfile from './Donardetails'
import MedicineDonation from './Availmed'
import MedicineList from './Listedmed'
import NeedyForm from './Needyprofile'
import MedicineFinder from './Medfinder'
import Navbar2 from './Navbar2'
import EquipmentDonation from './Donorequip'
import EquipmentFinder from './Needyequip'

function App() {
  return (

    <>

      <Routes>

        < Route path='/' element={<IndexPage></IndexPage>} ></Route>
        < Route path='/signup' element={<Signup></Signup>} ></Route>
        < Route path='/login' element={<Login></Login>} ></Route>
        <Route path="/donor-dashboard" element={<DonorDashboard />} />

        <Route
          path="/dprofile" element={
            <>
              <Navbar />
              <DonorProfile />
            </>
          }
        />
        <Route
          path="/availmed" element={
            <>
              <Navbar />
              <MedicineDonation />
            </>
          }
        />
        <Route
          path="/listedmed" element={
            <>
              <Navbar />
              <MedicineList />
            </>
          }
        />
        <Route
          path="/availequip" element={
            <>
              <Navbar />
              <EquipmentDonation />
            </>
          }
        />


        <Route path="/needy-dashboard" element={<NeedyDashboard />} />
        <Route
          path="/nprofile" element={
            <>
              <Navbar2 />
              <NeedyForm />
            </>
          }
        />
        <Route
          path="/medfinder" element={
            <>
              <Navbar2 />
              <MedicineFinder />
            </>
          }
        />
         <Route
          path="/equipfinder" element={
            <>
              <Navbar2 />
              <EquipmentFinder />
            </>
          }
        />

      </Routes>

    </>

  )
}

export default App