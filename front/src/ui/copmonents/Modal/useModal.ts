import React from 'react'

const modalStack: string[] = []

export const useModal = (hash: string = 'hash') => {
  const [show, setShow] = React.useState(false)
  const [active, setActive] = React.useState(false)

  const open = () => {
      modalStack.push(hash)
      setShow(true)
      setTimeout(() => setActive(true), 10)
  }

  const close = (fallbackHash?: string) => {
    if (active) {
      setActive(false)
      setTimeout(() => {
        setShow(false)
        const idx = modalStack.indexOf(fallbackHash || hash)
        if (idx !== -1) modalStack.splice(idx, 1)
      }, 500)
    }
  }

  React.useEffect(() => {
        if (modalStack.length === 0) return;

        const scrollBarWidth = window.innerWidth - document.documentElement.clientWidth;
        const currentPaddingRight = (getComputedStyle(document.body).paddingRight).replace('px', '');
        

        document.body.style.overflow = 'hidden';
        document.body.style.paddingRight = `${Number(currentPaddingRight) + scrollBarWidth}px`;

        return () => {
            document.body.style.overflow = '';
            document.body.style.paddingRight = '';
        };
    }, [modalStack.length, show, active]);

  return { show, active, hash, open, close }
}
