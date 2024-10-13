import { Button, Card, Checkbox, Form, Input } from 'antd';
import { CheckboxChangeEvent } from 'antd/es/checkbox';
import { useForm } from 'antd/es/form/Form'
import React, { useState } from 'react'

type LoginObject = {
    email: string,
    password: string,
    rememberMe: boolean,
}

const Login = () => {

    const [loginForm] = useForm<LoginObject>();
    const [isLoading, setIsLoading] = useState(false)
    const [isRememberme, setIsRememberme] = useState(false)

    const handleFormSubmitted = async () => {

    }

    return (
        <Card title={'Login'}>
            <Form className='d-flex flex-column justify-start' form={loginForm} onFinish={handleFormSubmitted}>
                <Form.Item label={'Email'} required name={'email'} >
                    < Input />
                </Form.Item>
                <Form.Item label={'Password'} required name={'password'}>
                    <Input />
                </Form.Item>
                <Form.Item>
                    <div className='d-flex flex-row justify-start gap-2 '>
                        Remember me: <Checkbox value={isRememberme} onChange={(val: CheckboxChangeEvent) => setIsRememberme(val.target.checked)} />
                    </div>
                </Form.Item>
                <Button onClick={() => loginForm.submit()} type='primary'  >Login</Button>
            </Form >
        </Card>
    )
}

export default Login