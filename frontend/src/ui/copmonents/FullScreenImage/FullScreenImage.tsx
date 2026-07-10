import React from 'react';
import styles from './FullScreenImage.module.scss';
import type { BlockProps } from '../Block';
import Block from '../Block';
import IconButton from '../IconButton';
import clsx from 'clsx';
import { createPortal } from 'react-dom';

export type FullScreenImageOptions = {
  readonly show: boolean;
  readonly active: boolean;
  readonly hash: string;
  readonly open: () => void;
  readonly close: (fallbackHash?: string) => void;
}

interface FullScreenImageProps extends BlockProps {
    options: FullScreenImageOptions;
}

const FullScreenImage: React.FC<FullScreenImageProps> = ({
    options,
    children,
}) => {

    const wrapperRef = React.useRef<HTMLDivElement>(null);

    const classesWrapper = clsx(styles.wrapper, {[styles.open]: options.show});

    const onCloseHandler = React.useCallback(() => {
        options.close();
    }, [options.close]);

    React.useEffect(() => {
        if(!options.show) return;

        const handleClickOutside = (e: MouseEvent) => {
            if(e.target === wrapperRef.current) {
                onCloseHandler();
            }
        }

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [onCloseHandler, options.show]);

    React.useEffect(() => {
        if(!options.show) return;

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                onCloseHandler();
            }
        };

        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [onCloseHandler, options.show]);

    return createPortal(
        <div ref={wrapperRef} className={classesWrapper}>
            {children}
        </div>,
        document.body
    );
};

export default FullScreenImage;