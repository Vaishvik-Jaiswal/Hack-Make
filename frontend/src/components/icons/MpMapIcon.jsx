import React from 'react';

const MpMapIcon = ({
  size = 420,
  color = '#1a237e',
  strokeWidth = 6,
  opacity = 0.08
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 1024 768"
      xmlns="http://www.w3.org/2000/svg"
      style={{ opacity }}
    >
      <path
        d="
          M122 278
          L180 190
          L260 160
          L340 150
          L430 130
          L520 150
          L610 180
          L700 240
          L760 300
          L720 360
          L780 420
          L740 500
          L680 530
          L640 580
          L560 610
          L480 620
          L420 600
          L360 620
          L300 600
          L250 560
          L210 520
          L170 480
          L150 430
          L180 380
          L140 330
          Z
        "
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinejoin="round"
        strokeLinecap="round"
      />
    </svg>
  );
};

export default MpMapIcon;
