import { Card, Typography } from 'antd'
import React from 'react'

interface Prop {
    title: string;
    value: number;
}

const UserAgeStatistic = (prop: Prop) => {
    const { title, value } = prop

    return (
        <div
            className="border rounded p-3 text-center d-flex flex-column justify-content-center align-items-center"
            style={{ minWidth: '120px', minHeight: '100px', backgroundColor: '#e3f2fd' }}
        >
            <i className="bi bi-info-circle text-primary mb-2" style={{ fontSize: '24px' }}></i>
            <h5 className="mb-1 text-dark">
                <b>{title}</b>
            </h5>
            <p className="text-muted m-0" style={{ fontSize: "18px" }} >{value}</p>
        </div>
    )
}

export default UserAgeStatistic