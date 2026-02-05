import React, { useRef } from 'react';
import { motion } from 'framer-motion';

const TouchGestureHandler = ({ children, onSwipeLeft, onSwipeRight, onDoubleTap, onLongPress }) => {
    const tapTimeoutRef = useRef(null);
    const longPressTimeoutRef = useRef(null);

    const handleTapStart = () => {
        longPressTimeoutRef.current = setTimeout(() => {
            if (onLongPress) onLongPress();
        }, 800); // 800ms for long press
    };

    const handleTapEnd = () => {
        clearTimeout(longPressTimeoutRef.current);
    };

    const handleTap = () => {
        if (tapTimeoutRef.current) {
            clearTimeout(tapTimeoutRef.current);
            tapTimeoutRef.current = null;
            if (onDoubleTap) onDoubleTap();
        } else {
            tapTimeoutRef.current = setTimeout(() => {
                tapTimeoutRef.current = null;
                // Single tap logic if needed
            }, 300);
        }
    };

    return (
        <motion.div
            className="h-full w-full"
            onPanEnd={(e, info) => {
                if (info.offset.x > 100 && onSwipeRight) onSwipeRight();
                if (info.offset.x < -100 && onSwipeLeft) onSwipeLeft();
            }}
            onTapStart={handleTapStart}
            onTap={handleTap}
            onTapCancel={handleTapEnd} // Cancel long press on drag/scroll
        >
            {children}
        </motion.div>
    );
};

export default TouchGestureHandler;