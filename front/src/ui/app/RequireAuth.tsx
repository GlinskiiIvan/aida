import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import type { AppDispatch } from '../../store/store';
import { checkThunk, selectIsAuth } from '../../store/slices/auth';
import { ROUTES } from '../../routes';

interface IProps { 
    toNavigate?: string;
    children: React.ReactNode;
    basename?: string;
}

const RequireAuth: React.FC<IProps> = ({toNavigate = ROUTES.Login, children, basename = ''}) => {
    // const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();
    const isAuth = useSelector(selectIsAuth);

    // React.useEffect(() => {        
    //     dispatch(checkThunk());
    // }, []);

    React.useEffect(() => {
        if (!isAuth) {
            localStorage.setItem('originUrl', window.location.pathname.replace(basename, ''));
            navigate(toNavigate);
        }
    }, [isAuth]);

    if (!isAuth) return null;
    
    return (<>{children}</>);
};

export default RequireAuth;