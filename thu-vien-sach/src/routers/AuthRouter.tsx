import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Login from '../pages/auth/Login'

const AuthRouter = () => {
    return (
        <div className="container-fluid">
            <div className="row  ">
                <div className="col d-none h-100vh d-lg-block mt-4 center">
                    <div>
                        <img src='images/logo.png' style={{ width: 500, objectFit: 'cover' }} alt='Application logo' />
                        <h4>Thư viện sách</h4>
                    </div>
                </div>
                <div className="col center">
                    <BrowserRouter>
                        <Routes>
                            <Route path='/' element={<Login />} />
                        </Routes>
                    </BrowserRouter>
                </div>
            </div>

        </div>
    )
}

export default AuthRouter