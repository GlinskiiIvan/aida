import React from 'react';
import styles from './Modal.module.scss';
import type { BlockProps } from '../Block';
import Block from '../Block';
import IconButton from '../IconButton';
import clsx from 'clsx';
import { createPortal } from 'react-dom';

export type ModalOptions = {
  readonly show: boolean;
  readonly active: boolean;
  readonly hash: string;
  readonly open: () => void;
  readonly close: (fallbackHash?: string) => void;
}

interface ModalProps extends BlockProps {
    options: ModalOptions;
}

const Modal: React.FC<ModalProps> = ({
    options,
    children,
    ...props
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
            <Block fullWidth className={styles.modal} {...props} 
                actions={<IconButton icon={{name: 'CLOSE', size: 'xl'}} onClick={onCloseHandler } />} >
                <div className={styles.body}>
                    {children}
                </div>
            </Block>
        </div>,
        document.body
    );
};

export default Modal;