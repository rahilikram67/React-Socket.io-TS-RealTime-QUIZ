import { Avatar, Box, Button, TextField } from "@mui/material"
import { useContext, useState } from "react"
import { GoogleLogin } from 'react-google-login';
import { useNavigate } from "react-router-dom";
import LoginContext from "../../hooks/loginContext"
export default function Login() {
    const [email, setEmail] = useState("")
    const [pass, setPass] = useState("")
    const route = useNavigate()
    const { setLogin } = useContext(LoginContext) as Login
    const handleLogin = () => {
        if (!email || !pass) return
        let who = email.includes("admin") ? "admin" : "student"
        setLogin(email)
        route(`/${who}`)
    }
    const handleGoogleLogin = (resp: any) => {
        let userEmail = resp.profileObj.email
        setLogin(userEmail)
        route({ pathname: '/student' })
    }

    return <>
        <Box
            sx={{
                width: 340,
                height: 340,
                backgroundColor: 'ButtonFace',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                margin: 'auto',
                boxShadow: '0px 0px 10px rgba(0,0,0,0.5)',
                borderRadius: 5
            }}
        >
            <Avatar src="https://picsum.photos/300/300" style={{
                width: 100,
                height: 100,
                margin: "auto",
                marginTop: 20,
            }} alt="" />
            <TextField
                label="Email"
                type="email"
                size="small"
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                style={{ display: "flex", margin: "20px auto 0 auto", width: '90%' }}
            />
            <TextField
                label="Password"
                type='password'
                size="small"
                onChange={(e) => setPass(e.target.value)}
                autoComplete="password"
                style={{ display: "flex", margin: "10px auto 0 auto", width: '90%' }}
            />
            <Button onClick={handleLogin} style={{ display: "flex", margin: "15px auto 0 auto", width: '50%' }} variant="contained" color="success">
                Success
            </Button>
            <div style={{ display: "flex", justifyContent: "center", marginTop: "10px" }}>
                <GoogleLogin
                    clientId={import.meta.env.VITE_APP_GOOGLE_CLIENT_ID as string}
                    buttonText="Login"
                    onSuccess={handleGoogleLogin}
                    onFailure={(resp) => { }}
                    cookiePolicy={'single_host_origin'}
                    render={renderProps => <Button onClick={renderProps.onClick} disabled={renderProps.disabled}>
                        <Avatar src="https://blog.hubspot.com/hubfs/image8-2.jpg" />
                    </Button>}
                />
            </div>
        </Box>
    </>
}
