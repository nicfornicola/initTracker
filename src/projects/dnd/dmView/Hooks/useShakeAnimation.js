import { useRef, useEffect } from 'react';

const useShakeAnimation = (trigger, className = 'hiddenShake') => {
    const ref = useRef(null);

    useEffect(() => {
        const element = ref.current;
        if (element) {
            element.classList.remove(className);
            void element.offsetWidth; // Force reflow to restart the animation
            element.classList.add(className);
        }
    }, [trigger, className]);

    return ref;
};

export default useShakeAnimation;