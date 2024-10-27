'use client'
import React, { MouseEvent, useEffect, useState } from 'react'
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import AdbIcon from '@mui/icons-material/Adb';
import WbSunnyIcon from '@mui/icons-material/WbSunny';
import ModeNightIcon from '@mui/icons-material/ModeNight';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { clearUserInfo } from '@/redux/slices/userSlice';
import { clearCategoryInfo } from '@/redux/slices/categorySlice';
import Link from 'next/link';

import logo from '@/images/logo.png'
import Image from 'next/image';
import { RootState } from '@/redux/store/store';

const pages = [{ page: "Home", navigation: "/" }, { page: "Expenses", navigation: "/expenses" }];
const settings = ['Profile', 'Logout'];

const Navbar = () => {
    const router = useRouter()
    const [anchorElNav, setAnchorElNav] = useState<null | HTMLElement>(null);
    const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);

    const [isDarkMode, setIsDarkMode] = useState<boolean>(false)

    const userName = useSelector((state: RootState) => state.user.firstName)
    const userInfo = useSelector((state: RootState) => state.user)

    const dispatch = useDispatch()

    const handleOpenNavMenu = (event: MouseEvent<HTMLElement>) => {
        setAnchorElNav(event.currentTarget);
    };
    const handleOpenUserMenu = (event: MouseEvent<HTMLElement>) => {
        setAnchorElUser(event.currentTarget);
    };

    const handleCloseNavMenu = () => {
        setAnchorElNav(null);
    };

    const handleCloseUserMenu = (value: string) => {
        if (value === 'Logout') {
            // Cookies.remove('token', { path: '/' })
            localStorage.removeItem("token")
            dispatch(clearUserInfo())
            dispatch(clearCategoryInfo())
            router.push('/login')
        }
        if (value === 'Profile') {
            router.push('/profile')
        }
        setAnchorElUser(null);
    };

    const toggleDarkMode = () => {
        if (document.documentElement.classList.contains('dark')) {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('theme', 'light');
            setIsDarkMode(false);
        } else {
            document.documentElement.classList.add('dark');
            localStorage.setItem('theme', 'dark');
            setIsDarkMode(true);
        }
    };

    useEffect(() => {
        if (localStorage.getItem('theme') === 'dark') {
            document.documentElement.classList.add('dark');
            setIsDarkMode(true);
        }
    }, []);

    return (
        <AppBar position="static">
            <Container maxWidth="xl">
                <Toolbar disableGutters>

                    <Image src={logo} alt="App Logo" width={80} height={80} className="md:flex mr-1 hidden " />
                    <Link href={'/'}>
                        <Typography
                            variant="h6"
                            noWrap
                            component="a"
                            href="#app-bar-with-responsive-menu"
                            sx={{
                                mr: 3,
                                display: { xs: 'none', md: 'flex' },
                                fontFamily: 'monospace',
                                fontWeight: 700,
                                letterSpacing: '.3rem',
                                color: 'inherit',
                                textDecoration: 'none',
                            }}
                        >
                            আয়ব্যয়
                        </Typography>
                    </Link>

                    {/* For Mobile View Hanburg icon */}
                    <Box sx={{ flexGrow: 1, display: { sm: 'flex', md: 'none' } }}>
                        <IconButton
                            size="large"
                            aria-label="account of current user"
                            aria-controls="menu-appbar"
                            aria-haspopup="true"
                            onClick={handleOpenNavMenu}
                            color="inherit"
                        >
                            <MenuIcon />
                        </IconButton>
                        <Menu
                            id="menu-appbar"
                            anchorEl={anchorElNav}
                            anchorOrigin={{
                                vertical: 'bottom',
                                horizontal: 'left',
                            }}
                            keepMounted
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'left',
                            }}
                            open={Boolean(anchorElNav)}
                            onClose={handleCloseNavMenu}
                            sx={{ display: { xs: 'block', md: 'none' } }}
                        >
                            {pages.map((page) => (
                                <MenuItem key={page.page} onClick={handleCloseNavMenu}>
                                    <Link href={page.navigation}>{page.page}</Link>
                                </MenuItem>
                            ))}
                        </Menu>
                    </Box>
                    {/* <AdbIcon sx={{ display: { xs: 'flex', md: 'none' }, mr: 1 }} /> */}
                    {/* For mobile view icon */}

                    <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
                        {pages.map((page) => (
                            <Button
                                key={page.page}
                                onClick={handleCloseNavMenu}
                                sx={{ my: 2, color: 'white', display: 'block' }}
                            >
                                <Link href={page.navigation}>{page.page}</Link>

                            </Button>
                        ))}
                    </Box>
                    <Box sx={{ width: "100%", display: { xs: "flex", md: "none" }, justifyContent: "center" }}  >

                        {/* <Image src={logo} alt="App Logo" width={80} height={80} /> */}

                        <Link href={'/'}>
                        <Typography
                            variant="h6"
                            noWrap
                            component="a"
                            href="#app-bar-with-responsive-menu"
                            sx={{
                                mr: 3,
                                display: { xs: 'flex', md: 'none' },
                                fontFamily: 'monospace',
                                fontWeight: 700,
                                letterSpacing: '.3rem',
                                color: 'inherit',
                                textDecoration: 'none',
                            }}
                        >
                            আয়ব্যয়
                        </Typography>
                    </Link>
                    </Box>
                    <h6 className='mr-5'>{`Hi, ${userName && userName}`}</h6>
                    <Box sx={{ flexGrow: 0 }}>

                        <Tooltip title="Open settings">
                            <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                                <Avatar alt="User Image" src={userInfo.profileImageUrl ? userInfo.profileImageUrl : ""} />
                            </IconButton>
                        </Tooltip>
                        <Menu
                            sx={{ mt: '45px' }}
                            id="menu-appbar"
                            anchorEl={anchorElUser}
                            anchorOrigin={{
                                vertical: 'top',
                                horizontal: 'right',
                            }}
                            keepMounted
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'right',
                            }}
                            open={Boolean(anchorElUser)}
                            onClose={handleCloseUserMenu}
                        >
                            {settings.map((setting) => (
                                <MenuItem key={setting} onClick={() => handleCloseUserMenu(setting)}>
                                    <Typography sx={{ textAlign: 'center' }}>{setting}</Typography>
                                </MenuItem>
                            ))}
                        </Menu>
                        {/* <Tooltip title={isDarkMode ? "Light Mode" : "Dark Mode"}>
                            {
                                isDarkMode ? <WbSunnyIcon sx={{ ml: 3, cursor: "pointer" }} onClick={toggleDarkMode} /> : <ModeNightIcon sx={{ ml: 3, cursor: "pointer" }} onClick={toggleDarkMode} />
                            }

                        </Tooltip> */}
                    </Box>
                </Toolbar>
            </Container>
        </AppBar>
    )
}

export default Navbar