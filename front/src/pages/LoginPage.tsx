import React from 'react';
import { Block, Button, Page, Stack, TextField } from '../ui/copmonents';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch } from '../store/store';
import { useNavigate } from 'react-router-dom';
import { loginThunk, selectUser } from '../store/slices/auth';
import { addNotice } from '../store/slices/notices';
import { ROUTES } from '../routes';
import { useTranslation } from 'react-i18next';

type LoginData = {
    email: string;
    password: string;
};

const LoginPage = () => {
    const {t} = useTranslation();
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();
    const userData = useSelector(selectUser);

    
    const [loginInputs, setLoginInputs] = React.useState<LoginData>({
        email: '',
        password: '',
    });

    const loginHandler = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.preventDefault();
        await dispatch(loginThunk({email: loginInputs.email, password: loginInputs.password}));
    }

    React.useEffect(() => {
        if(userData.status === 'SUCCESS' && Boolean(userData.userData)) {
            dispatch(addNotice({type: 'success', message: t('notification.success.auth')}));

            const originUrl = localStorage.getItem('originUrl');
            const to = (originUrl !== ROUTES.Login) ? (originUrl || ROUTES.Main) : ROUTES.Main;
            navigate(to);
        }
        if(userData.status === 'ERROR' && Boolean(userData.error)) {
            dispatch(addNotice({type: 'error', message: t('notification.error.auth')}));
        }
    }, [userData.status]);

    return (
        <Page>
            <Block 
                decorativeIcon='INFO' title={t('pages.login.title')}
                fullWidth style={{maxWidth: '50%'}}>
                <Stack direction='column' gap='md' justify='center' align='stretch'>
                    <TextField
                        label={t('pages.login.fields.email')} placeholder={t('pages.login.placeholders.email')} 
                        validation={{status: 'default', messages: []}}
                        value={loginInputs.email} onChangeValue={(value: string) => setLoginInputs(prev => ({...prev, email: value}))} />
                    <TextField
                        type='password'
                        label={t('pages.login.fields.password')} placeholder={t('pages.login.placeholders.password')} 
                        validation={{status: 'default', messages: []}}
                        value={loginInputs.password} onChangeValue={(value: string) => setLoginInputs(prev => ({...prev, password: value}))} />
                    <Button onClick={loginHandler} variant='primary' intent='normal' size='md'>{t('actions.login')}</Button>
                </Stack>
            </Block>
        </Page>
    );
};

export default LoginPage;