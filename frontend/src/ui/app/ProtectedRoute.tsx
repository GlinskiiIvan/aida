import React from 'react';
import { useNavigate } from 'react-router-dom';
import FallbackPage from './FallbackPage/FallbackPage';
import { useSelector } from 'react-redux';
import { selectUserData } from '@packages/store/slices/user';



interface ProtectedRouteProps {
    userPermissions: string[];
    requirePermissions: string[];
    redirectTo?: string;
    children: React.ReactNode;
    matchStrategy?: 'some' | 'every';
    onDeny?: 'redirect' | 'fallback';
    fallbackComponent?: React.ReactNode
}
const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
    userPermissions, requirePermissions,
    children,
    fallbackComponent = <FallbackPage />,
    redirectTo = '/', 
    matchStrategy = 'every', onDeny = 'fallback'
}) => {
    const navigate = useNavigate();
    const userData = useSelector(selectUserData);

    const hasAccess = requirePermissions[matchStrategy](role => userPermissions.includes(role)) || userData?.role.id === 1;
    const redirectIsAllow = !hasAccess && onDeny === 'redirect';
    const fallbackIsAllow = !hasAccess && (onDeny === 'fallback') && Boolean(fallbackComponent);

    React.useEffect(() => {
        if(redirectIsAllow) {
            navigate(redirectTo);
        }
    }, [hasAccess]);
    if(redirectIsAllow) return null;

    if(fallbackIsAllow) return fallbackComponent;

    return (<>{children}</>);
};

export default ProtectedRoute;