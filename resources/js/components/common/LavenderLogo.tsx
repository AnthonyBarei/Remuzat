import React from 'react';
import { SvgIcon, SvgIconProps } from '@mui/material';

/**
 * Lavender sprig logo – a stylized Provençal lavender branch
 * with a graceful natural curve, inspired by real lavender sprigs.
 * Use `fontSize` or `sx={{ width, height }}` to control size.
 */
const LavenderLogo: React.FC<SvgIconProps> = (props) => (
    <SvgIcon {...props} viewBox="0 0 48 48">
        {/* Gracefully curved stem */}
        <path
            d="M20 46 Q19 38, 19.5 32 Q20 26, 22.5 20 Q24.5 15, 28 7"
            fill="none"
            stroke="#7B9E55"
            strokeWidth="1.1"
            strokeLinecap="round"
        />

        {/* Left leaf */}
        <path
            d="M19.8 34 Q16 31.5, 14.5 33.5 Q13.5 35, 16 35.5 Q18 35.3, 19.8 34Z"
            fill="#8DB06A"
            opacity="0.9"
        />
        {/* Right leaf */}
        <path
            d="M20.2 29 Q24 26.5, 26 28 Q26.8 29.5, 24.5 30 Q22 30, 20.2 29Z"
            fill="#8DB06A"
            opacity="0.9"
        />

        {/* === Paired flower buds (teardrop shapes) along the curve === */}

        {/* Pair 1 – bottom (largest, deepest purple) */}
        <path d="M20 24.5 Q18 22, 18.2 20 Q18.8 18.8, 19.8 20.2 Q20.5 21.5, 20 24.5Z" fill="#6B4D8A" />
        <path d="M23.5 23 Q25 20.5, 25.5 19 Q25.2 18, 24 19.2 Q22.8 20.5, 23.5 23Z" fill="#7B5EA7" />

        {/* Pair 2 */}
        <path d="M21.5 21 Q19.5 18.8, 19.8 17 Q20.3 16, 21.2 17.3 Q21.8 18.5, 21.5 21Z" fill="#7B5EA7" />
        <path d="M25 19.5 Q26.5 17.2, 27 15.8 Q26.8 14.8, 25.7 16 Q24.8 17, 25 19.5Z" fill="#8968B0" />

        {/* Pair 3 – mid */}
        <path d="M23 17.5 Q21.2 15.5, 21.5 13.8 Q22 12.8, 22.8 14 Q23.3 15, 23 17.5Z" fill="#8968B0" />
        <path d="M26.5 16 Q28 13.8, 28.3 12.5 Q28 11.6, 27 12.5 Q26.2 13.8, 26.5 16Z" fill="#9B7DC0" />

        {/* Pair 4 */}
        <path d="M24.5 14 Q23 12, 23.3 10.5 Q23.7 9.7, 24.4 10.8 Q24.8 11.8, 24.5 14Z" fill="#9B7DC0" />
        <path d="M27.8 12.5 Q29 10.5, 29.3 9.2 Q29 8.4, 28.2 9.3 Q27.5 10.3, 27.8 12.5Z" fill="#A88FCC" />

        {/* Pair 5 – upper (lighter, smaller) */}
        <path d="M26 10.8 Q24.8 9, 25.1 7.8 Q25.5 7.1, 26 8.2 Q26.3 9, 26 10.8Z" fill="#A88FCC" />
        <path d="M29 9.5 Q29.8 8, 30 7 Q29.8 6.2, 29.1 7 Q28.6 7.8, 29 9.5Z" fill="#B8A0D6" />

        {/* Top cluster – smallest buds */}
        <path d="M27.5 8 Q26.6 6.5, 26.8 5.5 Q27.2 5, 27.6 5.8 Q27.8 6.5, 27.5 8Z" fill="#B8A0D6" />
        <path d="M29.5 7 Q30.2 5.8, 30.3 5 Q30 4.4, 29.5 5.2 Q29.2 5.8, 29.5 7Z" fill="#C8B5DE" />

        {/* Tip */}
        <path d="M28.5 5.5 Q28 4.5, 28.2 3.8 Q28.5 3.3, 28.8 4 Q28.8 4.5, 28.5 5.5Z" fill="#C8B5DE" />
    </SvgIcon>
);

export default LavenderLogo;
